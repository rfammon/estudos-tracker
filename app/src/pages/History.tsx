import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore, useSessionStore } from '@/store';
import { CATEGORY_LABELS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Clock,
    Trash2,
    BookOpen,
    Filter
} from 'lucide-react';
import { formatDuration, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

type PeriodFilter = 'all' | 'week' | 'month';

export function History() {
    const navigate = useNavigate();
    const { topics, getTopicById } = useTopicStore();
    const { sessions, deleteSession, getTotalTime, getTotalTimeByTopic } = useSessionStore();

    const [topicFilter, setTopicFilter] = useState<string>('all');
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');

    const filteredSessions = useMemo(() => {
        let filtered = [...sessions];

        // Filter by topic
        if (topicFilter !== 'all') {
            filtered = filtered.filter((s) => s.topicId === topicFilter);
        }

        // Filter by period
        if (periodFilter !== 'all') {
            const startDate = new Date();

            if (periodFilter === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (periodFilter === 'month') {
                startDate.setMonth(startDate.getMonth() - 1);
            }

            filtered = filtered.filter((s) => new Date(s.startTime) >= startDate);
        }

        // Sort by date (most recent first)
        return filtered.sort((a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
    }, [sessions, topicFilter, periodFilter]);

    const totalTime = topicFilter === 'all'
        ? getTotalTime()
        : getTotalTimeByTopic(topicFilter);

    const handleDeleteSession = (sessionId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta sessão?')) {
            deleteSession(sessionId);
            toast.success('Sessão excluída');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full hover:bg-foreground/10"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                        Histórico
                    </h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Sua jornada de aprendizado</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="pb-3 border-b border-border/20">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Filtros</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <Select value={topicFilter} onValueChange={setTopicFilter}>
                            <SelectTrigger className="w-full md:w-[250px] bg-muted/30 border-border/20 rounded-xl">
                                <SelectValue placeholder="Todas as matérias" />
                            </SelectTrigger>
                            <SelectContent className="glass-card border-border/20">
                                <SelectItem value="all">Todas as matérias</SelectItem>
                                {topics.map((topic) => (
                                    <SelectItem key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as PeriodFilter)}>
                            <SelectTrigger className="w-full md:w-[200px] bg-muted/30 border-border/20 rounded-xl">
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent className="glass-card border-border/20">
                                <SelectItem value="all">Todo o período</SelectItem>
                                <SelectItem value="week">Última semana</SelectItem>
                                <SelectItem value="month">Último mês</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Total de Sessões
                        </p>
                        <Clock className="h-4 w-4 text-primary/40" />
                    </div>
                    <div className="mt-2 text-3xl font-black tracking-tighter text-foreground">
                        {filteredSessions.length}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                        SESSÕES REGISTRADAS
                    </p>
                </Card>
                <Card className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Tempo Total
                        </p>
                        <Clock className="h-4 w-4 text-emerald-500/40" />
                    </div>
                    <div className="mt-2 text-3xl font-black tracking-tighter text-foreground">
                        {formatDuration(totalTime)}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                        TEMPO ESTUDADO
                    </p>
                </Card>
                <Card className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Matérias
                        </p>
                        <BookOpen className="h-4 w-4 text-blue-500/40" />
                    </div>
                    <div className="mt-2 text-3xl font-black tracking-tighter text-foreground">
                        {topicFilter === 'all' ? topics.length : '1'}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                        {topicFilter === 'all' ? 'MATÉRIAS COM ESTUDOS' : 'MATÉRIA SELECIONADA'}
                    </p>
                </Card>
            </div>

            {/* Sessions List */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="border-b border-border/20 pb-4">
                    <CardTitle className="text-xl font-black tracking-tighter text-foreground/90">Sessões ({filteredSessions.length})</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {filteredSessions.length === 0 ? (
                        <div className="text-center py-20">
                            <Clock className="h-16 w-16 text-muted/20 mx-auto mb-6" />
                            <p className="text-muted-foreground/40 font-bold uppercase tracking-widest text-sm">
                                Nenhuma sessão encontrada
                            </p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                Comece a estudar para ver seu histórico aqui
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredSessions.map((session) => {
                                const topic = getTopicById(session.topicId);
                                return (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-6 bg-card/20 border border-border/20 rounded-2xl hover:bg-card/40 hover:border-border/30 transition-all group"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-black tracking-tighter text-foreground/90">{topic?.name || 'Matéria excluída'}</span>
                                                {topic && (
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase border-border/20 text-muted-foreground rounded-full px-3">
                                                        {CATEGORY_LABELS[topic.category]}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-6 text-xs text-muted-foreground font-bold uppercase tracking-tight">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3 text-primary/60" />
                                                    {formatDateTime(session.startTime).toUpperCase()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <BookOpen className="h-3 w-3 text-emerald-500/60" />
                                                    {formatDuration(session.duration).toUpperCase()}
                                                </span>
                                                {session.points > 0 && (
                                                    <span className="text-yellow-500/80">
                                                        +{session.points} XP
                                                    </span>
                                                )}
                                            </div>
                                            {session.notes && (
                                                <p className="text-sm text-muted-foreground font-medium italic border-l-2 border-primary/20 pl-3 py-1 mt-2">
                                                    {session.notes}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDeleteSession(session.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-400 rounded-full"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
