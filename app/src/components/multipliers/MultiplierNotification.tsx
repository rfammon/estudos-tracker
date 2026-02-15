import React, { useEffect, useState, useCallback } from 'react';
import { useMultiplierStore } from '../../store/use-multiplier-store';
import {
    MultiplierNotification as NotificationType,
    MULTIPLIER_TYPE_COLORS
} from '../../types/multipliers';

interface MultiplierNotificationProps {
    notification: NotificationType;
    onDismiss: (id: string) => void;
    autoHideDuration?: number;
}

const MultiplierNotificationItem: React.FC<MultiplierNotificationProps> = ({
    notification,
    onDismiss,
    autoHideDuration = 5000,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => {
            setIsVisible(true);
        });

        // Auto-hide timer
        const timer = setTimeout(() => {
            handleDismiss();
        }, autoHideDuration);

        return () => clearTimeout(timer);
    }, [autoHideDuration]);

    const handleDismiss = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onDismiss(notification.id);
        }, 300); // Match animation duration
    }, [notification.id, onDismiss]);

    const typeColor = MULTIPLIER_TYPE_COLORS[notification.type];

    return (
        <div
            className={`
        relative overflow-hidden rounded-lg shadow-xl
        transform transition-all duration-300 ease-out
        ${isVisible && !isExiting
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
                }
      `}
            style={{
                background: `linear-gradient(135deg, ${typeColor}20, ${typeColor}10)`,
                borderLeft: `4px solid ${typeColor}`,
            }}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
        >
            {/* Progress bar */}
            <div
                className="absolute bottom-0 left-0 h-1 transition-all ease-linear"
                style={{
                    backgroundColor: typeColor,
                    animation: `shrink ${autoHideDuration}ms linear forwards`,
                }}
            />

            <div className="p-4 flex items-start gap-3">
                {/* Icon */}
                <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl animate-bounce"
                    style={{ backgroundColor: `${typeColor}30` }}
                >
                    {notification.icon}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-bold text-white">
                        Multiplicador Ativado!
                    </h4>
                    <p className="text-sm text-slate-300 mt-0.5">
                        {notification.multiplierName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span
                            className="text-lg font-bold"
                            style={{ color: typeColor }}
                        >
                            {notification.multiplierValue}x
                        </span>
                        <span className="text-xs text-slate-400">XP</span>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
                    aria-label="Fechar notificação"
                >
                    <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Sparkle animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute w-2 h-2 rounded-full animate-ping"
                    style={{
                        backgroundColor: typeColor,
                        top: '20%',
                        right: '20%',
                    }}
                />
            </div>

            <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </div>
    );
};

// Container component for displaying multiple notifications
interface NotificationContainerProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    maxVisible?: number;
    className?: string;
}

export const MultiplierNotificationContainer: React.FC<NotificationContainerProps> = ({
    position = 'top-right',
    maxVisible = 3,
    className = '',
}) => {
    const { notifications, markNotificationRead } = useMultiplierStore();
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    // Get unread notifications that haven't been dismissed
    const visibleNotifications = notifications
        .filter(n => !dismissed.has(n.id))
        .slice(0, maxVisible);

    const handleDismiss = useCallback((id: string) => {
        setDismissed(prev => new Set([...prev, id]));
        markNotificationRead(id);
    }, [markNotificationRead]);

    // Position classes
    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
    };

    if (visibleNotifications.length === 0) {
        return null;
    }

    return (
        <div
            className={`
        fixed z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]
        ${positionClasses[position]}
        ${className}
      `}
            role="region"
            aria-label="Notificações de multiplicadores"
        >
            {visibleNotifications.map((notification) => (
                <MultiplierNotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleDismiss}
                />
            ))}
        </div>
    );
};

// Hook for programmatic notifications
export const useMultiplierNotification = () => {
    const { addNotification, notifications, clearNotifications } = useMultiplierStore();

    const notify = useCallback((
        multiplierId: string,
        multiplierName: string,
        multiplierValue: number,
        type: NotificationType['type'],
        icon: string
    ) => {
        addNotification({
            multiplierId,
            multiplierName,
            multiplierValue,
            type,
            icon,
        });
    }, [addNotification]);

    return {
        notify,
        notifications,
        clearNotifications,
    };
};

// Toast-style notification for quick display
interface MultiplierToastProps {
    message: string;
    multiplier: number;
    icon?: string;
    duration?: number;
    onClose?: () => void;
}

export const MultiplierToast: React.FC<MultiplierToastProps> = ({
    message,
    multiplier,
    icon = '⚡',
    duration = 3000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        z-[100] pointer-events-none
        transition-all duration-300
        ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
      `}
            role="status"
            aria-live="polite"
        >
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <span className="text-4xl block mb-2">{icon}</span>
                    <p className="text-lg font-bold">{message}</p>
                    <p className="text-3xl font-bold mt-2">{multiplier}x XP!</p>
                </div>
            </div>
        </div>
    );
};

// Animated badge that appears when multiplier is active
interface ActiveMultiplierBadgeProps {
    multiplier: number;
    className?: string;
}

export const ActiveMultiplierBadge: React.FC<ActiveMultiplierBadgeProps> = ({
    multiplier,
    className = '',
}) => {
    return (
        <div
            className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        bg-gradient-to-r from-amber-500 to-orange-500
        text-white text-sm font-bold rounded-full
        shadow-lg animate-pulse
        ${className}
      `}
            role="status"
            aria-label={`Multiplicador ativo: ${multiplier}x`}
        >
            <span className="animate-spin-slow">⚡</span>
            <span>{multiplier.toFixed(1)}x</span>
        </div>
    );
};

export default MultiplierNotificationContainer;
