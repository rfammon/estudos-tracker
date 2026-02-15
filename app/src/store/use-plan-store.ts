import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    StudyPlan,
    DayPlan,
    DailyGoal,
    ReminderConfig,
    AdherenceRecord,
    DEFAULT_WEEKLY_PLAN,
    DEFAULT_DAILY_GOAL,
    DEFAULT_REMINDERS,
    DayOfWeek
} from '@/types/plan';

interface PlanState {
    plan: StudyPlan | null;
    adherenceHistory: AdherenceRecord[];
    createPlan: (name: string, description: string) => void;
    updatePlan: (updates: Partial<StudyPlan>) => void;
    deletePlan: () => void;
    updateDayPlan: (day: DayOfWeek, dayPlan: Partial<DayPlan>) => void;
    addTopicToDay: (day: DayOfWeek, topicId: string, durationMinutes: number) => void;
    removeTopicFromDay: (day: DayOfWeek, topicId: string) => void;
    updateDailyGoal: (goal: Partial<DailyGoal>) => void;
    updateReminders: (reminders: Partial<ReminderConfig>) => void;
    toggleReminder: (enabled: boolean) => void;
    recordAdherence: (date: string, actualMinutes: number, topicsStudied: number) => void;
    getWeeklyAdherence: () => number;
    getMonthlyAdherence: () => number;
    getTodayAdherence: () => AdherenceRecord | null;
    getPlannedMinutesForDay: (day: DayOfWeek) => number;
    getPlannedTopicsForDay: (day: DayOfWeek) => string[];
}

function getDayOfWeekFromDate(date: Date): DayOfWeek {
    const days: DayOfWeek[] = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    return days[date.getDay()];
}

