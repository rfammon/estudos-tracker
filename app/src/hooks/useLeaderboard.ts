import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type { Database } from '../types/database.types'

type LeaderboardEntry = Database['public']['Tables']['leaderboard_entries']['Row']
type LeaderboardEntryInsert = Database['public']['Tables']['leaderboard_entries']['Insert']

interface LeaderboardEntryWithProfile extends LeaderboardEntry {
    profiles: {
        username: string | null
        display_name: string | null
        avatar_url: string | null
        level: number | null
    } | null
}

type Period = 'daily' | 'weekly' | 'monthly' | 'all_time'
type Category = 'xp' | 'study_time' | 'streak' | 'sessions'

interface UseLeaderboardReturn {
    entries: LeaderboardEntryWithProfile[]
    userEntry: LeaderboardEntry | null
    loading: boolean
    error: string | null
    fetchLeaderboard: (period: Period, category: Category) => Promise<void>
    getUserRank: (period: Period, category: Category) => Promise<number>
    updateScore: (category: Category, score: number) => Promise<void>
    getTopUsers: (period: Period, category: Category, limit?: number) => Promise<LeaderboardEntryWithProfile[]>
    getUserPosition: () => number | null
}

const PERIOD_CONFIG: Record<Period, { days: number; format: string }> = {
    daily: { days: 1, format: 'YYYY-MM-DD' },
    weekly: { days: 7, format: 'YYYY-WW' },
    monthly: { days: 30, format: 'YYYY-MM' },
    all_time: { days: Infinity, format: 'all-time' },
}

export function useLeaderboard(): UseLeaderboardReturn {
    const { user } = useAuth()
    const [entries, setEntries] = useState<LeaderboardEntryWithProfile[]>([])
    const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getPeriodDates = (period: Period): { startDate: string; endDate: string; periodValue: string } => {
        const now = new Date()
        let startDate: Date
        let endDate = now
        let periodValue: string

        switch (period) {
            case 'daily':
                startDate = now
                periodValue = now.toISOString().split('T')[0]
                break
            case 'weekly':
                startDate = new Date(now)
                startDate.setDate(now.getDate() - now.getDay())
                const weekNum = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7)
                periodValue = `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
                break
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                periodValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
                break
            case 'all_time':
            default:
                startDate = new Date(2020, 0, 1) // Far in the past
                periodValue = 'all-time'
                break
        }

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            periodValue,
        }
    }

    const fetchLeaderboard = useCallback(async (period: Period, category: Category) => {
        setLoading(true)
        setError(null)

        try {
            const { startDate, endDate, periodValue } = getPeriodDates(period)

            // Query leaderboard entries with profile data
            const { data, error: fetchError } = await supabase
                .from('leaderboard_entries')
                .select(`
                    *,
                    profiles:user_id (
                        username,
                        display_name,
                        avatar_url,
                        level
                    )
                `)
                .eq('period', periodValue)
                .eq('category', category)
                .order('rank', { ascending: true })
                .limit(100)

            if (fetchError) throw fetchError

            setEntries(data as LeaderboardEntryWithProfile[] || [])

            // Find user's entry
            if (user) {
                const userEntry = data?.find((e: LeaderboardEntryWithProfile) => e.user_id === user.id)
                setUserEntry(userEntry || null)
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leaderboard'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [user])

    const getUserRank = useCallback(async (period: Period, category: Category): Promise<number> => {
        if (!user) {
            return -1
        }

        try {
            const { periodValue } = getPeriodDates(period)

            const { data, error: fetchError } = await supabase
                .from('leaderboard_entries')
                .select('rank')
                .eq('user_id', user.id)
                .eq('period', periodValue)
                .eq('category', category)
                .single()

            if (fetchError || !data) {
                return -1
            }

            return data.rank || -1
        } catch (err) {
            console.error('Error getting user rank:', err)
            return -1
        }
    }, [user])

    const updateScore = useCallback(async (category: Category, score: number) => {
        if (!user) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const { startDate, endDate, periodValue } = getPeriodDates('weekly') // Default to weekly

            // Check if entry exists
            const { data: existing, error: checkError } = await supabase
                .from('leaderboard_entries')
                .select('*')
                .eq('user_id', user.id)
                .eq('period', periodValue)
                .eq('category', category)
                .single()

            if (existing) {
                // Update existing entry
                const newScore = (existing.score || 0) + score
                const { error: updateError } = await supabase
                    .from('leaderboard_entries')
                    .update({
                        score: newScore,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', existing.id)

                if (updateError) throw updateError
            } else {
                // Create new entry
                const { error: insertError } = await supabase
                    .from('leaderboard_entries')
                    .insert({
                        user_id: user.id,
                        category,
                        period: periodValue,
                        period_start_date: startDate,
                        period_end_date: endDate,
                        score,
                    })

                if (insertError) throw insertError
            }

            // Recalculate ranks for this period and category
            await recalculateRanks(periodValue, category)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update score'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user])

    const recalculateRanks = async (period: string, category: Category) => {
        try {
            // Fetch all entries for this period and category
            const { data: allEntries, error: fetchError } = await supabase
                .from('leaderboard_entries')
                .select('*')
                .eq('period', period)
                .eq('category', category)
                .order('score', { ascending: false })

            if (fetchError || !allEntries) return

            // Update ranks
            for (let i = 0; i < allEntries.length; i++) {
                await supabase
                    .from('leaderboard_entries')
                    .update({ rank: i + 1 })
                    .eq('id', allEntries[i].id)
            }
        } catch (err) {
            console.error('Error recalculating ranks:', err)
        }
    }

    const getTopUsers = useCallback(async (period: Period, category: Category, limit = 10): Promise<LeaderboardEntryWithProfile[]> => {
        try {
            const { periodValue } = getPeriodDates(period)

            const { data, error: fetchError } = await supabase
                .from('leaderboard_entries')
                .select(`
                    *,
                    profiles:user_id (
                        username,
                        display_name,
                        avatar_url,
                        level
                    )
                `)
                .eq('period', periodValue)
                .eq('category', category)
                .order('rank', { ascending: true })
                .limit(limit)

            if (fetchError) throw fetchError

            return (data as LeaderboardEntryWithProfile[]) || []
        } catch (err) {
            console.error('Error fetching top users:', err)
            return []
        }
    }, [])

    const getUserPosition = useCallback((): number | null => {
        return userEntry?.rank || null
    }, [userEntry])

    return {
        entries,
        userEntry,
        loading,
        error,
        fetchLeaderboard,
        getUserRank,
        updateScore,
        getTopUsers,
        getUserPosition,
    }
}

export type { UseLeaderboardReturn, LeaderboardEntry, LeaderboardEntryInsert, LeaderboardEntryWithProfile, Period, Category }
