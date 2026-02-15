import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import { LiveRegion } from '@/components/accessibility';

/**
 * Progress component with ARIA progressbar attributes and screen reader support.
 * 
 * @see https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22.html
 * 
 * @example
 * <Progress 
 *   value={50} 
 *   max={100} 
 *   label="Upload progress"
 *   showValue
 * />
 */

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
    /**
     * Custom class name for the indicator
     */
    indicatorClassName?: string;
    /**
     * Accessible label for the progress bar
     */
    label?: string;
    /**
     * Whether to show the value visually
     */
    showValue?: boolean;
    /**
     * Whether to announce progress changes to screen readers
     */
    announceProgress?: boolean;
    /**
     * Percentages at which to announce progress (default: 25, 50, 75, 100)
     */
    announceAt?: number[];
    /**
     * Size variant
     */
    size?: 'sm' | 'md' | 'lg';
}

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressProps
>(
    (
        {
            className,
            value,
            max = 100,
            indicatorClassName,
            label,
            showValue = false,
            announceProgress = true,
            announceAt = [25, 50, 75, 100],
            size = 'md',
            ...props
        },
        ref
    ) => {
        const [announcement, setAnnouncement] = React.useState('');
        const previousPercentageRef = React.useRef(0);
        const percentage = Math.round(((value || 0) / max) * 100);

        // Announce progress at specified thresholds
        React.useEffect(() => {
            if (!announceProgress) return;

            const crossedThreshold = announceAt.find(
                (threshold) => previousPercentageRef.current < threshold && percentage >= threshold
            );

            if (crossedThreshold !== undefined && label) {
                setAnnouncement(`${label}: ${crossedThreshold}% complete`);
                // Clear announcement after 3 seconds
                const timer = setTimeout(() => setAnnouncement(''), 3000);
                return () => clearTimeout(timer);
            }

            previousPercentageRef.current = percentage;
        }, [percentage, label, announceProgress, announceAt]);

        const sizeClasses = {
            sm: 'h-2',
            md: 'h-4',
            lg: 'h-6',
        };

        return (
            <>
                <ProgressPrimitive.Root
                    ref={ref}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-valuenow={value || 0}
                    aria-valuetext={label ? `${label}: ${percentage}%` : `${percentage}%`}
                    aria-label={label}
                    className={cn(
                        'relative w-full overflow-hidden rounded-full bg-secondary',
                        sizeClasses[size],
                        className
                    )}
                    max={max}
                    {...props}
                >
                    <ProgressPrimitive.Indicator
                        className={cn(
                            'h-full w-full flex-1 bg-primary transition-all duration-300',
                            indicatorClassName
                        )}
                        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
                    />
                    {showValue && (
                        <span
                            className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-foreground"
                            aria-hidden="true"
                        >
                            {percentage}%
                        </span>
                    )}
                </ProgressPrimitive.Root>

                {/* Screen reader announcement */}
                {announceProgress && (
                    <LiveRegion message={announcement} aria-live="polite" />
                )}
            </>
        );
    }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

/**
 * CircularProgress component for circular progress indicators
 */
interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    showValue?: boolean;
    className?: string;
}

const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
    (
        {
            value,
            max = 100,
            size = 48,
            strokeWidth = 4,
            label,
            showValue = false,
            className,
        },
        ref
    ) => {
        const percentage = Math.round((value / max) * 100);
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;

        return (
            <svg
                ref={ref}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={value}
                aria-valuetext={label ? `${label}: ${percentage}%` : `${percentage}%`}
                aria-label={label}
                width={size}
                height={size}
                className={cn('transform -rotate-90', className)}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-secondary"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-300"
                />
                {/* Center text */}
                {showValue && (
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-xs font-medium fill-current transform rotate-90"
                        aria-hidden="true"
                    >
                        {percentage}%
                    </text>
                )}
            </svg>
        );
    }
);
CircularProgress.displayName = 'CircularProgress';

export { Progress, CircularProgress };
