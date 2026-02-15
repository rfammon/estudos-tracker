import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { WeeklyXPData } from '@/types/analytics';
import { clsx } from 'clsx';

interface XPProgressChartProps {
    data: WeeklyXPData[];
    title?: string;
}

export function XPProgressChart({ data, title = 'Progresso de XP' }: XPProgressChartProps) {
    const maxXp = useMemo(() => {
        return Math.max(...data.map(d => d.xpEarned), 1);
    }, [data]);

    const totalXp = useMemo(() => {
        return data.reduce((sum, d) => sum + d.xpEarned, 0);
    }, [data]);

    const averageXp = useMemo(() => {
        return Math.round(totalXp / data.length);
    }, [totalXp, data]);

    const trend = useMemo(() => {
        if (data.length < 2) return 'stable';
        const lastWeek = data[data.length - 1].xpEarned;
        const previousWeek = data[data.length - 2].xpEarned;
        if (lastWeek > previousWeek * 1.1) return 'up';
        if (lastWeek < previousWeek * 0.9) return 'down';
        return 'stable';
    }, [data]);

    const trendPercentage = useMemo(() => {
        if (data.length < 2) return 0;
        const lastWeek = data[data.length - 1].xpEarned;
        const previousWeek = data[data.length - 2].xpEarned;
        if (previousWeek === 0) return lastWeek > 0 ? 100 : 0;
        return Math.round(((lastWeek - previousWeek) / previousWeek) * 100);
    }, [data]);

    // Generate accessible description
    const chartDescription = useMemo(() => {
        if (!data || data.length === 0) {
            return `Gráfico de XP ganho por semana. Nenhum dado disponível no momento.`;
        }
        const maxWeek = data.reduce((max, d) => d.xpEarned > max.xpEarned ? d : max, data[0]);
        return `Gráfico de XP ganho por semana nas últimas ${data.length} semanas. ` +
            `Total de ${totalXp} XP ganhos. ` +
            `Média semanal de ${averageXp} XP. ` +
            `A semana com mais XP foi "${maxWeek.weekLabel}" com ${maxWeek.xpEarned} XP.`;
    }, [data, totalXp, averageXp]);

    return (
        <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
            <CardHeader className="border-b border-border/20">
                <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                        {title}
                    </div>
                    {trend !== 'stable' && (
                        <div className={clsx(
                            "flex items-center gap-1 text-sm font-medium",
                            trend === 'up' ? "text-emerald-500" : "text-red-500"
                        )}>
                            {trend === 'up' ? (
                                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <TrendingDown className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span>{Math.abs(trendPercentage)}%</span>
                        </div>
                    )}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Últimas {data.length} semanas • Total: {totalXp} XP
                </p>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Accessible description for screen readers */}
                <p className="sr-only">{chartDescription}</p>

                {/* Visual chart for sighted users */}
                <div
                    className="h-40 flex items-end justify-between gap-2"
                    role="img"
                    aria-label="Gráfico de barras mostrando XP ganho por semana"
                >
                    {data.map((week, index) => (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                            role="listitem"
                        >
                            <div
                                className={clsx(
                                    "w-full rounded-t transition-all duration-500 hover:scale-x-105",
                                    week.xpEarned > 0
                                        ? "bg-gradient-to-t from-yellow-500/40 to-yellow-400 hover:from-yellow-500/60 hover:to-amber-400 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                                        : "bg-muted/5"
                                )}
                                style={{
                                    height: `${Math.max((week.xpEarned / maxXp) * 100, week.xpEarned > 0 ? 8 : 0)}%`,
                                    minHeight: week.xpEarned > 0 ? '8px' : '0'
                                }}
                                title={`${week.weekLabel}: ${week.xpEarned} XP`}
                                aria-hidden="true"
                            />
                            <span className="text-[9px] font-bold text-muted-foreground text-center leading-tight" aria-hidden="true">
                                {week.weekLabel.split(' - ')[0]}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Accessible data table for screen readers */}
                <table className="sr-only">
                    <caption>XP ganho por semana nas últimas {data.length} semanas</caption>
                    <thead>
                        <tr>
                            <th scope="col">Semana</th>
                            <th scope="col">XP Ganho</th>
                            <th scope="col">Sessões</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((week, index) => (
                            <tr key={index}>
                                <td>{week.weekLabel}</td>
                                <td>{week.xpEarned}</td>
                                <td>{week.sessionsCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary stats */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-black text-foreground">{totalXp}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">XP Total</p>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-foreground">{averageXp}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Média/Semana</p>
                    </div>
                    <div>
                        <p className={clsx(
                            "text-2xl font-black",
                            trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-red-500" : "text-foreground"
                        )}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'}
                            {Math.abs(trendPercentage)}%
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Tendência</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
