import { useOnboardingStore, ONBOARDING_STEPS } from '@/store';
import { cn } from '@/lib/utils';

interface OnboardingProgressProps {
    className?: string;
}

export function OnboardingProgress({ className }: OnboardingProgressProps) {
    const { currentStep, stepProgress } = useOnboardingStore();
    const totalSteps = ONBOARDING_STEPS.length;

    return (
        <div
            className={cn('w-full', className)}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Passo ${currentStep + 1} de ${totalSteps}`}
        >
            {/* Progress bar */}
            <div className="relative mb-4">
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-between items-center">
                {ONBOARDING_STEPS.map((step, index) => {
                    const isCompleted = stepProgress[step.id];
                    const isCurrent = index === currentStep;
                    const isPast = index < currentStep;

                    return (
                        <button
                            key={step.id}
                            className={cn(
                                'flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-lg p-1',
                                'transition-all duration-300'
                            )}
                            onClick={() => {
                                const store = useOnboardingStore.getState();
                                if (isCompleted || isPast) {
                                    store.goToStep(index);
                                }
                            }}
                            disabled={!isCompleted && !isPast}
                            aria-label={`Ir para passo ${index + 1}: ${step.title}`}
                            aria-current={isCurrent ? 'step' : undefined}
                        >
                            {/* Step circle */}
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1',
                                    'transition-all duration-300 transform',
                                    {
                                        'bg-gradient-to-br from-cyan-500 to-blue-500 text-white scale-110 shadow-lg shadow-cyan-500/30': isCurrent,
                                        'bg-green-500 text-white': isCompleted && !isCurrent,
                                        'bg-slate-700 text-slate-400 group-hover:bg-slate-600': !isCompleted && !isCurrent && isPast,
                                        'bg-slate-800 text-slate-500': !isCompleted && !isCurrent && !isPast,
                                    }
                                )}
                            >
                                {isCompleted && !isCurrent ? (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    step.icon
                                )}
                            </div>

                            {/* Step label - hidden on mobile */}
                            <span
                                className={cn(
                                    'text-xs font-medium hidden md:block max-w-[80px] text-center truncate',
                                    'transition-colors duration-300',
                                    {
                                        'text-cyan-400': isCurrent,
                                        'text-green-400': isCompleted && !isCurrent,
                                        'text-slate-500': !isCompleted && !isCurrent,
                                    }
                                )}
                            >
                                {step.title.split(' ').slice(0, 2).join(' ')}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Current step info */}
            <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                    Passo <span className="text-cyan-400 font-semibold">{currentStep + 1}</span> de{' '}
                    <span className="text-slate-300">{totalSteps}</span>
                </p>
            </div>
        </div>
    );
}
