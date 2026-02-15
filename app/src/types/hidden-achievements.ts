// Hidden Achievements Types - Command Center Elite
// Easter Eggs and Secret Discoveries

export type HiddenAchievementTrigger =
    | 'konami_code'
    | 'click_count'
    | 'time_based'
    | 'special_date'
    | 'sequence'
    | 'exploration'
    | 'milestone';

export type HiddenAchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface HiddenAchievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
    trigger: HiddenAchievementTrigger;
    triggerValue: HiddenAchievementTriggerValue;
    discovered: boolean;
    discoveredAt?: Date;
    hint?: string;
    rarity: HiddenAchievementRarity;
}

// Trigger value types based on trigger type
export type HiddenAchievementTriggerValue =
    | string // konami_code: the sequence
    | number // click_count: number of clicks
    | TimeBasedTrigger
    | SpecialDateTrigger
    | SequenceTrigger
    | ExplorationTrigger
    | MilestoneTrigger;

export interface TimeBasedTrigger {
    type: 'hour' | 'streak';
    hour?: number; // For 'hour' type: 0-23
    streakDays?: number; // For 'streak' type
    nightOnly?: boolean; // If true, only counts night hours (20:00 - 06:00)
}

export interface SpecialDateTrigger {
    type: 'birthday' | 'christmas' | 'new_year' | 'friday_13' | 'custom';
    customDate?: string; // MM-DD format for custom dates
}

export interface SequenceTrigger {
    type: 'sessions' | 'perfect_scores' | 'pages_visited';
    count: number;
    consecutive?: boolean;
}

export interface ExplorationTrigger {
    type: 'secret_page' | 'settings_sections' | 'documentation' | 'console';
    path?: string; // For secret_page
    sections?: string[]; // For settings_sections
}

export interface MilestoneTrigger {
    type: 'first_discoverer' | 'easter_eggs_count' | 'all_discovered';
    count?: number; // For easter_eggs_count
}

