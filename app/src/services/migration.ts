import { supabase } from '../lib/supabase-auth'
import type { Database } from '../types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface LocalData {
    profile?: {
        xp: number
        level: number
        streak: number
        lastActivityDate: string | null
    }
    sessions?: Array<{
        topicId: string
        topicName: string
        durationMinutes: number
        xpEarned: number
        objectivesCompleted: number
        assessmentsTaken: number
        sessionDate: string
        startedAt: string
        endedAt: string | null
    }>
    achievements?: Array<{
        achievementId: string
        discoveredAt: string
    }>
}

const STORAGE_KEY = 'estudos-tracker-data'

export function getLocalData(): LocalData {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : {}
    } catch {
        return {}
    }
}

export function clearLocalData() {
    localStorage.removeItem(STORAGE_KEY)
}

export async function migrateToSupabase(userId: string): Promise<{
    success: boolean
    migrated: {
        sessions: number
        achievements: number
        profile: boolean
    }
    error?: string
}> {
    try {
        const localData = getLocalData()
        let sessionsCount = 0
        let achievementsCount = 0
        let profileMigrated = false

        // Migrate profile data (XP, level, streak)
        if (localData.profile) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    xp: localData.profile.xp,
                    level: localData.profile.level,
                    streak: localData.profile.streak,
                    last_activity_date: localData.profile.lastActivityDate
                })
                .eq('id', userId)

            if (profileError) {
                console.error('Error migrating profile:', profileError)
            } else {
                profileMigrated = true
            }
        }

        // Migrate sessions
        if (localData.sessions && localData.sessions.length > 0) {
            const sessions = localData.sessions.map(session => ({
                user_id: userId,
                topic_id: session.topicId,
                topic_name: session.topicName,
                duration_minutes: session.durationMinutes,
                xp_earned: session.xpEarned,
                objectives_completed: session.objectivesCompleted,
                assessments_taken: session.assessmentsTaken,
                session_date: session.sessionDate,
                started_at: session.startedAt,
                ended_at: session.endedAt
            }))

            const { error: sessionsError } = await supabase
                .from('study_sessions')
                .insert(sessions)

            if (sessionsError) {
                console.error('Error migrating sessions:', sessionsError)
            } else {
                sessionsCount = sessions.length
            }
        }

        // Migrate achievements
        if (localData.achievements && localData.achievements.length > 0) {
            const achievements = localData.achievements.map(achievement => ({
                user_id: userId,
                achievement_id: achievement.achievementId,
                discovered_at: achievement.discoveredAt
            }))

            const { error: achievementsError } = await supabase
                .from('user_achievements')
                .insert(achievements)

            if (achievementsError) {
                console.error('Error migrating achievements:', achievementsError)
            } else {
                achievementsCount = achievements.length
            }
        }

        return {
            success: true,
            migrated: {
                sessions: sessionsCount,
                achievements: achievementsCount,
                profile: profileMigrated
            }
        }
    } catch (error) {
        return {
            success: false,
            migrated: { sessions: 0, achievements: 0, profile: false },
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

export function hasLocalDataToMigrate(): boolean {
    const localData = getLocalData()
    return !!(
        localData.profile ||
        (localData.sessions && localData.sessions.length > 0) ||
        (localData.achievements && localData.achievements.length > 0)
    )
}
