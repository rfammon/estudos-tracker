import { cn } from '@/lib/utils';
import { forwardRef, HTMLAttributes } from 'react';

/**
 * SkipLink component for keyboard navigation accessibility.
 * Allows users to skip directly to main content, bypassing navigation.
 * 
 * @see https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html
 */
export interface SkipLinkProps extends HTMLAttributes<HTMLAnchorElement> {
    /**
     * The ID of the element to skip to (default: "main-content")
     */
    targetId?: string;
    /**
     * Label for the skip link (default: "Skip to main content")
     */
    label?: string;
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
    ({ className, targetId = 'main-content', label = 'Skip to main content', ...props }, ref) => {
        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            const target = document.getElementById(targetId);
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        };

        return (
            <a
                ref={ref}
                href={`#${targetId}`}
                onClick={handleClick}
                className={cn(
                    // Visually hidden until focused
                    'sr-only focus:not-sr-only',
                    // When focused, show at top of page
                    'focus:fixed focus:top-4 focus:left-4 focus:z-[9999]',
                    // Styling when visible
                    'focus:px-4 focus:py-2 focus:rounded-md',
                    'focus:bg-primary focus:text-primary-foreground',
                    'focus:font-medium focus:text-sm',
                    'focus:shadow-lg focus:outline-none',
                    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    // Transition for smooth appearance
                    'transition-all duration-200',
                    className
                )}
                {...props}
            >
                {label}
            </a>
        );
    }
);

SkipLink.displayName = 'SkipLink';

/**
 * SkipLinks component for multiple skip targets.
 * Renders multiple skip links for common page sections.
 */
export interface SkipLinksProps {
    links?: Array<{ targetId: string; label: string }>;
}

export function SkipLinks({
    links = [
        { targetId: 'main-content', label: 'Skip to main content' },
        { targetId: 'main-navigation', label: 'Skip to navigation' },
        { targetId: 'sidebar', label: 'Skip to sidebar' },
    ]
}: SkipLinksProps) {
    return (
        <div className="skip-links-container">
            {links.map((link, index) => (
                <SkipLink
                    key={link.targetId}
                    targetId={link.targetId}
                    label={link.label}
                    // Offset position for multiple skip links
                    style={{
                        top: index === 0 ? undefined : `${(index * 44) + 16}px`
                    }}
                />
            ))}
        </div>
    );
}

export default SkipLink;