export const usePlanStore = create<PlanState>()(
    persist(
        (set, get) => ({
            plan: null,
            adherenceHistory: [],

            createPlan: (name: string, description: string) => {
                const now = new Date().toISOString();
                const newPlan: StudyPlan = {
                    id: crypto.randomUUID(),
                    name,
                    description,
                    weeklyPlan: DEFAULT_WEEKLY_PLAN.map(day => ({ ...day, topics: [] })),
                    dailyGoal: { ...DEFAULT_DAILY_GOAL },
                    reminders: { ...DEFAULT_REMINDERS },
                    createdAt: now,
                    updatedAt: now,
                };
                set({ plan: newPlan });
            },

            updatePlan: (updates) => {
                set((state) => ({
                    plan: state.plan
                        ? { ...state.plan, ...updates, updatedAt: new Date().toISOString() }
                        : null,
                }));
            },

            deletePlan: () => {
                set({ plan: null, adherenceHistory: [] });
            },

            updateDayPlan: (day, dayPlan) => {
                set((state) => {
                    if (!state.plan) return state;
                    return {
                        plan: {
                            ...state.plan,
                            weeklyPlan: state.plan.weeklyPlan.map((d) =>
                                d.day === day ? { ...d, ...dayPlan } : d
                            ),
                            updatedAt: new Date().toISOString(),
                        },
                    };
                });
            },

            addTopicToDay: (day, topicId, durationMinutes) => {
                set((state) => {
                    if (!state.plan) return state;
                    return {
                        plan: {
                            ...state.plan,
                            weeklyPlan: state.plan.weeklyPlan.map((d) => {
                                if (d.day !== day) return d;
                                const existingIndex = d.topics.findIndex(t => t.topicId === topicId);
                                if (existingIndex >= 0) {
                                    const newTopics = [...d.topics];
                                    newTopics[existingIndex] = {
                                        ...newTopics[existingIndex],
                                        durationMinutes: newTopics[existingIndex].durationMinutes + durationMinutes,
                                    };
                                    return { ...d, topics: newTopics };
                                }
                                return {
                                    ...d,
                                    topics: [...d.topics, { topicId, durationMinutes }],
                                };
                            }),
                            updatedAt: new Date().toISOString(),
                        },
                    };
                });
            },

            removeTopicFromDay: (day, topicId) => {
                set((state) => {
                    if (!state.plan) return state;
                    return {
                        plan: {
                            ...state.plan,
                            weeklyPlan: state.plan.weeklyPlan.map((d) =>
                                d.day === day
                                    ? { ...d, topics: d.topics.filter((t) => t.topicId !== topicId) }
                                    : d
                            ),
                            updatedAt: new Date().toISOString(),
                        },
                    };
                });
            },

            updateDailyGoal: (goal) => {
                set((state) => {
                    if (!state.plan) return state;
                    return {
                        plan: {
                            ...state.plan,
                            dailyGoal: { ...state.plan.dailyGoal, ...goal },
                            updatedAt: new Date().toISOString(),
                        },
                    };
                });
            },

            updateReminders: (reminders) => {
                set((state) => {
                    if (!state.plan) return state;
                    return {
                        plan: {
                            ...state.plan,
                            reminders: { ...state.plan.reminders, ...reminders },
                            updatedAt: new Date().toISOString(),
                        },
                    };
                });
            },

            toggleReminder: (enabled) => {
                set((state) => {
                    if (!state.plan) return state;
                    return {
                        plan: {
                            ...state.plan,
                            reminders: { ...state.plan.reminders, enabled },
                            updatedAt: new Date().toISOString(),
                        },
                    };
                });
            },

            recordAdherence: (date, actualMinutes, topicsStudied) => {
                const dayOfWeek = getDayOfWeekFromDate(new Date(date));
                const { plan, getPlannedMinutesForDay } = get();

                if (!plan) return;

                const plannedMinutes = getPlannedMinutesForDay(dayOfWeek);
                const plannedTopics = plan.weeklyPlan
                    .find(d => d.day === dayOfWeek)?.topics.length || 0;

                const newRecord: AdherenceRecord = {
                    date,
                    dayOfWeek,
                    plannedMinutes,
                    actualMinutes,
                    topicsPlanned: plannedTopics,
                    topicsStudied,
                    completed: actualMinutes >= plannedMinutes && plannedMinutes > 0,
                };

                set((state) => {
                    const existingIndex = state.adherenceHistory.findIndex(r => r.date === date);
                    if (existingIndex >= 0) {
                        const newHistory = [...state.adherenceHistory];
                        newHistory[existingIndex] = newRecord;
                        return { adherenceHistory: newHistory };
                    }
                    return { adherenceHistory: [...state.adherenceHistory, newRecord] };
                });
            },

            getWeeklyAdherence: () => {
                const { adherenceHistory } = get();
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);

                const recentRecords = adherenceHistory.filter(
                    r => new Date(r.date) >= weekAgo && new Date(r.date) <= today
                );

                if (recentRecords.length === 0) return 0;

                const completedDays = recentRecords.filter(r => r.completed).length;
                return Math.round((completedDays / recentRecords.length) * 100);
            },

            getMonthlyAdherence: () => {
                const { adherenceHistory } = get();
                const today = new Date();
                const monthAgo = new Date(today);
                monthAgo.setDate(monthAgo.getDate() - 30);

                const recentRecords = adherenceHistory.filter(
                    r => new Date(r.date) >= monthAgo && new Date(r.date) <= today
                );

                if (recentRecords.length === 0) return 0;

                const completedDays = recentRecords.filter(r => r.completed).length;
                return Math.round((completedDays / recentRecords.length) * 100);
            },

            getTodayAdherence: () => {
                const { adherenceHistory } = get();
                const today = new Date().toISOString().split('T')[0];
                return adherenceHistory.find(r => r.date === today) || null;
            },

            getPlannedMinutesForDay: (day) => {
                const { plan } = get();
                if (!plan) return 0;
                const dayPlan = plan.weeklyPlan.find(d => d.day === day);
                if (!dayPlan || dayPlan.isRestDay) return 0;
                return dayPlan.topics.reduce((total, t) => total + t.durationMinutes, 0);
            },

            getPlannedTopicsForDay: (day) => {
                const { plan } = get();
                if (!plan) return [];
                const dayPlan = plan.weeklyPlan.find(d => d.day === day);
                return dayPlan?.topics.map(t => t.topicId) || [];
            },
        }),
        {
            name: 'estudos-tracker-plan',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
