import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    updateLeaderboardOnXP,
    updateLeaderboardOnSession,
    updateLeaderboardOnStreak,
    updateLeaderboardOnObjective,
    updateLeaderboardOnAssessment
} from './use-leaderboard-store';
import { useMultiplierStore } from './use-multiplier-store';

// Types for achievements
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement: number;
    type: 'sessions' | 'streak' | 'totalTime' | 'points' | 'topics' | 'objectives' | 'assessments' | 'quiz-streak' | 'perfect-score';
    unlockedAt?: string;
}

// Types for levels
export interface Level {
    number: number;
    name: string;
    minPoints: number;
    maxPoints: number;
    color: string;
}

// Predefined achievements
export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-session',
        name: 'Primeiro Passo',
        description: 'Complete sua primeira sessão de estudo',
        icon: '🌟',
        requirement: 1,
        type: 'sessions',
    },
    {
        id: 'five-sessions',
        name: 'Estudante Dedicado',
        description: 'Complete 5 sessões de estudo',
        icon: '📚',
        requirement: 5,
        type: 'sessions',
    },
    {
        id: 'ten-sessions',
        name: 'Estudante Exemplar',
        description: 'Complete 10 sessões de estudo',
        icon: '🏆',
        requirement: 10,
        type: 'sessions',
    },
    {
        id: 'twenty-five-sessions',
        name: 'Mestre dos Estudos',
        description: 'Complete 25 sessões de estudo',
        icon: '👑',
        requirement: 25,
        type: 'sessions',
    },
    {
        id: 'three-day-streak',
        name: 'Consistência Inicial',
        description: 'Mantenha uma sequência de 3 dias',
        icon: '🔥',
        requirement: 3,
        type: 'streak',
    },
    {
        id: 'seven-day-streak',
        name: 'Semana de Ouro',
        description: 'Mantenha uma sequência de 7 dias',
        icon: '💪',
        requirement: 7,
        type: 'streak',
    },
    {
        id: 'fourteen-day-streak',
        name: 'Duas Semanas',
        description: 'Mantenha uma sequência de 14 dias',
        icon: '⭐',
        requirement: 14,
        type: 'streak',
    },
    {
        id: 'thirty-day-streak',
        name: 'Mês de Ferro',
        description: 'Mantenha uma sequência de 30 dias',
        icon: '💎',
        requirement: 30,
        type: 'streak',
    },
    {
        id: 'one-hour-total',
        name: 'Hora do Conhecimento',
        description: 'Estude um total de 1 hora',
        icon: '⏰',
        requirement: 60,
        type: 'totalTime',
    },
    {
        id: 'ten-hours-total',
        name: 'Dedicado',
        description: 'Estude um total de 10 horas',
        icon: '🎯',
        requirement: 600,
        type: 'totalTime',
    },
    {
        id: 'fifty-hours-total',
        name: 'Guerreiro',
        description: 'Estude um total de 50 horas',
        icon: '⚔️',
        requirement: 3000,
        type: 'totalTime',
    },
    {
        id: 'hundred-hours-total',
        name: 'Lenda',
        description: 'Estude um total de 100 horas',
        icon: '🌈',
        requirement: 6000,
        type: 'totalTime',
    },
    {
        id: 'hundred-points',
        name: 'Pontuador',
        description: 'Acumule 100 pontos',
        icon: '🎨',
        requirement: 100,
        type: 'points',
    },
    {
        id: 'five-hundred-points',
        name: 'Pontuador Elite',
        description: 'Acumule 500 pontos',
        icon: '🌺',
        requirement: 500,
        type: 'points',
    },
    {
        id: 'thousand-points',
        name: 'Arquiteto do Conhecimento',
        description: 'Acumule 1000 pontos',
        icon: '🎭',
        requirement: 1000,
        type: 'points',
    },
    {
        id: 'one-topic',
        name: 'Início',
        description: 'Domine seu primeiro tópico',
        icon: '🌱',
        requirement: 1,
        type: 'topics',
    },
    {
        id: 'three-topics',
        name: 'Tríade do Conhecimento',
        description: 'Domine 3 tópicos',
        icon: '🍀',
        requirement: 3,
        type: 'topics',
    },
    {
        id: 'five-topics',
        name: 'Expert',
        description: 'Domine 5 tópicos',
        icon: '🎓',
        requirement: 5,
        type: 'topics',
    },
    // Learning Objectives Achievements
    {
        id: 'first-objective',
        name: 'Primeira Meta',
        description: 'Complete seu primeiro objetivo de aprendizagem',
        icon: '🎯',
        requirement: 1,
        type: 'objectives',
    },
    {
        id: 'five-objectives',
        name: 'Focado',
        description: 'Complete 5 objetivos de aprendizagem',
        icon: '📌',
        requirement: 5,
        type: 'objectives',
    },
    {
        id: 'ten-objectives',
        name: 'Determinado',
        description: 'Complete 10 objetivos de aprendizagem',
        icon: '🏅',
        requirement: 10,
        type: 'objectives',
    },
    {
        id: 'twenty-five-objectives',
        name: 'Conquistador',
        description: 'Complete 25 objetivos de aprendizagem',
        icon: '🥇',
        requirement: 25,
        type: 'objectives',
    },
    {
        id: 'fifty-objectives',
        name: 'Realizador',
        description: 'Complete 50 objetivos de aprendizagem',
        icon: '🏆',
        requirement: 50,
        type: 'objectives',
    },
    // Assessment Achievements
    {
        id: 'first-assessment',
        name: 'Primeiro Teste',
        description: 'Complete sua primeira avaliação',
        icon: '📝',
        requirement: 1,
        type: 'assessments',
    },
    {
        id: 'five-assessments',
        name: 'Avaliador',
        description: 'Complete 5 avaliações',
        icon: '📊',
        requirement: 5,
        type: 'assessments',
    },
    {
        id: 'ten-assessments',
        name: 'Examinateur',
        description: 'Complete 10 avaliações',
        icon: '🎯',
        requirement: 10,
        type: 'assessments',
    },
    {
        id: 'twenty-five-assessments',
        name: 'Mestre das Avaliações',
        description: 'Complete 25 avaliações',
        icon: '🏅',
        requirement: 25,
        type: 'assessments',
    },
    // Quiz Streak Achievements
    {
        id: 'quiz-streak-3',
        name: 'Sequência de Quiz',
        description: 'Complete quizzes 3 dias seguidos',
        icon: '🔥',
        requirement: 3,
        type: 'quiz-streak',
    },
    {
        id: 'quiz-streak-7',
        name: 'Semana de Quizzes',
        description: 'Complete quizzes 7 dias seguidos',
        icon: '⚡',
        requirement: 7,
        type: 'quiz-streak',
    },
    // Perfect Score Achievements
    {
        id: 'first-perfect',
        name: 'Perfeição',
        description: 'Tire 100% em uma avaliação',
        icon: '💎',
        requirement: 1,
        type: 'perfect-score',
    },
    {
        id: 'five-perfect',
        name: 'Perfeccionista',
        description: 'Tire 100% em 5 avaliações',
        icon: '👑',
        requirement: 5,
        type: 'perfect-score',
    },
    {
        id: 'ten-perfect',
        name: 'Impecável',
        description: 'Tire 100% em 10 avaliações',
        icon: '🌟',
        requirement: 10,
        type: 'perfect-score',
    },
];

