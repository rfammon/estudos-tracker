import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type { Database } from '../types/database.types'

type Achievement = Database['public']['Tables']['achievements']['Row']
type UserAchievement = Database['public']['Tables']['user_achievements']['Row']

interface AchievementWithProgress extends Achievement {
    discovered: boolean
    discovered_at: string | null
}

interface UseAchievementsReturn {
    achievements: Achievement[]
    userAchievements: UserAchievement[]
    achievementsWithProgress: AchievementWithProgress[]
    loading: boolean
    error: string | null
    fetchAchievements: () => Promise<void>
    fetchUserAchievements: () => Promise<void>
    unlockAchievement: (achievementId: string) => Promise<void>
    checkAndUnlockAchievement: (triggerType: string, triggerValue: unknown) => Promise<Achievement | null>
    getAchievementsByCategory: (category: string) => AchievementWithProgress[]
    getUnlockedCount: () => number
    getTotalXPFromAchievements: () => number
}

export function useAchievements(): UseAchievementsReturn {
    const { user } = useAuth()
    const [achievements, setAchievements] = useState<Achievement[]>([])
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Combined achievements with progress
    const achievementsWithProgress: AchievementWithProgress[] = achievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id)
        return {
            ...achievement,
            discovered: !!userAchievement,
            discovered_at: userAchievement?.discovered_at || null,
        }
    })

    const fetchAchievements = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('achievements')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true })

            if (fetchError) throw fetchError
            setAchievements(data || [])
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch achievements'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchUserAchievements = useCallback(async () => {
        if (!user) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            const { data, error: fetchError } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', user.id)

            if (fetchError) throw fetchError
            setUserAchievements(data || [])
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user achievements'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [user])

    const unlockAchievement = useCallback(async (achievementId: string) => {
        if (!user) {
            throw new Error('No user logged in')
        }

        setLoading(true)
        setError(null)

        try {
            // Check if already unlocked
            const { data: existing, error: checkError } = await supabase
                .from('user_achievements')
                .select('*')
                .eq('user_id', user.id)
                .eq('achievement_id', achievementId)
                .single()

            if (existing) {
                // Already unlocked
                return
            }

            // Unlock the achievement
            const { error: insertError } = await supabase
                .from('user_achievements')
                .insert({
                    user_id: user.id,
                    achievement_id: achievementId,
                    discovered_at: new Date().toISOString(),
                })

            if (insertError) throw insertError

            // Get achievement XP reward
            const achievement = achievements.find(a => a.id === achievementId)
            if (achievement?.xp_reward) {
                // Add XP to user profile
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('xp')
                    .eq('id', user.id)
                    .single()

                if (profile && !profileError) {
                    await supabase
                        .from('profiles')
                        .update({
                            xp: (profile.xp || 0) + achievement.xp_reward,
                        })
                        .eq('id', user.id)
                }
            }

            // Refresh user achievements
            await fetchUserAchievements()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to unlock achievement'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user, achievements, fetchUserAchievements])

    const checkAndUnlockAchievement = useCallback(async (triggerType: string, triggerValue: unknown): Promise<Achievement | null> => {
        if (!user) {
            throw new Error('No user logged in')
        }

        try {
            // Find achievements matching the trigger
            const matchingAchievements = achievements.filter(a => a.trigger_type === triggerType)

            for (const achievement of matchingAchievements) {
                // Check if already unlocked
                const alreadyUnlocked = userAchievements.some(ua => ua.achievement_id === achievement.id)
                if (alreadyUnlocked) continue

                // Check trigger value
                let shouldUnlock = false

                if (achievement.trigger_value) {
                    const triggerData = achievement.trigger_value as Record<string, unknown>

                    // Handle different trigger types
                    switch (triggerType) {
                        case 'session_count':
                            shouldUnlock = (triggerValue as number) >= (triggerData.count as number)
                            break
                        case 'streak_days':
                            shouldUnlock = (triggerValue as number) >= (triggerData.days as number)
                            break
                        case 'xp_total':
                            shouldUnlock = (triggerValue as number) >= (triggerData.amount as number)
                            break
                        case 'level_reached':
                            shouldUnlock = (triggerValue as number) >= (triggerData.level as number)
                            break
                        case 'topic_studied':
                            shouldUnlock = triggerValue === triggerData.topic
                            break
                        case 'time_studied_minutes':
                            shouldUnlock = (triggerValue as number) >= (triggerData.minutes as number)
                            break
                        default:
                            // For hidden achievements, use custom logic
                            if (achievement.is_hidden) {
                                shouldUnlock = triggerValue === triggerData.value
                            }
                    }
                }

                if (shouldUnlock) {
                    await unlockAchievement(achievement.id)
                    return achievement
                }
            }

            return null
        } catch (err) {
            console.error('Error checking achievements:', err)
            return null
        }
    }, [user, achievements, userAchievements, unlockAchievement])

    const getAchievementsByCategory = useCallback((category: string): AchievementWithProgress[] => {
        return achievementsWithProgress.filter(a => a.category === category)
    }, [achievementsWithProgress])

    const getUnlockedCount = useCallback((): number => {
        return userAchievements.length
    }, [userAchievements])

    const getTotalXPFromAchievements = useCallback((): number => {
        const unlockedIds = userAchievements.map(ua => ua.achievement_id)
        return achievements
            .filter(a => unlockedIds.includes(a.id))
            .reduce((sum, a) => sum + (a.xp_reward || 0), 0)
    }, [achievements, userAchievements])

    // Fetch achievements on mount
    useEffect(() => {
        fetchAchievements()
    }, [fetchAchievements])

    // Fetch user achievements when user changes
    useEffect(() => {
        if (user) {
            fetchUserAchievements()
        }
    }, [user, fetchUserAchievements])

    return {
        achievements,
        userAchievements,
        achievementsWithProgress,
        loading,
        error,
        fetchAchievements,
        fetchUserAchievements,
        unlockAchievement,
        checkAndUnlockAchievement,
        getAchievementsByCategory,
        getUnlockedCount,
        getTotalXPFromAchievements,
    }
}

export type { UseAchievementsReturn, Achievement, UserAchievement, AchievementWithProgress }
