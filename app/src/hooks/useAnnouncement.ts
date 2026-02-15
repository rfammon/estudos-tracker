import { useCallback, useRef, useState, useEffect } from 'react';
import type { AriaLive } from '@/components/accessibility/LiveRegion';

/**
 * useAnnouncement hook for screen reader announcements.
 * Provides a simple interface for making announcements to screen readers.
 * 
 * @example
 * const { announce, announcePolite, announceAssertive } = useAnnouncement();
 * 
 * // Polite announcement (waits for user idle)
 * announcePolite('Item added to cart');
 * 
 * // Assertive announcement (interrupts)
 * announceAssertive('Error: Please fix the form');
 */

interface AnnouncementOptions {
    /**
     * Clear the announcement after this many milliseconds
     */
    clearAfter?: number;
    /**
     * Whether to deduplicate identical announcements
     */
    deduplicate?: boolean;
    /**
     * Minimum time between identical announcements (ms)
     */
    debounceMs?: number;
}

interface UseAnnouncementReturn {
    /**
     * Current announcement message
     */
    message: string;
    /**
     * Current politeness level
     */
    politeness: AriaLive;
    /**
     * Make an announcement with specified politeness
     */
    announce: (message: string, politeness?: AriaLive, options?: AnnouncementOptions) => void;
    /**
     * Make a polite announcement (waits for user idle)
     */
    announcePolite: (message: string, options?: AnnouncementOptions) => void;
    /**
     * Make an assertive announcement (interrupts current speech)
     */
    announceAssertive: (message: string, options?: AnnouncementOptions) => void;
    /**
     * Clear the current announcement
     */
    clearAnnouncement: () => void;
}

export function useAnnouncement(): UseAnnouncementReturn {
    const [message, setMessage] = useState('');
    const [politeness, setPoliteness] = useState<AriaLive>('polite');

    const lastAnnouncementRef = useRef<string>('');
    const lastAnnouncementTimeRef = useRef<number>(0);
    const clearTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const clearAnnouncement = useCallback(() => {
        setMessage('');
        if (clearTimeoutRef.current) {
            clearTimeout(clearTimeoutRef.current);
        }
    }, []);

    const announce = useCallback(
        (newMessage: string, newPoliteness: AriaLive = 'polite', options: AnnouncementOptions = {}) => {
            const { clearAfter = 3000, deduplicate = false, debounceMs = 500 } = options;
            const now = Date.now();

            // Check for duplicate announcements
            if (deduplicate && newMessage === lastAnnouncementRef.current) {
                const timeSinceLastAnnouncement = now - lastAnnouncementTimeRef.current;
                if (timeSinceLastAnnouncement < debounceMs) {
                    return; // Skip duplicate announcement
                }
            }

            // Clear any existing timeout
            if (clearTimeoutRef.current) {
                clearTimeout(clearTimeoutRef.current);
            }

            // Update the announcement
            setMessage(newMessage);
            setPoliteness(newPoliteness);
            lastAnnouncementRef.current = newMessage;
            lastAnnouncementTimeRef.current = now;

            // Auto-clear after specified time
            if (clearAfter > 0) {
                clearTimeoutRef.current = setTimeout(() => {
                    setMessage('');
                }, clearAfter);
            }
        },
        []
    );

    const announcePolite = useCallback(
        (msg: string, options?: AnnouncementOptions) => {
            announce(msg, 'polite', options);
        },
        [announce]
    );

    const announceAssertive = useCallback(
        (msg: string, options?: AnnouncementOptions) => {
            announce(msg, 'assertive', options);
        },
        [announce]
    );

    return {
        message,
        politeness,
        announce,
        announcePolite,
        announceAssertive,
        clearAnnouncement,
    };
}

/**
 * usePageAnnouncement hook for page-level announcements.
 * Announces when a new page or view is loaded.
 * 
 * @example
 * usePageAnnouncement('Dashboard');
 * // Announces "Dashboard page loaded" when component mounts
 */
export function usePageAnnouncement(pageName: string, shouldAnnounce = true) {
    const { announcePolite } = useAnnouncement();

    // Use a ref to ensure we only announce once per mount
    const hasAnnouncedRef = useRef(false);

    useEffect(() => {
        if (shouldAnnounce && !hasAnnouncedRef.current) {
            hasAnnouncedRef.current = true;
            // Delay slightly to ensure screen reader is ready
            const timeoutId = setTimeout(() => {
                announcePolite(`${pageName} page loaded`);
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [pageName, shouldAnnounce, announcePolite]);
}

/**
 * useStatusAnnouncement hook for status updates.
 * Provides specialized announcement functions for common status types.
 * 
 * @example
 * const { announceSuccess, announceError, announceWarning, announceInfo } = useStatusAnnouncement();
 * 
 * announceSuccess('Settings saved successfully');
 * announceError('Failed to save settings');
 */
export function useStatusAnnouncement() {
    const { announce, announcePolite, announceAssertive } = useAnnouncement();

    const announceSuccess = useCallback(
        (message: string) => {
            announcePolite(`Success: ${message}`);
        },
        [announcePolite]
    );

    const announceError = useCallback(
        (message: string) => {
            announceAssertive(`Error: ${message}`);
        },
        [announceAssertive]
    );

    const announceWarning = useCallback(
        (message: string) => {
            announcePolite(`Warning: ${message}`);
        },
        [announcePolite]
    );

    const announceInfo = useCallback(
        (message: string) => {
            announcePolite(message);
        },
        [announcePolite]
    );

    const announceLoading = useCallback(
        (message: string = 'Loading') => {
            announcePolite(message, { clearAfter: 0 });
        },
        [announcePolite]
    );

    const announceComplete = useCallback(
        (message: string = 'Complete') => {
            announcePolite(message);
        },
        [announcePolite]
    );

    return {
        announce,
        announcePolite,
        announceAssertive,
        announceSuccess,
        announceError,
        announceWarning,
        announceInfo,
        announceLoading,
        announceComplete,
    };
}

/**
 * useProgressAnnouncement hook for progress updates.
 * Announces progress at specified intervals.
 * 
 * @example
 * const { updateProgress } = useProgressAnnouncement('Upload', 100);
 * updateProgress(50); // Announces at 25%, 50%, 75%, 100%
 */
export function useProgressAnnouncement(
    label: string,
    max: number = 100,
    announceAt: number[] = [25, 50, 75, 100]
) {
    const { announcePolite } = useAnnouncement();
    const lastAnnouncedThresholdRef = useRef<number>(0);

    const updateProgress = useCallback(
        (value: number) => {
            const percentage = Math.round((value / max) * 100);

            // Find the highest threshold we've crossed but haven't announced yet
            const thresholdToAnnounce = announceAt.find(
                (threshold) => threshold > lastAnnouncedThresholdRef.current && percentage >= threshold
            );

            if (thresholdToAnnounce !== undefined) {
                lastAnnouncedThresholdRef.current = thresholdToAnnounce;
                announcePolite(`${label}: ${thresholdToAnnounce}% complete`);
            }
        },
        [label, max, announceAt, announcePolite]
    );

    const resetProgress = useCallback(() => {
        lastAnnouncedThresholdRef.current = 0;
    }, []);

    return { updateProgress, resetProgress };
}

export default useAnnouncement;
