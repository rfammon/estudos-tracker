import { Achievement } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
    achievement: Achievement;
    unlocked: boolean;
    progress?: number;
    /**
     * Whether to show detailed information
     */
    detailed?: boolean;
}

export function AchievementBadge({
    achievement,
    unlocked,
    progress,
}: AchievementBadgeProps) {
    const progressPercent = progress !== undefined ? Math.min(100, progress) : 0;

    // Generate accessible label
    const accessibleLabel = unlocked
        ? `Conquista: ${achievement.name}. ${achievement.description}`
        : `Conquista bloqueada: ${achievement.name}. Progresso: ${progressPercent}%`;

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                unlocked
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:shadow-lg'
                    : 'bg-gray-50 border-gray-200 opacity-75'
            )}
            role="article"
            aria-label={accessibleLabel}
            aria-describedby={`achievement-${achievement.id}-description`}
            tabIndex={0}
        >
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                {/* Icon with accessible label */}
                <div
                    className={cn(
                        "text-4xl",
                        !unlocked && 'grayscale opacity-50'
                    )}
                    role="img"
                    aria-label={unlocked ? achievement.name : 'Ícone da conquista bloqueada'}
                >
                    {achievement.icon}
                </div>

                <div className="space-y-1">
                    {/* Achievement name */}
                    <h3
                        className={cn(
                            "font-semibold text-sm",
                            unlocked ? 'text-amber-800' : 'text-gray-600'
                        )}
                        id={`achievement-${achievement.id}-title`}
                    >
                        {unlocked ? achievement.name : '???'}
                    </h3>

                    {/* Achievement description */}
                    <p
                        className={cn(
                            "text-xs",
                            unlocked ? 'text-amber-700' : 'text-gray-500'
                        )}
                        id={`achievement-${achievement.id}-description`}
                    >
                        {unlocked ? achievement.description : 'Complete desafios para desbloquear'}
                    </p>
                </div>

                {/* Progress bar for locked achievements */}
                {!unlocked && progress !== undefined && (
                    <div className="w-full mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span id={`progress-label-${achievement.id}`}>Progresso</span>
                            <span aria-label={`${progressPercent} por cento completo`}>{progressPercent}%</span>
                        </div>
                        <div
                            className="h-1.5 bg-gray-200 rounded-full overflow-hidden"
                            role="progressbar"
                            aria-valuenow={progressPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-labelledby={`progress-label-${achievement.id}`}
                        >
                            <div
                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Lock/Unlock status indicator */}
                <div
                    className="absolute top-2 right-2"
                    aria-hidden="true"
                >
                    {unlocked ? (
                        <Unlock className="h-4 w-4 text-amber-500" />
                    ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * AchievementBadgeCompact component for smaller displays
 */
interface AchievementBadgeCompactProps {
    achievement: Achievement;
    unlocked: boolean;
    progress?: number;
    onClick?: () => void;
}

export function AchievementBadgeCompact({
    achievement,
    unlocked,
    progress,
    onClick
}: AchievementBadgeCompactProps) {
    const progressPercent = progress !== undefined ? Math.min(100, progress) : 0;

    return (
        <button
            className={cn(
                "relative flex items-center gap-2 p-2 rounded-lg transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                unlocked
                    ? 'bg-amber-100 hover:bg-amber-200'
                    : 'bg-gray-100 hover:bg-gray-200 opacity-75'
            )}
            onClick={onClick}
            aria-label={unlocked
                ? `${achievement.name}: ${achievement.description}`
                : `Conquista bloqueada. Progresso: ${progressPercent}%`
            }
            aria-pressed={unlocked}
        >
            <span
                className={cn(
                    "text-2xl",
                    !unlocked && 'grayscale opacity-50'
                )}
                aria-hidden="true"
            >
                {achievement.icon}
            </span>
            <div className="flex-1 text-left">
                <p className={cn(
                    "text-xs font-medium",
                    unlocked ? 'text-amber-800' : 'text-gray-600'
                )}>
                    {unlocked ? achievement.name : '???'}
                </p>
                {!unlocked && progress !== undefined && (
                    <div
                        className="h-1 bg-gray-200 rounded-full mt-1 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progresso: ${progressPercent}%`}
                    >
                        <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                )}
            </div>
            {unlocked ? (
                <Unlock className="h-3 w-3 text-amber-500" aria-hidden="true" />
            ) : (
                <Lock className="h-3 w-3 text-gray-400" aria-hidden="true" />
            )}
        </button>
    );
}
