import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, TrendingUp, Lightbulb, Award, AlertTriangle } from 'lucide-react';
import { LearningMetrics as LearningMetricsType, BloomLevelProgress } from '@/types/analytics';
import { BLOOM_LEVEL_LABELS, BLOOM_LEVEL_COLORS } from '@/types/topic';
import { clsx } from 'clsx';

interface LearningMetricsProps {
    metrics: LearningMetricsType | null;
    bloomLevelProgress: BloomLevelProgress[];
}

export function LearningMetrics({ metrics, bloomLevelProgress }: LearningMetricsProps) {
    const retentionColor = useMemo(() => {
        if (!metrics) return 'text-muted-foreground';
        if (metrics.retentionRate >= 80) return 'text-emerald-500';
        if (metrics.retentionRate >= 50) return 'text-yellow-500';
        return 'text-red-500';
    }, [metrics]);

    const assessmentColor = useMemo(() => {
        if (!metrics) return 'text-muted-foreground';
        if (metrics.averageAssessmentScore >= 80) return 'text-emerald-500';
        if (metrics.averageAssessmentScore >= 60) return 'text-yellow-500';
        return 'text-red-500';
    }, [metrics]);

    if (!metrics) {
        return (
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="border-b border-border/20">
                    <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" aria-hidden="true" />
                        Métricas de Aprendizagem
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                        <p className="text-muted-foreground">
                            Dados insuficientes para calcular métricas
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Continue estudando para ver suas métricas
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
            <CardHeader className="border-b border-border/20">
                <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" aria-hidden="true" />
                    Métricas de Aprendizagem
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Análise do seu desempenho e progresso
                </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* Main Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Retention Rate */}
                    <div className="glass-card border-border/20 p-4 rounded-xl bg-card/5 text-center">
                        <Target className="h-5 w-5 text-primary/40 mx-auto mb-2" aria-hidden="true" />
                        <p className={clsx("text-3xl font-black", retentionColor)}>
                            {metrics.retentionRate}%
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Taxa de Retenção</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {metrics.retentionRate >= 80 ? 'Excelente!' : metrics.retentionRate >= 50 ? 'Bom' : 'Precisa melhorar'}
                        </p>
                    </div>

                    {/* Average Assessment Score */}
                    <div className="glass-card border-border/20 p-4 rounded-xl bg-card/5 text-center">
                        <Award className="h-5 w-5 text-yellow-500/40 mx-auto mb-2" aria-hidden="true" />
                        <p className={clsx("text-3xl font-black", assessmentColor)}>
                            {metrics.averageAssessmentScore}%
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Média Avaliações</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {metrics.averageAssessmentScore >= 80 ? 'Excelente!' : metrics.averageAssessmentScore >= 60 ? 'Bom' : 'Precisa melhorar'}
                        </p>
                    </div>
                </div>

                {/* Strongest Topics */}
                {metrics.strongestTopics.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                            Tópicos Mais Fortes
                        </h3>
                        <ul className="space-y-2" role="list">
                            {metrics.strongestTopics.map((topic, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-foreground">{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Weakest Topics */}
                {metrics.weakestTopics.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" aria-hidden="true" />
                            Tópicos que Precisam de Atenção
                        </h3>
                        <ul className="space-y-2" role="list">
                            {metrics.weakestTopics.map((topic, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20"
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 text-xs font-bold">
                                        !
                                    </span>
                                    <span className="font-medium text-foreground">{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommendations */}
                {metrics.recommendedFocus.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                            Recomendações
                        </h3>
                        <ul className="space-y-2" role="list">
                            {metrics.recommendedFocus.map((rec, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                                >
                                    <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0" aria-hidden="true" />
                                    <span className="text-sm text-foreground">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Bloom's Taxonomy Progress */}
                {bloomLevelProgress.some(p => p.totalObjectives > 0) && (
                    <div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                            Progresso por Nível Cognitivo
                        </h3>
                        <div className="space-y-3">
                            {bloomLevelProgress.map((progress) => {
                                if (progress.totalObjectives === 0) return null;
                                const colors = BLOOM_LEVEL_COLORS[progress.level];
                                return (
                                    <div key={progress.level} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className={clsx("text-sm font-medium", colors.text)}>
                                                {BLOOM_LEVEL_LABELS[progress.level]}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {progress.completedObjectives}/{progress.totalObjectives}
                                            </span>
                                        </div>
                                        <div
                                            className="h-2 rounded-full bg-muted/10 overflow-hidden"
                                            role="progressbar"
                                            aria-valuenow={progress.percentage}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-label={`Progresso em ${BLOOM_LEVEL_LABELS[progress.level]}: ${progress.percentage}%`}
                                        >
                                            <div
                                                className={clsx("h-full rounded-full transition-all duration-500", colors.bg)}
                                                style={{ width: `${progress.percentage}%` }}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Accessible summary for screen readers */}
                <div className="sr-only" role="region" aria-label="Resumo das métricas de aprendizagem">
                    <p>
                        Métricas de aprendizagem:
                        Taxa de retenção de {metrics.retentionRate}%.
                        Média de {metrics.averageAssessmentScore}% nas avaliações.
                        {metrics.strongestTopics.length > 0 && ` Tópicos mais fortes: ${metrics.strongestTopics.join(', ')}.`}
                        {metrics.weakestTopics.length > 0 && ` Tópicos que precisam de atenção: ${metrics.weakestTopics.join(', ')}.`}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
