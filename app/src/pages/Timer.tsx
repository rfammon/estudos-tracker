import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTopicStore, useSessionStore, useGamificationStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    Play,
    Pause,
    Square,
    ArrowLeft,
    Clock,
    Zap,
    BookOpen,
    Target,
    Trophy
} from 'lucide-react';
import { formatTime, formatDuration } from '@/lib/utils';
import { CATEGORY_LABELS } from '@/types';
import toast from 'react-hot-toast';
import { LiveRegion } from '@/components/accessibility';
import { usePageAnnouncement, useAnnouncement } from '@/hooks/useAnnouncement';

export function Timer() {
    const { topicId } = useParams<{ topicId?: string }>();
    const navigate = useNavigate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { getTopicById, updateTopicProgress } = useTopicStore();
    const {
        activeSession,
        startSession,
        endSession,
        updateActiveSessionTime,
        getTotalTimeByTopic
    } = useSessionStore();
    const { addPoints, addStudyTime, updateStreak, incrementSessions, checkAchievements } = useGamificationStore();

    const topic = topicId ? getTopicById(topicId) : null;

    // Accessibility hooks
    usePageAnnouncement('Cronômetro');
    const { announcePolite, announceAssertive } = useAnnouncement();
    const [timerAnnouncement, setTimerAnnouncement] = useState('');

    // Track previous timer state for announcements
    const previousStateRef = useRef<'idle' | 'running' | 'paused'>('idle');
    const lastMinuteAnnouncedRef = useRef(0);

    useEffect(() => {
        if (activeSession) {
            intervalRef.current = setInterval(() => {
                updateActiveSessionTime(activeSession.seconds + 1);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activeSession, updateActiveSessionTime]);

    // Announce timer state changes and periodic updates
    useEffect(() => {
        const currentSeconds = activeSession?.seconds || 0;
        const currentMinutes = Math.floor(currentSeconds / 60);
        const currentState = activeSession
            ? (intervalRef.current ? 'running' : 'paused')
            : 'idle';

        // Announce state changes
        if (currentState !== previousStateRef.current) {
            if (currentState === 'running') {
                announcePolite('Cronômetro iniciado');
            } else if (currentState === 'paused') {
                announcePolite('Cronômetro pausado');
            }
            previousStateRef.current = currentState;
        }

        // Announce every 5 minutes during active session
        if (currentState === 'running' && currentMinutes > 0 && currentMinutes % 5 === 0 && currentMinutes !== lastMinuteAnnouncedRef.current) {
            setTimerAnnouncement(`${currentMinutes} minutos de estudo`);
            lastMinuteAnnouncedRef.current = currentMinutes;
        }
    }, [activeSession?.seconds, announcePolite]);

    const handleStart = () => {
        if (!topicId) {
            toast.error('Selecione uma matéria primeiro');
            navigate('/topics');
            return;
        }
        startSession(topicId);
        announcePolite('Sessão de foco iniciada');
        toast.success('Sessão de foco iniciada!');
    };

    const handlePause = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        const elapsed = activeSession?.seconds || 0;
        announcePolite(`Pausado aos ${formatTime(elapsed)}`);
    };

    const handleResume = () => {
        if (activeSession) {
            intervalRef.current = setInterval(() => {
                updateActiveSessionTime(activeSession.seconds + 1);
            }, 1000);
        }
        announcePolite('Cronômetro retomado');
    };

    const handleStop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const session = endSession();
        if (session && (activeSession?.topicId || topicId)) {
            const sid = activeSession?.topicId || topicId;
            if (sid) {
                updateTopicProgress(sid, session.duration);

                // Update gamification
                const points = Math.floor(session.duration / 60);
                addPoints(points);
                addStudyTime(session.duration);
                incrementSessions();
                updateStreak(true);

                // Check for new achievements
                const newAchievements = checkAchievements();

                if (newAchievements.length > 0) {
                    announceAssertive(`Excelente trabalho! ${points} pontos ganhos e nova conquista desbloqueada!`);
                    toast.success(`Excelente trabalho! +${points} pontos e uma nova conquista! 🏆`);
                } else {
                    announcePolite(`Sessão finalizada! ${points} pontos ganhos.`);
                    toast.success(`Sessão finalizada com sucesso! +${points} pontos.`);
                }
                navigate('/session-summary', { state: { sessionId: session.id } });
            }
        } else {
            navigate('/topics');
        }
    };

    const handleSelectTopic = () => {
        navigate('/topics');
    };

    const currentSeconds = activeSession?.seconds || 0;
    const currentTopicId = activeSession?.topicId || topicId;
    const currentTopic = currentTopicId ? getTopicById(currentTopicId) : null;
    const currentTotalTime = currentTopicId ? getTotalTimeByTopic(currentTopicId) : 0;

    const progressValue = currentTopic && currentTopic.targetHours > 0
        ? Math.min(Math.round(((currentTotalTime + currentSeconds) / 3600 / currentTopic.targetHours) * 100), 100)
        : 0;

    if (!topic && !activeSession) {
        return (
            <div
                className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
                role="region"
                aria-label="Cronômetro - Selecione uma matéria"
            >
                <header className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full hover:bg-foreground/10"
                        aria-label="Voltar"
                    >
                        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                            Cronômetro
                        </h1>
                        <p className="text-sm font-bold text-primary/60 uppercase tracking-[0.2em]">Estado de Flow Ativado</p>
                    </div>
                </header>

                <Card className="glass-card overflow-hidden border-border/20 rounded-[2rem]">
                    <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-110" aria-hidden="true" />
                            <div className="relative z-10 p-6 bg-muted/30 rounded-[2.5rem] border border-border/30">
                                <Clock className="h-16 w-16 text-primary" aria-hidden="true" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter mb-4 text-foreground/90">Selecione uma matéria</h2>
                        <p className="text-muted-foreground mb-10 max-w-sm font-medium">
                            Para começar a registrar seu progresso e ganhar pontos, selecione o que você vai estudar agora.
                        </p>
                        <Button
                            size="lg"
                            onClick={handleSelectTopic}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(37,99,235,0.3)] px-10 py-7 text-lg h-auto rounded-full font-bold tracking-tight group"
                            aria-label="Explorar matérias para começar a estudar"
                        >
                            <BookOpen className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                            Explorar Matérias
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isActive = !!activeSession;
    const isPaused = isActive && !intervalRef.current;

    return (
        <div
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4"
            role="application"
            aria-label="Cronômetro de estudo"
            aria-live="polite"
        >
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="rounded-full hover:bg-foreground/10"
                        aria-label="Voltar para página anterior"
                    >
                        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                            {isActive ? 'Foco Máximo' : 'Preparar'}
                        </h1>
                        <p className="text-sm font-bold text-primary/60 uppercase tracking-[0.2em]">
                            {isActive ? 'Continue concentrado no seu objetivo' : 'Tudo pronto para começar?'}
                        </p>
                    </div>
                </div>
                {currentTopic && (
                    <Badge
                        variant="outline"
                        className={`glass-card px-4 py-1 border-border/30 category-${currentTopic.category}`}
                        aria-label={`Categoria: ${CATEGORY_LABELS[currentTopic.category]}`}
                    >
                        {CATEGORY_LABELS[currentTopic.category]}
                    </Badge>
                )}
            </header>

            <main className="max-w-3xl mx-auto space-y-8">
                {/* Main Timer Display Card */}
                <article
                    className="glass-card relative overflow-hidden border-border/20 pt-12 pb-16 rounded-[2rem]"
                    aria-labelledby="timer-topic-name"
                >
                    {/* Atmospheric background glow */}
                    <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 ${isActive ? 'bg-primary/20 scale-110 opacity-100' : 'bg-primary/5 scale-90 opacity-50'}`}
                        aria-hidden="true"
                    />

                    <CardContent className="relative z-10 space-y-12 text-center">
                        <div>
                            <h2 id="timer-topic-name" className="text-2xl font-semibold mb-2 opacity-80">
                                {currentTopic?.name}
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                                <Target className="h-4 w-4" aria-hidden="true" />
                                <span>Meta de hoje: {currentTopic?.targetHours}h</span>
                            </div>
                        </div>

                        {/* Huge Digital Timer */}
                        <div
                            className="relative inline-block group"
                            role="timer"
                            aria-label={`Tempo decorrido: ${formatTime(currentSeconds)}`}
                            aria-atomic="true"
                        >
                            <div
                                className={`text-8xl md:text-9xl font-bold tracking-tighter tabular-nums transition-all duration-700 ${isActive && !isPaused ? 'text-foreground drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'text-foreground/40 grayscale'}`}
                                aria-hidden="true"
                            >
                                {formatTime(currentSeconds)}
                            </div>
                            {/* Visually hidden live timer for screen readers */}
                            <span className="sr-only" aria-live="polite" aria-atomic="true">
                                {formatTime(currentSeconds)}
                            </span>
                            {isPaused && (
                                <div
                                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse"
                                    role="status"
                                    aria-label="Cronômetro pausado"
                                >
                                    Pausado
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <nav className="flex flex-col items-center gap-6" aria-label="Controles do cronômetro">
                            <div className="flex items-center justify-center gap-4">
                                {!isActive ? (
                                    <Button
                                        size="lg"
                                        onClick={handleStart}
                                        className="h-20 w-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-110 active:scale-95 group"
                                        aria-label="Iniciar sessão de estudo"
                                    >
                                        <Play className="h-8 w-8 fill-current" aria-hidden="true" />
                                    </Button>
                                ) : (
                                    <>
                                        {!isPaused ? (
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                onClick={handlePause}
                                                className="h-16 w-16 rounded-full glass-card border-border/30 hover:bg-muted/20 transition-all hover:scale-105 active:scale-95"
                                                aria-label="Pausar cronômetro"
                                            >
                                                <Pause className="h-6 w-6" aria-hidden="true" />
                                            </Button>
                                        ) : (
                                            <Button
                                                size="lg"
                                                onClick={handleResume}
                                                className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                                aria-label="Retomar cronômetro"
                                            >
                                                <Play className="h-6 w-6 fill-current" aria-hidden="true" />
                                            </Button>
                                        )}
                                        <Button
                                            size="lg"
                                            variant="destructive"
                                            onClick={handleStop}
                                            className="h-16 w-16 rounded-full bg-red-500/80 hover:bg-red-500 text-destructive-foreground shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                                            aria-label="Finalizar sessão de estudo"
                                        >
                                            <Square className="h-6 w-6 fill-current" aria-hidden="true" />
                                        </Button>
                                    </>
                                )}
                            </div>
                            {!isActive && (
                                <p className="text-sm text-foreground/40 font-medium">
                                    Pressione para iniciar sua jornada
                                </p>
                            )}
                        </nav>
                    </CardContent>
                </article>

                {/* Info and Progress Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <article
                        className="glass-card border-border/20 p-6 flex flex-col justify-between rounded-[2rem]"
                        aria-labelledby="progress-title"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg" aria-hidden="true">
                                    <Target className="h-4 w-4 text-blue-400" />
                                </div>
                                <span id="progress-title" className="font-semibold text-foreground/80">Meta Geral</span>
                            </div>
                            <span className="text-sm font-bold text-blue-400" aria-label={`${progressValue}% completo`}>{progressValue}%</span>
                        </div>
                        <div className="space-y-3">
                            <Progress
                                value={progressValue}
                                className="h-2 bg-muted/30"
                                indicatorClassName="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                label="Progresso da meta"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                <span>{formatDuration(currentTotalTime + (isActive ? currentSeconds : 0))} acumulado</span>
                                <span>Restam {Math.max(0, (currentTopic?.targetHours || 0) - (currentTotalTime + currentSeconds) / 3600).toFixed(1)}h</span>
                            </div>
                        </div>
                    </article>

                    <article
                        className="glass-card border-border/20 p-8 flex flex-col justify-between group rounded-[2rem] hover:border-border/40 transition-all duration-500"
                        aria-labelledby="rewards-title"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-yellow-500/10 rounded-2xl group-hover:bg-yellow-500/20 transition-colors" aria-hidden="true">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                </div>
                                <span id="rewards-title" className="font-bold text-foreground/80 tracking-tight">Recompensas</span>
                            </div>
                            <div
                                className="flex items-center gap-1.5 text-[10px] font-black text-yellow-500 uppercase tracking-[0.15em] bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20"
                                aria-label="Multiplicador de pontos ativo"
                            >
                                <Trophy className="h-3 w-3" aria-hidden="true" />
                                Boost Ativo
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="text-4xl font-black tracking-tighter tabular-nums text-foreground" aria-label={`${Math.floor(currentSeconds / 60)} pontos ganhos`}>
                                +{Math.floor(currentSeconds / 60)} <span className="text-sm font-bold text-foreground/30 ml-1 tracking-normal">PONTOS</span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground font-bold leading-tight">Ganhando 1pt/min de estudo focado</p>
                            </div>
                        </div>
                    </article>
                </div>
            </main>

            {/* Live region for timer announcements */}
            <LiveRegion
                message={timerAnnouncement}
                aria-live="polite"
                clearAfter={5000}
            />
        </div>
    );
}
