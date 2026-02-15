import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Calendar,
    Download,
    RefreshCw,
    Lightbulb,
    TrendingUp,
    Clock,
    Target,
    Zap,
    AlertTriangle,
    Award,
    Info,
} from 'lucide-react';
import { useAnalyticsStore } from '@/store/use-analytics-store';
import { StudyTimeChart } from './StudyTimeChart';
import { XPProgressChart } from './XPProgressChart';
import { WeeklyReport } from './WeeklyReport';
import { LearningMetrics } from './LearningMetrics';
import { TopicHeatmap } from './TopicHeatmap';
import { GoalProgress } from './GoalProgress';
import { AnalyticsFilter, StudyInsight } from '@/types/analytics';
import { formatDuration } from '@/lib/utils';
import { clsx } from 'clsx';

type PeriodFilter = 'week' | 'month' | 'quarter' | 'all';

export function AnalyticsDashboard() {
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('month');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        dailyStudyData,
        weeklyXPData,
        weeklyReports,
        learningMetrics,
        bloomLevelProgress,
        hourlyActivity,
        topicDistribution,
        goalProgress,
        insights,
        predictions,
        studyPatterns,
        calculateAllAnalytics,
        exportData,
    } = useAnalyticsStore();

    // Calculate analytics on mount and when filter changes
    useEffect(() => {
        const filter: AnalyticsFilter = {
            period: periodFilter === 'week' ? 'week' : periodFilter === 'month' ? 'month' : periodFilter === 'quarter' ? 'year' : 'all',
        };
        calculateAllAnalytics(filter);
    }, [periodFilter, calculateAllAnalytics]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        const filter: AnalyticsFilter = {
            period: periodFilter === 'week' ? 'week' : periodFilter === 'month' ? 'month' : periodFilter === 'quarter' ? 'year' : 'all',
        };
        calculateAllAnalytics(filter);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleExport = () => {
        const data = exportData('json') as ReturnType<typeof exportData>;
        if (typeof data === 'object' && 'title' in data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Get insight icon
    const getInsightIcon = (type: StudyInsight['type']) => {
        switch (type) {
            case 'achievement':
                return <Award className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
            case 'recommendation':
                return <Lightbulb className="h-5 w-5 text-blue-500" aria-hidden="true" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-orange-500" aria-hidden="true" />;
            case 'info':
            default:
                return <Info className="h-5 w-5 text-primary" aria-hidden="true" />;
        }
    };

    // Get insight background color
    const getInsightBg = (type: StudyInsight['type']) => {
        switch (type) {
            case 'achievement':
                return 'bg-yellow-500/10 border-yellow-500/20';
            case 'recommendation':
                return 'bg-blue-500/10 border-blue-500/20';
            case 'warning':
                return 'bg-orange-500/10 border-orange-500/20';
            case 'info':
            default:
                return 'bg-primary/10 border-primary/20';
        }
    };

    // Summary stats
    const summaryStats = useMemo(() => {
        const totalMinutes = dailyStudyData.reduce((sum, d) => sum + d.totalMinutes, 0);
        const totalSessions = dailyStudyData.reduce((sum, d) => sum + d.sessionsCount, 0);
        const totalXP = dailyStudyData.reduce((sum, d) => sum + d.xpEarned, 0);
        const daysWithStudy = dailyStudyData.filter(d => d.totalMinutes > 0).length;
        const averageDaily = daysWithStudy > 0 ? Math.round(totalMinutes / daysWithStudy) : 0;

        return {
            totalMinutes,
            totalSessions,
            totalXP,
            daysWithStudy,
            averageDaily,
        };
    }, [dailyStudyData]);

    return (
        <div className="space-y-6" role="region" aria-label="Dashboard de Analytics">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                        Analytics
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Visualize seu progresso e identifique padrões de estudo
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Period Filter */}
                    <Select
                        value={periodFilter}
                        onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}
                        aria-label="Selecionar período de análise"
                    >
                        <SelectTrigger className="w-[150px] bg-muted/30 border-border/20 rounded-xl">
                            <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/20">
                            <SelectItem value="week">Última semana</SelectItem>
                            <SelectItem value="month">Último mês</SelectItem>
                            <SelectItem value="quarter">Último trimestre</SelectItem>
                            <SelectItem value="all">Todo o período</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="rounded-xl border-border/20 bg-muted/30"
                        aria-label="Atualizar dados"
                    >
                        <RefreshCw
                            className={clsx("h-4 w-4", isRefreshing && "animate-spin")}
                            aria-hidden="true"
                        />
                    </Button>

                    {/* Export Button */}
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="rounded-xl border-border/20 bg-muted/30"
                        aria-label="Exportar relatório"
                    >
                        <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                        Exportar
                    </Button>
                </div>
            </header>

            {/* Summary Cards */}
            <section className="grid gap-4 md:grid-cols-4" aria-label="Resumo de estatísticas">
                <article className="glass-card border-border/20 p-4 rounded-xl bg-card/5">
                    <div className="flex items-center justify-between">
                        <Clock className="h-5 w-5 text-primary/40" aria-hidden="true" />
                        <Badge variant="outline" className="text-[10px]">Total</Badge>
                    </div>
                    <p className="text-2xl font-black text-foreground mt-2">
                        {formatDuration(summaryStats.totalMinutes * 60)}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Tempo Estudado</p>
                </article>

                <article className="glass-card border-border/20 p-4 rounded-xl bg-card/5">
                    <div className="flex items-center justify-between">
                        <BarChart3 className="h-5 w-5 text-emerald-500/40" aria-hidden="true" />
                        <Badge variant="outline" className="text-[10px]">Sessões</Badge>
                    </div>
                    <p className="text-2xl font-black text-foreground mt-2">
                        {summaryStats.totalSessions}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Total de Sessões</p>
                </article>

                <article className="glass-card border-border/20 p-4 rounded-xl bg-card/5">
                    <div className="flex items-center justify-between">
                        <Zap className="h-5 w-5 text-yellow-500/40" aria-hidden="true" />
                        <Badge variant="outline" className="text-[10px]">XP</Badge>
                    </div>
                    <p className="text-2xl font-black text-foreground mt-2">
                        {summaryStats.totalXP}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">XP Ganho</p>
                </article>

                <article className="glass-card border-border/20 p-4 rounded-xl bg-card/5">
                    <div className="flex items-center justify-between">
                        <Target className="h-5 w-5 text-orange-500/40" aria-hidden="true" />
                        <Badge variant="outline" className="text-[10px]">Média</Badge>
                    </div>
                    <p className="text-2xl font-black text-foreground mt-2">
                        {summaryStats.averageDaily} min
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Por Dia Ativo</p>
                </article>
            </section>

            {/* Insights Section */}
            {insights.length > 0 && (
                <section aria-label="Insights e recomendações">
                    <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                        <CardHeader className="border-b border-border/20">
                            <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                                Insights
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Recomendações personalizadas baseadas nos seus dados
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-3" role="list">
                                {insights.slice(0, 5).map((insight) => (
                                    <li
                                        key={insight.id}
                                        className={clsx(
                                            "flex items-start gap-3 p-4 rounded-xl border",
                                            getInsightBg(insight.type)
                                        )}
                                    >
                                        {getInsightIcon(insight.type)}
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">{insight.title}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                                            {insight.actionable && insight.actionLabel && (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="mt-2 p-0 h-auto text-primary"
                                                >
                                                    {insight.actionLabel} →
                                                </Button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <StudyTimeChart
                    data={dailyStudyData}
                    days={periodFilter === 'week' ? 7 : periodFilter === 'quarter' ? 90 : 30}
                />
                <XPProgressChart data={weeklyXPData} />
            </div>

            {/* Weekly Report */}
            {weeklyReports.length > 0 && (
                <WeeklyReport report={weeklyReports[0]} previousReport={weeklyReports[1]} />
            )}

            {/* Learning Metrics & Goal Progress Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <LearningMetrics metrics={learningMetrics} bloomLevelProgress={bloomLevelProgress} />
                <GoalProgress goals={goalProgress} />
            </div>

            {/* Topic Heatmap */}
            <TopicHeatmap hourlyActivity={hourlyActivity} topicDistribution={topicDistribution} />

            {/* Predictions Section */}
            {predictions && (
                <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                    <CardHeader className="border-b border-border/20">
                        <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                            Previsão de Conclusão
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Estimativa baseada no seu ritmo atual de estudos
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="text-center p-4 rounded-xl bg-card/5 border border-border/20">
                                <p className="text-3xl font-black text-foreground">
                                    {predictions.daysRemaining}
                                </p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Dias Restantes</p>
                            </div>

                            <div className="text-center p-4 rounded-xl bg-card/5 border border-border/20">
                                <p className="text-3xl font-black text-foreground">
                                    {predictions.currentProgress}%
                                </p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Progresso Atual</p>
                            </div>

                            <div className="text-center p-4 rounded-xl bg-card/5 border border-border/20">
                                <p className="text-3xl font-black text-foreground">
                                    {predictions.requiredDailyMinutes}
                                </p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Min/Dia Necessários</p>
                            </div>

                            <div className="text-center p-4 rounded-xl bg-card/5 border border-border/20">
                                <p className={clsx(
                                    "text-3xl font-black",
                                    predictions.isOnTrack ? "text-emerald-500" : "text-orange-500"
                                )}>
                                    {predictions.isOnTrack ? '✓' : '!'}
                                </p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                    {predictions.isOnTrack ? 'No Caminho' : 'Atenção'}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground text-center mt-4">
                            Previsão de conclusão: {predictions.estimatedDate.toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>

                        {/* Confidence indicator */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Confiança da previsão</span>
                                <span className="text-xs font-medium">{Math.round(predictions.confidence * 100)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/10 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{ width: `${predictions.confidence * 100}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Study Patterns */}
            {studyPatterns && (
                <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                    <CardHeader className="border-b border-border/20">
                        <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
                            Padrões de Estudo
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Análise dos seus hábitos de estudo
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 rounded-xl bg-card/5 border border-border/20">
                                <p className="text-sm text-muted-foreground mb-2">Melhores Horários</p>
                                <div className="flex flex-wrap gap-2">
                                    {studyPatterns.bestStudyHours.map((hour, i) => (
                                        <Badge key={i} variant="outline" className="text-primary">
                                            {hour}:00
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-card/5 border border-border/20">
                                <p className="text-sm text-muted-foreground mb-2">Dias Mais Produtivos</p>
                                <div className="flex flex-wrap gap-2">
                                    {studyPatterns.mostProductiveDays.map((day, i) => (
                                        <Badge key={i} variant="outline" className="text-emerald-500">
                                            {day}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-card/5 border border-border/20">
                                <p className="text-sm text-muted-foreground mb-2">Consistência</p>
                                <p className="text-2xl font-black text-foreground">
                                    {Math.round(studyPatterns.consistency * 100)}%
                                </p>
                            </div>
                        </div>

                        {studyPatterns.recommendations.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                    Recomendações
                                </p>
                                <ul className="space-y-2">
                                    {studyPatterns.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                            <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Accessible summary for screen readers */}
            <div className="sr-only" role="region" aria-label="Resumo do dashboard de analytics">
                <p>
                    Dashboard de Analytics - Período: {periodFilter === 'week' ? 'última semana' : periodFilter === 'month' ? 'último mês' : periodFilter === 'quarter' ? 'último trimestre' : 'todo o período'}.
                    Tempo total estudado: {formatDuration(summaryStats.totalMinutes * 60)}.
                    Total de {summaryStats.totalSessions} sessões.
                    {summaryStats.totalXP} XP ganhos.
                    Média de {summaryStats.averageDaily} minutos por dia ativo.
                    {predictions && ` Previsão de conclusão em ${predictions.daysRemaining} dias.`}
                </p>
            </div>
        </div>
    );
}
