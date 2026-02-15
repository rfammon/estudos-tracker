import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type { Database } from '../types/database.types'

type AchievementRow = Database['public']['Tables']['achievements']['Row']
type UserAchievementRow = Database['public']['Tables']['user_achievements']['Row']
type LeaderboardEntryRow = Database['public']['Tables']['leaderboard_entries']['Row']

export interface RealtimeNotification {
    id: string
    type: 'achievement' | 'level_up' | 'streak' | 'leaderboard' | 'friend'
    title: string
    message: string
    data?: Record<string, unknown>
    created_at: string
    read: boolean
}

interface PostgresChangePayload<T> {
    commit_timestamp: string
    eventType: 'INSERT' | 'UPDATE' | 'DELETE'
    schema: string
    table: string
    new: T
    old: T | null
    errors: string[]
}

interface UseRealtimeNotificationsReturn {
    notifications: RealtimeNotification[]
    unreadCount: number
    addNotification: (notification: Omit<RealtimeNotification, 'id' | 'created_at' | 'read'>) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    clearNotifications: () => void
}

export function useRealtimeNotifications(): UseRealtimeNotificationsReturn {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const channelsRef = useRef<ReturnType<typeof supabase.channel>[]>([])

    const addNotification = useCallback((notification: Omit<RealtimeNotification, 'id' | 'created_at' | 'read'>) => {
        const newNotification: RealtimeNotification = {
            ...notification,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            read: false
        }
        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)
    }, [])

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
    }, [])

    const clearNotifications = useCallback(() => {
        setNotifications([])
        setUnreadCount(0)
    }, [])

    useEffect(() => {
        if (!user) return

        // Listen for achievement unlocks
        const achievementsChannel = supabase
            .channel(`notifications:achievements:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_achievements',
                    filter: `user_id=eq.${user.id}`
                },
                async (payload: PostgresChangePayload<UserAchievementRow>) => {
                    // Fetch achievement details
                    const { data: achievement } = await supabase
                        .from('achievements')
                        .select('*')
                        .eq('id', payload.new.achievement_id)
                        .single()

                    if (achievement) {
                        addNotification({
                            type: 'achievement',
                            title: '🏆 Nova Conquista!',
                            message: `Você desbloqueou: ${achievement.name}`,
                            data: achievement as unknown as Record<string, unknown>
                        })
                    }
                }
            )
            .subscribe()

        channelsRef.current.push(achievementsChannel)

        // Listen for leaderboard position changes
        const leaderboardChannel = supabase
            .channel(`notifications:leaderboard:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'leaderboard_entries',
                    filter: `user_id=eq.${user.id}`
                },
                (payload: PostgresChangePayload<LeaderboardEntryRow>) => {
                    const oldRank = payload.old?.rank
                    const newRank = payload.new?.rank
                    if (oldRank != null && newRank != null && newRank < oldRank) {
                        addNotification({
                            type: 'leaderboard',
                            title: '📈 Subiu no Ranking!',
                            message: `Você agora está na posição #${newRank}`,
                            data: payload.new as unknown as Record<string, unknown>
                        })
                    }
                }
            )
            .subscribe()

        channelsRef.current.push(leaderboardChannel)

        return () => {
            channelsRef.current.forEach(channel => {
                supabase.removeChannel(channel)
            })
            channelsRef.current = []
        }
    }, [user?.id, addNotification])

    return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
    }
}
