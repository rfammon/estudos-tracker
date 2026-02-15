/**
 * Leaderboard Types for Estudos Tracker
 * Time-bounded leaderboard system with multiple categories
 */

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time'

export type LeaderboardCategory = 'xp' | 'streak' | 'sessions' | 'objectives' | 'assessments'

export interface LeaderboardEntry {
    id: string
    userId: string
    userName: string
    avatar?: string
    score: number
    rank: number
    previousRank?: number
    change?: number // positive = up, negative = down
    period: LeaderboardPeriod
    category: LeaderboardCategory
    updatedAt: Date
}

export interface Leaderboard {
    period: LeaderboardPeriod
    category: LeaderboardCategory
    entries: LeaderboardEntry[]
    totalParticipants: number
    startDate: Date
    endDate: Date
}

export interface LeaderboardState {
    leaderboards: Record<string, Leaderboard> // key: `${period}-${category}`
    currentUserPosition: Record<string, number> // key: `${period}-${category}`
    lastReset: Record<LeaderboardPeriod, string> // ISO date string
}

export interface LeaderboardConfig {
    period: LeaderboardPeriod
    category: LeaderboardCategory
    maxEntries: number
}

// Period configuration
export interface PeriodConfig {
    name: string
    nameShort: string
    resetDescription: string
    getStartDate: () => Date
    getEndDate: () => Date
}

export const PERIOD_CONFIGS: Record<LeaderboardPeriod, PeriodConfig> = {
    daily: {
        name: 'Diário',
        nameShort: 'Dia',
        resetDescription: 'Reseta todo dia à meia-noite',
        getStartDate: () => {
            const now = new Date()
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        },
        getEndDate: () => {
            const now = new Date()
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0)
        }
    },
    weekly: {
        name: 'Semanal',
        nameShort: 'Semana',
        resetDescription: 'Reseta toda segunda-feira',
        getStartDate: () => {
            const now = new Date()
            const dayOfWeek = now.getDay()
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
            const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff, 0, 0, 0, 0)
            return monday
        },
        getEndDate: () => {
            const now = new Date()
            const dayOfWeek = now.getDay()
            const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
            const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff + 1, 0, 0, 0, 0)
            return sunday
        }
    },
    monthly: {
        name: 'Mensal',
        nameShort: 'Mês',
        resetDescription: 'Reseta no primeiro dia de cada mês',
        getStartDate: () => {
            const now = new Date()
            return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
        },
        getEndDate: () => {
            const now = new Date()
            return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0)
        }
    },
    'all-time': {
        name: 'All-Time',
        nameShort: 'Total',
        resetDescription: 'Nunca reseta (histórico total)',
        getStartDate: () => new Date(2020, 0, 1, 0, 0, 0, 0), // Project start
        getEndDate: () => new Date(2100, 11, 31, 23, 59, 59, 999) // Far future
    }
}

// Category configuration
export interface CategoryConfig {
    name: string
    nameShort: string
    description: string
    icon: string
    unit: string
}

export const CATEGORY_CONFIGS: Record<LeaderboardCategory, CategoryConfig> = {
    xp: {
        name: 'Experiência',
        nameShort: 'XP',
        description: 'Total de XP ganho no período',
        icon: '⭐',
        unit: 'XP'
    },
    streak: {
        name: 'Sequência',
        nameShort: 'Streak',
        description: 'Maior sequência de dias consecutivos',
        icon: '🔥',
        unit: 'dias'
    },
    sessions: {
        name: 'Sessões',
        nameShort: 'Sessões',
        description: 'Número de sessões de estudo',
        icon: '📚',
        unit: 'sessões'
    },
    objectives: {
        name: 'Objetivos',
        nameShort: 'Objetivos',
        description: 'Objetivos de aprendizagem completados',
        icon: '🎯',
        unit: 'objetivos'
    },
    assessments: {
        name: 'Avaliações',
        nameShort: 'Avaliações',
        description: 'Pontuação média em avaliações',
        icon: '📝',
        unit: '%'
    }
}

// Simulated users for demo
export interface SimulatedUser {
    id: string
    name: string
    avatar?: string
    baseXp: number
    baseStreak: number
    baseSessions: number
    baseObjectives: number
    baseAssessments: number
    activity: 'high' | 'medium' | 'low' // Determines score variation
}

