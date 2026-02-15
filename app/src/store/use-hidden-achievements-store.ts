import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    HiddenAchievement,
    HiddenAchievementNotification,
    EasterEgg,
    HIDDEN_ACHIEVEMENTS,
    EASTER_EGGS,
} from '../types/hidden-achievements';
import { useGamificationStore } from './use-gamification-store';

interface HiddenAchievementsState {
    // State
    achievements: HiddenAchievement[];
    easterEggs: EasterEgg[];
    notifications: HiddenAchievementNotification[];
    logoClickCount: number;
    konamiProgress: string;
    consecutiveSessions: number;
    consecutivePerfectScores: number;
    pagesVisitedInSession: Set<string>;
    settingsSectionsVisited: Set<string>;
    nightStudyStreak: number;
    lastNightStudyDate: string | null;
    consoleMessageSeen: boolean;
    rainbowThemeUnlocked: boolean;

    // Actions
    discoverAchievement: (id: string) => void;
    discoverEasterEgg: (id: string) => void;
    addNotification: (achievement: HiddenAchievement) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;

    // Trigger detectors
    handleKonamiKey: (key: string) => boolean;
    handleLogoClick: () => HiddenAchievement | null;
    checkTimeBasedAchievement: (hour: number) => HiddenAchievement | null;
    checkSpecialDateAchievement: (date: Date, userBirthday?: string) => HiddenAchievement | null;
    handleSessionComplete: (hour: number) => HiddenAchievement | null;
    handleAssessmentComplete: (isPerfect: boolean) => HiddenAchievement | null;
    handlePageVisit: (page: string) => HiddenAchievement | null;
    handleSettingsSectionVisit: (section: string) => HiddenAchievement | null;
    handleSecretPageVisit: () => HiddenAchievement | null;
    handleConsoleMessageView: () => HiddenAchievement | null;

    // Milestone checker
    checkMilestoneAchievements: () => void;

    // Getters
    getDiscoveredAchievements: () => HiddenAchievement[];
    getUndiscoveredAchievements: () => HiddenAchievement[];
    getDiscoveredEasterEggs: () => EasterEgg[];
    getAchievementByRarity: (rarity: string) => HiddenAchievement[];
    getTotalHiddenXP: () => number;
    getDiscoveryProgress: () => { discovered: number; total: number; percentage: number };

    // Reset
    resetHiddenAchievements: () => void;
}

// Konami code sequence
const KONAMI_CODE = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';

// All pages that need to be visited for explorer achievement
const ALL_PAGES = ['dashboard', 'timer', 'topics', 'history', 'evolution', 'settings', 'plan'];

