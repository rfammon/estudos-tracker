import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type { Database } from '../types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

interface UseProfileReturn {
    profile: Profile | null
    loading: boolean
    error: string | null
    updateProfile: (updates: ProfileUpdate) => Promise<void>
    addXP: (amount: number) => Promise<void>
    updateStreak: () => Promise<void>
    refreshProfile: () => Promise<void>
    calculateLevel: (xp: number) => number
    xpForNextLevel: (level: number) => number
}

// XP required for each level (exponential scaling)
const calculateXPForLevel = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Calculate current level from total XP
const calculateLevelFromXP = (xp: number): number => {
    let level = 1
    let totalXP = 0

    while (totalXP + calculateXPForLevel(level) <= xp) {
        totalXP += calculateXPForLevel(level)
        level++
    }

    return level
}

export function useProfile(): UseProfileReturn {
    const { user, profile, refreshProfile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateProfile = useCallback(async (updates: ProfileUpdate) => {
        if (!user) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)
                .select()
                .single()

            if (updateError) throw updateError

            await refreshProfile()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user, refreshProfile])

    const addXP = useCallback(async (amount: number) => {
        if (!user || !profile) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const newXP = (profile.xp || 0) + amount
            const newLevel = calculateLevelFromXP(newXP)

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    xp: newXP,
                    level: newLevel,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)

            if (updateError) throw updateError

            await refreshProfile()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add XP'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user, profile, refreshProfile])

    const updateStreak = useCallback(async () => {
        if (!user || !profile) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const today = new Date().toISOString().split('T')[0]
            const lastActivity = profile.last_activity_date

            let newStreak = profile.streak || 0

            if (lastActivity) {
                const lastDate = new Date(lastActivity)
                const todayDate = new Date(today)
                const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

                if (diffDays === 0) {
                    // Same day, no streak change
                    return
                } else if (diffDays === 1) {
                    // Consecutive day, increment streak
                    newStreak += 1
                } else {
                    // Streak broken, reset to 1
                    newStreak = 1
                }
            } else {
                // First activity
                newStreak = 1
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    streak: newStreak,
                    last_activity_date: today,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)

            if (updateError) throw updateError

            await refreshProfile()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update streak'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user, profile, refreshProfile])

    const calculateLevel = useCallback((xp: number): number => {
        return calculateLevelFromXP(xp)
    }, [])

    const xpForNextLevel = useCallback((level: number): number => {
        return calculateXPForLevel(level)
    }, [])

    return {
        profile,
        loading,
        error,
        updateProfile,
        addXP,
        updateStreak,
        refreshProfile,
        calculateLevel,
        xpForNextLevel,
    }
}

export type { UseProfileReturn, Profile, ProfileUpdate }
