import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
    LeaderboardPeriod,
    LeaderboardCategory,
    LeaderboardEntry,
    Leaderboard,
    SIMULATED_USERS,
    PERIOD_CONFIGS,
} from '../types/leaderboard'

// Current user ID (for the real user)
export const CURRENT_USER_ID = 'current-user'

interface PeriodScores {
    xp: number
    streak: number
    sessions: number
    objectives: number
    assessments: number
    assessmentCount: number // For calculating average
}

interface LeaderboardState {
    // Period scores for current user
    periodScores: Record<LeaderboardPeriod, PeriodScores>

    // Last reset timestamps for each period
    lastReset: Record<LeaderboardPeriod, string>

    // Simulated user data (regenerated on each period reset)
    simulatedPeriodScores: Record<LeaderboardPeriod, Record<string, PeriodScores>>

    // Previous ranks for change calculation
    previousRanks: Record<string, number> // key: `${period}-${category}-${userId}`

    // Actions
    getLeaderboard: (period: LeaderboardPeriod, category: LeaderboardCategory) => Leaderboard
    getCurrentUserEntry: (period: LeaderboardPeriod, category: LeaderboardCategory) => LeaderboardEntry | null
    updateScore: (category: LeaderboardCategory, value: number, period?: LeaderboardPeriod) => void
    incrementScore: (category: LeaderboardCategory, value: number) => void
    checkAndResetPeriods: () => void
    resetPeriod: (period: LeaderboardPeriod) => void
    getTopThree: (period: LeaderboardPeriod, category: LeaderboardCategory) => LeaderboardEntry[]
    getUserRank: (period: LeaderboardPeriod, category: LeaderboardCategory) => number
}

// Helper to get period start date as ISO string
function getPeriodStartISO(period: LeaderboardPeriod): string {
    return PERIOD_CONFIGS[period].getStartDate().toISOString()
}

// Check if a period needs reset
function needsReset(period: LeaderboardPeriod, lastReset: string): boolean {
    if (period === 'all-time') return false

    const lastResetDate = new Date(lastReset)
    const currentPeriodStart = PERIOD_CONFIGS[period].getStartDate()

    return currentPeriodStart > lastResetDate
}

// Generate random variation for simulated users
function getRandomVariation(base: number, activity: 'high' | 'medium' | 'low', period: LeaderboardPeriod): number {
    const activityMultiplier = activity === 'high' ? 1.2 : activity === 'medium' ? 1.0 : 0.8
    const periodMultiplier = period === 'daily' ? 0.1 : period === 'weekly' ? 0.3 : period === 'monthly' ? 0.6 : 1.0
    const randomFactor = 0.7 + Math.random() * 0.6 // 0.7 to 1.3

    return Math.floor(base * activityMultiplier * periodMultiplier * randomFactor)
}

// Generate simulated scores for a period
function generateSimulatedScores(period: LeaderboardPeriod): Record<string, PeriodScores> {
    const scores: Record<string, PeriodScores> = {}

    SIMULATED_USERS.forEach(user => {
        scores[user.id] = {
            xp: getRandomVariation(user.baseXp, user.activity, period),
            streak: period === 'daily' ? Math.floor(Math.random() * 2) :
                period === 'weekly' ? Math.floor(user.baseStreak * 0.3) :
                    period === 'monthly' ? Math.floor(user.baseStreak * 0.6) :
                        user.baseStreak,
            sessions: getRandomVariation(user.baseSessions, user.activity, period),
            objectives: getRandomVariation(user.baseObjectives, user.activity, period),
            assessments: user.baseAssessments + (Math.random() * 10 - 5),
            assessmentCount: Math.floor(getRandomVariation(user.baseSessions * 0.3, user.activity, period))
        }
    })

    return scores
}

// Get initial period scores
function getInitialPeriodScores(): Record<LeaderboardPeriod, PeriodScores> {
    return {
        daily: { xp: 0, streak: 0, sessions: 0, objectives: 0, assessments: 0, assessmentCount: 0 },
        weekly: { xp: 0, streak: 0, sessions: 0, objectives: 0, assessments: 0, assessmentCount: 0 },
        monthly: { xp: 0, streak: 0, sessions: 0, objectives: 0, assessments: 0, assessmentCount: 0 },
        'all-time': { xp: 0, streak: 0, sessions: 0, objectives: 0, assessments: 0, assessmentCount: 0 }
    }
}