// Predefined Hidden Achievements
export const HIDDEN_ACHIEVEMENTS: Omit<HiddenAchievement, 'discovered' | 'discoveredAt'>[] = [
    // Konami Code
    {
        id: 'konami-code',
        name: 'Gamer Nato',
        description: 'Digite o código Konami clássico!',
        icon: '🎮',
        xpReward: 500,
        trigger: 'konami_code',
        triggerValue: 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA',
        hint: '↑↑↓↓←→←→BA',
        rarity: 'legendary',
    },

    // Click Count
    {
        id: 'curious-clicker',
        name: 'Curioso',
        description: 'Clique 10 vezes no logo',
        icon: '🔍',
        xpReward: 50,
        trigger: 'click_count',
        triggerValue: 10,
        hint: 'Será que tem algo escondido no logo?',
        rarity: 'common',
    },
    {
        id: 'very-curious',
        name: 'Muito Curioso',
        description: 'Clique 50 vezes no logo',
        icon: '🔎',
        xpReward: 100,
        trigger: 'click_count',
        triggerValue: 50,
        rarity: 'rare',
    },
    {
        id: 'obsessive-clicker',
        name: 'Obsessivo',
        description: 'Clique 100 vezes no logo',
        icon: '🎯',
        xpReward: 200,
        trigger: 'click_count',
        triggerValue: 100,
        rarity: 'epic',
    },

    // Time Based
    {
        id: 'early-bird',
        name: 'Madrugador',
        description: 'Estude às 4:00 da manhã',
        icon: '🌅',
        xpReward: 100,
        trigger: 'time_based',
        triggerValue: { type: 'hour', hour: 4 } as TimeBasedTrigger,
        hint: 'O pássaro madrugador pega o conhecimento!',
        rarity: 'rare',
    },
    {
        id: 'night-owl',
        name: 'Noturno',
        description: 'Estude às 2:00 da madrugada',
        icon: '🦉',
        xpReward: 100,
        trigger: 'time_based',
        triggerValue: { type: 'hour', hour: 2 } as TimeBasedTrigger,
        hint: 'A sabedoria não tem horário...',
        rarity: 'rare',
    },
    {
        id: 'vampire',
        name: 'Vampiro',
        description: 'Estude apenas à noite por 7 dias seguidos',
        icon: '🧛',
        xpReward: 300,
        trigger: 'time_based',
        triggerValue: { type: 'streak', streakDays: 7, nightOnly: true } as TimeBasedTrigger,
        rarity: 'epic',
    },

    // Special Dates
    {
        id: 'birthday-user',
        name: 'Aniversariante',
        description: 'Use o app no seu aniversário',
        icon: '🎂',
        xpReward: 200,
        trigger: 'special_date',
        triggerValue: { type: 'birthday' } as SpecialDateTrigger,
        hint: 'Configure sua data de aniversário nas configurações!',
        rarity: 'rare',
    },
    {
        id: 'christmas-studier',
        name: 'Natal Studier',
        description: 'Estude no Natal (25 de dezembro)',
        icon: '🎄',
        xpReward: 300,
        trigger: 'special_date',
        triggerValue: { type: 'christmas' } as SpecialDateTrigger,
        rarity: 'epic',
    },
    {
        id: 'new-year-worker',
        name: 'Reveillon Worker',
        description: 'Estude na virada de ano (31 de dezembro ou 1 de janeiro)',
        icon: '🎆',
        xpReward: 400,
        trigger: 'special_date',
        triggerValue: { type: 'new_year' } as SpecialDateTrigger,
        rarity: 'epic',
    },
    {
        id: 'friday-13',
        name: 'Sexta-Feira 13',
        description: 'Estude numa sexta-feira 13',
        icon: '🔮',
        xpReward: 150,
        trigger: 'special_date',
        triggerValue: { type: 'friday_13' } as SpecialDateTrigger,
        hint: 'Cuidado com o azar... ou será sorte?',
        rarity: 'rare',
    },

    // Sequence
    {
        id: 'marathon-runner',
        name: 'Maratonista',
        description: 'Complete 5 sessões seguidas sem parar',
        icon: '🏃',
        xpReward: 200,
        trigger: 'sequence',
        triggerValue: { type: 'sessions', count: 5, consecutive: true } as SequenceTrigger,
        rarity: 'rare',
    },
    {
        id: 'perfectionist',
        name: 'Perfeccionista',
        description: 'Acerte 100% em 3 avaliações seguidas',
        icon: '💯',
        xpReward: 300,
        trigger: 'sequence',
        triggerValue: { type: 'perfect_scores', count: 3, consecutive: true } as SequenceTrigger,
        rarity: 'epic',
    },
    {
        id: 'explorer-pages',
        name: 'Explorador',
        description: 'Visite todas as páginas em uma sessão',
        icon: '🗺️',
        xpReward: 150,
        trigger: 'sequence',
        triggerValue: { type: 'pages_visited', count: 7 } as SequenceTrigger, // Dashboard, Timer, Topics, History, Evolution, Settings, Plan
        rarity: 'rare',
    },

    // Exploration
    {
        id: 'detective',
        name: 'Detetive',
        description: 'Encontre a página secreta',
        icon: '🕵️',
        xpReward: 100,
        trigger: 'exploration',
        triggerValue: { type: 'secret_page', path: '/easter-egg' } as ExplorationTrigger,
        hint: 'Existe uma página que não aparece no menu...',
        rarity: 'rare',
    },
    {
        id: 'configurator',
        name: 'Configurador',
        description: 'Visite todas as seções de configurações',
        icon: '⚙️',
        xpReward: 100,
        trigger: 'exploration',
        triggerValue: {
            type: 'settings_sections',
            sections: ['account', 'personalization', 'notifications', 'privacy', 'data', 'language', 'accessibility', 'devices', 'subscription']
        } as ExplorationTrigger,
        rarity: 'common',
    },
    {
        id: 'reader',
        name: 'Leitor',
        description: 'Leia toda a documentação',
        icon: '📖',
        xpReward: 200,
        trigger: 'exploration',
        triggerValue: { type: 'documentation' } as ExplorationTrigger,
        rarity: 'rare',
    },
    {
        id: 'console-explorer',
        name: 'Hacker',
        description: 'Encontre a mensagem escondida no console',
        icon: '💻',
        xpReward: 150,
        trigger: 'exploration',
        triggerValue: { type: 'console' } as ExplorationTrigger,
        hint: 'Os desenvolvedores deixaram uma mensagem especial...',
        rarity: 'rare',
    },

    // Milestone
    {
        id: 'first-discoverer',
        name: 'Pioneiro',
        description: 'Seja o primeiro a descobrir um Easter Egg',
        icon: '🚀',
        xpReward: 500,
        trigger: 'milestone',
        triggerValue: { type: 'first_discoverer' } as MilestoneTrigger,
        rarity: 'legendary',
    },
    {
        id: 'easter-egg-hunter',
        name: 'Caçador',
        description: 'Descubra 5 Easter Eggs',
        icon: '🥚',
        xpReward: 300,
        trigger: 'milestone',
        triggerValue: { type: 'easter_eggs_count', count: 5 } as MilestoneTrigger,
        rarity: 'epic',
    },
    {
        id: 'master-of-secrets',
        name: 'Mestre dos Segredos',
        description: 'Descubra todos os Easter Eggs',
        icon: '🏆',
        xpReward: 1000,
        trigger: 'milestone',
        triggerValue: { type: 'all_discovered' } as MilestoneTrigger,
        rarity: 'legendary',
    },
];

