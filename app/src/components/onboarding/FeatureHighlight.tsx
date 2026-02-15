import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureHighlightProps {
    icon: string;
    title: string;
    description: string;
    children?: ReactNode;
    variant?: 'default' | 'accent' | 'success';
    className?: string;
}

export function FeatureHighlight({
    icon,
    title,
    description,
    children,
    variant = 'default',
    className,
}: FeatureHighlightProps) {
    const variantStyles = {
        default: 'from-slate-800/80 to-slate-900/80 border-slate-700/50',
        accent: 'from-cyan-900/30 to-blue-900/30 border-cyan-500/30',
        success: 'from-green-900/30 to-emerald-900/30 border-green-500/30',
    };

    const iconBgStyles = {
        default: 'bg-slate-700/50',
        accent: 'bg-cyan-500/20',
        success: 'bg-green-500/20',
    };

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl p-6',
                'bg-gradient-to-br backdrop-blur-sm border',
                'transition-all duration-300 hover:scale-[1.02]',
                variantStyles[variant],
                className
            )}
        >
            {/* Background decoration */}
            <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl"
                style={{
                    background: variant === 'accent'
                        ? 'radial-gradient(circle, cyan 0%, transparent 70%)'
                        : variant === 'success'
                            ? 'radial-gradient(circle, green 0%, transparent 70%)'
                            : 'radial-gradient(circle, slate 0%, transparent 70%)',
                }}
                aria-hidden="true"
            />

            <div className="relative flex flex-col md:flex-row items-start gap-4">
                {/* Icon */}
                <div
                    className={cn(
                        'flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-3xl',
                        iconBgStyles[variant]
                    )}
                    aria-hidden="true"
                >
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>

                    {/* Additional content */}
                    {children && (
                        <div className="mt-4">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Grid container for multiple highlights
interface FeatureHighlightGridProps {
    children: ReactNode;
    className?: string;
    columns?: 1 | 2 | 3;
}

export function FeatureHighlightGrid({
    children,
    className,
    columns = 1,
}: FeatureHighlightGridProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    };

    return (
        <div className={cn('grid gap-4', gridCols[columns], className)}>
            {children}
        </div>
    );
}

// Animated feature card with stats
interface FeatureStatCardProps {
    icon: string;
    label: string;
    value: string | number;
    description?: string;
    className?: string;
}

export function FeatureStatCard({
    icon,
    label,
    value,
    description,
    className,
}: FeatureStatCardProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center p-4 rounded-xl',
                'bg-slate-800/50 border border-slate-700/50',
                'hover:border-cyan-500/30 transition-all duration-300',
                className
            )}
        >
            <span className="text-2xl mb-2" aria-hidden="true">{icon}</span>
            <span className="text-2xl font-bold text-cyan-400">{value}</span>
            <span className="text-sm text-slate-300 font-medium">{label}</span>
            {description && (
                <span className="text-xs text-slate-500 mt-1">{description}</span>
            )}
        </div>
    );
}
