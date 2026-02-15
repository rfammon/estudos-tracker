import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3X3, Clock } from 'lucide-react';
import { HourlyActivityData, TopicDistributionData } from '@/types/analytics';
import { clsx } from 'clsx';

interface TopicHeatmapProps {
    hourlyActivity: HourlyActivityData[];
    topicDistribution: TopicDistributionData[];
}

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function TopicHeatmap({ hourlyActivity, topicDistribution }: TopicHeatmapProps) {
    // Get intensity color based on value
    const getIntensityColor = (intensity: number) => {
        if (intensity === 0) return 'bg-muted/5';
        if (intensity < 0.2) return 'bg-primary/10';
        if (intensity < 0.4) return 'bg-primary/30';
        if (intensity < 0.6) return 'bg-primary/50';
        if (intensity < 0.8) return 'bg-primary/70';
        return 'bg-primary';
    };

    // Find best study time
    const bestStudyTime = useMemo(() => {
        const hourlyTotals = new Map<number, number>();
        hourlyActivity.forEach(data => {
            hourlyTotals.set(data.hour, (hourlyTotals.get(data.hour) || 0) + data.totalMinutes);
        });

        const sorted = Array.from(hourlyTotals.entries()).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0 || sorted[0][1] === 0) return null;

        return {
            hour: sorted[0][0],
            minutes: sorted[0][1],
        };
    }, [hourlyActivity]);

    // Find most productive day
    const mostProductiveDay = useMemo(() => {
        const dailyTotals = new Map<number, number>();
        hourlyActivity.forEach(data => {
            dailyTotals.set(data.dayOfWeek, (dailyTotals.get(data.dayOfWeek) || 0) + data.totalMinutes);
        });

        const sorted = Array.from(dailyTotals.entries()).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0 || sorted[0][1] === 0) return null;

        return {
            day: sorted[0][0],
            minutes: sorted[0][1],
        };
    }, [hourlyActivity]);

    // Generate accessible description
    const heatmapDescription = useMemo(() => {
        const totalMinutes = hourlyActivity.reduce((sum, d) => sum + d.totalMinutes, 0);
        const activeHours = hourlyActivity.filter(d => d.totalMinutes > 0).length;

        let description = `Mapa de calor de atividade de estudo. Total de ${Math.round(totalMinutes)} minutos estudados em ${activeHours} horários diferentes.`;

        if (bestStudyTime) {
            description += ` Melhor horário para estudar: ${bestStudyTime.hour}:00.`;
        }
        if (mostProductiveDay) {
            description += ` Dia mais produtivo: ${DAY_NAMES[mostProductiveDay.day]}.`;
        }

        return description;
    }, [hourlyActivity, bestStudyTime, mostProductiveDay]);

    // Get activity for specific hour and day
    const getActivity = (hour: number, day: number) => {
        return hourlyActivity.find(d => d.hour === hour && d.dayOfWeek === day) || { intensity: 0, totalMinutes: 0 };
    };

    return (
        <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
            <CardHeader className="border-b border-border/20">
                <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5 text-primary" aria-hidden="true" />
                    Mapa de Atividade
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Distribuição de estudo por horário e dia da semana
                </p>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Accessible description for screen readers */}
                <p className="sr-only">{heatmapDescription}</p>

                {/* Heatmap Grid */}
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        {/* Day headers */}
                        <div className="flex mb-2">
                            <div className="w-12 flex-shrink-0" /> {/* Empty corner */}
                            {DAY_NAMES.map((day, index) => (
                                <div
                                    key={index}
                                    className="flex-1 text-center text-[10px] font-bold text-muted-foreground"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Hour rows */}
                        <div className="space-y-1">
                            {Array.from({ length: 24 }, (_, hour) => (
                                <div key={hour} className="flex items-center gap-1">
                                    {/* Hour label */}
                                    <div className="w-12 flex-shrink-0 text-[10px] font-bold text-muted-foreground text-right pr-2">
                                        {hour.toString().padStart(2, '0')}:00
                                    </div>

                                    {/* Day cells */}
                                    {Array.from({ length: 7 }, (_, day) => {
                                        const activity = getActivity(hour, day);
                                        return (
                                            <div
                                                key={day}
                                                className={clsx(
                                                    "flex-1 h-4 rounded-sm transition-all duration-300",
                                                    getIntensityColor(activity.intensity),
                                                    activity.totalMinutes > 0 && "cursor-pointer hover:ring-2 hover:ring-primary/50"
                                                )}
                                                title={`${DAY_NAMES[day]} ${hour}:00 - ${activity.totalMinutes} minutos`}
                                                role="gridcell"
                                                aria-label={`${DAY_NAMES[day]} às ${hour}:00: ${activity.totalMinutes} minutos de estudo`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Menos</span>
                    <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-sm bg-muted/5" aria-hidden="true" />
                        <div className="w-4 h-4 rounded-sm bg-primary/10" aria-hidden="true" />
                        <div className="w-4 h-4 rounded-sm bg-primary/30" aria-hidden="true" />
                        <div className="w-4 h-4 rounded-sm bg-primary/50" aria-hidden="true" />
                        <div className="w-4 h-4 rounded-sm bg-primary/70" aria-hidden="true" />
                        <div className="w-4 h-4 rounded-sm bg-primary" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">Mais</span>
                </div>

                {/* Insights */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                    {bestStudyTime && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-card/5 border border-border/20">
                            <Clock className="h-5 w-5 text-primary/40" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Melhor Horário</p>
                                <p className="text-lg font-black text-primary">{bestStudyTime.hour}:00</p>
                            </div>
                        </div>
                    )}

                    {mostProductiveDay && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-card/5 border border-border/20">
                            <Grid3X3 className="h-5 w-5 text-emerald-500/40" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Dia Mais Produtivo</p>
                                <p className="text-lg font-black text-emerald-500">{DAY_NAMES[mostProductiveDay.day]}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Topic Distribution Pie Chart Alternative (CSS-based) */}
                {topicDistribution.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
                            Distribuição por Tópico
                        </h3>
                        <ul className="space-y-2" role="list">
                            {topicDistribution.slice(0, 5).map((topic) => (
                                <li key={topic.topicId} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: topic.color }}
                                                aria-hidden="true"
                                            />
                                            <span className="text-sm font-medium text-foreground truncate max-w-[150px]">
                                                {topic.topicName}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {topic.totalMinutes} min ({topic.percentage}%)
                                        </span>
                                    </div>
                                    <div
                                        className="h-2 rounded-full bg-muted/10 overflow-hidden"
                                        role="progressbar"
                                        aria-valuenow={topic.percentage}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label={`Tempo em ${topic.topicName}: ${topic.percentage}%`}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${topic.percentage}%`,
                                                backgroundColor: topic.color,
                                            }}
                                            aria-hidden="true"
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Accessible table for screen readers */}
                <table className="sr-only">
                    <caption>Atividade de estudo por hora e dia da semana</caption>
                    <thead>
                        <tr>
                            <th scope="col">Hora</th>
                            {DAY_NAMES.map((day, i) => (
                                <th key={i} scope="col">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 24 }, (_, hour) => (
                            <tr key={hour}>
                                <td>{hour}:00</td>
                                {Array.from({ length: 7 }, (_, day) => (
                                    <td key={day}>{getActivity(hour, day).totalMinutes} min</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
