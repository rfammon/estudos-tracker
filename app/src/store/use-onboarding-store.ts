import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types for onboarding
export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    completed: boolean;
}

export interface OnboardingState {
    // State
    completed: boolean;
    currentStep: number;
    skipped: boolean;
    startedAt: string | null;
    completedAt: string | null;
    stepProgress: Record<string, boolean>;

    // Actions
    startOnboarding: () => void;
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (step: number) => void;
    completeStep: (stepId: string) => void;
    skipOnboarding: () => void;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
    getProgress: () => number;
    isStepCompleted: (stepId: string) => boolean;
}

// Default onboarding steps configuration
export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'welcome',
        title: 'Bem-vindo ao Estudos Tracker!',
        description: 'Conheça seu novo companheiro de estudos para concursos e exames.',
        icon: '🎉',
        completed: false,
    },
    {
        id: 'xp-system',
        title: 'Sistema de XP e Níveis',
        description: 'Ganhe pontos de experiência e suba de nível enquanto estuda.',
        icon: '⭐',
        completed: false,
    },
    {
        id: 'timer',
        title: 'Timer de Estudos',
        description: 'Use o cronômetro para acompanhar suas sessões de estudo.',
        icon: '⏱️',
        completed: false,
    },
    {
        id: 'topics',
        title: 'Tópicos e Plano de Estudos',
        description: 'Organize seus estudos por matérias e tópicos.',
        icon: '📚',
        completed: false,
    },
    {
        id: 'achievements',
        title: 'Conquistas e Gamificação',
        description: 'Desbloqueie conquistas e acompanhe seu progresso.',
        icon: '🏆',
        completed: false,
    },
    {
        id: 'settings',
        title: 'Configurações Iniciais',
        description: 'Personalize sua experiência com suas preferências.',
        icon: '⚙️',
        completed: false,
    },
    {
        id: 'first-session',
        title: 'Primeira Sessão',
        description: 'Inicie sua primeira sessão de estudo!',
        icon: '🚀',
        completed: false,
    },
];

const TOTAL_STEPS = ONBOARDING_STEPS.length;

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set, get) => ({
            completed: false,
            currentStep: 0,
            skipped: false,
            startedAt: null,
            completedAt: null,
            stepProgress: {},

            startOnboarding: () => {
                set({
                    startedAt: new Date().toISOString(),
                    currentStep: 0,
                    skipped: false,
                });
            },

            nextStep: () => {
                const { currentStep } = get();
                if (currentStep < TOTAL_STEPS - 1) {
                    set({ currentStep: currentStep + 1 });
                }
            },

            previousStep: () => {
                const { currentStep } = get();
                if (currentStep > 0) {
                    set({ currentStep: currentStep - 1 });
                }
            },

            goToStep: (step: number) => {
                if (step >= 0 && step < TOTAL_STEPS) {
                    set({ currentStep: step });
                }
            },

            completeStep: (stepId: string) => {
                set((state) => ({
                    stepProgress: {
                        ...state.stepProgress,
                        [stepId]: true,
                    },
                }));
            },

            skipOnboarding: () => {
                set({
                    skipped: true,
                    completed: true,
                    completedAt: new Date().toISOString(),
                });
            },

            completeOnboarding: () => {
                set({
                    completed: true,
                    completedAt: new Date().toISOString(),
                    stepProgress: ONBOARDING_STEPS.reduce(
                        (acc, step) => ({ ...acc, [step.id]: true }),
                        {}
                    ),
                });
            },

            resetOnboarding: () => {
                set({
                    completed: false,
                    currentStep: 0,
                    skipped: false,
                    startedAt: null,
                    completedAt: null,
                    stepProgress: {},
                });
            },

            getProgress: () => {
                const { stepProgress } = get();
                const completedSteps = Object.values(stepProgress).filter(Boolean).length;
                return Math.round((completedSteps / TOTAL_STEPS) * 100);
            },

            isStepCompleted: (stepId: string) => {
                const { stepProgress } = get();
                return stepProgress[stepId] === true;
            },
        }),
        {
            name: 'estudos-tracker-onboarding',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Expose store for testing
if (import.meta.env?.DEV || typeof window !== 'undefined') {
    (window as any).__ONBOARDING_STORE__ = useOnboardingStore;
}
