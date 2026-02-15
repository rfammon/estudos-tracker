import { useEffect, useRef, useCallback } from 'react';

/**
 * useFocusTrap hook for trapping focus within a container.
 * Essential for modal dialogs and other overlay components.
 * 
 * @see https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR26.html
 * 
 * @example
 * const { containerRef, activate, deactivate } = useFocusTrap();
 * 
 * return (
 *   <div ref={containerRef} role="dialog" aria-modal="true">
 *     <button>First focusable</button>
 *     <button>Second focusable</button>
 *   </div>
 * );
 */

interface UseFocusTrapOptions {
    /**
     * Whether the focus trap is active (default: true)
     */
    active?: boolean;
    /**
     * Whether to auto-focus the first focusable element on activation
     */
    autoFocus?: boolean;
    /**
     * Whether to restore focus to the previously focused element on deactivation
     */
    restoreFocus?: boolean;
    /**
     * Selector for focusable elements (can be customized for special cases)
     */
    focusableSelector?: string;
    /**
     * Callback when escape key is pressed
     */
    onEscape?: () => void;
}

interface UseFocusTrapReturn {
    containerRef: React.RefObject<HTMLDivElement>;
    activate: () => void;
    deactivate: () => void;
    focusFirst: () => void;
    focusLast: () => void;
}

// Default selector for focusable elements
const DEFAULT_FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function useFocusTrap(options: UseFocusTrapOptions = {}): UseFocusTrapReturn {
    const {
        active = true,
        autoFocus = true,
        restoreFocus = true,
        focusableSelector = DEFAULT_FOCUSABLE_SELECTOR,
        onEscape,
    } = options;

    const containerRef = useRef<HTMLDivElement>(null);
    const isActiveRef = useRef(active);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Get all focusable elements within the container
    const getFocusableElements = useCallback(() => {
        if (!containerRef.current) return [];

        const elements = containerRef.current.querySelectorAll<HTMLElement>(focusableSelector);

        // Filter out elements that are not visible
        return Array.from(elements).filter((el) => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                el.offsetParent !== null;
        });
    }, [focusableSelector]);

    // Focus the first focusable element
    const focusFirst = useCallback(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
            focusable[0].focus();
        }
    }, [getFocusableElements]);

    // Focus the last focusable element
    const focusLast = useCallback(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
            focusable[focusable.length - 1].focus();
        }
    }, [getFocusableElements]);

    // Activate the focus trap
    const activate = useCallback(() => {
        isActiveRef.current = true;

        // Store the previously focused element
        if (restoreFocus) {
            previousFocusRef.current = document.activeElement as HTMLElement;
        }

        // Auto-focus first element if enabled
        if (autoFocus) {
            // Use a small timeout to ensure the container is rendered
            setTimeout(() => {
                focusFirst();
            }, 0);
        }
    }, [autoFocus, restoreFocus, focusFirst]);

    // Deactivate the focus trap
    const deactivate = useCallback(() => {
        isActiveRef.current = false;

        // Restore focus to the previously focused element
        if (restoreFocus && previousFocusRef.current) {
            previousFocusRef.current.focus();
            previousFocusRef.current = null;
        }
    }, [restoreFocus]);

    // Handle keyboard events
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!isActiveRef.current || !containerRef.current) return;

        // Handle Tab key
        if (event.key === 'Tab') {
            const focusable = getFocusableElements();
            if (focusable.length === 0) return;

            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];
            const currentElement = document.activeElement as HTMLElement;

            if (event.shiftKey) {
                // Shift+Tab: going backwards
                if (currentElement === firstElement || !containerRef.current.contains(currentElement)) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: going forwards
                if (currentElement === lastElement || !containerRef.current.contains(currentElement)) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }

        // Handle Escape key
        if (event.key === 'Escape' && onEscape) {
            event.preventDefault();
            onEscape();
        }
    }, [getFocusableElements, onEscape]);

    // Set up event listeners
    useEffect(() => {
        if (active) {
            activate();
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (isActiveRef.current && restoreFocus && previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        };
    }, [active, activate, handleKeyDown, restoreFocus]);

    return {
        containerRef,
        activate,
        deactivate,
        focusFirst,
        focusLast,
    };
}

export default useFocusTrap;
