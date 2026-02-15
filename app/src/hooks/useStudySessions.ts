import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type { Database } from '../types/database.types'

type StudySession = Database['public']['Tables']['study_sessions']['Row']
type StudySessionInsert = Database['public']['Tables']['study_sessions']['Insert']
type StudySessionUpdate = Database['public']['Tables']['study_sessions']['Update']

interface SessionStats {
    totalSessions: number
    totalMinutes: number
    totalXP: number
    averageDuration: number
    topicsStudied: string[]
    thisWeekMinutes: number
    thisMonthMinutes: number
}

interface UseStudySessionsReturn {
    sessions: StudySession[]
    loading: boolean
    error: string | null
    fetchSessions: (limit?: number) => Promise<void>
    createSession: (session: Omit<StudySessionInsert, 'user_id'>) => Promise<StudySession>
    updateSession: (id: string, updates: StudySessionUpdate) => Promise<void>
    endSession: (id: string, xpEarned: number) => Promise<void>
    getStats: () => Promise<SessionStats>
    getSessionsByDateRange: (startDate: string, endDate: string) => Promise<StudySession[]>
    getRecentSessions: (limit?: number) => Promise<StudySession[]>
}

export function useStudySessions(): UseStudySessionsReturn {
    const { user } = useAuth()
    const [sessions, setSessions] = useState<StudySession[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchSessions = useCallback(async (limit = 50) => {
        if (!user) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('study_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('session_date', { ascending: false })
                .limit(limit)

            if (fetchError) throw fetchError
            setSessions(data || [])
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sessions'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [user])

    const createSession = useCallback(async (sessionData: Omit<StudySessionInsert, 'user_id'>): Promise<StudySession> => {
        if (!user) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const { data, error: insertError } = await supabase
                .from('study_sessions')
                .insert({
                    ...sessionData,
                    user_id: user.id,
                })
                .select()
                .single()

            if (insertError) throw insertError

            // Refresh sessions list
            await fetchSessions()

            return data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create session'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user, fetchSessions])

    const updateSession = useCallback(async (id: string, updates: StudySessionUpdate) => {
        if (!user) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase
                .from('study_sessions')
                .update(updates)
                .eq('id', id)
                .eq('user_id', user.id)

            if (updateError) throw updateError

            // Refresh sessions list
            await fetchSessions()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update session'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user, fetchSessions])

    const endSession = useCallback(async (id: string, xpEarned: number) => {
        if (!user) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase
                .from('study_sessions')
                .update({
                    ended_at: new Date().toISOString(),
                    xp_earned: xpEarned,
                })
                .eq('id', id)
                .eq('user_id', user.id)

            if (updateError) throw updateError

            // Refresh sessions list
            await fetchSessions()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to end session'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user, fetchSessions])

    const getStats = useCallback(async (): Promise<SessionStats> => {
        if (!user) {
            throw new Error('No user logged in')
        }

        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        try {
            // Fetch all sessions for stats calculation
            const { data: allSessions, error: fetchError } = await supabase
                .from('study_sessions')
                .select('*')
                .eq('user_id', user.id)

            if (fetchError) throw fetchError

            const sessions = allSessions || []

            // Calculate stats
            const totalSessions = sessions.length
            const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
            const totalXP = sessions.reduce((sum, s) => sum + (s.xp_earned || 0), 0)
            const averageDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0
            const topicsStudied = [...new Set(sessions.map(s => s.topic_name))]

            // This week's minutes
            const thisWeekSessions = sessions.filter(s =>
                new Date(s.session_date) >= startOfWeek
            )
            const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + s.duration_minutes, 0)

            // This month's minutes
            const thisMonthSessions = sessions.filter(s =>
                new Date(s.session_date) >= startOfMonth
            )
            const thisMonthMinutes = thisMonthSessions.reduce((sum, s) => sum + s.duration_minutes, 0)

            return {
                totalSessions,
                totalMinutes,
                totalXP,
                averageDuration,
                topicsStudied,
                thisWeekMinutes,
                thisMonthMinutes,
            }
        } catch (err) {
            console.error('Error fetching stats:', err)
            return {
                totalSessions: 0,
                totalMinutes: 0,
                totalXP: 0,
                averageDuration: 0,
                topicsStudied: [],
                thisWeekMinutes: 0,
                thisMonthMinutes: 0,
            }
        }
    }, [user])

    const getSessionsByDateRange = useCallback(async (startDate: string, endDate: string): Promise<StudySession[]> => {
        if (!user) {
            throw new Error('No user logged in')
        }

        try {
            const { data, error: fetchError } = await supabase
                .from('study_sessions')
                .select('*')
                .eq('user_id', user.id)
                .gte('session_date', startDate)
                .lte('session_date', endDate)
                .order('session_date', { ascending: true })

            if (fetchError) throw fetchError
            return data || []
        } catch (err) {
            console.error('Error fetching sessions by date range:', err)
            return []
        }
    }, [user])

    const getRecentSessions = useCallback(async (limit = 10): Promise<StudySession[]> => {
        if (!user) {
            throw new Error('No user logged in')
        }

        try {
            const { data, error: fetchError } = await supabase
                .from('study_sessions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (fetchError) throw fetchError
            return data || []
        } catch (err) {
            console.error('Error fetching recent sessions:', err)
            return []
        }
    }, [user])

    // Fetch sessions on mount
    useEffect(() => {
        if (user) {
            fetchSessions()
        }
    }, [user, fetchSessions])

    return {
        sessions,
        loading,
        error,
        fetchSessions,
        createSession,
        updateSession,
        endSession,
        getStats,
        getSessionsByDateRange,
        getRecentSessions,
    }
}

export type { UseStudySessionsReturn, StudySession, StudySessionInsert, StudySessionUpdate, SessionStats }