// Predefined levels
export const LEVELS: Level[] = [
    { number: 1, name: 'Iniciante', minPoints: 0, maxPoints: 100, color: '#9CA3AF' },
    { number: 2, name: 'Aprendiz', minPoints: 100, maxPoints: 300, color: '#22C55E' },
    { number: 3, name: 'Estudante', minPoints: 300, maxPoints: 600, color: '#3B82F6' },
    { number: 4, name: 'Academico', minPoints: 600, maxPoints: 1000, color: '#8B5CF6' },
    { number: 5, name: 'Concurseiro', minPoints: 1000, maxPoints: 2000, color: '#F59E0B' },
    { number: 6, name: 'Profissional', minPoints: 2000, maxPoints: 3500, color: '#EF4444' },
    { number: 7, name: 'Especialista', minPoints: 3500, maxPoints: 5000, color: '#EC4899' },
    { number: 8, name: 'Mestre', minPoints: 5000, maxPoints: 7500, color: '#14B8A6' },
    { number: 9, name: 'Guru', minPoints: 7500, maxPoints: 10000, color: '#F97316' },
    { number: 10, name: 'Lenda', minPoints: 10000, maxPoints: Infinity, color: '#EAB308' },
];

interface GamificationState {
    totalPoints: number;
    currentStreak: number;
    bestStreak: number;
    lastStudyDate: string | null;
    unlockedAchievements: string[];
    totalStudyTime: number;
    totalSessions: number;
    masteredTopics: number;
    completedObjectives: number;
    completedAssessments: number;
    perfectScores: number;
    currentQuizStreak: number;
    bestQuizStreak: number;

