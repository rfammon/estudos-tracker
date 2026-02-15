import { ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: TooltipPosition;
    show?: boolean;
    onDismiss?: () => void;
    className?: string;
    arrowClassName?: string;
    dismissible?: boolean;
    highlight?: boolean;
}

export function Tooltip({
    content,
    children,
    position = 'bottom',
    show: controlledShow,
    onDismiss,
    className,
    arrowClassName,
    dismissible = true,
    highlight = false,
}: TooltipProps) {
    const [internalShow, setInternalShow] = useState(true);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const show = controlledShow !== undefined ? controlledShow : internalShow;

    // Handle click outside to dismiss
    useEffect(() => {
        if (!show || !dismissible) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setInternalShow(false);
                onDismiss?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [show, dismissible, onDismiss]);

    // Handle escape key
    useEffect(() => {
        if (!show || !dismissible) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setInternalShow(false);
                onDismiss?.();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [show, dismissible, onDismiss]);

    const positionStyles: Record<TooltipPosition, string> = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
        left: 'right-full top-1/2 -translate-y-1/2 mr-3',
        right: 'left-full top-1/2 -translate-y-1/2 ml-3',
    };

    const arrowStyles: Record<TooltipPosition, string> = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-l-transparent border-r-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-l-transparent border-r-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-t-transparent border-b-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-t-transparent border-b-transparent border-l-transparent',
    };

    if (!show) {
        return <>{children}</>;
    }

    return (
        <div
            ref={tooltipRef}
            className={cn('relative inline-block', className)}
            role="tooltip"
            aria-live="polite"
        >
            {/* Target element with optional highlight */}
            <div
                className={cn({
                    'ring-2 ring-cyan-500 ring-offset-2 ring-offset-slate-900 rounded-lg': highlight,
                })}
            >
                {children}
            </div>

            {/* Tooltip content */}
            <div
                className={cn(
                    'absolute z-50',
                    positionStyles[position],
                    'animate-fade-in'
                )}
            >
                {/* Arrow */}
                <div
                    className={cn(
                        'absolute w-0 h-0 border-[8px]',
                        arrowStyles[position],
                        arrowClassName
                    )}
                    aria-hidden="true"
                />

                {/* Content box */}
                <div
                    className={cn(
                        'relative bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-xl',
                        'max-w-xs min-w-[200px]',
                        'text-sm text-slate-200'
                    )}
                >
                    {content}

                    {/* Dismiss button */}
                    {dismissible && (
                        <button
                            onClick={() => {
                                setInternalShow(false);
                                onDismiss?.();
                            }}
                            className={cn(
                                'absolute -top-2 -right-2 w-6 h-6 rounded-full',
                                'bg-slate-700 hover:bg-slate-600',
                                'flex items-center justify-center',
                                'text-slate-400 hover:text-white',
                                'transition-colors duration-200',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'
                            )}
                            aria-label="Fechar dica"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Pulsing dot indicator for tooltips
interface TooltipDotProps {
    className?: string;
    pulse?: boolean;
}

export function TooltipDot({ className, pulse = true }: TooltipDotProps) {
    return (
        <div
            className={cn(
                'absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500',
                pulse && 'animate-pulse',
                className
            )}
            aria-hidden="true"
        >
            {pulse && (
                <div className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-75" />
            )}
        </div>
    );
}

// Coach mark for guided tours
interface CoachMarkProps {
    children: ReactNode;
    message: string;
    step?: number;
    totalSteps?: number;
    onNext?: () => void;
    onPrevious?: () => void;
    onSkip?: () => void;
    position?: TooltipPosition;
    show?: boolean;
}

export function CoachMark({
    children,
    message,
    step,
    totalSteps,
    onNext,
    onPrevious,
    onSkip,
    position = 'bottom',
    show = true,
}: CoachMarkProps) {
    return (
        <Tooltip
            show={show}
            position={position}
            dismissible={false}
            highlight
            content={
                <div className="space-y-3">
                    <p>{message}</p>

                    {/* Step indicator */}
                    {step !== undefined && totalSteps !== undefined && (
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{step + 1} de {totalSteps}</span>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700">
                        <button
                            onClick={onSkip}
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                            Pular tour
                        </button>

                        <div className="flex gap-2">
                            {onPrevious && (
                                <button
                                    onClick={onPrevious}
                                    className={cn(
                                        'px-3 py-1 text-xs rounded-lg',
                                        'bg-slate-700 hover:bg-slate-600',
                                        'transition-colors duration-200'
                                    )}
                                >
                                    Anterior
                                </button>
                            )}
                            {onNext && (
                                <button
                                    onClick={onNext}
                                    className={cn(
                                        'px-3 py-1 text-xs rounded-lg',
                                        'bg-cyan-600 hover:bg-cyan-500',
                                        'transition-colors duration-200'
                                    )}
                                >
                                    Próximo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            }
        >
            {children}
        </Tooltip>
    );
}
