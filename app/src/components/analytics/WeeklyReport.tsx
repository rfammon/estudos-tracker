import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, Zap, TrendingUp, TrendingDown, Trophy } from 'lucide-react';
import { WeeklyReport as WeeklyReportType } from '@/types/analytics';
import { formatDuration } from '@/lib/utils';
import { clsx } from 'clsx';

interface WeeklyReportProps {
    report: WeeklyReportType;
    previousReport?: WeeklyReportType;
}

export function WeeklyReport({ report }: WeeklyReportProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    const improvementLabel = useMemo(() => {
        if (report.improvement > 0) return `+${report.improvement}%`;
        if (report.improvement < 0) return `${report.improvement}%`;
        return '0%';
    }, [report.improvement]);

    const improvementColor = useMemo(() => {
        if (report.improvement > 0) return 'text-emerald-500';
        if (report.improvement < 0) return 'text-red-500';
        return 'text-muted-foreground';
    }, [report.improvement]);

    return (
        <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
            <CardHeader className="border-b border-border/20">
                <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
                        Relatório Semanal
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-card border-border/20 p-4 rounded-xl bg-card/5 text-center">
                        <Clock className="h-5 w-5 text-primary/40 mx-auto mb-2" aria-hidden="true" />
                        <p className="text-2xl font-black text-foreground">
                            {formatDuration(report.totalStudyTime)}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Tempo Total</p>
                    </div>

                    <div className="glass-card border-border/20 p-4 rounded-xl bg-card/5 text-center">
                        <Target className="h-5 w-5 text-emerald-500/40 mx-auto mb-2" aria-hidden="true" />
                        <p className="text-2xl font-black text-foreground">
                            {report.sessionsCount}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Sessões</p>
                    </div>

                    <div className="glass-card border-border/20 p-4 rounded-xl bg-card/5 text-center">
                        <Zap className="h-5 w-5 text-yellow-500/40 mx-auto mb-2" aria-hidden="true" />
                        <p className="text-2xl font-black text-foreground">
                            {report.xpEarned}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">XP Ganho</p>
                    </div>

                    <div className="glass-card border-border/20 p-4 rounded-xl bg-card/5 text-center">
                        <Trophy className="h-5 w-5 text-orange-500/40 mx-auto mb-2" aria-hidden="true" />
                        <p className="text-2xl font-black text-foreground">
                            {report.streakDays}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Dias Ativos</p>
                    </div>
                </div>

                {/* Improvement Indicator */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-card/5 border border-border/20">
                    <div className="flex items-center gap-3">
                        {report.improvement > 0 ? (
                            <TrendingUp className="h-6 w-6 text-emerald-500" aria-hidden="true" />
                        ) : report.improvement < 0 ? (
                            <TrendingDown className="h-6 w-6 text-red-500" aria-hidden="true" />
                        ) : (
                            <div className="h-6 w-6 text-muted-foreground" aria-hidden="true">−</div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-foreground">Comparação com Semana Anterior</p>
                            <p className="text-xs text-muted-foreground">
                                {report.improvement > 0
                                    ? 'Você estudou mais esta semana!'
                                    : report.improvement < 0
                                        ? 'Tente melhorar na próxima semana'
                                        : 'Manteve o mesmo ritmo'}
                            </p>
                        </div>
                    </div>
                    <span className={clsx("text-xl font-black", improvementColor)}>
                        {improvementLabel}
                    </span>
                </div>

                {/* Top Topics */}
                {report.topTopics.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                            Tópicos Mais Estudados
                        </h3>
                        <ul className="space-y-2" role="list">
                            {report.topTopics.map((topic, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-card/5 border border-border/20"
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-foreground">{topic}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Objectives Completed */}
                {report.objectivesCompleted > 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Target className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                        <div>
                            <p className="font-medium text-foreground">
                                {report.objectivesCompleted} objetivo{report.objectivesCompleted > 1 ? 's' : ''} completado{report.objectivesCompleted > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-muted-foreground">Continue assim!</p>
                        </div>
                    </div>
                )}

                {/* Average Session Duration */}
                <div className="text-center text-sm text-muted-foreground">
                    Média de {formatDuration(report.averageSessionDuration)} por sessão
                </div>

                {/* Accessible summary for screen readers */}
                <div className="sr-only" role="region" aria-label="Resumo do relatório semanal">
                    <p>
                        Relatório da semana de {formatDate(report.weekStart)} a {formatDate(report.weekEnd)}:
                        {report.totalStudyTime > 0 && ` Tempo total de estudo: ${formatDuration(report.totalStudyTime)}.`}
                        {report.sessionsCount > 0 && ` ${report.sessionsCount} sessões realizadas.`}
                        {report.xpEarned > 0 && ` ${report.xpEarned} XP ganhos.`}
                        {report.streakDays > 0 && ` ${report.streakDays} dias ativos.`}
                        {report.objectivesCompleted > 0 && ` ${report.objectivesCompleted} objetivos completados.`}
                        {report.improvement !== 0 && ` ${report.improvement > 0 ? 'Aumento' : 'Redução'} de ${Math.abs(report.improvement)}% em relação à semana anterior.`}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
