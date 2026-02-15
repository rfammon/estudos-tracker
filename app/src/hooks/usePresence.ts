import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type { Database } from '../types/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

interface OnlineUser {
    user_id: string
    display_name: string
    online_at: string
}

interface PresenceState {
    [key: string]: OnlineUser[]
}

interface PresenceEvent {
    event: 'sync' | 'join' | 'leave'
    state?: PresenceState
    newPresences?: OnlineUser[]
    leftPresences?: OnlineUser[]
}

interface UsePresenceReturn {
    onlineUsers: OnlineUser[]
    onlineCount: number
    isOnline: (userId: string) => boolean
    broadcastActivity: (activity: string) => void
}

export function usePresence(): UsePresenceReturn {
    const { user, profile } = useAuth()
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

    const isOnline = useCallback((userId: string) => {
        return onlineUsers.some(u => u.user_id === userId)
    }, [onlineUsers])

    const broadcastActivity = useCallback((activity: string) => {
        if (channelRef.current && user && profile) {
            channelRef.current.track({
                user_id: user.id,
                display_name: profile.display_name || profile.username || 'Anonymous',
                online_at: new Date().toISOString(),
                current_activity: activity
            })
        }
    }, [user?.id, profile?.id])

    useEffect(() => {
        if (!user || !profile) return

        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: user.id
                }
            }
        })

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState<OnlineUser>()
                const users = Object.values(state).flat()
                setOnlineUsers(users)
            })
            .on('presence', { event: 'join' }, ({ newPresences }: { newPresences: OnlineUser[] }) => {
                setOnlineUsers(prev => {
                    const existingIds = new Set(prev.map(u => u.user_id))
                    const newUsers = newPresences.filter(u => !existingIds.has(u.user_id))
                    return [...prev, ...newUsers]
                })
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }: { leftPresences: OnlineUser[] }) => {
                setOnlineUsers(prev => {
                    const leftIds = new Set(leftPresences.map(u => u.user_id))
                    return prev.filter(u => !leftIds.has(u.user_id))
                })
            })
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: user.id,
                        display_name: profile.display_name || profile.username || 'Anonymous',
                        online_at: new Date().toISOString()
                    })
                }
            })

        channelRef.current = channel

        return () => {
            if (channelRef.current) {
                channelRef.current.untrack()
                supabase.removeChannel(channelRef.current)
                channelRef.current = null
            }
        }
    }, [user?.id, profile?.id])

    return {
        onlineUsers,
        onlineCount: onlineUsers.length,
        isOnline,
        broadcastActivity
    }
}
