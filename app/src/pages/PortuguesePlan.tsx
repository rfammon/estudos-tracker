import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortuguesePlan } from '@/hooks/usePortuguesePlan'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
    BookOpen,
    Clock,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Circle,
    PlayCircle,
    ArrowLeft,
    Loader2,
    Target,
    Calendar,
    Award,
    TrendingUp,
    Sparkles
} from 'lucide-react'
import { seedPortuguesePlan } from '@/lib/seed-portuguese-plan'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { usePageAnnouncement } from '@/hooks/useAnnouncement'
import type { PlanMonthWithWeeks, PlanWeekWithTopics, StudyTopicWithProgress } from '@/types/database.types'

// Animation variants
const accordionVariants = {
    closed: { height: 0, opacity: 0, overflow: 'hidden' },
    open: { height: 'auto', opacity: 1, overflow: 'hidden' }
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
}

interface TopicItemProps {
    topic: StudyTopicWithProgress
    onToggle: (topicId: string, currentStatus: string) => void
    isUpdating: boolean
}

function TopicItem({ topic, onToggle, isUpdating }: TopicItemProps) {
    const status = topic.progress?.status || 'not_started'

    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            case 'in_progress':
                return <PlayCircle className="h-5 w-5 text-amber-500" />
            default:
                return <Circle className="h-5 w-5 text-muted-foreground/30" />
        }
    }

    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'border-emerald-500/30 bg-emerald-500/5'
            case 'in_progress':
                return 'border-amber-500/30 bg-amber-500/5'
            default:
                return 'border-border/20 bg-card'
        }
    }

    return (
        <motion.button
            variants={itemVariants}
            onClick={() => onToggle(topic.id, status)}
            disabled={isUpdating}
            className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200",
                "hover:shadow-md hover:border-primary/20",
                getStatusColor(),
                isUpdating && "opacity-50 cursor-wait"
            )}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {isUpdating ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                        getStatusIcon()
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground tracking-tight">
                        {topic.title}
                    </h4>
                    {topic.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {topic.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                        {topic.estimated_minutes && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <Clock className="h-3 w-3" />
                                {topic.estimated_minutes}min
                            </span>
                        )}
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            status === 'completed' && "text-emerald-500 bg-emerald-500/10",
                            status === 'in_progress' && "text-amber-500 bg-amber-500/10",
                            status === 'not_started' && "text-muted-foreground bg-muted/20"
                        )}>
                            {status === 'completed' ? 'Concluído' : status === 'in_progress' ? 'Em progresso' : 'Não iniciado'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.button>
    )
}

interface WeekSectionProps {
    week: PlanWeekWithTopics
    onToggleTopic: (topicId: string, currentStatus: string) => void
    updatingTopicId: string | null
}

