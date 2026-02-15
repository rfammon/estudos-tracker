import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore, useSessionStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { clsx } from 'clsx';
import {
    ArrowLeft,
    TrendingUp,
    Clock,
    Target,
    BookOpen,
    Calendar,
    Trophy
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types';
import { usePageAnnouncement } from '@/hooks/useAnnouncement';
import { LeaderboardView } from '@/components/leaderboard';

type PeriodFilter = 'week' | 'month' | 'all';

export function Evolution() {
    const navigate = useNavigate();
    const { topics } = useTopicStore();
    const { sessions, getEvolutionData, getTotalTime, getTodayTime, getTotalTimeByTopic } = useSessionStore();

    // Accessibility: Announce page on load
    usePageAnnouncement('Evolução - Métricas e Performance');

    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('week');

    const days = periodFilter === 'week' ? 7 : periodFilter === 'month' ? 30 : 90;

    const evolutionData = useMemo(() => {
        return getEvolutionData(days);
    }, [sessions, days]);

    const totalTime = getTotalTime();
    const todayTime = getTodayTime();
    const overallProgress = topics.length > 0
        ? Math.round(topics.reduce((sum, t) => sum + t.progress, 0) / topics.length)
        : 0;

    const maxMinutes = Math.max(...evolutionData.map(d => d.total), 1);
    const averageMinutes = Math.round(evolutionData.reduce((sum, d) => sum + d.total, 0) / evolutionData.length);

    // Calculate streak (days with study)
    const streak = useMemo(() => {
        let currentStreak = 0;
        const data = getEvolutionData(30);
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].total > 0) {
                currentStreak++;
            } else if (i < data.length - 1) {
                break;
            }
        }
        return currentStreak;
    }, [sessions]);

    // Generate accessible chart description
    const chartDescription = useMemo(() => {
        const totalMinutes = evolutionData.reduce((sum, d) => sum + d.total, 0);
        const maxDay = evolutionData.reduce((max, d) => d.total > max.total ? d : max, evolutionData[0]);
        const daysWithStudy = evolutionData.filter(d => d.total > 0).length;

        return `Gráfico de evolução de estudos nos últimos ${days} dias. ` +
            `Total de ${formatDuration(totalMinutes * 60)} estudados em ${daysWithStudy} dias. ` +
            `Média diária de ${averageMinutes} minutos. ` +
            `O dia com mais estudo foi ${maxDay.date} com ${maxDay.total} minutos.`;
    }, [evolutionData, days, averageMinutes]);

    // Generate accessible table data for screen readers
    const chartTableData = useMemo(() => {
        return evolutionData.map(d => ({
            date: d.date,
            minutes: d.total,
            formatted: formatDuration(d.total * 60)
        }));
    }, [evolutionData]);

    // Count topics by status
    const topicsInProgress = topics.filter(t => t.status === 'em_progresso').length;
    const topicsMastered = topics.filter(t => t.status === 'dominado').length;
    const topicsNotStarted = topics.filter(t => t.status === 'nao_iniciado').length;

    return (
        <div className="space-y-6" role="region" aria-label="Página de Evolução">
            <header className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Voltar para página anterior"
                >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                <div>
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40 italic">
                        Evolução
                    </h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Métricas e performance</p>
                </div>
            </header>

            {/* Period Filter */}
            <nav className="flex justify-end" aria-label="Filtro de período">
                <Select
                    value={periodFilter}
                    onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}
                    aria-label="Selecionar período de análise"
                >
                    <SelectTrigger className="w-[180px] bg-muted/30 border-border/20 rounded-xl focus-visible:ring-2 focus-visible:ring-ring">
                        <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                        <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border/20">
                        <SelectItem value="week">Última semana</SelectItem>
                        <SelectItem value="month">Último mês</SelectItem>
                        <SelectItem value="all">Todo o período</SelectItem>
                    </SelectContent>
                </Select>
            </nav>

            {/* Summary Cards */}
            <section
                className="grid gap-6 md:grid-cols-4"
                aria-label="Resumo de estatísticas"
            >
                <article
                    className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5"
                    aria-labelledby="total-time-title"
                >
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h2 id="total-time-title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tempo Total</h2>
                        <Clock className="h-4 w-4 text-primary/40" aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-3xl font-black tracking-tighter text-foreground" aria-label={`${formatDuration(totalTime)} de tempo total estudado`}>
                        {formatDuration(totalTime)}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">TEMPO ESTUDADO</p>
                </article>

                <article
                    className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5"
                    aria-labelledby="today-time-title"
                >
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h2 id="today-time-title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hoje</h2>
                        <Clock className="h-4 w-4 text-emerald-500/40" aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-3xl font-black tracking-tighter text-foreground" aria-label={`${formatDuration(todayTime)} estudados hoje`}>
                        {formatDuration(todayTime)}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">TEMPO DE HOJE</p>
                </article>

                <article
                    className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5"
                    aria-labelledby="average-title"
                >
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h2 id="average-title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Média Diária</h2>
                        <TrendingUp className="h-4 w-4 text-blue-500/40" aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-3xl font-black tracking-tighter text-foreground" aria-label={`${averageMinutes} minutos de média diária`}>
                        {averageMinutes} min
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">POR DIA</p>
                </article>

                <article
                    className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5"
                    aria-labelledby="streak-title"
                >
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h2 id="streak-title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sequência</h2>
                        <Target className="h-4 w-4 text-orange-500/40" aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-3xl font-black tracking-tighter text-foreground" aria-label={`${streak} dias consecutivos de estudo`}>
                        {streak} dias
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">DIAS CONSECUTIVOS</p>
                </article>
            </section>

            {/* Evolution Chart */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="border-b border-border/20">
                    <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                        Evolução do Estudo
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-10">
                    {/* Accessible description for screen readers */}
                    <p className="sr-only">{chartDescription}</p>

                    {/* Visual chart for sighted users */}
                    <div
                        className="h-64 flex items-end justify-between gap-1.5"
                        role="img"
                        aria-label="Gráfico de barras mostrando tempo de estudo por dia"
                        aria-describedby="chart-description"
                    >
                        {evolutionData.map((data, index) => (
                            <div
                                key={index}
                                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                                role="listitem"
                            >
                                <div
                                    className="w-full bg-gradient-to-t from-primary/40 to-primary rounded-t-lg transition-all duration-500 hover:scale-x-105 hover:from-primary/60 hover:to-blue-400 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                                    style={{
                                        height: `${Math.max((data.total / maxMinutes) * 100, data.total > 0 ? 5 : 0)}%`,
                                        minHeight: data.total > 0 ? '4px' : '0'
                                    }}
                                    role="presentation"
                                    aria-hidden="true"
                                />
                                <span className="text-[10px] font-black text-muted-foreground rotate-45 origin-left whitespace-nowrap" aria-hidden="true">
                                    {data.date}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Accessible data table for screen readers (hidden visually) */}
                    <table className="sr-only" id="chart-description">
                        <caption>Tempo de estudo por dia nos últimos {days} dias</caption>
                        <thead>
                            <tr>
                                <th scope="col">Data</th>
                                <th scope="col">Tempo (minutos)</th>
                                <th scope="col">Tempo formatado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartTableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.date}</td>
                                    <td>{row.minutes}</td>
                                    <td>{row.formatted}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Topic Progress */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="border-b border-border/20 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" aria-hidden="true" />
                        Progresso por Matéria
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {topics.length === 0 ? (
                        <div
                            className="text-center py-8"
                            role="status"
                            aria-label="Nenhuma matéria cadastrada"
                        >
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                            <p className="text-muted-foreground">
                                Nenhuma matéria cadastrada
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Crie matérias para acompanhar seu progresso
                            </p>
                        </div>
                    ) : (
                        <ul
                            className="space-y-4"
                            role="list"
                            aria-label="Lista de progresso por matéria"
                        >
                            {topics
                                .sort((a, b) => b.progress - a.progress)
                                .map((topic) => {
                                    const topicTime = getTotalTimeByTopic(topic.id);
                                    return (
                                        <li
                                            key={topic.id}
                                            className="space-y-2"
                                            role="listitem"
                                            aria-labelledby={`topic-${topic.id}-name`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        id={`topic-${topic.id}-name`}
                                                        className="font-medium"
                                                    >
                                                        {topic.name}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        aria-label={`Categoria: ${CATEGORY_LABELS[topic.category]}`}
                                                    >
                                                        {CATEGORY_LABELS[topic.category]}
                                                    </Badge>
                                                    <Badge
                                                        variant={topic.status === 'dominado' ? 'success' : topic.status === 'em_progresso' ? 'info' : 'secondary'}
                                                        aria-label={`Status: ${STATUS_LABELS[topic.status]}`}
                                                    >
                                                        {STATUS_LABELS[topic.status]}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span aria-label={`${formatDuration(topicTime)} de ${topic.targetHours} horas`}>
                                                        {formatDuration(topicTime)} / {topic.targetHours}h
                                                    </span>
                                                    <span
                                                        className="font-medium"
                                                        aria-label={`${topic.progress}% completo`}
                                                    >
                                                        {topic.progress}%
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Progress bar with ARIA */}
                                            <div
                                                className="flex gap-1 h-2"
                                                role="progressbar"
                                                aria-valuenow={topic.progress}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-label={`Progresso de ${topic.name}: ${topic.progress}%`}
                                                aria-labelledby={`topic-${topic.id}-name`}
                                            >
                                                {[...Array(10)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={clsx(
                                                            "flex-1 rounded-sm transition-all duration-500",
                                                            i < Math.floor(topic.progress / 10)
                                                                ? "bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                                                : "bg-muted/10"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="border-b border-border/20 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" aria-hidden="true" />
                        Progresso Geral
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground" id="overall-progress-label">Geral</span>
                            <span
                                className="font-medium"
                                aria-label={`${overallProgress}% de progresso geral`}
                            >
                                {overallProgress}%
                            </span>
                        </div>
                        {/* Overall progress bar with ARIA */}
                        <div
                            className="flex gap-1 h-3"
                            role="progressbar"
                            aria-valuenow={overallProgress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Progresso geral de todas as matérias"
                            aria-labelledby="overall-progress-label"
                        >
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        "flex-1 rounded-sm transition-all duration-700",
                                        i < Math.floor(overallProgress / 5)
                                            ? "bg-gradient-to-t from-primary to-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                                            : "bg-muted/10"
                                    )}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Statistics summary */}
                    <dl
                        className="grid grid-cols-3 gap-4 text-center"
                        aria-label="Resumo de matérias por status"
                    >
                        <div>
                            <dt className="text-xs text-muted-foreground">Total</dt>
                            <dd className="text-2xl font-bold" aria-label={`${topics.length} matérias no total`}>
                                {topics.length}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-muted-foreground">Em Progresso</dt>
                            <dd className="text-2xl font-bold" aria-label={`${topicsInProgress} matérias em progresso`}>
                                {topicsInProgress}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-muted-foreground">Dominadas</dt>
                            <dd className="text-2xl font-bold" aria-label={`${topicsMastered} matérias dominadas`}>
                                {topicsMastered}
                            </dd>
                        </div>
                    </dl>

                    {/* Additional stats for screen readers */}
                    <p className="sr-only">
                        Resumo: {topics.length} matérias cadastradas, sendo {topicsInProgress} em progresso,
                        {topicsMastered} dominadas e {topicsNotStarted} não iniciadas.
                    </p>
                </CardContent>
            </Card>

            {/* Leaderboard Section */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="border-b border-border/20 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                        Ranking
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Compare seu progresso com outros estudantes
                    </p>
                </CardHeader>
                <CardContent className="pt-6">
                    <LeaderboardView
                        initialPeriod="weekly"
                        initialCategory="xp"
                        showUserCard={true}
                        maxEntries={10}
                        compact={false}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