// Get initial simulated scores
function getInitialSimulatedScores(): Record<LeaderboardPeriod, Record<string, PeriodScores>> {
    return {
        daily: generateSimulatedScores('daily'),
        weekly: generateSimulatedScores('weekly'),
        monthly: generateSimulatedScores('monthly'),
        'all-time': generateSimulatedScores('all-time')
    }
}

export const useLeaderboardStore = create<LeaderboardState>()(
    persist(
        (set, get) => ({
            periodScores: getInitialPeriodScores(),
            lastReset: {
                daily: getPeriodStartISO('daily'),
                weekly: getPeriodStartISO('weekly'),
                monthly: getPeriodStartISO('monthly'),
                'all-time': new Date(2020, 0, 1).toISOString()
            },
            simulatedPeriodScores: getInitialSimulatedScores(),
            previousRanks: {},

            getLeaderboard: (period: LeaderboardPeriod, category: LeaderboardCategory): Leaderboard => {
                const state = get()
                const entries: LeaderboardEntry[] = []

                // Get current user score
                const currentUserScore = state.periodScores[period]
                const currentUserScoreValue = getScoreValue(currentUserScore, category)

                // Add current user entry
                entries.push({
                    id: `${CURRENT_USER_ID}-${period}-${category}`,
                    userId: CURRENT_USER_ID,
                    userName: 'Você',
                    avatar: undefined,
                    score: currentUserScoreValue,
                    rank: 0, // Will be calculated
                    previousRank: state.previousRanks[`${period}-${category}-${CURRENT_USER_ID}`],
                    period,
                    category,
                    updatedAt: new Date()
                })

                // Add simulated users
                const simulatedScores = state.simulatedPeriodScores[period]
                SIMULATED_USERS.forEach(user => {
                    const userScore = simulatedScores[user.id]
                    if (userScore) {
                        entries.push({
                            id: `${user.id}-${period}-${category}`,
                            userId: user.id,
                            userName: user.name,
                            avatar: user.name.split(' ').map(n => n[0]).join('').slice(0, 2),
                            score: getScoreValue(userScore, category),
                            rank: 0, // Will be calculated
                            previousRank: state.previousRanks[`${period}-${category}-${user.id}`],
                            period,
                            category,
                            updatedAt: new Date()
                        })
                    }
                })

                // Sort by score descending
                entries.sort((a, b) => b.score - a.score)

                // Assign ranks and calculate changes
                entries.forEach((entry, index) => {
                    const rank = index + 1
                    entry.rank = rank
                    entry.change = entry.previousRank ? entry.previousRank - rank : 0
                })

                // Store new ranks for next comparison
                const newPreviousRanks: Record<string, number> = {}
                entries.forEach(entry => {
                    newPreviousRanks[`${period}-${category}-${entry.userId}`] = entry.rank
                })

                // Update previous ranks (debounced to avoid loops)
                setTimeout(() => {
                    set(state => ({
                        previousRanks: { ...state.previousRanks, ...newPreviousRanks }
                    }))
                }, 0)

                return {
                    period,
                    category,
                    entries,
                    totalParticipants: entries.length,
                    startDate: PERIOD_CONFIGS[period].getStartDate(),
                    endDate: PERIOD_CONFIGS[period].getEndDate()
                }
            },

            getCurrentUserEntry: (period: LeaderboardPeriod, category: LeaderboardCategory): LeaderboardEntry | null => {
                const leaderboard = get().getLeaderboard(period, category)
                return leaderboard.entries.find(e => e.userId === CURRENT_USER_ID) || null
            },

            updateScore: (category: LeaderboardCategory, value: number, targetPeriod?: LeaderboardPeriod) => {
                const periods: LeaderboardPeriod[] = targetPeriod ? [targetPeriod] : ['daily', 'weekly', 'monthly', 'all-time']

                set(state => {
                    const newPeriodScores = { ...state.periodScores }

                    periods.forEach(period => {
                        newPeriodScores[period] = {
                            ...newPeriodScores[period],
                            [category]: value
                        }
                    })

                    return { periodScores: newPeriodScores }
                })
            },

            incrementScore: (category: LeaderboardCategory, value: number) => {
                set(state => {
                    const newPeriodScores = { ...state.periodScores }
                    const periods: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly', 'all-time']

                    periods.forEach(period => {
                        if (category === 'assessments') {
                            // For assessments, we track the average
                            const currentTotal = newPeriodScores[period].assessments * newPeriodScores[period].assessmentCount
                            const newCount = newPeriodScores[period].assessmentCount + 1
                            const newAverage = (currentTotal + value) / newCount
                            newPeriodScores[period] = {
                                ...newPeriodScores[period],
                                assessments: newAverage,
                                assessmentCount: newCount
                            }
                        } else {
                            newPeriodScores[period] = {
                                ...newPeriodScores[period],
                                [category]: (newPeriodScores[period][category as keyof PeriodScores] as number) + value
                            }
                        }
                    })

                    return { periodScores: newPeriodScores }
                })
            },

            checkAndResetPeriods: () => {
                const state = get()
                const periods: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly']
                let needsUpdate = false
                const newLastReset = { ...state.lastReset }
                const newPeriodScores = { ...state.periodScores }
                const newSimulatedScores = { ...state.simulatedPeriodScores }
                const newPreviousRanks = { ...state.previousRanks }

                periods.forEach(period => {
                    if (needsReset(period, state.lastReset[period])) {
                        // Reset period scores
                        newPeriodScores[period] = { xp: 0, streak: 0, sessions: 0, objectives: 0, assessments: 0, assessmentCount: 0 }

                        // Regenerate simulated scores
                        newSimulatedScores[period] = generateSimulatedScores(period)

                        // Clear previous ranks for this period
                        Object.keys(newPreviousRanks).forEach(key => {
                            if (key.startsWith(period)) {
                                delete newPreviousRanks[key]
                            }
                        })

                        newLastReset[period] = getPeriodStartISO(period)
                        needsUpdate = true
                    }
                })

                if (needsUpdate) {
                    set({
                        lastReset: newLastReset,
                        periodScores: newPeriodScores,
                        simulatedPeriodScores: newSimulatedScores,
                        previousRanks: newPreviousRanks
                    })
                }
            },

            resetPeriod: (period: LeaderboardPeriod) => {
                set(state => ({
                    periodScores: {
                        ...state.periodScores,
                        [period]: { xp: 0, streak: 0, sessions: 0, objectives: 0, assessments: 0, assessmentCount: 0 }
                    },
                    simulatedPeriodScores: {
                        ...state.simulatedPeriodScores,
                        [period]: generateSimulatedScores(period)
                    },
                    lastReset: {
                        ...state.lastReset,
                        [period]: getPeriodStartISO(period)
                    }
                }))
            },

            getTopThree: (period: LeaderboardPeriod, category: LeaderboardCategory): LeaderboardEntry[] => {
                const leaderboard = get().getLeaderboard(period, category)
                return leaderboard.entries.slice(0, 3)
            },

            getUserRank: (period: LeaderboardPeriod, category: LeaderboardCategory): number => {
                const entry = get().getCurrentUserEntry(period, category)
                return entry?.rank || 0
            }
        }),
        {
            name: 'estudos-tracker-leaderboard',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                periodScores: state.periodScores,
                lastReset: state.lastReset,
                previousRanks: state.previousRanks
            })
        }
    )
)

// Helper function to get score value by category
function getScoreValue(scores: PeriodScores, category: LeaderboardCategory): number {
    switch (category) {
        case 'xp':
            return scores.xp
        case 'streak':
            return scores.streak
        case 'sessions':
            return scores.sessions
        case 'objectives':
            return scores.objectives
        case 'assessments':
            return Math.round(scores.assessments * 10) / 10 // Round to 1 decimal
        default:
            return 0
    }
}

// Integration helpers - to be called from other stores
export function updateLeaderboardOnXP(xpEarned: number) {
    useLeaderboardStore.getState().incrementScore('xp', xpEarned)
}

export function updateLeaderboardOnSession() {
    useLeaderboardStore.getState().incrementScore('sessions', 1)
}

export function updateLeaderboardOnStreak(streakDays: number) {
    const state = useLeaderboardStore.getState()
    // Update streak for all periods
    state.updateScore('streak', streakDays)
}

export function updateLeaderboardOnObjective() {
    useLeaderboardStore.getState().incrementScore('objectives', 1)
}

export function updateLeaderboardOnAssessment(scorePercentage: number) {
    useLeaderboardStore.getState().incrementScore('assessments', scorePercentage)
}