function WeekSection({ week, onToggleTopic, updatingTopicId }: WeekSectionProps) {
    const [isOpen, setIsOpen] = useState(false)

    const completedTopics = week.topics.filter(t => t.progress?.status === 'completed').length
    const totalTopics = week.topics.length
    const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

    return (
        <div className="border border-border/20 rounded-xl overflow-hidden bg-card/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                    <div>
                        <h4 className="text-sm font-bold text-foreground tracking-tight">
                            Semana {week.week_number}: {week.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">
                            {completedTopics}/{totalTopics} tópicos concluídos
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-20 h-2 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                        {Math.round(progressPercentage)}%
                    </span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={accordionVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-4 pt-0 space-y-3">
                            {week.topics.map((topic) => (
                                <TopicItem
                                    key={topic.id}
                                    topic={topic}
                                    onToggle={onToggleTopic}
                                    isUpdating={updatingTopicId === topic.id}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

interface MonthAccordionProps {
    month: PlanMonthWithWeeks
    onToggleTopic: (topicId: string, currentStatus: string) => void
    updatingTopicId: string | null
}

function MonthAccordion({ month, onToggleTopic, updatingTopicId }: MonthAccordionProps) {
    const [isOpen, setIsOpen] = useState(month.month_number === 1)

    // Calculate month progress
    let totalTopics = 0
    let completedTopics = 0
    month.weeks.forEach(week => {
        totalTopics += week.topics.length
        completedTopics += week.topics.filter(t => t.progress?.status === 'completed').length
    })
    const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

    const monthColors = [
        { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-500' },
        { bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-500' },
        { bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-500' }
    ]
    const colorScheme = monthColors[month.month_number - 1] || monthColors[0]

    return (
        <motion.div
            variants={itemVariants}
            className={cn(
                "rounded-2xl border overflow-hidden bg-gradient-to-br",
                colorScheme.bg,
                colorScheme.border
            )}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg",
                        "bg-white/10 backdrop-blur-sm",
                        colorScheme.text
                    )}>
                        {month.month_number}
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-black text-foreground tracking-tight">
                            {month.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            {month.objective}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                            {completedTopics}/{totalTopics} tópicos
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                            {Math.round(progressPercentage)}% concluído
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className={cn("h-5 w-5", colorScheme.text)} />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={accordionVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 space-y-4">
                            {month.weeks.map((week) => (
                                <WeekSection
                                    key={week.id}
                                    week={week}
                                    onToggleTopic={onToggleTopic}
                                    updatingTopicId={updatingTopicId}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function PortuguesePlan() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { plan, loading, error, progress, updateTopicProgress, refreshPlan } = usePortuguesePlan()
    const [updatingTopicId, setUpdatingTopicId] = useState<string | null>(null)
    const [seeding, setSeeding] = useState(false)

    // Announce page load to screen readers
    usePageAnnouncement('Plano de Estudos de Português')

    const handleSeedPlan = async () => {
        if (!user) {
            toast.error('Você precisa estar logado para inicializar o plano')
            return
        }

        setSeeding(true)
        try {
            const result = await seedPortuguesePlan()
            if (result.success) {
                toast.success('Plano de estudos criado com sucesso!')
                refreshPlan()
            } else {
                toast.error('Erro ao criar plano de estudos')
            }
        } catch (err) {
            console.error('Error seeding plan:', err)
            toast.error('Erro ao criar plano de estudos')
        } finally {
            setSeeding(false)
        }
    }

    const handleToggleTopic = async (topicId: string, currentStatus: string) => {
        if (!user) {
            navigate('/auth')
            return
        }

        setUpdatingTopicId(topicId)

        try {
            // Cycle through statuses: not_started -> in_progress -> completed -> not_started
            let newStatus: 'not_started' | 'in_progress' | 'completed'
            switch (currentStatus) {
                case 'not_started':
                    newStatus = 'in_progress'
                    break
                case 'in_progress':
                    newStatus = 'completed'
                    break
                case 'completed':
                    newStatus = 'not_started'
                    break
                default:
                    newStatus = 'in_progress'
            }

            await updateTopicProgress(topicId, newStatus)
        } catch (err) {
            console.error('Error updating topic progress:', err)
        } finally {
            setUpdatingTopicId(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Carregando plano de estudos...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <BookOpen className="h-12 w-12 text-destructive mx-auto" />
                    <p className="text-sm font-bold text-destructive">
                        Erro ao carregar plano de estudos
                    </p>
                    <p className="text-xs text-muted-foreground">{error}</p>
                    <Button onClick={refreshPlan} variant="outline">
                        Tentar novamente
                    </Button>
                </div>
            </div>
        )
    }

    if (!plan) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md px-4">
                    <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                        <BookOpen className="h-12 w-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-foreground">Plano de Português</h2>
                        <p className="text-sm text-muted-foreground">
                            Nenhum plano de estudos encontrado. Clique no botão abaixo para inicializar o plano de estudos de Português.
                        </p>
                    </div>
                    <Button
                        onClick={handleSeedPlan}
                        disabled={seeding || !user}
                        className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-xl"
                    >
                        {seeding ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Criando plano...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Inicializar Plano de Português
                            </>
                        )}
                    </Button>
                    {!user && (
                        <p className="text-xs text-muted-foreground">
                            Você precisa estar logado para inicializar o plano
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/20 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.8)]" aria-hidden="true" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Plano de Estudos</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                        PORTUGUÊS COMPLETO
                    </h1>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                        <BookOpen className="h-3 w-3" aria-hidden="true" />
                        {plan.total_weeks} semanas • {plan.daily_goal_minutes}min/dia
                    </p>
                    {plan.description && (
                        <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
                            {plan.description}
                        </p>
                    )}
                </div>
                <nav className="flex gap-3" aria-label="Ações">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="glass-card border-border/20 hover:bg-muted/10 text-[10px] font-black uppercase tracking-widest px-6 h-12 rounded-2xl"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Button>
                </nav>
            </header>

            {/* Progress Overview */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="Progresso geral">
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-card rounded-2xl p-6 border border-border/20 shadow-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                    </div>
                    <p className="text-3xl font-black text-foreground">{progress.total}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">tópicos</p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl p-6 border border-border/20 shadow-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Concluídos</span>
                    </div>
                    <p className="text-3xl font-black text-emerald-500">{progress.completed}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">tópicos</p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="bg-card rounded-2xl p-6 border border-border/20 shadow-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <PlayCircle className="h-4 w-4 text-amber-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Em progresso</span>
                    </div>
                    <p className="text-3xl font-black text-amber-500">{progress.inProgress}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">tópicos</p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="bg-card rounded-2xl p-6 border border-border/20 shadow-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Progresso</span>
                    </div>
                    <p className="text-3xl font-black text-purple-500">{progress.percentage}%</p>
                    <p className="text-[10px] text-muted-foreground font-medium">concluído</p>
                </motion.div>
            </section>

            {/* Overall Progress Bar */}
            <section className="bg-card rounded-2xl p-6 border border-border/20 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Progresso Geral
                    </h2>
                    <span className="text-sm font-bold text-primary">{progress.percentage}%</span>
                </div>
                <div className="h-4 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground">
                    <span>{progress.completed} concluídos</span>
                    <span>{progress.total - progress.completed} restantes</span>
                </div>
            </section>

            {/* Login Prompt for Non-Logged Users */}
            {!user && (
                <section
                    className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center"
                    aria-label="Login necessário"
                >
                    <BookOpen className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <h2 className="text-lg font-black text-foreground mb-2">Faça login para salvar seu progresso</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Você pode visualizar o plano, mas precisa estar logado para marcar tópicos como concluídos.
                    </p>
                    <Button
                        onClick={() => navigate('/auth')}
                        className="bg-primary hover:bg-primary/80 text-[10px] font-black uppercase tracking-widest px-8 h-12 rounded-xl"
                    >
                        Entrar / Criar Conta
                    </Button>
                </section>
            )}

            {/* Months Accordion */}
            <section aria-label="Meses do plano">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="space-y-6"
                >
                    {plan.months.map((month) => (
                        <MonthAccordion
                            key={month.id}
                            month={month}
                            onToggleTopic={handleToggleTopic}
                            updatingTopicId={updatingTopicId}
                        />
                    ))}
                </motion.div>
            </section>

            {/* Plan Info */}
            <section className="bg-card rounded-2xl p-6 border border-border/20 shadow-lg">
                <h2 className="text-lg font-black text-foreground tracking-tight mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Estrutura do Plano
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plan.months.map((month, index) => (
                        <div
                            key={month.id}
                            className="p-4 bg-muted/10 rounded-xl border border-border/10"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-black text-primary">{index + 1}º</span>
                                <span className="text-sm font-bold text-foreground">Mês</span>
                            </div>
                            <h3 className="text-sm font-bold text-foreground">{month.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{month.objective}</p>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                {month.weeks.length} semanas
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
