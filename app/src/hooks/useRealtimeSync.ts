import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type { Database } from '../types/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type StudySessionRow = Database['public']['Tables']['study_sessions']['Row']
type UserAchievementRow = Database['public']['Tables']['user_achievements']['Row']
type LeaderboardEntryRow = Database['public']['Tables']['leaderboard_entries']['Row']

interface PostgresChangePayload<T> {
    commit_timestamp: string
    eventType: 'INSERT' | 'UPDATE' | 'DELETE'
    schema: string
    table: string
    new: T
    old: T
    errors: string[]
}

interface SyncConfig {
    onProfileChange?: (profile: ProfileRow) => void
    onSessionChange?: (payload: { event: string; data: StudySessionRow | null }) => void
    onAchievementChange?: (payload: { event: string; data: UserAchievementRow | null }) => void
    onLeaderboardChange?: (payload: { event: string; data: LeaderboardEntryRow | null }) => void
}

interface RealtimeSyncReturn {
    isConnected: boolean
    disconnect: () => void
    reconnect: () => void
}

export function useRealtimeSync(config: SyncConfig = {}): RealtimeSyncReturn {
    const { user } = useAuth()
    const channelsRef = useRef<ReturnType<typeof supabase.channel>[]>([])
    const isConnectedRef = useRef(false)

    const setupChannels = useCallback(() => {
        if (!user) return

        // Clean up existing channels
        channelsRef.current.forEach(channel => {
            supabase.removeChannel(channel)
        })
        channelsRef.current = []
        isConnectedRef.current = false

        // Profile changes
        const profileChannel = supabase
            .channel(`profile:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload: PostgresChangePayload<ProfileRow>) => {
                    if (config.onProfileChange && payload.new) {
                        config.onProfileChange(payload.new)
                    }
                }
            )
            .subscribe((status: string) => {
                if (status === 'SUBSCRIBED') {
                    isConnectedRef.current = true
                }
            })

        channelsRef.current.push(profileChannel)

        // Study sessions changes
        const sessionsChannel = supabase
            .channel(`sessions:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'study_sessions',
                    filter: `user_id=eq.${user.id}`
                },
                (payload: PostgresChangePayload<StudySessionRow>) => {
                    if (config.onSessionChange) {
                        config.onSessionChange({
                            event: payload.eventType,
                            data: payload.new || payload.old
                        })
                    }
                }
            )
            .subscribe()

        channelsRef.current.push(sessionsChannel)

        // User achievements changes
        const achievementsChannel = supabase
            .channel(`achievements:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_achievements',
                    filter: `user_id=eq.${user.id}`
                },
                (payload: PostgresChangePayload<UserAchievementRow>) => {
                    if (config.onAchievementChange) {
                        config.onAchievementChange({
                            event: payload.eventType,
                            data: payload.new || payload.old
                        })
                    }
                }
            )
            .subscribe()

        channelsRef.current.push(achievementsChannel)

        // Leaderboard changes (public)
        const leaderboardChannel = supabase
            .channel('leaderboard:global')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'leaderboard_entries'
                },
                (payload: PostgresChangePayload<LeaderboardEntryRow>) => {
                    if (config.onLeaderboardChange) {
                        config.onLeaderboardChange({
                            event: payload.eventType,
                            data: payload.new || payload.old
                        })
                    }
                }
            )
            .subscribe()

        channelsRef.current.push(leaderboardChannel)
    }, [user?.id, config.onProfileChange, config.onSessionChange, config.onAchievementChange, config.onLeaderboardChange])

    const disconnect = useCallback(() => {
        channelsRef.current.forEach(channel => {
            supabase.removeChannel(channel)
        })
        channelsRef.current = []
        isConnectedRef.current = false
    }, [])

    const reconnect = useCallback(() => {
        disconnect()
        setupChannels()
    }, [disconnect, setupChannels])

    useEffect(() => {
        if (user) {
            setupChannels()
        }

        return () => {
            channelsRef.current.forEach(channel => {
                supabase.removeChannel(channel)
            })
            channelsRef.current = []
            isConnectedRef.current = false
        }
    }, [user?.id])

    return {
        isConnected: isConnectedRef.current,
        disconnect,
        reconnect
    }
}
