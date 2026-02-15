import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    /**
     * Whether the button is in a loading state
     */
    loading?: boolean;
    /**
     * Accessible label for icon-only buttons
     */
    'aria-label'?: string;
    /**
     * Whether the button is pressed (for toggle buttons)
     */
    'aria-pressed'?: boolean;
    /**
     * Whether the button is expanded (for buttons that control collapsible content)
     */
    'aria-expanded'?: boolean;
    /**
     * ID of the element controlled by this button
     */
    'aria-controls'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant,
        size,
        asChild = false,
        loading = false,
        disabled,
        children,
        'aria-label': ariaLabel,
        'aria-pressed': ariaPressed,
        'aria-expanded': ariaExpanded,
        'aria-controls': ariaControls,
        ...props
    }, ref) => {
        const Comp = asChild ? Slot : 'button';

        // Determine if this is an icon-only button
        const isIconButton = size === 'icon';

        // Warn if icon button doesn't have accessible label
        if (isIconButton && !ariaLabel && process.env.NODE_ENV === 'development') {
            console.warn(
                'Button: Icon buttons should have an aria-label prop for accessibility.'
            );
        }

        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, className }),
                    // Enhanced focus styles for better visibility
                    'focus-visible:ring-4',
                    'focus-visible:ring-primary/50',
                    // High contrast focus for better accessibility
                    'focus-visible:outline-2',
                    'focus-visible:outline-offset-2',
                    // Loading state cursor
                    loading && 'cursor-wait'
                )}
                ref={ref}
                disabled={disabled || loading}
                aria-label={ariaLabel}
                aria-pressed={ariaPressed}
                aria-expanded={ariaExpanded}
                aria-controls={ariaControls}
                aria-busy={loading}
                {...props}
            >
                {loading ? (
                    <span className="contents" aria-hidden="true">
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                        {children}
                    </span>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
