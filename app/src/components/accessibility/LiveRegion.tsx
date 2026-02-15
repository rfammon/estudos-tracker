import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';

/**
 * LiveRegion component for screen reader announcements.
 * Provides ARIA live regions for dynamic content updates.
 * 
 * @see https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19.html
 */

export type AriaLive = 'polite' | 'assertive' | 'off';
export type AriaRelevant = 'additions' | 'removals' | 'text' | 'all';

export interface LiveRegionProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * The politeness level of the live region
     * - polite: Waits for user idle (default)
     * - assertive: Interrupts current announcements
     * - off: No announcement
     */
    'aria-live'?: AriaLive;
    /**
     * What types of changes should be announced
     * - additions: Only added content
     * - removals: Only removed content
     * - text: Only text changes
     * - all: All changes
     */
    'aria-relevant'?: AriaRelevant;
    /**
     * Whether the entire region should be announced
     */
    'aria-atomic'?: boolean;
    /**
     * Message to announce
     */
    message?: string;
    /**
     * Whether to visually hide the region
     */
    visuallyHidden?: boolean;
    /**
     * Clear message after announcement (ms)
     */
    clearAfter?: number;
}

export const LiveRegion = forwardRef<HTMLDivElement, LiveRegionProps>(
    (
        {
            className,
            'aria-live': ariaLive = 'polite',
            'aria-relevant': ariaRelevant = 'additions',
            'aria-atomic': ariaAtomic = false,
            message = '',
            visuallyHidden = true,
            clearAfter,
            ...props
        },
        ref
    ) => {
        const [currentMessage, setCurrentMessage] = useState(message);

        useEffect(() => {
            setCurrentMessage(message);

            if (clearAfter && message) {
                const timer = setTimeout(() => {
                    setCurrentMessage('');
                }, clearAfter);
                return () => clearTimeout(timer);
            }
        }, [message, clearAfter]);

        return (
            <div
                ref={ref}
                role="status"
                aria-live={ariaLive}
                aria-relevant={ariaRelevant}
                aria-atomic={ariaAtomic}
                className={cn(
                    visuallyHidden && 'sr-only',
                    // Ensure it's focusable for testing
                    'focus:outline-none',
                    className
                )}
                {...props}
            >
                {currentMessage}
            </div>
        );
    }
);

LiveRegion.displayName = 'LiveRegion';

/**
 * LiveRegionProvider context for managing announcements
 */
export interface LiveRegionContextValue {
    announce: (message: string, politeness?: AriaLive) => void;
    clearAnnouncement: () => void;
}

/**
 * StatusMessage component for status updates
 */
export interface StatusMessageProps extends Omit<LiveRegionProps, 'aria-live'> {
    /**
     * Type of status message
     */
    type?: 'status' | 'alert' | 'log';
}

export const StatusMessage = forwardRef<HTMLDivElement, StatusMessageProps>(
    ({ type = 'status', ...props }, ref) => {
        const role = type === 'alert' ? 'alert' : type === 'log' ? 'log' : 'status';
        const ariaLive = type === 'alert' ? 'assertive' : 'polite';

        return (
            <div
                ref={ref}
                role={role}
                aria-live={ariaLive}
                className={cn(props.visuallyHidden !== false && 'sr-only', props.className)}
                {...props}
            >
                {props.message}
            </div>
        );
    }
);

StatusMessage.displayName = 'StatusMessage';

/**
 * AlertMessage component for urgent announcements
 */
export const AlertMessage = forwardRef<HTMLDivElement, Omit<LiveRegionProps, 'aria-live'>>(
    (props, ref) => {
        return (
            <LiveRegion
                ref={ref}
                role="alert"
                aria-live="assertive"
                {...props}
            />
        );
    }
);

AlertMessage.displayName = 'AlertMessage';

/**
 * ProgressBarAnnouncer component for progress updates
 */
export interface ProgressBarAnnouncerProps {
    value: number;
    max: number;
    label: string;
    announceAt?: number[]; // Percentages at which to announce
}

export function ProgressBarAnnouncer({
    value,
    max,
    label,
    announceAt = [25, 50, 75, 100],
}: ProgressBarAnnouncerProps) {
    const [announcement, setAnnouncement] = useState('');
    const previousPercentage = useRef(0);
    const percentage = Math.round((value / max) * 100);

    useEffect(() => {
        // Check if we've crossed an announcement threshold
        const crossedThreshold = announceAt.find(
            (threshold) => previousPercentage.current < threshold && percentage >= threshold
        );

        if (crossedThreshold !== undefined) {
            setAnnouncement(`${label}: ${crossedThreshold}% complete`);
        }

        previousPercentage.current = percentage;
    }, [percentage, label, announceAt]);

    return <LiveRegion message={announcement} clearAfter={3000} />;
}

export default LiveRegion;
