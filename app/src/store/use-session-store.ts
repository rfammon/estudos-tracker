import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StudySession, ActiveSession } from '@/types';

export interface SessionState {
    sessions: StudySession[];
    activeSession: ActiveSession | null;
    startSession: (topicId: string) => void;
    endSession: (notes?: string) => StudySession | null;
    updateActiveSessionTime: (seconds: number) => void;
    getSessionsByTopic: (topicId: string) => StudySession[];
    getTotalTimeByTopic: (topicId: string) => number;
    getTotalTime: () => number;
    getTodayTime: () => number;
    getWeekTime: () => number;
    getMonthTime: () => number;
    getLastWeekTime: () => number;
    getLastMonthTime: () => number;
    deleteSession: (sessionId: string) => void;
    updateSessionNotes: (sessionId: string, notes: string) => void;
    getSessionsByDateRange: (startDate: string, endDate: string) => StudySession[];
    getEvolutionData: (days: number) => { date: string; total: number }[];
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set, get) => ({
            sessions: [],
            activeSession: null,

            startSession: (topicId: string) => {
                const now = new Date().toISOString();
                set({
                    activeSession: {
                        topicId,
                        startTime: now,
                        seconds: 0,
                    },
                });
            },

            endSession: (notes?: string) => {
                const { activeSession, sessions } = get();
                if (!activeSession) return null;

                const endTime = new Date().toISOString();
                const duration = activeSession.seconds;
                const points = Math.floor(duration / 60);

                const newSession: StudySession = {
                    id: crypto.randomUUID(),
                    topicId: activeSession.topicId,
                    startTime: activeSession.startTime,
                    endTime,
                    duration,
                    points,
                    notes,
                    createdAt: endTime,
                };

                set({
                    sessions: [...sessions, newSession],
                    activeSession: null,
                });

                return newSession;
            },

            updateActiveSessionTime: (seconds: number) => {
                set((state: SessionState) => ({
                    activeSession: state.activeSession
                        ? { ...state.activeSession, seconds }
                        : null,
                }));
            },

            getSessionsByTopic: (topicId: string) => {
                return get().sessions.filter((s: StudySession) => s.topicId === topicId);
            },

            getTotalTimeByTopic: (topicId: string) => {
                return get()
                    .sessions.filter((s: StudySession) => s.topicId === topicId)
                    .reduce((total: number, s: StudySession) => total + s.duration, 0);
            },

            getTotalTime: () => {
                return get().sessions.reduce((total: number, s: StudySession) => total + s.duration, 0);
            },

            getTodayTime: () => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayStr = today.toISOString();

                return get()
                    .sessions.filter((s: StudySession) => s.startTime >= todayStr)
                    .reduce((total: number, s: StudySession) => total + s.duration, 0);
            },

            getWeekTime: () => {
                const today = new Date();
                const dayOfWeek = today.getDay();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek);
                startOfWeek.setHours(0, 0, 0, 0);
                const startOfWeekStr = startOfWeek.toISOString();

                return get()
                    .sessions.filter((s: StudySession) => s.startTime >= startOfWeekStr)
                    .reduce((total: number, s: StudySession) => total + s.duration, 0);
            },

            getMonthTime: () => {
                const today = new Date();
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                startOfMonth.setHours(0, 0, 0, 0);
                const startOfMonthStr = startOfMonth.toISOString();

                return get()
                    .sessions.filter((s: StudySession) => s.startTime >= startOfMonthStr)
                    .reduce((total: number, s: StudySession) => total + s.duration, 0);
            },

            getLastWeekTime: () => {
                const today = new Date();
                const dayOfWeek = today.getDay();
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - dayOfWeek);
                startOfThisWeek.setHours(0, 0, 0, 0);

                const startOfLastWeek = new Date(startOfThisWeek);
                startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
                const startOfLastWeekStr = startOfLastWeek.toISOString();

                return get()
                    .sessions.filter(
                        (s: StudySession) => s.startTime >= startOfLastWeekStr && s.startTime < startOfThisWeek.toISOString()
                    )
                    .reduce((total: number, s: StudySession) => total + s.duration, 0);
            },

            getLastMonthTime: () => {
                const today = new Date();
                const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                startOfThisMonth.setHours(0, 0, 0, 0);

                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                startOfLastMonth.setHours(0, 0, 0, 0);
                const startOfLastMonthStr = startOfLastMonth.toISOString();

                return get()
                    .sessions.filter(
                        (s: StudySession) => s.startTime >= startOfLastMonthStr && s.startTime < startOfThisMonth.toISOString()
                    )
                    .reduce((total: number, s: StudySession) => total + s.duration, 0);
            },

            deleteSession: (sessionId: string) => {
                set((state: SessionState) => ({
                    sessions: state.sessions.filter((s: StudySession) => s.id !== sessionId),
                }));
            },
            updateSessionNotes: (sessionId: string, notes: string) => {
                set((state: SessionState) => ({
                    sessions: state.sessions.map((s: StudySession) =>
                        s.id === sessionId ? { ...s, notes } : s
                    ),
                }));
            },

            getSessionsByDateRange: (startDate: string, endDate: string) => {
                return get().sessions.filter(
                    (s: StudySession) => s.startTime >= startDate && s.startTime <= endDate
                );
            },

            getEvolutionData: (days: number) => {
                const result: { date: string; total: number }[] = [];
                const today = new Date();
                today.setHours(23, 59, 59, 999);

                for (let i = days - 1; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    date.setHours(0, 0, 0, 0);
                    const dateStr = date.toISOString();

                    const nextDate = new Date(date);
                    nextDate.setDate(nextDate.getDate() + 1);
                    const nextDateStr = nextDate.toISOString();

                    const dayTotal = get()
                        .sessions.filter(
                            (s: StudySession) => s.startTime >= dateStr && s.startTime < nextDateStr
                        )
                        .reduce((total: number, s: StudySession) => total + s.duration, 0);

                    result.push({
                        date: date.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit'
                        }),
                        total: Math.round(dayTotal / 60),
                    });
                }

                return result;
            },
        }),
        {
            name: 'estudos-tracker-sessions',
            storage: createJSONStorage(() => localStorage),
            partialize: (state: SessionState) => ({
                sessions: state.sessions,
            }),
        }
    )
);