    // Actions
    addPoints: (points: number, applyMultiplier?: boolean) => void;
    addPointsWithMultiplier: (points: number) => number;
    addStudyTime: (seconds: number) => void;
    updateStreak: (hasStudiedToday: boolean) => void;
    incrementSessions: () => void;
    incrementMasteredTopics: () => void;
    incrementCompletedObjectives: (xpEarned: number) => void;
    incrementAssessments: (xpEarned: number, isPerfect: boolean) => void;
    updateQuizStreak: () => void;
    checkAchievements: () => string[];
    getCurrentLevel: () => Level;
    getPointsToNextLevel: () => number;
    getProgressToNextLevel: () => number;
    getUnlockedAchievements: () => Achievement[];
    getLockedAchievements: () => Achievement[];
    resetGamification: () => void;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            totalPoints: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastStudyDate: null,
            unlockedAchievements: [],
            totalStudyTime: 0,
            totalSessions: 0,
            masteredTopics: 0,
            completedObjectives: 0,
            completedAssessments: 0,
            perfectScores: 0,
            currentQuizStreak: 0,
            bestQuizStreak: 0,

            addPoints: (points: number, applyMultiplier: boolean = true) => {
                let finalPoints = points;

                // Apply multiplier if requested
                if (applyMultiplier) {
                    try {
                        const multiplierState = useMultiplierStore.getState();
                        finalPoints = multiplierState.applyMultiplier(points);
                    } catch {
                        // Multiplier store not available, use base points
                        finalPoints = points;
                    }
                }

                set((state: GamificationState) => ({
                    totalPoints: state.totalPoints + finalPoints,
                }));
                // Update leaderboard
                updateLeaderboardOnXP(finalPoints);
                // Check for new achievements after adding points
                get().checkAchievements();
            },

            addPointsWithMultiplier: (points: number): number => {
                let finalPoints = points;

                // Apply multiplier
                try {
                    const multiplierState = useMultiplierStore.getState();
                    finalPoints = multiplierState.applyMultiplier(points);
                } catch {
                    // Multiplier store not available, use base points
                    finalPoints = points;
                }

                set((state: GamificationState) => ({
                    totalPoints: state.totalPoints + finalPoints,
                }));
                // Update leaderboard
                updateLeaderboardOnXP(finalPoints);
                // Check for new achievements after adding points
                get().checkAchievements();

                return finalPoints;
            },

            addStudyTime: (seconds: number) => {
                set((state: GamificationState) => ({
                    totalStudyTime: state.totalStudyTime + seconds,
                }));
                get().checkAchievements();
            },

            updateStreak: (hasStudiedToday: boolean) => {
                const { lastStudyDate, currentStreak, bestStreak } = get();
                const today = new Date().toISOString().split('T')[0];

                if (!hasStudiedToday) {
                    // Reset streak if didn't study today
                    set({ currentStreak: 0 });
                    return;
                }

                if (lastStudyDate === today) {
                    // Already studied today, no change
                    return;
                }

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                let newStreak: number;
                if (lastStudyDate === yesterdayStr) {
                    // Continue streak
                    newStreak = currentStreak + 1;
                } else if (lastStudyDate === null || lastStudyDate !== yesterdayStr) {
                    // Start new streak
                    newStreak = 1;
                } else {
                    newStreak = 1;
                }

                const newBestStreak = Math.max(bestStreak, newStreak);

                set({
                    currentStreak: newStreak,
                    bestStreak: newBestStreak,
                    lastStudyDate: today,
                });

                // Update leaderboard streak
                updateLeaderboardOnStreak(newStreak);

                // Update streak multiplier
                try {
                    useMultiplierStore.getState().updateStreakMultiplier(newStreak);
                } catch {
                    // Multiplier store not available
                }

                // Check for streak achievements
                get().checkAchievements();
            },

            incrementSessions: () => {
                set((state: GamificationState) => ({
                    totalSessions: state.totalSessions + 1,
                }));
                // Update leaderboard
                updateLeaderboardOnSession();
                get().checkAchievements();
            },

            incrementMasteredTopics: () => {
                set((state: GamificationState) => ({
                    masteredTopics: state.masteredTopics + 1,
                }));
                get().checkAchievements();
            },

            incrementCompletedObjectives: (xpEarned: number) => {
                set((state: GamificationState) => ({
                    completedObjectives: state.completedObjectives + 1,
                    totalPoints: state.totalPoints + xpEarned,
                }));
                // Update leaderboard
                updateLeaderboardOnObjective();
                updateLeaderboardOnXP(xpEarned);
                get().checkAchievements();
            },

