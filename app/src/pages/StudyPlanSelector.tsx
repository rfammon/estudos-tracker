import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudyPlans } from '@/hooks/useStudyPlans'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    BookOpen,
    Clock,
    Calendar,
    Target,
    CheckCircle2,
    Sparkles,
    ArrowLeft,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePageAnnouncement } from '@/hooks/useAnnouncement'
import type { Database } from '@/types/database.types'

type Subject = Database['public']['Tables']['subjects']['Row']
type StudyPlanModel = Database['public']['Tables']['study_plan_models']['Row']

interface PlanModelSelectorProps {
    models: StudyPlanModel[]
    selectedModelId: string | null
    onSelect: (modelId: string) => void
    weeklyHours: number
}

function PlanModelSelector({ models, selectedModelId, onSelect, weeklyHours }: PlanModelSelectorProps) {
    const selectedModel = models.find(m => m.id === selectedModelId)

    return (
        <div className="space-y-3">
            {/* Segment Control */}
            <div className="flex bg-muted/30 rounded-xl p-1 gap-1">
                {models.map((model) => (
                    <button
                        key={model.id}
                        onClick={() => onSelect(model.id)}
                        className={cn(
                            "flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200",
                            selectedModelId === model.id
                                ? "bg-card shadow-md text-foreground border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                        )}
                        aria-pressed={selectedModelId === model.id}
                    >
                        {model.name}
                    </button>
                ))}
            </div>

            {/* Selected Model Details */}
            {selectedModelId && selectedModel && (
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl p-4 border border-primary/10">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-black text-primary">{weeklyHours}h</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">por semana</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-purple-500">{selectedModel.sessions_per_week}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">sessões/sem</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-pink-500">{selectedModel.session_duration_minutes}min</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">por sessão</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

interface SubjectCardProps {
    subject: Subject
    models: StudyPlanModel[]
    currentPlan?: { plan_model_id: string; weekly_hours: number }
    onSelectPlan: (modelId: string) => void
    isUpdating: boolean
}

function SubjectCard({ subject, models, currentPlan, onSelectPlan, isUpdating }: SubjectCardProps) {
    const [selectedModelId, setSelectedModelId] = useState<string | null>(
        currentPlan?.plan_model_id || null
    )

    const handleSelect = (modelId: string) => {
        setSelectedModelId(modelId)
        onSelectPlan(modelId)
    }

    const weeklyHours = currentPlan?.weekly_hours ||
        Math.round(5 * (models.find(m => m.id === selectedModelId)?.weekly_hours_multiplier || 1))

    return (
        <article
            className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border/20 transition-all duration-300 hover:shadow-xl hover:border-primary/10"
            aria-labelledby={`subject-${subject.id}-title`}
        >
            {/* Header */}
            <div
                className="p-6 relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${subject.color}10, ${subject.color}25)`
                }}
            >
                <div className="flex items-center gap-4">
                    <span className="text-4xl" aria-hidden="true">{subject.icon}</span>
                    <div>
                        <h3 id={`subject-${subject.id}-title`} className="text-lg font-black text-foreground tracking-tight">
                            {subject.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">{subject.description}</p>
                    </div>
                </div>

                {/* Loading overlay */}
                {isUpdating && (
                    <div className="absolute inset-0 bg-card/80 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                )}
            </div>

            {/* Plan Selector */}
            <div className="p-4 border-t border-border/10">
                <PlanModelSelector
                    models={models}
                    selectedModelId={selectedModelId}
                    onSelect={handleSelect}
                    weeklyHours={weeklyHours}
                />
            </div>

            {/* Status Badge */}
            {selectedModelId && (
                <div className="px-4 pb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 rounded-lg px-3 py-2 border border-emerald-500/20">
                        <CheckCircle2 className="h-4 w-4" />
                        Plano configurado
                    </div>
                </div>
            )}
        </article>
    )
}

export function StudyPlanSelector() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { subjects, planModels, userPlans, loading, updatePlan, getPlanForSubject } = useStudyPlans()
    const [updatingSubjectId, setUpdatingSubjectId] = useState<string | null>(null)

    // Announce page load to screen readers
    usePageAnnouncement('Seletor de Plano de Estudos')

    const handleSelectPlan = async (subjectId: string, planModelId: string) => {
        if (!user) {
            navigate('/auth')
            return
        }

        setUpdatingSubjectId(subjectId)
        await updatePlan(subjectId, planModelId)
        setUpdatingSubjectId(null)
    }

    // Calculate summary stats
    const totalWeeklyHours = userPlans.reduce((sum, p) => sum + p.weekly_hours, 0)
    const totalSessions = userPlans.reduce((sum, p) => sum + (p.plan_model?.sessions_per_week || 0), 0)
    const dailyAverage = Math.round(totalWeeklyHours / 7 * 10) / 10

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                        Carregando planos...
                    </p>
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
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Configuração de Estudos</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                        PLANOS DE ESTUDO
                    </h1>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                        <BookOpen className="h-3 w-3" aria-hidden="true" />
                        Escolha o modelo ideal para cada disciplina
                    </p>
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

            {/* Plan Models Legend */}
            <section className="flex flex-wrap justify-center gap-4" aria-label="Modelos de plano disponíveis">
                {planModels.map(model => (
                    <div
                        key={model.id}
                        className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm border border-border/20"
                    >
                        <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span className="text-xs font-bold text-foreground">{model.name}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                            ({model.sessions_per_week}x/sem, {model.session_duration_minutes}min)
                        </span>
                    </div>
                ))}
            </section>

            {/* Subjects Grid */}
            <section aria-label="Disciplinas disponíveis">
                {subjects.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-sm font-bold text-muted-foreground">
                            Nenhuma disciplina disponível
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map(subject => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                models={planModels}
                                currentPlan={getPlanForSubject(subject.id)}
                                onSelectPlan={(modelId) => handleSelectPlan(subject.id, modelId)}
                                isUpdating={updatingSubjectId === subject.id}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Summary */}
            {userPlans.length > 0 && (
                <section
                    className="bg-card rounded-2xl shadow-lg p-6 border border-border/20"
                    aria-labelledby="summary-title"
                >
                    <h2 id="summary-title" className="text-lg font-black text-foreground tracking-tight mb-6 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                        Resumo da Semana
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <p className="text-3xl font-black text-primary">{userPlans.length}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Disciplinas</p>
                        </div>
                        <div className="text-center p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
                            <div className="flex items-center justify-center gap-1">
                                <Clock className="h-4 w-4 text-purple-500" aria-hidden="true" />
                                <p className="text-3xl font-black text-purple-500">{totalWeeklyHours}h</p>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Total/sem</p>
                        </div>
                        <div className="text-center p-4 bg-pink-500/5 rounded-xl border border-pink-500/10">
                            <div className="flex items-center justify-center gap-1">
                                <Calendar className="h-4 w-4 text-pink-500" aria-hidden="true" />
                                <p className="text-3xl font-black text-pink-500">{totalSessions}</p>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Sessões/sem</p>
                        </div>
                        <div className="text-center p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <p className="text-3xl font-black text-emerald-500">{dailyAverage}h</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Média/dia</p>
                        </div>
                    </div>

                    {/* Configured Plans List */}
                    <div className="mt-6 pt-6 border-t border-border/10">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
                            Planos Configurados
                        </h3>
                        <ul className="space-y-2" role="list">
                            {userPlans.map(plan => (
                                <li
                                    key={plan.id}
                                    className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg" aria-hidden="true">{plan.subject?.icon}</span>
                                        <span className="text-sm font-bold text-foreground">{plan.subject?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase border-border/20">
                                            {plan.plan_model?.name}
                                        </Badge>
                                        <span className="text-xs font-bold text-primary">{plan.weekly_hours}h/sem</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* Empty State for Non-Logged Users */}
            {!user && (
                <section
                    className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center"
                    aria-label="Login necessário"
                >
                    <BookOpen className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                    <h2 className="text-lg font-black text-foreground mb-2">Faça login para salvar seus planos</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Você pode visualizar os planos, mas precisa estar logado para salvar suas configurações.
                    </p>
                    <Button
                        onClick={() => navigate('/auth')}
                        className="bg-primary hover:bg-primary/80 text-[10px] font-black uppercase tracking-widest px-8 h-12 rounded-xl"
                    >
                        Entrar / Criar Conta
                    </Button>
                </section>
            )}
        </div>
    )
}
