import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore, ONBOARDING_STEPS, useSettingsStore, LEVELS } from '@/store';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingStep, OnboardingStepContainer } from './OnboardingStep';
import { WelcomeStep } from './WelcomeStep';
import { FeatureHighlight, FeatureHighlightGrid, FeatureStatCard } from './FeatureHighlight';
import { cn } from '@/lib/utils';

interface OnboardingWizardProps {
    onComplete?: () => void;
    onSkip?: () => void;
}

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
    const navigate = useNavigate();
    const {
        currentStep,
        startedAt,
        startOnboarding,
        nextStep,
        previousStep,
        completeStep,
        skipOnboarding,
        completeOnboarding,
    } = useOnboardingStore();

    const { userProfile, theme } = useSettingsStore();

    const [dailyGoal, setDailyGoal] = useState(30);
    const [selectedTheme, setSelectedTheme] = useState<'cyber-luxe' | 'pistachio'>(theme);

    // Start onboarding if not started
    useEffect(() => {
        if (!startedAt) {
            startOnboarding();
        }
    }, [startedAt, startOnboarding]);

    const handleComplete = useCallback(() => {
        completeOnboarding();
        onComplete?.();
        navigate('/timer');
    }, [completeOnboarding, onComplete, navigate]);

    const handleSkip = useCallback(() => {
        skipOnboarding();
        onSkip?.();
    }, [skipOnboarding, onSkip]);

    const handleNext = useCallback(() => {
        const step = ONBOARDING_STEPS[currentStep];
        completeStep(step.id);

        if (currentStep === ONBOARDING_STEPS.length - 1) {
            handleComplete();
        } else {
            nextStep();
        }
    }, [currentStep, completeStep, nextStep, handleComplete]);

    const handlePrevious = useCallback(() => {
        previousStep();
    }, [previousStep]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'Escape') {
                handleSkip();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrevious, handleSkip]);

    const handleStartFirstSession = useCallback(() => {
        completeStep('first-session');
        completeOnboarding();
        onComplete?.();
        navigate('/timer');
    }, [completeStep, completeOnboarding, onComplete, navigate]);

    const step = ONBOARDING_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
    const isFirstSessionStep = step?.id === 'first-session';

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
        >
            {/* Skip button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={handleSkip}
                    className={cn(
                        'px-4 py-2 text-sm rounded-lg',
                        'text-slate-400 hover:text-white hover:bg-slate-800',
                        'transition-colors duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'
                    )}
                    aria-label="Pular onboarding"
                >
                    Pular
                </button>
            </div>

            {/* Progress */}
            <div className="flex-shrink-0 pt-6 px-6">
                <OnboardingProgress className="max-w-2xl mx-auto" />
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center overflow-y-auto py-8 px-4">
                <OnboardingStepContainer stepKey={currentStep}>
                    {renderStepContent()}
                </OnboardingStepContainer>
            </div>

            {/* Navigation */}
            <div className="flex-shrink-0 p-6 border-t border-slate-800">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={isFirstStep}
                        className={cn(
                            'px-6 py-3 rounded-xl font-medium',
                            'transition-all duration-200',
                            isFirstStep
                                ? 'opacity-0 pointer-events-none'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                        )}
                        aria-label="Passo anterior"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Anterior
                        </span>
                    </button>

                    {/* Step indicators for mobile */}
                    <div className="flex md:hidden items-center gap-1">
                        {ONBOARDING_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-colors',
                                    i === currentStep
                                        ? 'bg-cyan-500'
                                        : i < currentStep
                                            ? 'bg-slate-600'
                                            : 'bg-slate-700'
                                )}
                            />
                        ))}
                    </div>

                    <button
                        onClick={isFirstSessionStep ? handleStartFirstSession : handleNext}
                        className={cn(
                            'px-6 py-3 rounded-xl font-medium',
                            'transition-all duration-200',
                            'bg-gradient-to-r from-cyan-500 to-blue-500',
                            'hover:from-cyan-400 hover:to-blue-400',
                            'text-white shadow-lg shadow-cyan-500/25',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
                        )}
                        aria-label={isLastStep ? 'Concluir onboarding' : 'Próximo passo'}
                    >
                        <span className="flex items-center gap-2">
                            {isLastStep ? 'Concluir' : 'Próximo'}
                            {!isLastStep && (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );

    function renderStepContent() {
        switch (step?.id) {
            case 'welcome':
                return <WelcomeStep userName={userProfile.name} />;

            case 'xp-system':
                return (
                    <OnboardingStep
                        icon="⭐"
                        title="Sistema de XP e Níveis"
                        description="Ganhe pontos de experiência a cada sessão de estudo e suba de nível!"
                    >
                        <div className="space-y-6 w-full max-w-lg">
                            {/* Level preview */}
                            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                <h4 className="text-lg font-semibold text-slate-200 mb-4">Níveis Disponíveis</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {LEVELS.slice(0, 5).map((level) => (
                                        <div
                                            key={level.number}
                                            className="flex items-center gap-2 p-2 rounded-lg bg-slate-700/30"
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                                style={{ backgroundColor: level.color }}
                                            >
                                                {level.number}
                                            </div>
                                            <span className="text-sm text-slate-300">{level.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* XP highlights */}
                            <FeatureHighlightGrid columns={2}>
                                <FeatureStatCard
                                    icon="⏱️"
                                    value="+10 XP"
                                    label="por sessão"
                                    description="Complete uma sessão"
                                />
                                <FeatureStatCard
                                    icon="🔥"
                                    value="+5 XP"
                                    label="por dia"
                                    description="Mantenha o streak"
                                />
                            </FeatureHighlightGrid>
                        </div>
                    </OnboardingStep>
                );

            case 'timer':
                return (
                    <OnboardingStep
                        icon="⏱️"
                        title="Timer de Estudos"
                        description="Use o cronômetro para acompanhar suas sessões de estudo e ganhar XP."
                    >
                        <div className="space-y-6 w-full max-w-lg">
                            {/* Timer preview */}
                            <div className="relative p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                <div className="text-center">
                                    <div className="text-6xl font-mono font-bold text-cyan-400 mb-4">
                                        25:00
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        Formato Pomodoro ou personalizado
                                    </p>
                                </div>

                                {/* Timer controls preview */}
                                <div className="flex justify-center gap-4 mt-6">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 6h12v12H6z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <FeatureHighlight
                                icon="💡"
                                title="Dica Pro"
                                description="Selecione uma matéria antes de iniciar para organizar melhor seus estudos."
                                variant="accent"
                            />
                        </div>
                    </OnboardingStep>
                );

            case 'topics':
                return (
                    <OnboardingStep
                        icon="📚"
                        title="Tópicos e Plano de Estudos"
                        description="Organize seus estudos por matérias e tópicos para acompanhar seu progresso."
                    >
                        <div className="space-y-6 w-full max-w-lg">
                            {/* Topics preview */}
                            <div className="space-y-3">
                                {[
                                    { name: 'Direito Constitucional', progress: 75, color: 'bg-cyan-500' },
                                    { name: 'Português', progress: 45, color: 'bg-blue-500' },
                                    { name: 'Raciocínio Lógico', progress: 30, color: 'bg-purple-500' },
                                ].map((topic) => (
                                    <div
                                        key={topic.name}
                                        className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-slate-200 font-medium">{topic.name}</span>
                                            <span className="text-sm text-slate-400">{topic.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={cn('h-full rounded-full transition-all', topic.color)}
                                                style={{ width: `${topic.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <FeatureHighlight
                                icon="🎯"
                                title="Metas Personalizadas"
                                description="Defina metas diárias e semanais para cada matéria."
                                variant="default"
                            />
                        </div>
                    </OnboardingStep>
                );

            case 'achievements':
                return (
                    <OnboardingStep
                        icon="🏆"
                        title="Conquistas e Gamificação"
                        description="Desbloqueie conquistas e acompanhe sua evolução como estudante."
                    >
                        <div className="space-y-6 w-full max-w-lg">
                            {/* Achievements preview */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { icon: '🌟', name: 'Primeiro Passo', unlocked: true },
                                    { icon: '📚', name: 'Dedicado', unlocked: true },
                                    { icon: '🔥', name: 'Streak 7 dias', unlocked: false },
                                    { icon: '⏰', name: '1 Hora', unlocked: false },
                                    { icon: '🎯', name: '10 Horas', unlocked: false },
                                    { icon: '👑', name: 'Mestre', unlocked: false },
                                ].map((achievement) => (
                                    <div
                                        key={achievement.name}
                                        className={cn(
                                            'flex flex-col items-center p-4 rounded-xl border',
                                            achievement.unlocked
                                                ? 'bg-slate-800/50 border-slate-700/50'
                                                : 'bg-slate-900/50 border-slate-800/50 opacity-50'
                                        )}
                                    >
                                        <span className={cn(
                                            'text-3xl mb-2',
                                            !achievement.unlocked && 'grayscale'
                                        )}>
                                            {achievement.icon}
                                        </span>
                                        <span className="text-xs text-slate-400 text-center">
                                            {achievement.name}
                                        </span>
                                        {achievement.unlocked && (
                                            <span className="text-xs text-green-400 mt-1">✓</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <FeatureHighlight
                                icon="🎮"
                                title="Gamificação"
                                description="Quanto mais você estuda, mais conquistas desbloqueia. Mantenha a consistência!"
                                variant="success"
                            />
                        </div>
                    </OnboardingStep>
                );

            case 'settings':
                return (
                    <OnboardingStep
                        icon="⚙️"
                        title="Configurações Iniciais"
                        description="Personalize sua experiência com suas preferências."
                    >
                        <div className="space-y-6 w-full max-w-lg">
                            {/* Daily goal */}
                            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                <h4 className="text-lg font-semibold text-slate-200 mb-4">
                                    Meta Diária de Estudo
                                </h4>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="15"
                                        max="120"
                                        step="15"
                                        value={dailyGoal}
                                        onChange={(e) => setDailyGoal(Number(e.target.value))}
                                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        aria-label="Meta diária em minutos"
                                    />
                                    <span className="text-2xl font-bold text-cyan-400 min-w-[80px] text-right">
                                        {dailyGoal} min
                                    </span>
                                </div>
                            </div>

                            {/* Theme selection */}
                            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                <h4 className="text-lg font-semibold text-slate-200 mb-4">
                                    Tema
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSelectedTheme('cyber-luxe')}
                                        className={cn(
                                            'p-4 rounded-xl border-2 transition-all',
                                            selectedTheme === 'cyber-luxe'
                                                ? 'border-cyan-500 bg-cyan-500/10'
                                                : 'border-slate-700 hover:border-slate-600'
                                        )}
                                    >
                                        <div className="h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 mb-2" />
                                        <span className="text-sm text-slate-300">Cyber Luxe</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedTheme('pistachio')}
                                        className={cn(
                                            'p-4 rounded-xl border-2 transition-all',
                                            selectedTheme === 'pistachio'
                                                ? 'border-green-500 bg-green-500/10'
                                                : 'border-slate-700 hover:border-slate-600'
                                        )}
                                    >
                                        <div className="h-12 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 mb-2" />
                                        <span className="text-sm text-slate-300">Pistachio</span>
                                    </button>
                                </div>
                            </div>

                            {/* Apply settings on next */}
                            {selectedTheme !== theme && (
                                <p className="text-sm text-slate-400 text-center">
                                    O tema será aplicado ao continuar
                                </p>
                            )}
                        </div>
                    </OnboardingStep>
                );

            case 'first-session':
                return (
                    <OnboardingStep
                        icon="🚀"
                        title="Primeira Sessão"
                        description="Você está pronto! Inicie sua primeira sessão de estudo."
                    >
                        <div className="space-y-6 w-full max-w-lg">
                            {/* Summary */}
                            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
                                <h4 className="text-lg font-semibold text-slate-200 mb-4">
                                    O que você aprendeu:
                                </h4>
                                <ul className="space-y-2">
                                    {[
                                        'Como ganhar XP e subir de nível',
                                        'Como usar o timer de estudos',
                                        'Como organizar matérias e tópicos',
                                        'Como desbloquear conquistas',
                                        'Como personalizar suas configurações',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-slate-300">
                                            <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="text-center">
                                <button
                                    onClick={handleStartFirstSession}
                                    className={cn(
                                        'px-8 py-4 rounded-xl font-semibold text-lg',
                                        'bg-gradient-to-r from-cyan-500 to-blue-500',
                                        'hover:from-cyan-400 hover:to-blue-400',
                                        'text-white shadow-lg shadow-cyan-500/25',
                                        'transition-all duration-200',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Iniciar Primeira Sessão
                                    </span>
                                </button>
                                <p className="text-sm text-slate-400 mt-3">
                                    e ganhe sua primeira conquista! 🌟
                                </p>
                            </div>
                        </div>
                    </OnboardingStep>
                );

            default:
                return null;
        }
    }
}
