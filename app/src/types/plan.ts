export type DayOfWeek = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface DayPlan {
    day: DayOfWeek;
    topics: DayTopicPlan[];
    isRestDay: boolean;
}

export interface DayTopicPlan {
    topicId: string;
    durationMinutes: number;
}

export interface DailyGoal {
    targetMinutes: number;
    targetTopics: number;
}

export interface StudyPlan {
    id: string;
    name: string;
    description: string;
    weeklyPlan: DayPlan[];
    dailyGoal: DailyGoal;
    reminders: ReminderConfig;
    createdAt: string;
    updatedAt: string;
}

export interface ReminderConfig {
    enabled: boolean;
    times: string[];
    days: DayOfWeek[];
}

export interface AdherenceRecord {
    date: string;
    dayOfWeek: DayOfWeek;
    plannedMinutes: number;
    actualMinutes: number;
    topicsPlanned: number;
    topicsStudied: number;
    completed: boolean;
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
    segunda: 'Segunda',
    terca: 'Terça',
    quarta: 'Quarta',
    quinta: 'Quinta',
    sexta: 'Sexta',
    sabado: 'Sábado',
    domingo: 'Domingo',
};

export const DAY_ORDER: DayOfWeek[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

export const DEFAULT_WEEKLY_PLAN: DayPlan[] = [
    { day: 'segunda', topics: [], isRestDay: false },
    { day: 'terca', topics: [], isRestDay: false },
    { day: 'quarta', topics: [], isRestDay: false },
    { day: 'quinta', topics: [], isRestDay: false },
    { day: 'sexta', topics: [], isRestDay: false },
    { day: 'sabado', topics: [], isRestDay: false },
    { day: 'domingo', topics: [], isRestDay: true },
];

export const DEFAULT_DAILY_GOAL: DailyGoal = {
    targetMinutes: 240, // 4 hours
    targetTopics: 3,
};

export const DEFAULT_REMINDERS: ReminderConfig = {
    enabled: false,
    times: ['09:00', '19:00'],
    days: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
};
