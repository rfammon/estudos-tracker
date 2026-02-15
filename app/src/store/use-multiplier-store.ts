import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    Multiplier,
    BonusEvent,
    ComboState,
    MultiplierNotification,
    STREAK_MULTIPLIERS,
    COMBO_MULTIPLIERS,
    TIME_BONUSES,
    DEFAULT_BONUS_EVENTS,
    MultiplierType,
    MultiplierCalculation,
} from '../types/multipliers';

interface MultiplierState {
    // Active multipliers
    activeMultipliers: Multiplier[];

    // Bonus events
    bonusEvents: BonusEvent[];

    // Combo state
    comboState: ComboState;

    // Notifications
    notifications: MultiplierNotification[];

    // First session tracking
    hasStudiedToday: boolean;
    lastStudyDate: string | null;

    // Actions
    initializeBonusEvents: () => void;
    activateMultiplier: (multiplier: Multiplier) => void;
    deactivateMultiplier: (multiplierId: string) => void;
    calculateTotalMultiplier: () => MultiplierCalculation;
    applyMultiplier: (baseXP: number) => number;

    // Streak multiplier
    updateStreakMultiplier: (currentStreak: number) => void;

    // Time bonus
    checkTimeBonus: () => Multiplier | null;

    // Combo system
    incrementCombo: () => void;
    resetCombo: () => void;
    checkComboTimeout: () => void;

    // Event multipliers
    checkActiveEvents: () => Multiplier[];
    activateEventMultiplier: (event: BonusEvent) => void;

    // Achievement bonus
    activateAchievementBonus: (achievementId: string, achievementName: string) => void;

    // First session bonus
    checkFirstSessionBonus: () => Multiplier | null;
    markFirstSessionUsed: () => void;

    // Notifications
    addNotification: (notification: Omit<MultiplierNotification, 'id' | 'timestamp' | 'read'>) => void;
    markNotificationRead: (notificationId: string) => void;
    clearNotifications: () => void;

    // Utility
    getActiveMultipliersByType: (type: MultiplierType) => Multiplier[];
    isMultiplierActive: (multiplierId: string) => boolean;
    reset: () => void;
}

