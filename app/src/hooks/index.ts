// Authentication
export { AuthProvider, useAuth } from './useAuth'

// Profile management
export { useProfile } from './useProfile'
export type { Profile, ProfileUpdate, UseProfileReturn } from './useProfile'

// Study sessions
export { useStudySessions } from './useStudySessions'
export type { StudySession, StudySessionInsert, StudySessionUpdate, SessionStats, UseStudySessionsReturn } from './useStudySessions'

// Achievements
export { useAchievements } from './useAchievements'
export type { Achievement, UserAchievement, AchievementWithProgress, UseAchievementsReturn } from './useAchievements'

// Leaderboard
export { useLeaderboard } from './useLeaderboard'
export type { LeaderboardEntry, LeaderboardEntryInsert, LeaderboardEntryWithProfile, Period, Category, UseLeaderboardReturn } from './useLeaderboard'

// Settings
export { useApplySettings, useNotificationSettings, usePrivacySettings, useLanguageSettings } from './useSettings'

// PWA
export { usePWAInstall } from './usePWAInstall'

// Focus trap
export { useFocusTrap } from './useFocusTrap'

// Multipliers
export { useMultipliers } from './useMultipliers'

// Announcements
export { useAnnouncement } from './useAnnouncement'

// Migration
export { useMigration } from './useMigration'
export type { MigrationResult } from './useMigration'

// Realtime sync
export { useRealtimeSync } from './useRealtimeSync'

// Presence
export { usePresence } from './usePresence'

// Realtime notifications
export { useRealtimeNotifications } from './useRealtimeNotifications'
export type { RealtimeNotification } from './useRealtimeNotifications'