// Easter Egg Types
export interface EasterEgg {
    id: string;
    name: string;
    description: string;
    type: 'page' | 'theme' | 'sound' | 'animation' | 'message';
    discovered: boolean;
    discoveredAt?: Date;
    data?: Record<string, unknown>;
}

// Predefined Easter Eggs
export const EASTER_EGGS: Omit<EasterEgg, 'discovered' | 'discoveredAt'>[] = [
    {
        id: 'secret-page',
        name: 'Página Secreta',
        description: 'Uma página escondida com surpresas',
        type: 'page',
    },
    {
        id: 'rainbow-theme',
        name: 'Tema Arco-Íris',
        description: 'Um tema especial e colorido',
        type: 'theme',
    },
    {
        id: 'achievement-sound',
        name: 'Som de Conquista',
        description: 'Som especial para hidden achievements',
        type: 'sound',
    },
    {
        id: 'confetti-effect',
        name: 'Confetti',
        description: 'Animação de confetti ao descobrir',
        type: 'animation',
    },
    {
        id: 'dev-message',
        name: 'Mensagem do Desenvolvedor',
        description: 'Uma mensagem especial no console',
        type: 'message',
    },
];

// Rarity colors for UI
export const RARITY_COLORS: Record<HiddenAchievementRarity, string> = {
    common: '#9CA3AF',    // Gray
    rare: '#3B82F6',      // Blue
    epic: '#8B5CF6',      // Purple
    legendary: '#F59E0B', // Gold
};

// Rarity glow effects
export const RARITY_GLOW: Record<HiddenAchievementRarity, string> = {
    common: '0 0 5px rgba(156, 163, 175, 0.5)',
    rare: '0 0 10px rgba(59, 130, 246, 0.5)',
    epic: '0 0 15px rgba(139, 92, 246, 0.5)',
    legendary: '0 0 20px rgba(245, 158, 11, 0.7)',
};

// Notification state for hidden achievements
export interface HiddenAchievementNotification {
    achievement: HiddenAchievement;
    show: boolean;
    timestamp: Date;
}
