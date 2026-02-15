import { useMemo } from 'react';
import { LearningObjective, BloomLevel, BLOOM_LEVEL_LABELS, BLOOM_LEVEL_COLORS, BLOOM_LEVEL_XP } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Award, Sparkles } from 'lucide-react';

interface ProgressData {
    completed: number;
    total: number;
    percentage: number;
    totalXP?: number;
    byLevel?: Record<BloomLevel, { completed: number; total: number }>;
}

interface ObjectiveProgressProps {
    objectives?: LearningObjective[];
    progress?: ProgressData;
    title?: string;
    showTitle?: boolean;
    showBloomBreakdown?: boolean;
    showXpSummary?: boolean;
    compact?: boolean;
}

export function ObjectiveProgress({
    objectives,
    progress: providedProgress,
    title = 'Progresso dos Objetivos',
    showTitle = true,
    showBloomBreakdown = true,
    showXpSummary = true,
    compact = false,
}: ObjectiveProgressProps) {
    // Calculate overall progress from objectives if not provided
    const progress = useMemo(() => {
        if (providedProgress) {
            return providedProgress;
        }
        if (!objectives) {
            return { total: 0, completed: 0, percentage: 0, totalXP: 0, byLevel: {} as Record<BloomLevel, { completed: number; total: number }> };
        }
        const total = objectives.length;
        const completed = objectives.filter((o) => o.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Calculate total XP
        const totalXP = objectives
            .filter((o) => o.completed)
            .reduce((sum, o) => sum + BLOOM_LEVEL_XP[o.bloomLevel], 0);

        // Calculate by Bloom level
        const levels: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
        const byLevel: Record<BloomLevel, { completed: number; total: number }> = {} as Record<BloomLevel, { completed: number; total: number }>;

        levels.forEach((level) => {
            const levelObjectives = objectives.filter((o) => o.bloomLevel === level);
            byLevel[level] = {
                total: levelObjectives.length,
                completed: levelObjectives.filter((o) => o.completed).length,
            };
        });

        return { total, completed, percentage, totalXP, byLevel };
    }, [objectives, providedProgress]);

    // Calculate progress by Bloom level
    const bloomProgress = useMemo(() => {
        const levels: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

        if (progress.byLevel) {
            return levels
                .map((level) => {
                    const levelData = progress.byLevel![level];
                    return {
                        level,
                        total: levelData.total,
                        completed: levelData.completed,
                        percentage: levelData.total > 0 ? Math.round((levelData.completed / levelData.total) * 100) : 0,
                    };
                })
                .filter((l) => l.total > 0);
        }

        if (!objectives) return [];

        return levels.map((level) => {
            const levelObjectives = objectives.filter((o) => o.bloomLevel === level);
            const total = levelObjectives.length;
            const completed = levelObjectives.filter((o) => o.completed).length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            return {
                level,
                total,
                completed,
                percentage,
            };
        }).filter((l) => l.total > 0);
    }, [objectives, progress.byLevel]);

    // Calculate XP
    const xpSummary = useMemo(() => {
        if (!objectives) {
            return { earned: progress.totalXP || 0, potential: 0 };
        }

        const earned = objectives
            .filter((o) => o.completed)
            .reduce((sum, o) => sum + BLOOM_LEVEL_XP[o.bloomLevel], 0);

        const potential = objectives.reduce((sum, o) => sum + BLOOM_LEVEL_XP[o.bloomLevel], 0);

        return { earned, potential };
    }, [objectives, progress.totalXP]);

    if (progress.total === 0) {
        return null;
    }

    if (compact) {
        return (
            <div
                className="flex items-center gap-4 p-3 rounded-xl bg-muted/20 border border-border/20"
                role="region"
                aria-label="Progresso dos objetivos"
            >
                <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Objetivos
                    </span>
                </div>
                <div className="flex-1">
                    <div
                        className="relative h-2 w-full bg-muted/30 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${progress.completed} de ${progress.total} objetivos concluídos`}
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-foreground">
                        {progress.completed}/{progress.total}
                    </span>
                    <Badge
                        className={`text-[9px] font-black rounded-full ${progress.percentage === 100
                            ? 'bg-emerald-500 text-white'
                            : 'bg-primary/10 text-primary'
                            }`}
                    >
                        {progress.percentage}%
                    </Badge>
                </div>
            </div>
        );
    }

    return (
        <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
            {showTitle && (
                <CardHeader className="pb-4 border-b border-border/20">
                    <CardTitle className="text-lg font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" aria-hidden="true" />
                        {title}
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent className="pt-6 space-y-6">
                {/* Overall Progress */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Progresso Geral
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-foreground">
                                {progress.completed}/{progress.total}
                            </span>
                            <Badge
                                className={`text-[10px] font-black uppercase tracking-wider rounded-full ${progress.percentage === 100
                                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    : progress.percentage >= 50
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {progress.percentage}%
                            </Badge>
                        </div>
                    </div>
                    <div
                        className="relative h-3 w-full bg-muted/20 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${progress.completed} de ${progress.total} objetivos concluídos`}
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>

                {/* XP Summary */}
                {showXpSummary && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                <Sparkles className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    XP Ganho
                                </p>
                                <p className="text-lg font-black text-foreground">
                                    {xpSummary.earned} <span className="text-sm text-muted-foreground">/ {xpSummary.potential}</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Potencial restante</p>
                            <p className="text-lg font-black text-yellow-500">
                                +{xpSummary.potential - xpSummary.earned} XP
                            </p>
                        </div>
                    </div>
                )}

                {/* Bloom Level Breakdown */}
                {showBloomBreakdown && bloomProgress.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Por Nível Cognitivo
                            </span>
                        </div>
                        <div className="space-y-2">
                            {bloomProgress.map(({ level, total, completed, percentage }) => {
                                const colors = BLOOM_LEVEL_COLORS[level];
                                return (
                                    <div key={level} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-bold ${colors.text}`}>
                                                {BLOOM_LEVEL_LABELS[level]}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {completed}/{total}
                                            </span>
                                        </div>
                                        <div
                                            className={`relative h-2 w-full rounded-full overflow-hidden ${colors.bg}`}
                                            role="progressbar"
                                            aria-valuenow={percentage}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`${completed} de ${total} objetivos de ${BLOOM_LEVEL_LABELS[level]} concluídos`}
                                        >
                                            <div
                                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${colors.bg.replace('/10', '/50')}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