            incrementAssessments: (xpEarned: number, isPerfect: boolean) => {
                set((state: GamificationState) => ({
                    completedAssessments: state.completedAssessments + 1,
                    totalPoints: state.totalPoints + xpEarned,
                    perfectScores: isPerfect ? state.perfectScores + 1 : state.perfectScores,
                }));
                // Update leaderboard - calculate score percentage based on XP
                const scorePercentage = Math.min(100, Math.round((xpEarned / 50) * 100)); // Assuming 50 XP is max for assessment
                updateLeaderboardOnAssessment(scorePercentage);
                updateLeaderboardOnXP(xpEarned);
                get().checkAchievements();
            },

            updateQuizStreak: () => {
                set((state: GamificationState) => {
                    const newStreak = state.currentQuizStreak + 1;
                    return {
                        currentQuizStreak: newStreak,
                        bestQuizStreak: Math.max(state.bestQuizStreak, newStreak),
                    };
                });
                get().checkAchievements();
            },

            checkAchievements: (): string[] => {
                const state = get();
                const newlyUnlocked: string[] = [];

                ACHIEVEMENTS.forEach((achievement) => {
                    if (state.unlockedAchievements.includes(achievement.id)) {
                        return; // Already unlocked
                    }

                    let shouldUnlock = false;

                    switch (achievement.type) {
                        case 'sessions':
                            shouldUnlock = state.totalSessions >= achievement.requirement;
                            break;
                        case 'streak':
                            shouldUnlock = state.currentStreak >= achievement.requirement || state.bestStreak >= achievement.requirement;
                            break;
                        case 'totalTime':
                            shouldUnlock = state.totalStudyTime >= achievement.requirement;
                            break;
                        case 'points':
                            shouldUnlock = state.totalPoints >= achievement.requirement;
                            break;
                        case 'topics':
                            shouldUnlock = state.masteredTopics >= achievement.requirement;
                            break;
                        case 'objectives':
                            shouldUnlock = state.completedObjectives >= achievement.requirement;
                            break;
                        case 'assessments':
                            shouldUnlock = state.completedAssessments >= achievement.requirement;
                            break;
                        case 'quiz-streak':
                            shouldUnlock = state.currentQuizStreak >= achievement.requirement || state.bestQuizStreak >= achievement.requirement;
                            break;
                        case 'perfect-score':
                            shouldUnlock = state.perfectScores >= achievement.requirement;
                            break;
                    }

                    if (shouldUnlock) {
                        newlyUnlocked.push(achievement.id);
                    }
                });

                if (newlyUnlocked.length > 0) {
                    set((state: GamificationState) => ({
                        unlockedAchievements: [...state.unlockedAchievements, ...newlyUnlocked],
                    }));
                }

                return newlyUnlocked;
            },

            getCurrentLevel: (): Level => {
                const { totalPoints } = get();
                for (let i = LEVELS.length - 1; i >= 0; i--) {
                    if (totalPoints >= LEVELS[i].minPoints) {
                        return LEVELS[i];
                    }
                }
                return LEVELS[0];
            },

            getPointsToNextLevel: (): number => {
                const { totalPoints } = get();
                const currentLevel = get().getCurrentLevel();
                if (currentLevel.number === LEVELS.length) {
                    return 0;
                }
                return currentLevel.maxPoints - totalPoints;
            },

            getProgressToNextLevel: (): number => {
                const { totalPoints } = get();
                const currentLevel = get().getCurrentLevel();
                if (currentLevel.number === LEVELS.length) {
                    return 100;
                }
                const levelRange = currentLevel.maxPoints - currentLevel.minPoints;
                const progressInLevel = totalPoints - currentLevel.minPoints;
                return Math.round((progressInLevel / levelRange) * 100);
            },

            getUnlockedAchievements: (): Achievement[] => {
                const { unlockedAchievements } = get();
                return ACHIEVEMENTS.filter((a) => unlockedAchievements.includes(a.id));
            },

            getLockedAchievements: (): Achievement[] => {
                const { unlockedAchievements } = get();
                return ACHIEVEMENTS.filter((a) => !unlockedAchievements.includes(a.id));
            },

            resetGamification: () => {
                set({
                    totalPoints: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    lastStudyDate: null,
                    unlockedAchievements: [],
                    totalStudyTime: 0,
                    totalSessions: 0,
                    masteredTopics: 0,
                    completedObjectives: 0,
                    completedAssessments: 0,
                    perfectScores: 0,
                    currentQuizStreak: 0,
                    bestQuizStreak: 0,
                });
            },
        }),
        {
            name: 'estudos-tracker-gamification',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
