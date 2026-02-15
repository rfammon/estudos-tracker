import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

interface SettingsToggleProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    description?: string;
    icon?: React.ReactNode;
}

export function SettingsToggle({
    checked,
    onCheckedChange,
    disabled = false,
    label,
    description,
    icon,
}: SettingsToggleProps) {
    return (
        <div
            className="flex items-center justify-between py-3"
            data-testid={label ? `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined}
        >
            <div className="flex items-center gap-3 flex-1">
                {icon && (
                    <div className="flex-shrink-0 text-muted-foreground">
                        {icon}
                    </div>
                )}
                <div className="flex flex-col">
                    {label && (
                        <span className="text-sm font-medium text-foreground">
                            {label}
                        </span>
                    )}
                    {description && (
                        <span className="text-xs text-muted-foreground">
                            {description}
                        </span>
                    )}
                </div>
            </div>
            <SwitchPrimitive.Root
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className={cn(
                    'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted',
                    'data-[state=checked]:shadow-[0_0_12px_rgba(37,99,235,0.4)]',
                    'hover:scale-105 active:scale-95',
                    'transition-all duration-200'
                )}
            >
                <SwitchPrimitive.Thumb
                    className={cn(
                        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0',
                        'transition-transform duration-200',
                        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
                        'data-[state=checked]:bg-primary-foreground'
                    )}
                />
            </SwitchPrimitive.Root>
        </div>
    );
}
