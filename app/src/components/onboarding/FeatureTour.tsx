import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface TourStep {
    target: string; // CSS selector
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface FeatureTourProps {
    steps: TourStep[];
    isActive: boolean;
    onComplete: () => void;
    onSkip: () => void;
    startAt?: number;
}

export function FeatureTour({
    steps,
    isActive,
    onComplete,
    onSkip,
    startAt = 0,
}: FeatureTourProps) {
    const [currentStep, setCurrentStep] = useState(startAt);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const step = steps[currentStep];

    // Update target position
    const updatePosition = useCallback(() => {
        if (!step) return;

        const target = document.querySelector(step.target);
        if (target) {
            const rect = target.getBoundingClientRect();
            setTargetRect(rect);
            setIsVisible(true);

            // Scroll target into view
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [step]);

    useEffect(() => {
        if (isActive) {
            updatePosition();
        } else {
            setIsVisible(false);
        }
    }, [isActive, currentStep, updatePosition]);

    // Update position on resize/scroll
    useEffect(() => {
        if (!isActive) return;

        const handleUpdate = () => updatePosition();
        window.addEventListener('resize', handleUpdate);
        window.addEventListener('scroll', handleUpdate, true);

        return () => {
            window.removeEventListener('resize', handleUpdate);
            window.removeEventListener('scroll', handleUpdate, true);
        };
    }, [isActive, updatePosition]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 200);
        } else {
            onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
            }, 200);
        }
    };

    const handleSkip = () => {
        setIsVisible(false);
        onSkip();
    };

    if (!isActive || !step || !targetRect) {
        return null;
    }

    return createPortal(
        <TourOverlay
            targetRect={targetRect}
            step={step}
            currentStep={currentStep}
            totalSteps={steps.length}
            isVisible={isVisible}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
        />,
        document.body
    );
}

interface TourOverlayProps {
    targetRect: DOMRect;
    step: TourStep;
    currentStep: number;
    totalSteps: number;
    isVisible: boolean;
    onNext: () => void;
    onPrevious: () => void;
    onSkip: () => void;
}

function TourOverlay({
    targetRect,
    step,
    currentStep,
    totalSteps,
    isVisible,
    onNext,
    onPrevious,
    onSkip,
}: TourOverlayProps) {
    const position = step.position || 'bottom';

    // Calculate spotlight position
    const spotlightStyle = {
        top: targetRect.top - 8,
        left: targetRect.left - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
    };

    // Calculate tooltip position
    const getTooltipStyle = () => {
        const padding = 16;
        const tooltipWidth = 320;

        switch (position) {
            case 'top':
                return {
                    top: targetRect.top - padding,
                    left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
                    transform: 'translateY(-100%)',
                };
            case 'bottom':
                return {
                    top: targetRect.bottom + padding,
                    left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
                };
            case 'left':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.left - padding,
                    transform: 'translate(-100%, -50%)',
                };
            case 'right':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.right + padding,
                    transform: 'translateY(-50%)',
                };
            default:
                return {};
        }
    };

    return (
        <div
            className={cn(
                'fixed inset-0 z-[9999] transition-opacity duration-200',
                isVisible ? 'opacity-100' : 'opacity-0'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
        >
            {/* Backdrop with cutout */}
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm">
                {/* SVG mask for spotlight effect */}
                <svg className="absolute inset-0 w-full h-full">
                    <defs>
                        <mask id="tour-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <rect
                                x={spotlightStyle.left}
                                y={spotlightStyle.top}
                                width={spotlightStyle.width}
                                height={spotlightStyle.height}
                                rx="12"
                                fill="black"
                            />
                        </mask>
                    </defs>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(15, 23, 42, 0.9)"
                        mask="url(#tour-mask)"
                    />
                </svg>
            </div>

            {/* Spotlight border */}
            <div
                className="absolute pointer-events-none ring-2 ring-cyan-500 rounded-xl transition-all duration-300"
                style={{
                    top: spotlightStyle.top,
                    left: spotlightStyle.left,
                    width: spotlightStyle.width,
                    height: spotlightStyle.height,
                }}
            />

            {/* Tooltip */}
            <div
                className={cn(
                    'absolute w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl',
                    'transition-all duration-300',
                    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                )}
                style={getTooltipStyle()}
            >
                {/* Arrow */}
                <div
                    className={cn(
                        'absolute w-4 h-4 bg-slate-800 border-slate-700 transform rotate-45',
                        {
                            'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b': position === 'top',
                            'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t': position === 'bottom',
                            'right-0 top-1/2 translate-x-1/2 -translate-y-1/2 border-r border-t': position === 'left',
                            'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-b': position === 'right',
                        }
                    )}
                />

                <div className="relative p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                        <h3
                            id="tour-title"
                            className="text-lg font-semibold text-slate-100"
                        >
                            {step.title}
                        </h3>
                        <span className="text-xs text-slate-500">
                            {currentStep + 1}/{totalSteps}
                        </span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-slate-400 mb-4">{step.content}</p>

                    {/* Progress dots */}
                    <div className="flex items-center justify-center gap-1 mb-4">
                        {Array.from({ length: totalSteps }).map((_, i) => (
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

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onSkip}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Pular tour
                        </button>

                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <button
                                    onClick={onPrevious}
                                    className={cn(
                                        'px-4 py-2 text-sm rounded-lg',
                                        'bg-slate-700 hover:bg-slate-600',
                                        'transition-colors duration-200',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'
                                    )}
                                >
                                    Anterior
                                </button>
                            )}
                            <button
                                onClick={onNext}
                                className={cn(
                                    'px-4 py-2 text-sm rounded-lg',
                                    'bg-cyan-600 hover:bg-cyan-500',
                                    'transition-colors duration-200',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'
                                )}
                            >
                                {currentStep === totalSteps - 1 ? 'Concluir' : 'Próximo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook for managing tour state
export function useFeatureTour(tourId: string) {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Check if tour was already completed
        const completedTours = JSON.parse(
            localStorage.getItem('completed-tours') || '[]'
        );

        if (!completedTours.includes(tourId)) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => setIsActive(true), 500);
            return () => clearTimeout(timer);
        }
    }, [tourId]);

    const completeTour = useCallback(() => {
        const completedTours = JSON.parse(
            localStorage.getItem('completed-tours') || '[]'
        );

        if (!completedTours.includes(tourId)) {
            completedTours.push(tourId);
            localStorage.setItem('completed-tours', JSON.stringify(completedTours));
        }

        setIsActive(false);
    }, [tourId]);

    const skipTour = useCallback(() => {
        // Mark as skipped (same as completed for persistence)
        completeTour();
    }, [completeTour]);

    const restartTour = useCallback(() => {
        const completedTours = JSON.parse(
            localStorage.getItem('completed-tours') || '[]'
        );

        const index = completedTours.indexOf(tourId);
        if (index > -1) {
            completedTours.splice(index, 1);
            localStorage.setItem('completed-tours', JSON.stringify(completedTours));
        }

        setIsActive(true);
    }, [tourId]);

    return {
        isActive,
        completeTour,
        skipTour,
        restartTour,
    };
}
