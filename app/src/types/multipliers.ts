/**
 * Multiplier and Bonus System Types
 * Defines types for the gamification multiplier and bonus event system
 */

export type MultiplierType = 'streak' | 'time' | 'combo' | 'event' | 'achievement';

export interface Multiplier {
    id: string;
    type: MultiplierType;
    name: string;
    description: string;
    value: number; // e.g., 1.5x, 2x, 3x
    duration?: number; // in minutes (for temporary multipliers)
    startTime?: Date;
    endTime?: Date;
    icon: string;
    active: boolean;
    source?: string; // ID reference to the source (event, achievement, etc.)
}

export interface BonusEvent {
    id: string;
    name: string;
    description: string;
    multiplier: number;
    startDate: Date;
    endDate: Date;
    icon: string;
    recurring: boolean;
    recurringPattern?: 'daily' | 'weekly' | 'monthly';
    // For time-based events (like "madrugada produtiva")
    startTime?: string; // HH:mm format
    endTime?: string; // HH:mm format
    // For day-based events (like "Domingo de Estudos")
    daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface ComboState {
    currentCombo: number;
    lastActivityTime: Date | null;
    comboMultiplier: number;
    comboTimeout: number; // in milliseconds, default 30 minutes
}

export interface MultiplierNotification {
    id: string;
    multiplierId: string;
    multiplierName: string;
    multiplierValue: number;
    type: MultiplierType;
    icon: string;
    timestamp: Date;
    read: boolean;
}

// Streak multiplier thresholds
export const STREAK_MULTIPLIERS = [
    { days: 7, multiplier: 1.5, name: 'Semana de Ouro' },
    { days: 14, multiplier: 2, name: 'Duas Semanas' },
    { days: 30, multiplier: 3, name: 'Mês de Ferro' },
] as const;

// Combo multiplier thresholds
export const COMBO_MULTIPLIERS = [
    { tasks: 3, multiplier: 1.5, name: 'Combo Iniciante' },
    { tasks: 5, multiplier: 2, name: 'Combo Avançado' },
    { tasks: 10, multiplier: 3, name: 'Combo Mestre' },
] as const;

// Time bonus configurations
export interface TimeBonus {
    name: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    multiplier: number;
    icon: string;
    description: string;
}

export const TIME_BONUSES: TimeBonus[] = [
    {
        name: 'Madrugada Produtiva',
        startTime: '00:00',
        endTime: '06:00',
        multiplier: 2,
        icon: '🌙',
        description: '2x XP entre meia-noite e 6h da manhã',
    },
    {
        name: 'Almoço Estudantil',
        startTime: '12:00',
        endTime: '14:00',
        multiplier: 1.25,
        icon: '🍽️',
        description: '1.25x XP durante o horário de almoço',
    },
];

// Default bonus events
export const DEFAULT_BONUS_EVENTS: Omit<BonusEvent, 'startDate' | 'endDate'>[] = [
    {
        id: 'sunday-studies',
        name: 'Domingo de Estudos',
        description: '1.5x XP aos domingos',
        multiplier: 1.5,
        icon: '☀️',
        recurring: true,
        recurringPattern: 'weekly',
        daysOfWeek: [0], // Sunday
    },
    {
        id: 'weekend-warrior',
        name: 'Final de Semana',
        description: '1.5x XP no sábado e domingo',
        multiplier: 1.5,
        icon: '🎉',
        recurring: true,
        recurringPattern: 'weekly',
        daysOfWeek: [0, 6], // Sunday and Saturday
    },
    {
        id: 'first-session',
        name: 'Primeira Sessão do Dia',
        description: '2x XP na primeira sessão de estudo do dia',
        multiplier: 2,
        icon: '🌅',
        recurring: true,
        recurringPattern: 'daily',
    },
];

// Helper type for calculating total multiplier
export interface MultiplierCalculation {
    baseValue: number;
    multipliers: Array<{
        id: string;
        name: string;
        value: number;
        type: MultiplierType;
    }>;
    totalMultiplier: number;
    finalValue: number;
}

// Color mapping for multiplier types
export const MULTIPLIER_TYPE_COLORS: Record<MultiplierType, string> = {
    streak: '#F97316', // Orange
    time: '#8B5CF6', // Purple
    combo: '#EF4444', // Red
    event: '#22C55E', // Green
    achievement: '#EAB308', // Yellow
};

// Icon mapping for multiplier types
export const MULTIPLIER_TYPE_ICONS: Record<MultiplierType, string> = {
    streak: '🔥',
    time: '⏰',
    combo: '⚡',
    event: '🎁',
    achievement: '🏆',
};
