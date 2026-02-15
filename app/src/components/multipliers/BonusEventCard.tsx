import React, { useMemo } from 'react';
import { BonusEvent, MULTIPLIER_TYPE_COLORS } from '../../types/multipliers';
import { useMultiplierStore } from '../../store/use-multiplier-store';

interface BonusEventCardProps {
    event: BonusEvent;
    className?: string;
    showStatus?: boolean;
    compact?: boolean;
}

export const BonusEventCard: React.FC<BonusEventCardProps> = ({
    event,
    className = '',
    showStatus = true,
    compact = false,
}) => {
    const { activateMultiplier, isMultiplierActive } = useMultiplierStore();

    // Check if event is currently active
    const isActive = useMemo(() => {
        const now = new Date();

        // Check date range
        if (new Date(event.startDate) > now || new Date(event.endDate) < now) {
            return false;
        }

        // Check day of week if specified
        if (event.daysOfWeek) {
            const today = now.getDay();
            if (!event.daysOfWeek.includes(today)) {
                return false;
            }
        }

        // Check time range if specified
        if (event.startTime && event.endTime) {
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const [startHour, startMin] = event.startTime.split(':').map(Number);
            const [endHour, endMin] = event.endTime.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;

            if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
                return false;
            }
        }

        return true;
    }, [event]);

    // Check if multiplier is already activated
    const isActivated = isMultiplierActive(`event-${event.id}`);

    // Get next occurrence info
    const nextOccurrence = useMemo(() => {
        if (isActive) return 'Agora!';

        const now = new Date();

        if (event.daysOfWeek) {
            // Find next matching day
            const currentDay = now.getDay();
            const sortedDays = [...event.daysOfWeek].sort((a, b) => a - b);

            let nextDay = sortedDays.find(d => d > currentDay);
            if (!nextDay) nextDay = sortedDays[0];

            const daysUntil = nextDay > currentDay
                ? nextDay - currentDay
                : 7 - currentDay + nextDay;

            if (daysUntil === 1) return 'Amanhã';
            if (daysUntil === 0) return 'Hoje';

            const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            return dayNames[nextDay];
        }

        if (event.startTime) {
            const [startHour] = event.startTime.split(':').map(Number);
            const currentHour = now.getHours();

            if (startHour > currentHour) {
                return `Hoje às ${event.startTime}`;
            }
        }

        return 'Em breve';
    }, [event, isActive]);

    // Format time range for display
    const timeDisplay = useMemo(() => {
        if (!event.startTime || !event.endTime) return null;
        return `${event.startTime} - ${event.endTime}`;
    }, [event.startTime, event.endTime]);

    // Format days for display
    const daysDisplay = useMemo(() => {
        if (!event.daysOfWeek) return null;

        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return event.daysOfWeek.map(d => dayNames[d]).join(', ');
    }, [event.daysOfWeek]);

    const handleActivate = () => {
        if (isActive && !isActivated) {
            useMultiplierStore.getState().activateEventMultiplier(event);
        }
    };

    // Compact version
    if (compact) {
        return (
            <div
                className={`
          flex items-center gap-2 p-2 rounded-lg
          ${isActive ? 'bg-green-500/20 border border-green-500/30' : 'bg-slate-800/50 border border-slate-700'}
          ${className}
        `}
                role="article"
                aria-label={`Evento: ${event.name}`}
            >
                <span className="text-lg">{event.icon}</span>
                <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-white truncate">{event.name}</p>
                </div>
                <span className={`text-sm font-bold ${isActive ? 'text-green-400' : 'text-slate-400'}`}>
                    {event.multiplier}x
                </span>
                {isActive && (
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                )}
            </div>
        );
    }

    // Full card version
    return (
        <div
            className={`
        relative overflow-hidden rounded-xl p-4
        ${isActive
                    ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-500/50'
                    : 'bg-slate-800/50 border border-slate-700'
                }
        transition-all duration-300 hover:scale-[1.02]
        ${className}
      `}
            role="article"
            aria-label={`Evento bônus: ${event.name}`}
        >
            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-0 right-0 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-bl-lg">
                    ATIVO
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl
          ${isActive ? 'bg-green-500/30' : 'bg-slate-700/50'}
        `}>
                    {event.icon}
                </div>

                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white">{event.name}</h3>
                    <p className="text-sm text-slate-400">{event.description}</p>
                </div>
            </div>

            {/* Multiplier Badge */}
            <div className="flex items-center gap-2 mb-3">
                <span
                    className="text-2xl font-bold"
                    style={{ color: MULTIPLIER_TYPE_COLORS.event }}
                >
                    {event.multiplier}x
                </span>
                <span className="text-sm text-slate-400">XP Bônus</span>
            </div>

            {/* Schedule Info */}
            <div className="space-y-1.5 text-sm">
                {/* Time */}
                {timeDisplay && (
                    <div className="flex items-center gap-2 text-slate-300">
                        <span>🕐</span>
                        <span>{timeDisplay}</span>
                    </div>
                )}

                {/* Days */}
                {daysDisplay && (
                    <div className="flex items-center gap-2 text-slate-300">
                        <span>📅</span>
                        <span>{daysDisplay}</span>
                    </div>
                )}

                {/* Recurring */}
                {event.recurring && (
                    <div className="flex items-center gap-2 text-slate-400">
                        <span>🔄</span>
                        <span className="capitalize">
                            Recorrente: {event.recurringPattern === 'daily' ? 'Diário' :
                                event.recurringPattern === 'weekly' ? 'Semanal' :
                                    event.recurringPattern === 'monthly' ? 'Mensal' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Status & Action */}
            {showStatus && (
                <div className="mt-4 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isActive ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-sm text-green-400 font-medium">
                                        Disponível agora!
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-slate-400">⏳</span>
                                    <span className="text-sm text-slate-400">
                                        Próximo: {nextOccurrence}
                                    </span>
                                </>
                            )}
                        </div>

                        {isActive && !isActivated && (
                            <button
                                onClick={handleActivate}
                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                                aria-label="Ativar multiplicador"
                            >
                                Ativar
                            </button>
                        )}

                        {isActivated && (
                            <span className="text-sm text-green-400 font-medium">
                                ✓ Ativado
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Grid component for displaying multiple events
interface BonusEventGridProps {
    events: BonusEvent[];
    className?: string;
    compact?: boolean;
}

export const BonusEventGrid: React.FC<BonusEventGridProps> = ({
    events,
    className = '',
    compact = false,
}) => {
    // Sort events: active first, then by name
    const sortedEvents = useMemo(() => {
        return [...events].sort((a, b) => {
            // This is a simplified sort - in production you'd check actual active status
            return a.name.localeCompare(b.name);
        });
    }, [events]);

    if (events.length === 0) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <div className="text-4xl mb-2">🎁</div>
                <p className="text-slate-400 text-sm">
                    Nenhum evento bônus disponível
                </p>
            </div>
        );
    }

    return (
        <div
            className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} ${className}`}
            role="list"
            aria-label="Eventos bônus"
        >
            {sortedEvents.map((event) => (
                <BonusEventCard
                    key={event.id}
                    event={event}
                    compact={compact}
                />
            ))}
        </div>
    );
};

export default BonusEventCard;
