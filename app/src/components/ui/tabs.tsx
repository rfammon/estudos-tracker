import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

/**
 * Tabs component with ARIA tab pattern for accessibility.
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
 * 
 * Features:
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Focus management
 * - ARIA roles and attributes
 * - Screen reader announcements
 */

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        role="tablist"
        aria-label={props['aria-label'] || 'Content tabs'}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

export interface TabsTriggerProps
    extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
    /**
     * Accessible label for the tab (if not provided, uses children text)
     */
    'aria-label'?: string;
}

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    TabsTriggerProps
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        role="tab"
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
            // Focus styles for keyboard navigation
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:ring-4 focus-visible:ring-primary/50",
            // Disabled state
            "disabled:pointer-events-none disabled:opacity-50",
            // Active state
            "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            // Hover state
            "hover:text-foreground hover:bg-background/50",
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

export interface TabsContentProps
    extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
    /**
     * Accessible label for the tab panel
     */
    'aria-label'?: string;
}

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    TabsContentProps
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn(
            "mt-2 ring-offset-background",
            // Focus styles for keyboard navigation
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

/**
 * AccessibleTabLabel component for providing additional context
 */
interface TabLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
    /**
     * Icon to display before the label
     */
    icon?: React.ReactNode;
    /**
     * Badge count to display
     */
    badge?: number;
}

const TabLabel = React.forwardRef<HTMLSpanElement, TabLabelProps>(
    ({ icon, badge, children, className, ...props }, ref) => (
        <span
            ref={ref}
            className={cn("inline-flex items-center gap-2", className)}
            {...props}
        >
            {icon && <span aria-hidden="true">{icon}</span>}
            <span>{children}</span>
            {badge !== undefined && badge > 0 && (
                <span
                    className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground"
                    aria-label={`${badge} items`}
                >
                    {badge}
                </span>
            )}
        </span>
    )
);
TabLabel.displayName = 'TabLabel';

export { Tabs, TabsList, TabsTrigger, TabsContent, TabLabel }