// Generate unique ID
const generateId = () => `mult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Check if current time is within a time range
const isTimeInRange = (startTime: string, endTime: string): boolean => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes <= endMinutes) {
        return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
        // Handles overnight ranges (e.g., 22:00 - 02:00)
        return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
};

// Check if today is a specific day of week
const isDayOfWeek = (daysOfWeek: number[]): boolean => {
    const today = new Date().getDay();
    return daysOfWeek.includes(today);
};

export const useMultiplierStore = create<MultiplierState>()(
    persist(
        (set, get) => ({
            activeMultipliers: [],
            bonusEvents: [],
            comboState: {
                currentCombo: 0,
                lastActivityTime: null,
                comboMultiplier: 1,
                comboTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
            },
            notifications: [],
            hasStudiedToday: false,
            lastStudyDate: null,

            initializeBonusEvents: () => {
                const now = new Date();
                const yearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

                const events: BonusEvent[] = DEFAULT_BONUS_EVENTS.map((event) => ({
                    ...event,
                    startDate: now,
                    endDate: yearFromNow,
                }));

                set({ bonusEvents: events });
            },

            activateMultiplier: (multiplier: Multiplier) => {
                const { activeMultipliers, addNotification } = get();

                // Check if already active
                if (activeMultipliers.some(m => m.id === multiplier.id)) {
                    return;
                }

                const newMultiplier: Multiplier = {
                    ...multiplier,
                    startTime: new Date(),
                    active: true,
                };

                if (multiplier.duration) {
                    newMultiplier.endTime = new Date(Date.now() + multiplier.duration * 60 * 1000);
                }

                set({
                    activeMultipliers: [...activeMultipliers, newMultiplier],
                });

                // Add notification
                addNotification({
                    multiplierId: multiplier.id,
                    multiplierName: multiplier.name,
                    multiplierValue: multiplier.value,
                    type: multiplier.type,
                    icon: multiplier.icon,
                });
            },

            deactivateMultiplier: (multiplierId: string) => {
                set((state) => ({
                    activeMultipliers: state.activeMultipliers.filter(m => m.id !== multiplierId),
                }));
            },

            calculateTotalMultiplier: (): MultiplierCalculation => {
                const { activeMultipliers } = get();

                // Remove expired multipliers first
                const now = new Date();
                const validMultipliers = activeMultipliers.filter(m => {
                    if (m.endTime && new Date(m.endTime) < now) {
                        return false;
                    }
                    return true;
                });

                // Calculate total multiplier (multiplicative, not additive)
                let totalMultiplier = 1;
                const appliedMultipliers: MultiplierCalculation['multipliers'] = [];

                validMultipliers.forEach(m => {
                    totalMultiplier *= m.value;
                    appliedMultipliers.push({
                        id: m.id,
                        name: m.name,
                        value: m.value,
                        type: m.type,
                    });
                });

                return {
                    baseValue: 1,
                    multipliers: appliedMultipliers,
                    totalMultiplier,
                    finalValue: totalMultiplier,
                };
            },

            applyMultiplier: (baseXP: number): number => {
                const calculation = get().calculateTotalMultiplier();
                return Math.round(baseXP * calculation.totalMultiplier);
            },

            updateStreakMultiplier: (currentStreak: number) => {
                const { activeMultipliers, activateMultiplier, deactivateMultiplier } = get();

                // Remove existing streak multipliers
                activeMultipliers
                    .filter(m => m.type === 'streak')
                    .forEach(m => deactivateMultiplier(m.id));

                // Find applicable streak multiplier
                const streakMult = [...STREAK_MULTIPLIERS].reverse().find(
                    sm => currentStreak >= sm.days
                );

                if (streakMult) {
                    activateMultiplier({
                        id: `streak-${streakMult.days}`,
                        type: 'streak',
                        name: streakMult.name,
                        description: `${streakMult.multiplier}x por sequência de ${streakMult.days} dias`,
                        value: streakMult.multiplier,
                        icon: '🔥',
                        active: true,
                    });
                }
            },

            checkTimeBonus: (): Multiplier | null => {
                const now = new Date();
                const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                for (const timeBonus of TIME_BONUSES) {
                    if (isTimeInRange(timeBonus.startTime, timeBonus.endTime)) {
                        return {
                            id: `time-${timeBonus.name.toLowerCase().replace(/\s+/g, '-')}`,
                            type: 'time',
                            name: timeBonus.name,
                            description: timeBonus.description,
                            value: timeBonus.multiplier,
                            icon: timeBonus.icon,
                            active: true,
                        };
                    }
                }

                return null;
            },

            incrementCombo: () => {
                const { comboState, activateMultiplier, deactivateMultiplier } = get();
                const now = new Date();

                // Check if combo timed out
                if (comboState.lastActivityTime) {
                    const elapsed = now.getTime() - new Date(comboState.lastActivityTime).getTime();
                    if (elapsed > comboState.comboTimeout) {
                        // Reset combo if timed out
                        get().resetCombo();
                        return;
                    }
                }

                const newCombo = comboState.currentCombo + 1;

                // Find applicable combo multiplier
                const comboMult = [...COMBO_MULTIPLIERS].reverse().find(
                    cm => newCombo >= cm.tasks
                );

                // Remove existing combo multipliers
                get().activeMultipliers
                    .filter(m => m.type === 'combo')
                    .forEach(m => deactivateMultiplier(m.id));

                if (comboMult) {
                    activateMultiplier({
                        id: `combo-${comboMult.tasks}`,
                        type: 'combo',
                        name: comboMult.name,
                        description: `${comboMult.multiplier}x por completar ${comboMult.tasks} tarefas em sequência`,
                        value: comboMult.multiplier,
                        icon: '⚡',
                        active: true,
                    });
                }

                set({
                    comboState: {
                        ...comboState,
                        currentCombo: newCombo,
                        lastActivityTime: now,
                        comboMultiplier: comboMult?.multiplier || 1,
                    },
                });
            },

            resetCombo: () => {
                const { activeMultipliers, deactivateMultiplier } = get();

                // Remove existing combo multipliers
                activeMultipliers
                    .filter(m => m.type === 'combo')
                    .forEach(m => deactivateMultiplier(m.id));

                set({
                    comboState: {
                        currentCombo: 0,
                        lastActivityTime: null,
                        comboMultiplier: 1,
                        comboTimeout: 30 * 60 * 1000,
                    },
                });
            },

            checkComboTimeout: () => {
                const { comboState, resetCombo } = get();

                if (comboState.lastActivityTime) {
                    const elapsed = Date.now() - new Date(comboState.lastActivityTime).getTime();
                    if (elapsed > comboState.comboTimeout && comboState.currentCombo > 0) {
                        resetCombo();
                    }
                }
            },

            checkActiveEvents: (): Multiplier[] => {
                const { bonusEvents } = get();
                const now = new Date();
                const activeEventMultipliers: Multiplier[] = [];

                bonusEvents.forEach(event => {
                    // Check if event is within date range
                    if (new Date(event.startDate) > now || new Date(event.endDate) < now) {
                        return;
                    }

                    // Check day of week if specified
                    if (event.daysOfWeek && !isDayOfWeek(event.daysOfWeek)) {
                        return;
                    }

                    // Check time range if specified
                    if (event.startTime && event.endTime) {
                        if (!isTimeInRange(event.startTime, event.endTime)) {
                            return;
                        }
                    }

                    // Event is active
                    activeEventMultipliers.push({
                        id: `event-${event.id}`,
                        type: 'event',
                        name: event.name,
                        description: event.description,
                        value: event.multiplier,
                        icon: event.icon,
                        active: true,
                        source: event.id,
                    });
                });

                return activeEventMultipliers;
            },

            activateEventMultiplier: (event: BonusEvent) => {
                get().activateMultiplier({
                    id: `event-${event.id}`,
                    type: 'event',
                    name: event.name,
                    description: event.description,
                    value: event.multiplier,
                    icon: event.icon,
                    active: true,
                    source: event.id,
                });
            },

            activateAchievementBonus: (achievementId: string, achievementName: string) => {
                get().activateMultiplier({
                    id: `achievement-${achievementId}`,
                    type: 'achievement',
                    name: `Bônus: ${achievementName}`,
                    description: '1.5x XP por 1 hora',
                    value: 1.5,
                    duration: 60, // 1 hour
                    icon: '🏆',
                    active: true,
                    source: achievementId,
                });
            },

            checkFirstSessionBonus: (): Multiplier | null => {
                const { hasStudiedToday, lastStudyDate } = get();
                const today = new Date().toISOString().split('T')[0];

                // Check if it's a new day
                if (lastStudyDate !== today && !hasStudiedToday) {
                    return {
                        id: 'first-session-today',
                        type: 'time',
                        name: 'Primeira Sessão do Dia',
                        description: '2x XP na primeira sessão de estudo do dia',
                        value: 2,
                        icon: '🌅',
                        active: true,
                    };
                }

                return null;
            },

            markFirstSessionUsed: () => {
                const today = new Date().toISOString().split('T')[0];
                set({
                    hasStudiedToday: true,
                    lastStudyDate: today,
                });

                // Deactivate first session multiplier
                get().deactivateMultiplier('first-session-today');
            },

            addNotification: (notification) => {
                const newNotification: MultiplierNotification = {
                    ...notification,
                    id: generateId(),
                    timestamp: new Date(),
                    read: false,
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
                }));
            },

            markNotificationRead: (notificationId: string) => {
                set((state) => ({
                    notifications: state.notifications.map(n =>
                        n.id === notificationId ? { ...n, read: true } : n
                    ),
                }));
            },

            clearNotifications: () => {
                set({ notifications: [] });
            },

            getActiveMultipliersByType: (type: MultiplierType) => {
                return get().activeMultipliers.filter(m => m.type === type);
            },

            isMultiplierActive: (multiplierId: string) => {
                return get().activeMultipliers.some(m => m.id === multiplierId);
            },

            reset: () => {
                set({
                    activeMultipliers: [],
                    bonusEvents: [],
                    comboState: {
                        currentCombo: 0,
                        lastActivityTime: null,
                        comboMultiplier: 1,
                        comboTimeout: 30 * 60 * 1000,
                    },
                    notifications: [],
                    hasStudiedToday: false,
                    lastStudyDate: null,
                });
            },
        }),
        {
            name: 'estudos-tracker-multipliers',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                bonusEvents: state.bonusEvents,
                comboState: state.comboState,
                hasStudiedToday: state.hasStudiedToday,
                lastStudyDate: state.lastStudyDate,
            }),
        }
    )
);

// Hook to automatically check and activate time-based multipliers
export const useTimeBasedMultipliers = () => {
    const { checkTimeBonus, activateMultiplier, checkActiveEvents, checkFirstSessionBonus } = useMultiplierStore();

    const checkAndActivateMultipliers = () => {
        // Check time bonus
        const timeBonus = checkTimeBonus();
        if (timeBonus) {
            activateMultiplier(timeBonus);
        }

        // Check first session bonus
        const firstSessionBonus = checkFirstSessionBonus();
        if (firstSessionBonus) {
            activateMultiplier(firstSessionBonus);
        }

        // Check active events
        const activeEvents = checkActiveEvents();
        activeEvents.forEach(event => {
            activateMultiplier(event);
        });
    };

    return { checkAndActivateMultipliers };
};

// Export utility functions for external use
export { isTimeInRange, isDayOfWeek };
