import React, { useMemo } from 'react';
import { useMultiplierStore } from '../../store/use-multiplier-store';
import {
    Multiplier,
    MULTIPLIER_TYPE_COLORS,
    MULTIPLIER_TYPE_ICONS,
    MultiplierType
} from '../../types/multipliers';

interface MultiplierListProps {
    showInactive?: boolean;
    filterByType?: MultiplierType;
    className?: string;
    onMultiplierClick?: (multiplier: Multiplier) => void;
}

export const MultiplierList: React.FC<MultiplierListProps> = ({
    showInactive = false,
    filterByType,
    className = '',
    onMultiplierClick,
}) => {
    const { activeMultipliers, deactivateMultiplier } = useMultiplierStore();

    // Filter and sort multipliers
    const displayMultipliers = useMemo(() => {
        const now = new Date();

        let filtered = activeMultipliers.filter(m => {
            // Filter out expired
            if (m.endTime && new Date(m.endTime) < now) {
                return showInactive;
            }

            // Filter by type if specified
            if (filterByType && m.type !== filterByType) {
                return false;
            }

            return m.active || showInactive;
        });

        // Sort by value (highest first) then by type
        return filtered.sort((a, b) => {
            if (a.active !== b.active) return a.active ? -1 : 1;
            return b.value - a.value;
        });
    }, [activeMultipliers, showInactive, filterByType]);

    if (displayMultipliers.length === 0) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-slate-400 text-sm">
                    Nenhum multiplicador ativo no momento
                </p>
                <p className="text-slate-500 text-xs mt-1">
                    Continue estudando para ativar multiplicadores!
                </p>
            </div>
        );
    }

    return (
        <div
            className={`space-y-2 ${className}`}
            role="list"
            aria-label="Lista de multiplicadores"
        >
            {displayMultipliers.map((multiplier) => (
                <MultiplierListItem
                    key={multiplier.id}
                    multiplier={multiplier}
                    onClick={() => onMultiplierClick?.(multiplier)}
                    onRemove={() => deactivateMultiplier(multiplier.id)}
                />
            ))}
        </div>
    );
};

interface MultiplierListItemProps {
    multiplier: Multiplier;
    onClick?: () => void;
    onRemove?: () => void;
}

const MultiplierListItem: React.FC<MultiplierListItemProps> = ({
    multiplier,
    onClick,
    onRemove,
}) => {
    const typeColor = MULTIPLIER_TYPE_COLORS[multiplier.type];
    const typeIcon = MULTIPLIER_TYPE_ICONS[multiplier.type];

    // Calculate remaining time for temporary multipliers
    const remainingTime = useMemo(() => {
        if (!multiplier.endTime) return null;

        const now = new Date();
        const end = new Date(multiplier.endTime);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Expirado';

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}h ${mins}m`;
        }

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, [multiplier.endTime]);

    return (
        <div
            className={`
        group relative flex items-center gap-3 p-3 rounded-lg
        bg-slate-800/80 hover:bg-slate-700/80 
        border border-slate-700 hover:border-slate-600
        transition-all duration-200 cursor-pointer
        ${!multiplier.active ? 'opacity-50' : ''}
      `}
            style={{
                borderLeftWidth: '4px',
                borderLeftColor: typeColor,
            }}
            onClick={onClick}
            role="listitem"
            aria-label={`${multiplier.name}: ${multiplier.value}x multiplicador`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {/* Icon */}
            <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: `${typeColor}20` }}
            >
                {multiplier.icon || typeIcon}
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                        {multiplier.name}
                    </h4>
                    <span
                        className="text-xs px-1.5 py-0.5 rounded capitalize"
                        style={{
                            backgroundColor: `${typeColor}20`,
                            color: typeColor,
                        }}
                    >
                        {multiplier.type}
                    </span>
                </div>

                {multiplier.description && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                        {multiplier.description}
                    </p>
                )}

                {/* Time remaining */}
                {remainingTime && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-amber-400">⏱️</span>
                        <span className="text-xs text-amber-400">{remainingTime}</span>
                    </div>
                )}
            </div>

            {/* Value Badge */}
            <div className="flex-shrink-0 flex items-center gap-2">
                <span
                    className="text-lg font-bold"
                    style={{ color: typeColor }}
                >
                    {multiplier.value}x
                </span>

                {/* Remove button */}
                {onRemove && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-600 transition-opacity"
                        aria-label={`Remover ${multiplier.name}`}
                    >
                        <svg
                            className="w-4 h-4 text-slate-400 hover:text-red-400"
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
                )}
            </div>

            {/* Active indicator */}
            {multiplier.active && (
                <div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: typeColor }}
                />
            )}
        </div>
    );
};

// Grouped view by type
interface MultiplierListGroupedProps {
    className?: string;
}

export const MultiplierListGrouped: React.FC<MultiplierListGroupedProps> = ({
    className = '',
}) => {
    const { activeMultipliers } = useMultiplierStore();

    const groupedMultipliers = useMemo(() => {
        const groups: Record<MultiplierType, Multiplier[]> = {
            streak: [],
            time: [],
            combo: [],
            event: [],
            achievement: [],
        };

        const now = new Date();

        activeMultipliers
            .filter(m => m.active && (!m.endTime || new Date(m.endTime) > now))
            .forEach(m => {
                groups[m.type].push(m);
            });

        return groups;
    }, [activeMultipliers]);

    const hasAnyMultipliers = Object.values(groupedMultipliers).some(
        group => group.length > 0
    );

    if (!hasAnyMultipliers) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-slate-400 text-sm">
                    Nenhum multiplicador ativo
                </p>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {(Object.entries(groupedMultipliers) as [MultiplierType, Multiplier[]][])
                .filter(([, multipliers]) => multipliers.length > 0)
                .map(([type, multipliers]) => (
                    <div key={type} className="space-y-2">
                        {/* Type Header */}
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-lg">{MULTIPLIER_TYPE_ICONS[type]}</span>
                            <h3
                                className="text-sm font-semibold capitalize"
                                style={{ color: MULTIPLIER_TYPE_COLORS[type] }}
                            >
                                {type === 'streak' && 'Sequência'}
                                {type === 'time' && 'Horário'}
                                {type === 'combo' && 'Combo'}
                                {type === 'event' && 'Evento'}
                                {type === 'achievement' && 'Conquista'}
                            </h3>
                            <span className="text-xs text-slate-500">
                                ({multipliers.length})
                            </span>
                        </div>

                        {/* Multipliers */}
                        <div className="space-y-1">
                            {multipliers.map((multiplier) => (
                                <MultiplierListItem
                                    key={multiplier.id}
                                    multiplier={multiplier}
                                />
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default MultiplierList;