export const useHiddenAchievementsStore = create<HiddenAchievementsState>()(
    persist(
        (set, get) => ({
            // Initial state
            achievements: HIDDEN_ACHIEVEMENTS.map(a => ({ ...a, discovered: false })),
            easterEggs: EASTER_EGGS.map(e => ({ ...e, discovered: false })),
            notifications: [],
            logoClickCount: 0,
            konamiProgress: '',
            consecutiveSessions: 0,
            consecutivePerfectScores: 0,
            pagesVisitedInSession: new Set<string>(),
            settingsSectionsVisited: new Set<string>(),
            nightStudyStreak: 0,
            lastNightStudyDate: null,
            consoleMessageSeen: false,
            rainbowThemeUnlocked: false,

            // Discover achievement
            discoverAchievement: (id: string) => {
                const state = get();
                const achievement = state.achievements.find(a => a.id === id);

                if (!achievement || achievement.discovered) return;

                const now = new Date();

                set((s) => ({
                    achievements: s.achievements.map(a =>
                        a.id === id
                            ? { ...a, discovered: true, discoveredAt: now }
                            : a
                    ),
                }));

                // Add XP reward
                useGamificationStore.getState().addPoints(achievement.xpReward, false);

                // Add notification
                get().addNotification({ ...achievement, discovered: true, discoveredAt: now });

                // Check for milestone achievements
                get().checkMilestoneAchievements();

                // Discover corresponding easter egg if exists
                const easterEggMap: Record<string, string> = {
                    'konami-code': 'rainbow-theme',
                    'detective': 'secret-page',
                    'console-explorer': 'dev-message',
                };

                if (easterEggMap[id]) {
                    get().discoverEasterEgg(easterEggMap[id]);
                }
            },

            // Discover easter egg
            discoverEasterEgg: (id: string) => {
                const state = get();
                const easterEgg = state.easterEggs.find(e => e.id === id);

                if (!easterEgg || easterEgg.discovered) return;

                set((s) => ({
                    easterEggs: s.easterEggs.map(e =>
                        e.id === id
                            ? { ...e, discovered: true, discoveredAt: new Date() }
                            : e
                    ),
                }));

                // Unlock rainbow theme if discovered
                if (id === 'rainbow-theme') {
                    set({ rainbowThemeUnlocked: true });
                }
            },

            // Add notification
            addNotification: (achievement: HiddenAchievement) => {
                set((s) => ({
                    notifications: [
                        ...s.notifications,
                        { achievement, show: true, timestamp: new Date() },
                    ],
                }));
            },

            // Remove notification
            removeNotification: (id: string) => {
                set((s) => ({
                    notifications: s.notifications.filter(n => n.achievement.id !== id),
                }));
            },

            // Clear all notifications
            clearNotifications: () => {
                set({ notifications: [] });
            },

            // Handle Konami code key press
            handleKonamiKey: (key: string): boolean => {
                const state = get();
                const newProgress = state.konamiProgress + key;

                // Check if we're still on track for Konami code
                if (KONAMI_CODE.startsWith(newProgress)) {
                    set({ konamiProgress: newProgress });

                    // Check if complete
                    if (newProgress === KONAMI_CODE) {
                        get().discoverAchievement('konami-code');
                        set({ konamiProgress: '' });
                        return true;
                    }
                } else {
                    // Reset if wrong key
                    set({ konamiProgress: '' });
                }

                return false;
            },

            // Handle logo click
            handleLogoClick: (): HiddenAchievement | null => {
                const state = get();
                const newCount = state.logoClickCount + 1;
                set({ logoClickCount: newCount });

                // Check for click count achievements
                const clickAchievements = [
                    { id: 'curious-clicker', count: 10 },
                    { id: 'very-curious', count: 50 },
                    { id: 'obsessive-clicker', count: 100 },
                ];

                for (const achievement of clickAchievements) {
                    if (newCount === achievement.count) {
                        get().discoverAchievement(achievement.id);
                        const discovered = get().achievements.find(a => a.id === achievement.id);
                        if (discovered) return discovered;
                    }
                }

                return null;
            },

            // Check time-based achievement
            checkTimeBasedAchievement: (hour: number): HiddenAchievement | null => {
                const state = get();

                // Check for early bird (4 AM)
                if (hour === 4) {
                    const achievement = state.achievements.find(a => a.id === 'early-bird');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('early-bird');
                        return { ...achievement, discovered: true, discoveredAt: new Date() };
                    }
                }

                // Check for night owl (2 AM)
                if (hour === 2) {
                    const achievement = state.achievements.find(a => a.id === 'night-owl');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('night-owl');
                        return { ...achievement, discovered: true, discoveredAt: new Date() };
                    }
                }

                return null;
            },

            // Check special date achievement
            checkSpecialDateAchievement: (date: Date, userBirthday?: string): HiddenAchievement | null => {
                const state = get();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const dayOfWeek = date.getDay();
                const isFriday = dayOfWeek === 5;
                const is13th = day === 13;

                // Christmas (December 25)
                if (month === 12 && day === 25) {
                    const achievement = state.achievements.find(a => a.id === 'christmas-studier');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('christmas-studier');
                        return { ...achievement, discovered: true, discoveredAt: new Date() };
                    }
                }

                // New Year (December 31 or January 1)
                if ((month === 12 && day === 31) || (month === 1 && day === 1)) {
                    const achievement = state.achievements.find(a => a.id === 'new-year-worker');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('new-year-worker');
                        return { ...achievement, discovered: true, discoveredAt: new Date() };
                    }
                }

                // Friday the 13th
                if (isFriday && is13th) {
                    const achievement = state.achievements.find(a => a.id === 'friday-13');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('friday-13');
                        return { ...achievement, discovered: true, discoveredAt: new Date() };
                    }
                }

                // User birthday
                if (userBirthday) {
                    const [bdayMonth, bdayDay] = userBirthday.split('-').map(Number);
                    if (month === bdayMonth && day === bdayDay) {
                        const achievement = state.achievements.find(a => a.id === 'birthday-user');
                        if (achievement && !achievement.discovered) {
                            get().discoverAchievement('birthday-user');
                            return { ...achievement, discovered: true, discoveredAt: new Date() };
                        }
                    }
                }

                return null;
            },

            // Handle session complete
            handleSessionComplete: (hour: number): HiddenAchievement | null => {
                const state = get();
                const now = new Date();
                const today = now.toISOString().split('T')[0];

                // Check time-based achievements
                const timeAchievement = get().checkTimeBasedAchievement(hour);

                // Update consecutive sessions
                set((s) => ({
                    consecutiveSessions: s.consecutiveSessions + 1,
                }));

                // Check for marathon achievement (5 consecutive sessions)
                if (state.consecutiveSessions + 1 >= 5) {
                    const achievement = state.achievements.find(a => a.id === 'marathon-runner');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('marathon-runner');
                    }
                }

                // Check for vampire achievement (night study streak)
                const isNightHour = hour >= 20 || hour < 6;
                if (isNightHour) {
                    if (state.lastNightStudyDate) {
                        const lastDate = new Date(state.lastNightStudyDate);
                        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

                        if (diffDays === 1) {
                            const newStreak = state.nightStudyStreak + 1;
                            set({
                                nightStudyStreak: newStreak,
                                lastNightStudyDate: today
                            });

                            if (newStreak >= 7) {
                                const achievement = state.achievements.find(a => a.id === 'vampire');
                                if (achievement && !achievement.discovered) {
                                    get().discoverAchievement('vampire');
                                }
                            }
                        } else if (diffDays > 1) {
                            set({ nightStudyStreak: 1, lastNightStudyDate: today });
                        }
                    } else {
                        set({ nightStudyStreak: 1, lastNightStudyDate: today });
                    }
                }

                return timeAchievement;
            },

            // Handle assessment complete
            handleAssessmentComplete: (isPerfect: boolean): HiddenAchievement | null => {
                const state = get();

                if (isPerfect) {
                    const newStreak = state.consecutivePerfectScores + 1;
                    set({ consecutivePerfectScores: newStreak });

                    // Check for perfectionist achievement (3 consecutive perfect scores)
                    if (newStreak >= 3) {
                        const achievement = state.achievements.find(a => a.id === 'perfectionist');
                        if (achievement && !achievement.discovered) {
                            get().discoverAchievement('perfectionist');
                            return { ...achievement, discovered: true, discoveredAt: new Date() };
                        }
                    }
                } else {
                    set({ consecutivePerfectScores: 0 });
                }

                return null;
            },

            // Handle page visit
            handlePageVisit: (page: string): HiddenAchievement | null => {
                const state = get();
                const newPages = new Set(state.pagesVisitedInSession);
                newPages.add(page);
                set({ pagesVisitedInSession: newPages });

                // Check for explorer achievement (visit all pages)
                const allVisited = ALL_PAGES.every(p => newPages.has(p));
                if (allVisited) {
                    const achievement = state.achievements.find(a => a.id === 'explorer-pages');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('explorer-pages');
                        return { ...achievement, discovered: true, discoveredAt: new Date() };
                    }
                }

                return null;
            },

            // Handle settings section visit
            handleSettingsSectionVisit: (section: string): HiddenAchievement | null => {
                const state = get();
                const newSections = new Set(state.settingsSectionsVisited);
                newSections.add(section);
                set({ settingsSectionsVisited: newSections });

                // Check for configurator achievement (visit all settings sections)
                const allSections = ['account', 'personalization', 'notifications', 'privacy', 'data', 'language', 'accessibility', 'devices', 'subscription'];
                const allVisited = allSections.every(s => newSections.has(s));

                if (allVisited) {
                    const achievement = state.achievements.find(a => a.id === 'configurator');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('configurator');
                        return { ...achievement, discovered: true, discoveredAt: new Date() };
                    }
                }

                return null;
            },

            // Handle secret page visit
            handleSecretPageVisit: (): HiddenAchievement | null => {
                const state = get();
                const achievement = state.achievements.find(a => a.id === 'detective');

                if (achievement && !achievement.discovered) {
                    get().discoverAchievement('detective');
                    get().discoverEasterEgg('secret-page');
                    return { ...achievement, discovered: true, discoveredAt: new Date() };
                }

                return null;
            },

            // Handle console message view
            handleConsoleMessageView: (): HiddenAchievement | null => {
                const state = get();

                if (state.consoleMessageSeen) return null;

                set({ consoleMessageSeen: true });

                const achievement = state.achievements.find(a => a.id === 'console-explorer');
                if (achievement && !achievement.discovered) {
                    get().discoverAchievement('console-explorer');
                    get().discoverEasterEgg('dev-message');
                    return { ...achievement, discovered: true, discoveredAt: new Date() };
                }

                return null;
            },

            // Check milestone achievements
            checkMilestoneAchievements: () => {
                const state = get();
                const discoveredCount = state.achievements.filter(a => a.discovered).length;
                const totalAchievements = state.achievements.length;

                // Easter egg hunter (5 achievements)
                if (discoveredCount >= 5) {
                    const achievement = state.achievements.find(a => a.id === 'easter-egg-hunter');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('easter-egg-hunter');
                    }
                }

                // Master of secrets (all achievements)
                if (discoveredCount >= totalAchievements) {
                    const achievement = state.achievements.find(a => a.id === 'master-of-secrets');
                    if (achievement && !achievement.discovered) {
                        get().discoverAchievement('master-of-secrets');
                    }
                }
            },

            // Get discovered achievements
            getDiscoveredAchievements: (): HiddenAchievement[] => {
                return get().achievements.filter(a => a.discovered);
            },

            // Get undiscovered achievements
            getUndiscoveredAchievements: (): HiddenAchievement[] => {
                return get().achievements.filter(a => !a.discovered);
            },

            // Get discovered easter eggs
            getDiscoveredEasterEggs: (): EasterEgg[] => {
                return get().easterEggs.filter(e => e.discovered);
            },

            // Get achievement by rarity
            getAchievementByRarity: (rarity: string): HiddenAchievement[] => {
                return get().achievements.filter(a => a.rarity === rarity);
            },

            // Get total hidden XP
            getTotalHiddenXP: (): number => {
                return get()
                    .achievements.filter(a => a.discovered)
                    .reduce((total, a) => total + a.xpReward, 0);
            },

            // Get discovery progress
            getDiscoveryProgress: (): { discovered: number; total: number; percentage: number } => {
                const state = get();
                const discovered = state.achievements.filter(a => a.discovered).length;
                const total = state.achievements.length;
                const percentage = Math.round((discovered / total) * 100);

                return { discovered, total, percentage };
            },

            // Reset hidden achievements
            resetHiddenAchievements: () => {
                set({
                    achievements: HIDDEN_ACHIEVEMENTS.map(a => ({ ...a, discovered: false })),
                    easterEggs: EASTER_EGGS.map(e => ({ ...e, discovered: false })),
                    notifications: [],
                    logoClickCount: 0,
                    konamiProgress: '',
                    consecutiveSessions: 0,
                    consecutivePerfectScores: 0,
                    pagesVisitedInSession: new Set<string>(),
                    settingsSectionsVisited: new Set<string>(),
                    nightStudyStreak: 0,
                    lastNightStudyDate: null,
                    consoleMessageSeen: false,
                    rainbowThemeUnlocked: false,
                });
            },
        }),
        {
            name: 'estudos-tracker-hidden-achievements',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                achievements: state.achievements,
                easterEggs: state.easterEggs,
                logoClickCount: state.logoClickCount,
                consecutiveSessions: state.consecutiveSessions,
                consecutivePerfectScores: state.consecutivePerfectScores,
                pagesVisitedInSession: Array.from(state.pagesVisitedInSession),
                settingsSectionsVisited: Array.from(state.settingsSectionsVisited),
                nightStudyStreak: state.nightStudyStreak,
                lastNightStudyDate: state.lastNightStudyDate,
                consoleMessageSeen: state.consoleMessageSeen,
                rainbowThemeUnlocked: state.rainbowThemeUnlocked,
            }),
            merge: (persistedState: unknown, currentState) => {
                const persisted = persistedState as Partial<HiddenAchievementsState> | undefined;
                if (!persisted) return currentState;

                return {
                    ...currentState,
                    ...persisted,
                    pagesVisitedInSession: new Set(persisted.pagesVisitedInSession || []),
                    settingsSectionsVisited: new Set(persisted.settingsSectionsVisited || []),
                };
            },
        }
    )
);

// Console Easter Egg Message
export const logEasterEggMessage = () => {
    const styles = [
        'color: #8B5CF6',
        'font-size: 20px',
        'font-weight: bold',
        'text-shadow: 2px 2px 4px rgba(0,0,0,0.3)',
    ].join(';');

    const stylesNormal = [
        'color: #3B82F6',
        'font-size: 14px',
    ].join(';');

    console.log('%c🎮 Easter Egg Encontrado! 🎮', styles);
    console.log('%cVocê descobriu a mensagem secreta do desenvolvedor!', stylesNormal);
    console.log('%cEste aplicativo foi feito com muito ❤️ e ☕', stylesNormal);
    console.log('%cParabéns por ser curioso! Aqui está um presente: 🎁', stylesNormal);
    console.log('%cDica: Tente digitar o código Konami na página principal...', stylesNormal);

    // Trigger achievement
    useHiddenAchievementsStore.getState().handleConsoleMessageView();
};
