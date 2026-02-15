import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSessionStore, useTopicStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Trophy,
    Clock,
    Zap,
    MessageSquare,
    CheckCircle2,
    ArrowRight,
    History as HistoryIcon
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/types';
import toast from 'react-hot-toast';

export function SessionSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessions, updateSessionNotes } = useSessionStore();
    const { getTopicById } = useTopicStore();

    const sessionId = location.state?.sessionId;
    const session = sessions.find(s => s.id === sessionId);
    const topic = session ? getTopicById(session.topicId) : null;

    const [notes, setNotes] = useState(session?.notes || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!session || !topic) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Erro</p>
                <h2 className="text-2xl font-bold">Sessão não encontrada</h2>
                <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
            </div>
        );
    }

    const handleSave = () => {
        setIsSaving(true);
        updateSessionNotes(session.id, notes);
        toast.success('Notas salvas com sucesso!');
        setIsSaving(false);
    };

    const handleFinish = () => {
        if (notes !== (session.notes || '')) {
            updateSessionNotes(session.id, notes);
        }
        navigate('/dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header Success Section */}
            <div className="text-center space-y-4 py-12">
                <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full scale-150" />
                    <div className="relative z-10 p-6 bg-emerald-500/10 rounded-[3rem] border border-emerald-500/20">
                        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                        Sessão Finalizada!
                    </h1>
                    <p className="text-sm font-bold text-emerald-500/60 uppercase tracking-[0.2em]">Excelente progresso • cada minuto conta</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <Card className="glass-card border-border/20 p-8 space-y-3 relative overflow-hidden group rounded-[2rem] hover:border-border/40 transition-all duration-500">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Clock className="h-24 w-24" />
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Tempo Total</p>
                    <p className="text-4xl font-black text-foreground tracking-tighter">{formatDuration(session.duration)}</p>
                </Card>

                <Card className="glass-card border-border/20 p-8 space-y-3 relative overflow-hidden group rounded-[2rem] hover:border-border/40 transition-all duration-500">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap className="h-24 w-24" />
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Pontos Ganhos</p>
                    <p className="text-4xl font-black text-yellow-500 tracking-tighter">+{session.points} XP</p>
                </Card>

                <Card className="glass-card border-border/20 p-8 space-y-3 relative overflow-hidden group rounded-[2rem] hover:border-border/40 transition-all duration-500">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Trophy className="h-24 w-24" />
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Status da Matéria</p>
                    <p className="text-4xl font-black text-blue-400 tracking-tighter">{Math.round((getTotalTimeByTopic(topic.id) / 3600 / topic.targetHours) * 100)}%</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Left Column: Topic Info */}
                <Card className="md:col-span-2 glass-card border-border/20 overflow-hidden">
                    <div className={`h-2 w-full category-${topic.category} opacity-50`} />
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            Matéria Estudada
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter text-foreground">{topic.name}</h3>
                            <div className="flex gap-2 mt-4">
                                <Badge variant="outline" className="glass-card border-border/20 uppercase text-[9px] font-black rounded-full px-3 py-1">
                                    {CATEGORY_LABELS[topic.category]}
                                </Badge>
                                <Badge variant="outline" className="glass-card border-border/20 uppercase text-[9px] font-black rounded-full px-3 py-1">
                                    {PRIORITY_LABELS[topic.priority]}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/20">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground font-medium">Início:</span>
                                <span className="text-foreground">{new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground font-medium">Término:</span>
                                <span className="text-foreground">{new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Notes and Actions */}
                <div className="md:col-span-3 space-y-6">
                    <Card className="glass-card border-border/20 p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-lg">Notas da Sessão</h3>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Descreva o que você aprendeu, dificuldades ou próximos passos..."
                            className="w-full min-h-[160px] bg-muted/10 border border-border/20 rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        />
                        <Button
                            variant="ghost"
                            onClick={handleSave}
                            disabled={isSaving || notes === session.notes}
                            className="w-full hover:bg-foreground/10 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={handleFinish}
                            className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-[0_0_30px_rgba(37,99,235,0.3)] group rounded-2xl tracking-tighter uppercase"
                        >
                            Finalizar Sessão
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/history')}
                            className="glass-card border-border/20 hover:bg-foreground/10 h-14 px-8 rounded-2xl"
                        >
                            <HistoryIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    function getTotalTimeByTopic(topicId: string) {
        return sessions
            .filter(s => s.topicId === topicId)
            .reduce((total, s) => total + s.duration, 0);
    }
}
