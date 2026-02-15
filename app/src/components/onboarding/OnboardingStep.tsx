import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface OnboardingStepProps {
    title: string;
    description?: string;
    icon?: string;
    children?: ReactNode;
    className?: string;
    isActive?: boolean;
}

export function OnboardingStep({
    title,
    description,
    icon,
    children,
    className,
    isActive = true,
}: OnboardingStepProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center text-center p-6 md:p-8',
                'transition-all duration-500 ease-out',
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                className
            )}
            role="article"
            aria-labelledby="step-title"
            aria-describedby="step-description"
        >
            {/* Icon */}
            {icon && (
                <div
                    className={cn(
                        'text-6xl md:text-7xl mb-6',
                        'animate-bounce-slow'
                    )}
                    aria-hidden="true"
                >
                    {icon}
                </div>
            )}

            {/* Title */}
            <h2
                id="step-title"
                className={cn(
                    'text-2xl md:text-3xl font-bold mb-4',
                    'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'
                )}
            >
                {title}
            </h2>

            {/* Description */}
            {description && (
                <p
                    id="step-description"
                    className="text-slate-400 text-lg md:text-xl max-w-md mb-6"
                >
                    {description}
                </p>
            )}

            {/* Custom content */}
            {children && (
                <div className="w-full max-w-lg mt-4">
                    {children}
                </div>
            )}
        </div>
    );
}

// Animated container for step transitions
interface OnboardingStepContainerProps {
    children: ReactNode;
    stepKey: number;
    className?: string;
}

export function OnboardingStepContainer({
    children,
    stepKey,
    className,
}: OnboardingStepContainerProps) {
    return (
        <div
            key={stepKey}
            className={cn(
                'w-full transition-all duration-500 ease-out',
                'animate-fade-in',
                className
            )}
            role="region"
            aria-live="polite"
        >
            {children}
        </div>
    );
}
