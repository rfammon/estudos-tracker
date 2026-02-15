import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    value?: string;
}

export function SettingsSection({
    title,
    description,
    icon,
    children,
    defaultOpen = false,
    value,
}: SettingsSectionProps) {
    const sectionValue = value || title.toLowerCase().replace(/\s+/g, '-');

    return (
        <AccordionPrimitive.Root
            type="single"
            defaultValue={defaultOpen ? sectionValue : undefined}
            collapsible
            className="w-full"
        >
            <AccordionPrimitive.Item value={sectionValue} className="border-b border-border/50">
                <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger
                        className={cn(
                            'flex w-full items-center justify-between py-4 px-4',
                            'group hover:bg-muted/30 rounded-lg transition-all duration-200',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                                    {icon}
                                </div>
                            )}
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {title}
                                </span>
                                {description && (
                                    <span className="text-xs text-muted-foreground">
                                        {description}
                                    </span>
                                )}
                            </div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content
                    className={cn(
                        'overflow-hidden text-sm',
                        'data-[state=closed]:animate-accordion-up',
                        'data-[state=open]:animate-accordion-down'
                    )}
                >
                    <div className="pb-4 px-4 space-y-1">
                        {children}
                    </div>
                </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
    );
}
