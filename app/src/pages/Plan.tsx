import { useState, useEffect } from 'react';
import { usePlanStore } from '@/store/use-plan-store';
import { useTopicStore } from '@/store/use-topic-store';
import { useSessionStore } from '@/store/use-session-store';
import { DAY_ORDER, DAY_LABELS, DayOfWeek } from '@/types/plan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Calendar,
    Target,
    Plus,
    Trash2,
    Bell,
    BellOff,
    CheckCircle2,
    XCircle,
    BookOpen,
    Timer,
    TrendingUp,
    Settings,
    Sparkles,
    Trophy,
    Goal
} from 'lucide-react';
import { ObjectiveProgress } from '@/components/learning-objectives';
import { initializePetrobrasPlan } from '@/lib/study-plan-utils';
import toast from 'react-hot-toast';

function formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
}

function getTodayDayOfWeek(): DayOfWeek {
    const days: DayOfWeek[] = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    return days[new Date().getDay()];
}

export function Plan() {
    const {
        plan,
        createPlan,
        addTopicToDay,
        removeTopicFromDay,
        updateDailyGoal,
        toggleReminder,
        updateReminders,
        getWeeklyAdherence,
        getMonthlyAdherence,
        getPlannedMinutesForDay,
        recordAdherence
    } = usePlanStore();

    const { topics, getTotalObjectiveProgress, getAllObjectives } = useTopicStore();
    const { getTodayTime, getSessionsByDateRange } = useSessionStore();

    // Get objectives progress for the plan
    const totalObjectiveProgress = getTotalObjectiveProgress();
    const allObjectives = getAllObjectives();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
    const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
    const [newPlanName, setNewPlanName] = useState('');
    const [newPlanDescription, setNewPlanDescription] = useState('');
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [topicDuration, setTopicDuration] = useState(30);
    const [targetMinutes, setTargetMinutes] = useState(240);
    const [reminderTime, setReminderTime] = useState('09:00');

    const today = getTodayDayOfWeek();
    const weeklyAdherence = getWeeklyAdherence();
    const monthlyAdherence = getMonthlyAdherence();
    const todayPlannedMinutes = plan ? getPlannedMinutesForDay(today) : 0;
    const todayActualMinutes = Math.floor(getTodayTime() / 60);

    // Record today's adherence when session changes
    useEffect(() => {
        if (plan) {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = today.toISOString();
            const todaySessions = getSessionsByDateRange(startOfDay.toISOString(), endOfDay);
            const uniqueTopics = new Set(todaySessions.map((s) => s.topicId)).size;
            recordAdherence(todayStr, todayActualMinutes, uniqueTopics);
        }
    }, [plan, todayActualMinutes, getSessionsByDateRange, recordAdherence]);

    const handleCreatePlan = () => {
        if (!newPlanName.trim()) {
            toast.error('Nome do plano é obrigatório');
            return;
        }
        createPlan(newPlanName, newPlanDescription);
        setIsCreateDialogOpen(false);
        setNewPlanName('');
        setNewPlanDescription('');
        toast.success('Plano de estudos criado!');
    };

    const handleImportPetrobras = () => {
        try {
            initializePetrobrasPlan();
            toast.success('Plano Petrobras 3 Meses importado com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao importar plano');
        }
    };

    const handleAddTopic = () => {
        if (!selectedDay || !selectedTopicId) {
            toast.error('Selecione um tópico');
            return;
        }
        addTopicToDay(selectedDay, selectedTopicId, topicDuration);
        setIsTopicDialogOpen(false);
        setSelectedTopicId('');
        setTopicDuration(30);
        toast.success('Tópico adicionado ao dia!');
    };

    const handleUpdateGoal = () => {
        updateDailyGoal({ targetMinutes });
        setIsGoalDialogOpen(false);
        toast.success('Meta diária atualizada!');
    };

    const handleToggleReminder = () => {
        if (plan) {
            toggleReminder(!plan.reminders.enabled);
            toast.success(plan.reminders.enabled ? 'Lembretes desativados' : 'Lembretes ativados');
        }
    };

    const handleAddReminderTime = () => {
        if (plan && reminderTime) {
            updateReminders({
                times: [...plan.reminders.times, reminderTime].sort()
            });
            setReminderTime('09:00');
            toast.success('Horário adicionado');
        }
    };

    const handleRemoveReminderTime = (time: string) => {
        if (plan) {
            updateReminders({
                times: plan.reminders.times.filter(t => t !== time)
            });
        }
    };

    const getTodayProgress = () => {
        if (todayPlannedMinutes === 0) return 0;
        return Math.min(100, (todayActualMinutes / todayPlannedMinutes) * 100);
    };

    const getDayStatus = (day: DayOfWeek) => {
        const dayPlan = plan?.weeklyPlan.find(d => d.day === day);
        if (!dayPlan) return 'pending';
        if (dayPlan.isRestDay) return 'rest';

        const plannedMinutes = getPlannedMinutesForDay(day);
        if (day === today) {
            return todayActualMinutes >= plannedMinutes ? 'completed' : 'in_progress';
        }

        // For past days, we would need to check adherence history
        return 'pending';
    };

    if (!plan) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="text-center py-20 glass-card rounded-[2rem] border-border/20 bg-card/5">
                    <Calendar className="w-20 h-20 mx-auto mb-6 text-primary/20" />
                    <h2 className="text-4xl font-black tracking-tighter text-foreground mb-2">Plano de Estudos</h2>
                    <p className="text-muted-foreground font-medium mb-10 max-w-md mx-auto">
                        Crie um plano de estudos estruturado para organizar sua rotina e acelerar sua aprovação.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-blue-600 font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Criar Novo Plano
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card border-border/20 bg-background/95 backdrop-blur-xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">Novo Plano de Estudo</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome do Plano</Label>
                                        <Input
                                            className="bg-muted/50 border-border/20 text-foreground rounded-xl h-12"
                                            placeholder="Ex: Preparação Concurso PF"
                                            value={newPlanName}
                                            onChange={(e) => setNewPlanName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Descrição (opcional)</Label>
                                        <Input
                                            className="bg-muted/50 border-border/20 text-foreground rounded-xl h-12"
                                            placeholder="Ex: Foco em Português e Raciocínio Lógico"
                                            value={newPlanDescription}
                                            onChange={(e) => setNewPlanDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="text-muted-foreground hover:text-foreground">
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleCreatePlan} className="bg-primary hover:bg-blue-600 font-bold rounded-xl px-6">
                                        Criar Plano
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleImportPetrobras}
                            className="rounded-full px-8 bg-muted/10 hover:bg-muted/20 text-foreground font-bold border border-border/20"
                        >
                            <Sparkles className="w-5 h-5 mr-2 text-primary" />
                            Importar Plano 3 Meses
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                        {plan.name}
                    </h1>
                    {plan.description && (
                        <p className="text-sm font-bold text-primary/60 uppercase tracking-[0.2em] mt-2">{plan.description}</p>
                    )}
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsGoalDialogOpen(true)}
                        className="bg-muted/10 border border-border/20 hover:bg-muted/20 text-foreground rounded-full px-4"
                    >
                        <Target className="w-4 h-4 mr-2 text-primary" />
                        Meta Diária
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsReminderDialogOpen(true)}
                        className="bg-muted/10 border border-border/20 hover:bg-muted/20 text-foreground rounded-full px-4"
                    >
                        <Settings className="w-4 h-4 mr-2 text-primary" />
                        Lembretes
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleImportPetrobras}
                        className="bg-muted/10 border border-border/20 hover:bg-muted/20 text-foreground rounded-full px-4"
                    >
                        <Sparkles className="w-4 h-4 mr-2 text-primary" />
                        Trocar para 3 Meses
                    </Button>
                </div>
            </div>

            {/* Today's Progress */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="pb-4 border-b border-border/20">
                    <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                        <Timer className="w-5 h-5 text-primary" />
                        Hoje - {DAY_LABELS[today]}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">PROGRESSO DO DIA</p>
                                <div className="text-3xl font-black tracking-tighter text-foreground">
                                    {formatMinutes(todayActualMinutes)} <span className="text-sm text-muted-foreground font-bold uppercase tracking-wider ml-1">/ {formatMinutes(todayPlannedMinutes)}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black tracking-tighter text-primary">{Math.round(getTodayProgress())}%</span>
                            </div>
                        </div>
                        <div className="relative h-3 w-full bg-muted/10 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                style={{ width: `${getTodayProgress()}%` }}
                            />
                        </div>
                        {todayPlannedMinutes > 0 && (
                            <div className="flex items-center gap-2 py-2 px-4 rounded-xl bg-muted/10 border border-border/20 w-fit">
                                {todayActualMinutes >= todayPlannedMinutes ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Meta Atingida</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 text-orange-500" />
                                        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                                            Faltam {formatMinutes(todayPlannedMinutes - todayActualMinutes)}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Adherence Stats */}
            <div className="grid grid-cols-2 gap-6">
                <Card className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-black tracking-tighter text-foreground">{weeklyAdherence}%</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ESTA SEMANA</p>
                        </div>
                    </div>
                </Card>
                <Card className="glass-card border-border/20 p-6 rounded-[2rem] bg-card/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                            <Calendar className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-black tracking-tighter text-foreground">{monthlyAdherence}%</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ESTE MÊS</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Learning Objectives Overview */}
            {allObjectives.length > 0 && (
                <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                    <CardHeader className="pb-4 border-b border-border/20">
                        <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                            <Goal className="w-5 h-5 text-primary" />
                            Objetivos de Aprendizagem
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Progress Summary */}
                            <div className="md:col-span-1">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">PROGRESSO GERAL</span>
                                        <span className="text-2xl font-black tracking-tighter text-primary">
                                            {totalObjectiveProgress.percentage}%
                                        </span>
                                    </div>
                                    <div className="relative h-3 w-full bg-muted/10 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                            style={{ width: `${totalObjectiveProgress.percentage}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="font-bold text-foreground">
                                            {totalObjectiveProgress.completed} de {totalObjectiveProgress.total} objetivos
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                        <span className="font-bold text-foreground">
                                            {totalObjectiveProgress.totalXP} XP total
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bloom Level Breakdown */}
                            <div className="md:col-span-2">
                                <ObjectiveProgress progress={totalObjectiveProgress} showTitle={false} />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/20">
                            <div className="text-center p-3 bg-muted/10 rounded-xl border border-border/20">
                                <div className="text-lg font-black tracking-tighter text-foreground">
                                    {allObjectives.filter(o => !o.completed).length}
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">PENDENTES</p>
                            </div>
                            <div className="text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <div className="text-lg font-black tracking-tighter text-emerald-500">
                                    {allObjectives.filter(o => o.completed).length}
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">COMPLETADOS</p>
                            </div>
                            <div className="text-center p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                                <div className="text-lg font-black tracking-tighter text-yellow-500">
                                    {allObjectives.filter(o => {
                                        if (!o.targetDate) return false;
                                        const target = new Date(o.targetDate);
                                        const today = new Date();
                                        const weekFromNow = new Date();
                                        weekFromNow.setDate(weekFromNow.getDate() + 7);
                                        return target <= weekFromNow && target >= today && !o.completed;
                                    }).length}
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-yellow-500/80">ESTA SEMANA</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Weekly Schedule */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="pb-4 border-b border-border/20">
                    <CardTitle className="text-xl font-black tracking-tighter text-foreground/90 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Grade Semanal
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-7 gap-3">
                        {DAY_ORDER.map((day) => {
                            const dayPlan = plan.weeklyPlan.find(d => d.day === day);
                            const plannedMinutes = getPlannedMinutesForDay(day);
                            const status = getDayStatus(day);

                            return (
                                <div
                                    key={day}
                                    className={`p-4 rounded-2xl border transition-all duration-300 ${day === today
                                        ? 'border-primary/50 bg-primary/5 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                                        : 'border-border/20 bg-card/10'
                                        } ${dayPlan?.isRestDay ? 'opacity-60' : ''}`}
                                >
                                    <div className="text-center mb-3">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${day === today ? 'text-primary' : 'text-muted-foreground'
                                            }`}>
                                            {DAY_LABELS[day].slice(0, 3)}
                                        </span>
                                    </div>

                                    {dayPlan?.isRestDay ? (
                                        <div className="text-center py-4">
                                            <Badge className="text-[10px] font-black uppercase tracking-widest bg-muted/10 text-muted-foreground/60 rounded-full py-0 border-border/20">
                                                OFF
                                            </Badge>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {dayPlan?.topics.length ? (
                                                <div className="space-y-1.5 min-h-[40px]">
                                                    {dayPlan.topics.slice(0, 2).map((t) => {
                                                        const topic = topics.find(top => top.id === t.topicId);
                                                        return topic ? (
                                                            <div key={t.topicId} className="group/item flex items-center justify-between gap-1">
                                                                <span className="text-[10px] font-bold text-muted-foreground truncate">{topic.name}</span>
                                                                <button
                                                                    onClick={() => removeTopicFromDay(day, t.topicId)}
                                                                    className="opacity-0 group-hover/item:opacity-100 text-red-500 hover:text-red-400 transition-opacity"
                                                                >
                                                                    <Trash2 className="w-2.5 h-2.5" />
                                                                </button>
                                                            </div>
                                                        ) : null;
                                                    })}
                                                    {dayPlan.topics.length > 2 && (
                                                        <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-tighter">
                                                            +{dayPlan.topics.length - 2} mais
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] font-bold text-muted-foreground/40 text-center py-4 italic">
                                                    Vazio
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between border-t border-border/20 pt-2">
                                                <span className="text-[11px] font-black text-foreground/80">
                                                    {formatMinutes(plannedMinutes)}
                                                </span>
                                                {status === 'completed' && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                )}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full h-8 rounded-xl bg-muted/10 hover:bg-muted/20 text-muted-foreground hover:text-foreground"
                                                onClick={() => {
                                                    setSelectedDay(day);
                                                    setIsTopicDialogOpen(true);
                                                }}
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Today's Topics */}
            {plan.weeklyPlan.find(d => d.day === today)?.topics.length ? (
                <Card className="glass-card border-emerald-500/10 bg-emerald-500/[0.01] rounded-[2rem]">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-black tracking-tighter text-foreground flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-emerald-500" />
                            Matérias Planejadas para Hoje
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {plan.weeklyPlan.find(d => d.day === today)?.topics.map((t) => {
                            const topic = topics.find(top => top.id === t.topicId);
                            return topic ? (
                                <div
                                    key={t.topicId}
                                    className="flex items-center justify-between p-4 bg-muted/10 border border-border/20 rounded-[1.25rem] hover:bg-muted/20 transition-colors group"
                                >
                                    <div>
                                        <p className="font-black text-lg tracking-tight text-foreground">{topic.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Timer className="w-3.5 h-3.5 text-emerald-500/60" />
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                {formatMinutes(t.durationMinutes)}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                                        onClick={() => removeTopicFromDay(today, t.topicId)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : null;
                        })}
                    </CardContent>
                </Card>
            ) : null}

            {/* Add Topic Dialog */}
            <Dialog open={isTopicDialogOpen} onOpenChange={setIsTopicDialogOpen}>
                <DialogContent className="glass-card border-border/20 bg-background/95 backdrop-blur-xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">
                            Adicionar Tópico ao {selectedDay ? DAY_LABELS[selectedDay] : ''}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-6 border-y border-border/20 my-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Selecionar Matéria</Label>
                            <select
                                className="w-full h-12 bg-muted/50 border border-border/20 text-foreground rounded-xl px-4 appearance-none focus:outline-none focus:border-primary/50"
                                value={selectedTopicId}
                                onChange={(e) => setSelectedTopicId(e.target.value)}
                            >
                                <option value="" className="bg-background">Selecione...</option>
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.id} className="bg-background">
                                        {topic.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Duração (minutos)</Label>
                            <Input
                                type="number"
                                min={15}
                                max={180}
                                className="bg-muted/50 border-border/20 text-foreground rounded-xl h-12"
                                value={topicDuration}
                                onChange={(e) => setTopicDuration(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsTopicDialogOpen(false)} className="text-muted-foreground hover:text-foreground">
                            Cancelar
                        </Button>
                        <Button onClick={handleAddTopic} className="bg-primary hover:bg-blue-600 font-bold rounded-xl px-6">
                            Adicionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Daily Goal Dialog */}
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogContent className="glass-card border-border/20 bg-background/95 backdrop-blur-xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">Meta Diária de Estudos</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-6 border-y border-border/20 my-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tempo diário (minutos)</Label>
                            <Input
                                type="number"
                                min={30}
                                max={480}
                                className="bg-muted/50 border-border/20 text-foreground rounded-xl h-12"
                                value={targetMinutes}
                                onChange={(e) => setTargetMinutes(Number(e.target.value))}
                            />
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                Meta atual: {formatMinutes(plan.dailyGoal.targetMinutes)}/dia
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Atalhos rápidos</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {[120, 240, 360, 480].map(mins => (
                                    <Button
                                        key={mins}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setTargetMinutes(mins)}
                                        className={`rounded-xl border border-border/20 ${targetMinutes === mins ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'}`}
                                    >
                                        {mins / 60}h
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsGoalDialogOpen(false)} className="text-muted-foreground hover:text-foreground">
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdateGoal} className="bg-primary hover:bg-blue-600 font-bold rounded-xl px-6">
                            Salvar Meta
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reminders Dialog */}
            <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
                <DialogContent className="glass-card border-border/20 bg-background/95 backdrop-blur-xl max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tighter text-foreground">Configurar Lembretes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-6 border-y border-border/20 my-4">
                        <div className="flex items-center justify-between p-4 bg-muted/10 border border-border/20 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl border ${plan.reminders.enabled ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-muted/10 border-border/20 text-muted-foreground'}`}>
                                    {plan.reminders.enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-foreground">Notificações</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{plan.reminders.enabled ? 'Ativadas' : 'Desativadas'}</p>
                                </div>
                            </div>
                            <Button
                                variant={plan.reminders.enabled ? 'default' : 'ghost'}
                                size="sm"
                                onClick={handleToggleReminder}
                                className={`rounded-xl px-4 font-bold ${plan.reminders.enabled ? 'bg-primary hover:bg-primary/80' : 'bg-muted/50 border border-border/20'}`}
                            >
                                {plan.reminders.enabled ? 'Desativar' : 'Ativar'}
                            </Button>
                        </div>

                        {plan.reminders.enabled && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Novo Horário</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="time"
                                            className="bg-muted/50 border-border/20 text-foreground rounded-xl h-12"
                                            value={reminderTime}
                                            onChange={(e) => setReminderTime(e.target.value)}
                                        />
                                        <Button onClick={handleAddReminderTime} className="bg-primary hover:bg-primary/80 h-12 w-12 rounded-xl p-0">
                                            <Plus className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {plan.reminders.times.map((time) => (
                                        <div
                                            key={time}
                                            className="flex items-center justify-between p-3 bg-muted/10 border border-border/20 rounded-xl group"
                                        >
                                            <span className="font-bold text-foreground tracking-widest">{time}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-8 h-8 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10"
                                                onClick={() => handleRemoveReminderTime(time)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <p className="text-[10px] font-bold text-muted-foreground text-center uppercase tracking-widest">
                            As notificações serão enviadas via navegador.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsReminderDialogOpen(false)} className="bg-muted/10 hover:bg-muted/20 text-foreground font-bold rounded-xl px-8 w-full">
                            Concluído
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
