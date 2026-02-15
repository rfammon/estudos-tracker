import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { DailyStudyData } from '@/types/analytics';
import { formatDuration } from '@/lib/utils';
import { clsx } from 'clsx';

interface StudyTimeChartProps {
    data: DailyStudyData[];
    title?: string;
    days?: number;
}

export function StudyTimeChart({ data, title = 'Tempo de Estudo', days = 30 }: StudyTimeChartProps) {
    const maxMinutes = useMemo(() => {
        return Math.max(...data.map(d => d.totalMinutes), 1);
    }, [data]);

    const totalMinutes = useMemo(() => {
        return data.reduce((sum, d) => sum + d.totalMinutes, 0);
    }, [data]);

    const averageMinutes = useMemo(() => {
        return Math.round(totalMinutes / data.length);
    }, [totalMinutes, data]);

    const daysWithStudy = useMemo(() => {
        return data.filter(d => d.totalMinutes > 0).length;
    }, [data]);

    // Generate accessible description
    const chartDescription = useMemo(() => {
        if (!data || data.length === 0) {
            return `Gráfico de tempo de estudo nos últimos ${days} dias. Nenhum dado disponível no momento.`;
        }
        const maxDay = data.reduce((max, d) => d.totalMinutes > max.totalMinutes ? d : max, data[0]);
        return `Gráfico de tempo de estudo nos últimos ${days} dias. ` +
            `Total de ${formatDuration(totalMinutes * 60)} estudados em ${daysWithStudy} dias. ` +
            `Média diária de ${averageMinutes} minutos. ` +
            `O dia com mais estudo foi ${maxDay.date} com ${maxDay.totalMinutes} minutos.`;
    }, [data, days, totalMinutes, daysWithStudy, averageMinutes]);

    return (
        <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
            <CardHeader className="border-b border-border/20">
                <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                    {title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Últimos {days} dias • Média: {averageMinutes} min/dia
                </p>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Accessible description for screen readers */}
                <p className="sr-only">{chartDescription}</p>

                {/* Visual chart for sighted users */}
                <div
                    className="h-48 flex items-end justify-between gap-1"
                    role="img"
                    aria-label="Gráfico de barras mostrando tempo de estudo por dia"
                >
                    {data.map((day, index) => (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-1 group h-full justify-end"
                            role="listitem"
                        >
                            <div
                                className={clsx(
                                    "w-full rounded-t transition-all duration-500 hover:scale-x-105",
                                    day.totalMinutes > 0
                                        ? "bg-gradient-to-t from-primary/40 to-primary hover:from-primary/60 hover:to-blue-400 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                                        : "bg-muted/5"
                                )}
                                style={{
                                    height: `${Math.max((day.totalMinutes / maxMinutes) * 100, day.totalMinutes > 0 ? 5 : 0)}%`,
                                    minHeight: day.totalMinutes > 0 ? '4px' : '0'
                                }}
                                title={`${day.date}: ${day.totalMinutes} minutos`}
                                aria-hidden="true"
                            />
                            {index % 7 === 0 && (
                                <span className="text-[9px] font-bold text-muted-foreground" aria-hidden="true">
                                    {day.date}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Accessible data table for screen readers */}
                <table className="sr-only">
                    <caption>Tempo de estudo por dia nos últimos {days} dias</caption>
                    <thead>
                        <tr>
                            <th scope="col">Data</th>
                            <th scope="col">Tempo (minutos)</th>
                            <th scope="col">Tempo formatado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((day, index) => (
                            <tr key={index}>
                                <td>{day.date}</td>
                                <td>{day.totalMinutes}</td>
                                <td>{formatDuration(day.totalMinutes * 60)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary stats */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-black text-foreground">{formatDuration(totalMinutes * 60)}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Total</p>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-foreground">{daysWithStudy}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Dias Ativos</p>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-foreground">{averageMinutes}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Média/Dia</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
