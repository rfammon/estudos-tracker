import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { GoalProgressData } from '@/types/analytics';
import { formatDuration } from '@/lib/utils';
import { clsx } from 'clsx';

interface GoalProgressProps {
    goals: GoalProgressData[];
}

const GOAL_LABELS = {
    daily: 'Diária',
    weekly: 'Semanal',
    monthly: 'Mensal',
};

const GOAL_ICONS = {
    daily: Clock,
    weekly: Target,
    monthly: CheckCircle,
};

export function GoalProgress({ goals }: GoalProgressProps) {
    const overallProgress = useMemo(() => {
        const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
        const totalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
        return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
    }, [goals]);

    const goalsOnTrack = useMemo(() => {
        return goals.filter(g => g.isOnTrack).length;
    }, [goals]);

    return (
        <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
            <CardHeader className="border-b border-border/20">
                <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                        Progresso de Metas
                    </div>
                    <span className={clsx(
                        "text-sm font-medium",
                        goalsOnTrack === goals.length ? "text-emerald-500" : "text-yellow-500"
                    )}>
                        {goalsOnTrack}/{goals.length} no alvo
                    </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Acompanhe suas metas de estudo
                </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* Overall Progress */}
                <div className="text-center p-4 rounded-xl bg-card/5 border border-border/20">
                    <p className="text-4xl font-black text-foreground mb-2">{overallProgress}%</p>
                    <p className="text-sm text-muted-foreground">Progresso Geral</p>
                    <div
                        className="mt-3 h-3 rounded-full bg-muted/10 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={overallProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Progresso geral das metas: ${overallProgress}%`}
                    >
                        <div
                            className={clsx(
                                "h-full rounded-full transition-all duration-700",
                                overallProgress >= 100 ? "bg-emerald-500" : overallProgress >= 50 ? "bg-primary" : "bg-yellow-500"
                            )}
                            style={{ width: `${Math.min(overallProgress, 100)}%` }}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* Individual Goals */}
                <div className="space-y-4">
                    {goals.map((goal) => {
                        const Icon = GOAL_ICONS[goal.type];
                        const isComplete = goal.percentage >= 100;

                        return (
                            <div
                                key={goal.type}
                                className={clsx(
                                    "p-4 rounded-xl border transition-all duration-300",
                                    isComplete
                                        ? "bg-emerald-500/10 border-emerald-500/20"
                                        : goal.isOnTrack
                                            ? "bg-card/5 border-border/20"
                                            : "bg-yellow-500/10 border-yellow-500/20"
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {isComplete ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                                        ) : goal.isOnTrack ? (
                                            <Icon className="h-5 w-5 text-primary/40" aria-hidden="true" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                                        )}
                                        <div>
                                            <p className="font-medium text-foreground">
                                                Meta {GOAL_LABELS[goal.type]}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDuration(goal.current * 60)} de {formatDuration(goal.target * 60)}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={clsx(
                                            "text-lg font-black",
                                            isComplete ? "text-emerald-500" : goal.isOnTrack ? "text-foreground" : "text-yellow-500"
                                        )}
                                    >
                                        {goal.percentage}%
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div
                                    className="h-2 rounded-full bg-muted/10 overflow-hidden"
                                    role="progressbar"
                                    aria-valuenow={goal.percentage}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`Meta ${GOAL_LABELS[goal.type]}: ${goal.percentage}%`}
                                >
                                    <div
                                        className={clsx(
                                            "h-full rounded-full transition-all duration-500",
                                            isComplete ? "bg-emerald-500" : goal.isOnTrack ? "bg-primary" : "bg-yellow-500"
                                        )}
                                        style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* Remaining time */}
                                {!isComplete && goal.remainingMinutes > 0 && (
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                        Faltam {formatDuration(goal.remainingMinutes * 60)} para atingir a meta
                                    </p>
                                )}

                                {/* Completion message */}
                                {isComplete && (
                                    <p className="text-xs text-emerald-500 mt-2 text-center font-medium">
                                        ✓ Meta atingida!
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Accessible summary for screen readers */}
                <div className="sr-only" role="region" aria-label="Resumo do progresso de metas">
                    <p>
                        Progresso geral das metas: {overallProgress}%.
                        {goals.map(goal => (
                            ` Meta ${GOAL_LABELS[goal.type]}: ${goal.current} de ${goal.target} minutos (${goal.percentage}%).`
                        )).join('')}
                        {goalsOnTrack} de {goals.length} metas no alvo.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
