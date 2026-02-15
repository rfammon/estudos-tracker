import React, { useEffect, useMemo } from 'react';
import { useMultiplierStore } from '../../store/use-multiplier-store';
import { MULTIPLIER_TYPE_COLORS } from '../../types/multipliers';

interface MultiplierDisplayProps {
    compact?: boolean;
    showDetails?: boolean;
    className?: string;
}

export const MultiplierDisplay: React.FC<MultiplierDisplayProps> = ({
    compact = false,
    showDetails = false,
    className = '',
}) => {
    const {
        activeMultipliers,
        calculateTotalMultiplier,
        checkTimeBonus,
        checkActiveEvents,
        checkFirstSessionBonus,
        activateMultiplier,
        checkComboTimeout,
    } = useMultiplierStore();

    // Check for time-based multipliers on mount and periodically
    useEffect(() => {
        const checkMultipliers = () => {
            // Check time bonus
            const timeBonus = checkTimeBonus();
            if (timeBonus) {
                activateMultiplier(timeBonus);
            }

            // Check first session bonus
            const firstSessionBonus = checkFirstSessionBonus();
            if (firstSessionBonus) {
                activateMultiplier(firstSessionBonus);
            }

            // Check active events
            const activeEvents = checkActiveEvents();
            activeEvents.forEach(event => {
                activateMultiplier(event);
            });

            // Check combo timeout
            checkComboTimeout();
        };

        checkMultipliers();

        // Check every minute for time-based changes
        const interval = setInterval(checkMultipliers, 60000);

        return () => clearInterval(interval);
    }, [checkTimeBonus, checkActiveEvents, checkFirstSessionBonus, activateMultiplier, checkComboTimeout]);

    const calculation = useMemo(() => {
        return calculateTotalMultiplier();
    }, [activeMultipliers, calculateTotalMultiplier]);

    // Filter out expired multipliers
    const validMultipliers = useMemo(() => {
        const now = new Date();
        return activeMultipliers.filter(m => {
            if (m.endTime && new Date(m.endTime) < now) {
                return false;
            }
            return m.active;
        });
    }, [activeMultipliers]);

    if (validMultipliers.length === 0) {
        return null;
    }

    // Compact version for header/badge
    if (compact) {
        return (
            <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg animate-pulse ${className}`}
                role="status"
                aria-live="polite"
                aria-label={`Multiplicador ativo: ${calculation.totalMultiplier.toFixed(1)}x`}
            >
                <span className="text-base">⚡</span>
                <span>{calculation.totalMultiplier.toFixed(1)}x</span>
            </div>
        );
    }

    // Full display version
    return (
        <div
            className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-xl border border-slate-700 ${className}`}
            role="region"
            aria-label="Multiplicadores ativos"
        >
            {/* Total Multiplier Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <h3 className="text-lg font-bold text-white">Multiplicador Total</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-amber-400">
                        {calculation.totalMultiplier.toFixed(1)}x
                    </span>
                </div>
            </div>

            {/* Active Multipliers List */}
            {showDetails && validMultipliers.length > 0 && (
                <div className="space-y-2 mt-3 border-t border-slate-700 pt-3">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                        Multiplicadores Ativos
                    </p>
                    {validMultipliers.map((multiplier) => (
                        <div
                            key={multiplier.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                            style={{
                                borderLeft: `3px solid ${MULTIPLIER_TYPE_COLORS[multiplier.type]}`,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{multiplier.icon}</span>
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {multiplier.name}
                                    </p>
                                    {multiplier.description && (
                                        <p className="text-xs text-slate-400">
                                            {multiplier.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span
                                className="text-sm font-bold px-2 py-0.5 rounded"
                                style={{
                                    backgroundColor: `${MULTIPLIER_TYPE_COLORS[multiplier.type]}20`,
                                    color: MULTIPLIER_TYPE_COLORS[multiplier.type],
                                }}
                            >
                                {multiplier.value}x
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Time Remaining for Temporary Multipliers */}
            {validMultipliers.some(m => m.endTime) && (
                <div className="mt-3 text-xs text-slate-400">
                    <TimeRemainingDisplay multipliers={validMultipliers} />
                </div>
            )}
        </div>
    );
};

// Helper component to display remaining time
const TimeRemainingDisplay: React.FC<{ multipliers: Array<{ id: string; endTime?: Date; name: string }> }> = ({ multipliers }) => {
    const [timeRemaining, setTimeRemaining] = React.useState<Record<string, string>>({});

    useEffect(() => {
        const updateTimes = () => {
            const now = new Date();
            const remaining: Record<string, string> = {};

            multipliers.forEach(m => {
                if (m.endTime) {
                    const end = new Date(m.endTime);
                    const diff = end.getTime() - now.getTime();

                    if (diff > 0) {
                        const minutes = Math.floor(diff / 60000);
                        const seconds = Math.floor((diff % 60000) / 1000);
                        remaining[m.id] = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    }
                }
            });

            setTimeRemaining(remaining);
        };

        updateTimes();
        const interval = setInterval(updateTimes, 1000);

        return () => clearInterval(interval);
    }, [multipliers]);

    const tempMultipliers = multipliers.filter(m => m.endTime && timeRemaining[m.id]);

    if (tempMultipliers.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {tempMultipliers.map(m => (
                <span key={m.id} className="text-amber-400">
                    ⏱️ {m.name}: {timeRemaining[m.id]}
                </span>
            ))}
        </div>
    );
};

export default MultiplierDisplay;
