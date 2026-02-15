import { useNavigate } from 'react-router-dom';
import { useTopicStore, useSessionStore, useGamificationStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    Clock,
    TrendingUp,
    Play,
    History,
    Flame,
    Star,
    Trophy,
    Target
} from 'lucide-react';
import { formatDuration, cn } from '@/lib/utils';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types';
import { usePageAnnouncement } from '@/hooks/useAnnouncement';

export function Dashboard() {
    const navigate = useNavigate();
    const { topics } = useTopicStore();
    const {
        getTotalTime,
        getTodayTime,
        getWeekTime,
        getLastWeekTime,
        getTotalTimeByTopic
    } = useSessionStore();
    const { totalPoints, currentStreak, bestStreak, getCurrentLevel } = useGamificationStore();

    // Announce page load to screen readers
    usePageAnnouncement('Dashboard');

    const totalTime = getTotalTime();
    const todayTime = getTodayTime();
    const weekTime = getWeekTime();
    const lastWeekTime = getLastWeekTime();
    const currentLevel = getCurrentLevel();

    // Calculate evolution percentages
    const weekEvolution = lastWeekTime > 0 ? ((weekTime - lastWeekTime) / lastWeekTime) * 100 : 0;


    // Prepare topic times for leaderboard
    const topicTimes = topics.map(topic => ({
        topicId: topic.id,
        topicName: topic.name,
        totalTime: getTotalTimeByTopic(topic.id),
        category: topic.category
    })).sort((a, b) => b.totalTime - a.totalTime);

    // Top 5 most studied subjects
    const topSubjects = topicTimes.slice(0, 5);

    const topicsInProgress = topics.filter(t => t.status === 'em_progresso').length;
    const topicsCompleted = topics.filter(t => t.status === 'dominado').length;
    const overallProgress = topics.length > 0
        ? Math.round(topics.reduce((sum, t) => sum + t.progress, 0) / topics.length)
        : 0;

    const recentTopics = [...topics]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-10 pb-20" role="region" aria-label="Painel principal">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/20 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.8)]" aria-hidden="true" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Command Center v1.0</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-foreground">
                        DASHBOARD
                    </h1>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                        Status: <span className="text-emerald-500 italic">Operacional</span> • <span className="italic">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
                    </p>
                </div>
                <nav className="flex gap-3" aria-label="Ações principais">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/history')}
                        className="glass-card border-border/20 hover:bg-muted/10 text-[10px] font-black uppercase tracking-widest px-6 h-12 rounded-2xl"
                        aria-label="Ver histórico de sessões"
                    >
                        Histórico
                    </Button>
                    <Button
                        onClick={() => navigate('/topics')}
                        className="bg-primary hover:bg-primary/80 blue-glow-button text-[10px] font-black uppercase tracking-widest px-6 h-12 rounded-2xl"
                        aria-label="Adicionar nova matéria"
                    >
                        Nova Matéria
                    </Button>
                </nav>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column - Main Content (8 cols) */}
                <main className="lg:col-span-8 space-y-8">
                    {/* Time Statistics - High Density */}
                    <section aria-label="Estatísticas de tempo">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <article
                                className="glass-card p-6 rounded-3xl group border-border/20 hover:border-primary/20 transition-all duration-500"
                                aria-labelledby="today-time-title"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 italic" id="today-time-title">Tempo Hoje</p>
                                        <h3 className="text-4xl font-black text-foreground tracking-tighter" aria-label={`${formatDuration(todayTime)} de estudo hoje`}>
                                            {formatDuration(todayTime)}
                                        </h3>
                                    </div>
                                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary" aria-hidden="true">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                        <span className="text-muted-foreground">Meta Diária (4h)</span>
                                        <span className="text-primary" aria-label={`${Math.round((todayTime / 14400) * 100)}% da meta`}>
                                            {Math.round((todayTime / 14400) * 100)}%
                                        </span>
                                    </div>
                                    {/* Notion-style segmented progress */}
                                    <div
                                        className="flex gap-1 h-1.5"
                                        role="progressbar"
                                        aria-valuenow={Math.round((todayTime / 14400) * 100)}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label="Progresso da meta diária"
                                    >
                                        {[...Array(10)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex-1 rounded-full transition-all duration-500",
                                                    i < (todayTime / 14400) * 10
                                                        ? "bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                                        : "bg-muted/30"
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </article>

                            <article
                                className="glass-card p-6 rounded-3xl group border-border/20 hover:border-emerald-500/20 transition-all duration-500"
                                aria-labelledby="week-time-title"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 italic" id="week-time-title">Semanário</p>
                                        <h3 className="text-4xl font-black text-foreground tracking-tighter" aria-label={`${formatDuration(weekTime)} de estudo esta semana`}>
                                            {formatDuration(weekTime)}
                                        </h3>
                                    </div>
                                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" aria-hidden="true">
                                        <TrendingUp className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                            weekEvolution >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                        )}
                                        aria-label={`${weekEvolution >= 0 ? 'Aumento' : 'Redução'} de ${Math.abs(Math.round(weekEvolution))}% em relação à semana anterior`}
                                    >
                                        {weekEvolution >= 0 ? "↑" : "↓"} {Math.abs(Math.round(weekEvolution))}%
                                    </div>
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic opacity-80">vs. Anterior</span>
                                </div>
                            </article>
                        </div>
                    </section>

                    {/* Progress Overview Section */}
                    <section
                        className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-card/40 to-card/60 border-border/20 relative overflow-hidden group"
                        aria-labelledby="plan-status-title"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-primary/10" aria-hidden="true" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 id="plan-status-title" className="text-2xl font-black tracking-tighter text-foreground uppercase italic">Status do Plano</h2>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Domínio total do conteúdo programático</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-5xl font-black text-foreground tracking-tighter" aria-label={`${overallProgress}% de progresso global`}>{overallProgress}%</span>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Global Mastered</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span>Matérias Ativas</span>
                                        <span aria-label={`${topicsInProgress} matérias ativas`}>{topicsInProgress}</span>
                                    </div>
                                    <div
                                        className="flex gap-0.5 h-1"
                                        role="progressbar"
                                        aria-valuenow={topicsInProgress}
                                        aria-valuemin={0}
                                        aria-valuemax={topics.length}
                                        aria-label="Matérias ativas"
                                    >
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex-1 rounded-full transition-all duration-700",
                                                    i < (topicsInProgress / topics.length) * 20
                                                        ? "bg-primary shadow-[0_0_5px_rgba(37,99,235,0.3)]"
                                                        : "bg-muted/30"
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Masterizadas</span>
                                        <span aria-label={`${topicsCompleted} matérias dominadas`}>{topicsCompleted}</span>
                                    </div>
                                    <div
                                        className="flex gap-0.5 h-1"
                                        role="progressbar"
                                        aria-valuenow={topicsCompleted}
                                        aria-valuemin={0}
                                        aria-valuemax={topics.length}
                                        aria-label="Matérias dominadas"
                                    >
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex-1 rounded-full transition-all duration-700",
                                                    i < (topicsCompleted / topics.length) * 20
                                                        ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.3)]"
                                                        : "bg-muted/30"
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Total Horas</span>
                                        <span aria-label={`${Math.round(totalTime / 3600)} horas de estudo`}>{Math.round(totalTime / 3600)}h</span>
                                    </div>
                                    <div className="flex gap-0.5 h-1" aria-hidden="true">
                                        {[...Array(20)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={cn(
                                                    "flex-1 rounded-full transition-all duration-700",
                                                    i < 13 // Arbitrary 65% for visual weight
                                                        ? "bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.3)]"
                                                        : "bg-muted/30"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recently Studied */}
                    <section aria-labelledby="recent-activities-title">
                        <div className="flex items-center justify-between px-2">
                            <h2 id="recent-activities-title" className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                <History className="h-3 w-3" aria-hidden="true" />
                                Atividades Recentes
                            </h2>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => navigate('/topics')}
                                className="text-[9px] font-black text-primary uppercase tracking-widest hover:text-foreground transition-colors"
                                aria-label="Ver todas as matérias"
                            >
                                Ver Tudo →
                            </Button>
                        </div>

                        <ul className="grid gap-3" role="list" aria-label="Matérias recentes">
                            {recentTopics.map((topic) => (
                                <li key={topic.id}>
                                    <button
                                        className="w-full p-4 rounded-2xl glass-card border-border/20 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group cursor-pointer flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        onClick={() => navigate(`/timer/${topic.id}`)}
                                        aria-label={`Iniciar sessão de ${topic.name}. Progresso: ${topic.progress}%. Status: ${STATUS_LABELS[topic.status]}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500",
                                                    topic.priority === 'alta' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                                        topic.priority === 'media' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                                            "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                )}
                                                aria-hidden="true"
                                            >
                                                <BookOpen className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{topic.name}</h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{CATEGORY_LABELS[topic.category]}</span>
                                                    <span className="text-[9px] text-muted-foreground/40" aria-hidden="true">•</span>
                                                    <Badge variant="outline" className="text-[8px] h-4 font-black uppercase border-border/20 text-muted-foreground px-1 py-0">
                                                        {STATUS_LABELS[topic.status]}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[10px] font-black text-foreground">{topic.progress}%</div>
                                                <p className="text-[8px] font-black text-muted-foreground opacity-70 uppercase tracking-tighter">Domínio</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:blue-glow-button transition-all duration-500" aria-hidden="true">
                                                <Play className="h-3 w-3 text-muted-foreground group-hover:text-primary-foreground group-hover:fill-current" />
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                </main>

                {/* Right Column - Sidebar Info (4 cols) */}
                <aside className="lg:col-span-4 space-y-6" aria-label="Estatísticas e conquistas">
                    {/* Gamification Stats */}
                    <article
                        className="glass-card p-6 rounded-3xl border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden group"
                        aria-labelledby="rank-title"
                    >
                        <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 rotate-12 transition-all duration-700 group-hover:scale-[1.7] group-hover:rotate-0" aria-hidden="true">
                            <Trophy className="h-24 w-24 text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" aria-hidden="true">
                                    <Trophy className="h-4 w-4" />
                                </div>
                                <span id="rank-title" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Estatuto de Rank</span>
                            </div>
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-5xl font-black text-foreground emerald-glow-text tracking-tighter" aria-label={`${totalPoints} pontos de experiência`}>{totalPoints}</span>
                                <span className="text-xs font-black text-emerald-500/60 pb-1.5 uppercase tracking-widest">XP</span>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                Nível: <span className="text-foreground italic">{currentLevel.name}</span>
                            </p>

                            <div className="mt-6 space-y-1.5">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    <span>Próximo Tier</span>
                                    <span>450 / 1000 XP</span>
                                </div>
                                <div
                                    className="h-1 bg-muted/40 rounded-full overflow-hidden"
                                    role="progressbar"
                                    aria-valuenow={45}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label="Progresso para o próximo nível"
                                >
                                    <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '45%' }} />
                                </div>
                            </div>
                        </div>
                    </article>

                    <article
                        className="glass-card p-6 rounded-3xl border-gold/10 bg-gradient-to-br from-gold/5 to-transparent relative overflow-hidden group"
                        aria-labelledby="streak-title"
                    >
                        <div className="absolute -right-2 -bottom-2 opacity-5 scale-150 -rotate-12 transition-all duration-700 group-hover:scale-[1.7] group-hover:rotate-0" aria-hidden="true">
                            <Flame className="h-24 w-24 text-gold" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 rounded-lg bg-gold/10 text-gold border border-gold/20" aria-hidden="true">
                                    <Flame className="h-4 w-4" />
                                </div>
                                <span id="streak-title" className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Consistência Atal</span>
                            </div>
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-5xl font-black text-foreground gold-glow-text tracking-tighter" aria-label={`${currentStreak} dias consecutivos`}>{currentStreak}</span>
                                <span className="text-xs font-black text-gold/60 pb-1.5 uppercase tracking-widest">Dias</span>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                Recorde Pessoal: <span className="text-foreground italic">{bestStreak} dias</span>
                            </p>

                            <div className="flex gap-1 mt-6" role="list" aria-label="Dias da semana atual">
                                {[...Array(7)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex-1 h-8 rounded-lg border transition-all duration-500 flex items-center justify-center font-black text-[10px]",
                                            i < currentStreak
                                                ? "bg-gold/10 border-gold/30 text-gold shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                                                : "bg-muted/20 border-border/20 text-muted-foreground/30"
                                        )}
                                        role="listitem"
                                        aria-label={`Semana ${i + 1}${i < currentStreak ? ' - completo' : ' - pendente'}`}
                                    >
                                        S{i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* Mastered Subjects Leaderboard */}
                    <article className="glass-card p-6 rounded-3xl border-border/20" aria-labelledby="mastery-title">
                        <h3 id="mastery-title" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 italic flex items-center gap-2">
                            <Target className="h-3 w-3" aria-hidden="true" />
                            Mestria por Matéria
                        </h3>
                        <ol className="space-y-4" aria-label="Ranking de matérias mais estudadas">
                            {topSubjects.map((sub, i) => (
                                <li key={sub.topicId} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-muted-foreground/40 w-2" aria-label={`${i + 1}º lugar`}>{i + 1}</span>
                                        <span className="text-xs font-bold text-foreground tracking-tight">{sub.topicName}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-primary/80 font-black" aria-label={`${Math.round(sub.totalTime / 3600)} horas de estudo`}>
                                        {Math.round(sub.totalTime / 3600)}h
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <Button
                            variant="outline"
                            className="w-full mt-6 h-10 rounded-xl border-border/20 text-[9px] font-black uppercase tracking-widest hover:bg-muted/10"
                            onClick={() => navigate('/evolution')}
                            aria-label="Ver evolução completa"
                        >
                            Ver Evolução Completa
                        </Button>
                    </article>

                    {/* Quick Info Box */}
                    <aside
                        className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4"
                        role="complementary"
                        aria-label="Dica do sistema"
                    >
                        <div className="flex items-center gap-3 text-primary">
                            <Star className="h-5 w-5 fill-current" aria-hidden="true" />
                            <span className="text-xs font-black uppercase tracking-widest">Dica do Sistema</span>
                        </div>
                        <blockquote className="text-xs text-muted-foreground font-bold italic leading-relaxed">
                            "O sucesso é a soma de pequenos esforços repetidos dia após dia. Mantenha sua streak ativa para multiplicadores de XP."
                        </blockquote>
                    </aside>
                </aside>
            </div>
        </div>
    );

}