export const SIMULATED_USERS: SimulatedUser[] = [
    { id: 'sim-1', name: 'Ana Silva', baseXp: 8500, baseStreak: 45, baseSessions: 120, baseObjectives: 28, baseAssessments: 92, activity: 'high' },
    { id: 'sim-2', name: 'Bruno Costa', baseXp: 7200, baseStreak: 38, baseSessions: 95, baseObjectives: 22, baseAssessments: 88, activity: 'high' },
    { id: 'sim-3', name: 'Carla Santos', baseXp: 6800, baseStreak: 32, baseSessions: 88, baseObjectives: 19, baseAssessments: 85, activity: 'medium' },
    { id: 'sim-4', name: 'Daniel Oliveira', baseXp: 5500, baseStreak: 28, baseSessions: 72, baseObjectives: 15, baseAssessments: 82, activity: 'medium' },
    { id: 'sim-5', name: 'Elena Ferreira', baseXp: 4800, baseStreak: 22, baseSessions: 65, baseObjectives: 12, baseAssessments: 79, activity: 'medium' },
    { id: 'sim-6', name: 'Felipe Rocha', baseXp: 4200, baseStreak: 18, baseSessions: 58, baseObjectives: 10, baseAssessments: 76, activity: 'low' },
    { id: 'sim-7', name: 'Gabriela Lima', baseXp: 3800, baseStreak: 15, baseSessions: 52, baseObjectives: 8, baseAssessments: 74, activity: 'low' },
    { id: 'sim-8', name: 'Hugo Almeida', baseXp: 3200, baseStreak: 12, baseSessions: 45, baseObjectives: 6, baseAssessments: 71, activity: 'low' },
    { id: 'sim-9', name: 'Isabela Martins', baseXp: 2800, baseStreak: 10, baseSessions: 38, baseObjectives: 5, baseAssessments: 68, activity: 'low' },
    { id: 'sim-10', name: 'João Pereira', baseXp: 2200, baseStreak: 8, baseSessions: 32, baseObjectives: 4, baseAssessments: 65, activity: 'low' },
    { id: 'sim-11', name: 'Larissa Souza', baseXp: 1800, baseStreak: 6, baseSessions: 28, baseObjectives: 3, baseAssessments: 62, activity: 'low' },
    { id: 'sim-12', name: 'Matheus Ribeiro', baseXp: 1500, baseStreak: 5, baseSessions: 22, baseObjectives: 2, baseAssessments: 58, activity: 'low' },
    { id: 'sim-13', name: 'Natália Gomes', baseXp: 1200, baseStreak: 4, baseSessions: 18, baseObjectives: 2, baseAssessments: 55, activity: 'low' },
    { id: 'sim-14', name: 'Otávio Mendes', baseXp: 900, baseStreak: 3, baseSessions: 15, baseObjectives: 1, baseAssessments: 52, activity: 'low' },
    { id: 'sim-15', name: 'Patrícia Nunes', baseXp: 600, baseStreak: 2, baseSessions: 10, baseObjectives: 1, baseAssessments: 48, activity: 'low' }
]

// Helper functions
export function getLeaderboardKey(period: LeaderboardPeriod, category: LeaderboardCategory): string {
    return `${period}-${category}`
}

export function formatScore(score: number, category: LeaderboardCategory): string {
    switch (category) {
        case 'xp':
            return `${score.toLocaleString('pt-BR')} XP`
        case 'streak':
            return `${score} dias`
        case 'sessions':
            return `${score} sessões`
        case 'objectives':
            return `${score} objetivos`
        case 'assessments':
            return `${score.toFixed(1)}%`
        default:
            return score.toString()
    }
}

export function getRankSuffix(rank: number): string {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}º`
}

export function getRankColor(rank: number): string {
    if (rank === 1) return 'text-yellow-500'
    if (rank === 2) return 'text-gray-400'
    if (rank === 3) return 'text-amber-600'
    return 'text-gray-600'
}

export function getRankBg(rank: number): string {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20'
    if (rank === 2) return 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/30 dark:to-gray-700/20'
    if (rank === 3) return 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20'
    return ''
}

export function getTimeRemaining(endDate: Date): { days: number; hours: number; minutes: number; seconds: number } {
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
}

export function formatTimeRemaining(endDate: Date): string {
    const { days, hours, minutes } = getTimeRemaining(endDate)

    if (days > 0) {
        return `${days}d ${hours}h restantes`
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m restantes`
    }
    return `${minutes}m restantes`
}
