import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTopicStore, useSessionStore, useGamificationStore } from '@/store';
import { useAssessmentStore, generateSampleAssessments } from '@/store/use-assessment-store';
import { Topic, TopicCategory, TopicPriority, TopicFormData, LearningObjective, LearningObjectiveFormData, CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS } from '@/types';
import { Assessment, AssessmentResult } from '@/types/assessment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Plus,
    Pencil,
    Trash2,
    Play,
    Clock,
    Search,
    Filter,
    BookOpen,
    Target,
    ChevronDown,
    ChevronUp,
    ClipboardCheck
} from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import toast from 'react-hot-toast';
import { usePageAnnouncement, useStatusAnnouncement } from '@/hooks/useAnnouncement';
import { LearningObjectiveList, AddObjectiveModal } from '@/components/learning-objectives';
import { AssessmentList, AssessmentView } from '@/components/assessment';

export function Topics() {
    const navigate = useNavigate();
    const { topics, addTopic, updateTopic, deleteTopic, addObjective, updateObjective, completeObjective, removeObjective, getObjectiveProgress } = useTopicStore();
    const { getTotalTimeByTopic } = useSessionStore();
    const { incrementCompletedObjectives } = useGamificationStore();
    const {
        getAssessmentsByTopic,
        addAssessment,
        calculateResultXP
    } = useAssessmentStore();

    // Accessibility hooks
    usePageAnnouncement('Biblioteca de Matérias');
    const { announceSuccess, announceError } = useStatusAnnouncement();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    // Learning Objectives state
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
    const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
    const [editingObjective, setEditingObjective] = useState<LearningObjective | null>(null);
    const [topicForObjective, setTopicForObjective] = useState<Topic | null>(null);

    // Assessment state
    const [activeAssessmentTopic, setActiveAssessmentTopic] = useState<Topic | null>(null);
    const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<TopicCategory | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<TopicPriority | 'all'>('all');

    const [formData, setFormData] = useState<TopicFormData>({
        name: '',
        description: '',
        category: 'gramatica',
        priority: 'media',
        targetHours: 10,
    });

    const resetForm = useCallback(() => {
        setFormData({
            name: '',
            description: '',
            category: 'gramatica',
            priority: 'media',
            targetHours: 10,
        });
    }, []);

    const handleCreate = useCallback(() => {
        if (!formData.name.trim() || formData.name.length < 3) {
            announceError('O nome deve ter pelo menos 3 caracteres');
            toast.error('O nome deve ter pelo menos 3 caracteres');
            return;
        }
        addTopic(formData);
        announceSuccess('Matéria criada com sucesso');
        toast.success('Matéria criada com sucesso!');
        setIsCreateOpen(false);
        resetForm();
    }, [formData, addTopic, announceSuccess, announceError, resetForm]);

    const handleEdit = useCallback(() => {
        if (!selectedTopic) return;
        if (!formData.name.trim() || formData.name.length < 3) {
            announceError('O nome deve ter pelo menos 3 caracteres');
            toast.error('O nome deve ter pelo menos 3 caracteres');
            return;
        }
        updateTopic(selectedTopic.id, formData);
        announceSuccess('Matéria atualizada com sucesso');
        toast.success('Matéria atualizada com sucesso!');
        setIsEditOpen(false);
        setSelectedTopic(null);
        resetForm();
    }, [selectedTopic, formData, updateTopic, announceSuccess, announceError, resetForm]);

    const handleDelete = useCallback(() => {
        if (!selectedTopic) return;
        deleteTopic(selectedTopic.id);
        announceSuccess('Matéria excluída com sucesso');
        toast.success('Matéria excluída com sucesso!');
        setIsDeleteOpen(false);
        setSelectedTopic(null);
    }, [selectedTopic, deleteTopic, announceSuccess]);

    const openEditDialog = useCallback((topic: Topic) => {
        setSelectedTopic(topic);
        setFormData({
            name: topic.name,
            description: topic.description,
            category: topic.category,
            priority: topic.priority,
            targetHours: topic.targetHours,
        });
        setIsEditOpen(true);
    }, []);

    const openDeleteDialog = useCallback((topic: Topic) => {
        setSelectedTopic(topic);
        setIsDeleteOpen(true);
    }, []);

    // Toggle topic expansion for objectives
    const toggleTopicExpansion = useCallback((topicId: string) => {
        setExpandedTopics((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(topicId)) {
                newSet.delete(topicId);
            } else {
                newSet.add(topicId);
            }
            return newSet;
        });
    }, []);

    // Objective handlers
    const handleAddObjective = useCallback((topic: Topic) => {
        setTopicForObjective(topic);
        setEditingObjective(null);
        setIsObjectiveModalOpen(true);
    }, []);

    const handleEditObjective = useCallback((topic: Topic, objective: LearningObjective) => {
        setTopicForObjective(topic);
        setEditingObjective(objective);
        setIsObjectiveModalOpen(true);
    }, []);

    const handleObjectiveSubmit = useCallback((data: LearningObjectiveFormData) => {
        if (!topicForObjective) return;

        if (editingObjective) {
            updateObjective(topicForObjective.id, editingObjective.id, data);
            toast.success('Objetivo atualizado!');
        } else {
            addObjective(topicForObjective.id, data);
            toast.success('Objetivo adicionado!');
        }

        setIsObjectiveModalOpen(false);
        setTopicForObjective(null);
        setEditingObjective(null);
    }, [topicForObjective, editingObjective, addObjective, updateObjective]);

    const handleCompleteObjective = useCallback((topicId: string, objectiveId: string) => {
        const result = completeObjective(topicId, objectiveId);
        if (result.xpEarned > 0) {
            // Update gamification store with XP and increment completed objectives
            incrementCompletedObjectives(result.xpEarned);
            toast.success(`Objetivo concluído! +${result.xpEarned} XP`);
            announceSuccess(`Objetivo concluído! Você ganhou ${result.xpEarned} XP`);
        }
    }, [completeObjective, announceSuccess, incrementCompletedObjectives]);

    const handleDeleteObjective = useCallback((topicId: string, objectiveId: string) => {
        removeObjective(topicId, objectiveId);
        toast.success('Objetivo removido');
    }, [removeObjective]);

    // Assessment handlers
    const handleOpenAssessments = useCallback((topic: Topic) => {
        // Check if topic has assessments, if not generate sample ones
        const existingAssessments = getAssessmentsByTopic(topic.id);
        if (existingAssessments.length === 0) {
            const sampleAssessments = generateSampleAssessments(topic.id, topic.name);
            sampleAssessments.forEach(assessment => addAssessment(assessment));
        }
        setActiveAssessmentTopic(topic);
    }, [getAssessmentsByTopic, addAssessment]);

    const handleStartAssessment = useCallback((assessmentId: string) => {
        const assessments = activeAssessmentTopic ? getAssessmentsByTopic(activeAssessmentTopic.id) : [];
        const assessment = assessments.find(a => a.id === assessmentId);
        if (assessment) {
            setActiveAssessment(assessment);
        }
    }, [activeAssessmentTopic, getAssessmentsByTopic]);

    const handleViewAssessmentResults = useCallback((_assessmentId: string) => {
        // For now, just show toast - in future could open a results modal
        toast('Visualização de resultados em desenvolvimento', { icon: '📊' });
    }, []);

    const handleAssessmentComplete = useCallback((result: AssessmentResult) => {
        if (result && activeAssessment) {
            const xpEarned = calculateResultXP(activeAssessment.id, result);
            const isPerfect = result.score === 100;

            // Update gamification store with assessment completion
            const { incrementAssessments, updateQuizStreak } = useGamificationStore.getState();
            incrementAssessments(xpEarned, isPerfect);
            updateQuizStreak();

            toast.success(`Avaliação finalizada! +${xpEarned} XP`);
            announceSuccess(`Avaliação finalizada com ${result.score}% de acerto!`);
        }
        setActiveAssessment(null);
    }, [activeAssessment, calculateResultXP, announceSuccess]);

    const handleAssessmentCancel = useCallback(() => {
        setActiveAssessment(null);
    }, []);

    const handleCloseAssessmentTopic = useCallback(() => {
        setActiveAssessmentTopic(null);
        setActiveAssessment(null);
    }, []);

    const filteredTopics = topics.filter(topic => {
        const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || topic.category === categoryFilter;
        const matchesPriority = priorityFilter === 'all' || topic.priority === priorityFilter;
        return matchesSearch && matchesCategory && matchesPriority;
    });

    // Keyboard navigation handler
    const handleKeyDown = useCallback((event: React.KeyboardEvent, topic: Topic) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navigate(`/timer/${topic.id}`);
        }
    }, [navigate]);

    return (
        <div className="space-y-8 pb-10" role="region" aria-label="Biblioteca de matérias">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
                        Biblioteca
                    </h1>
                    <p className="text-sm font-bold text-primary/60 uppercase tracking-[0.2em] mt-2">Gerencie suas matérias • trilhas de aprendizado</p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-electric-blue hover:bg-electric-blue/80 blue-glow-button transition-all duration-300"
                    aria-label="Criar nova matéria"
                >
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    Nova Matéria
                </Button>
            </header>

            {/* Filters */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5" role="search" aria-label="Filtrar matérias">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            placeholder="Buscar matérias..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-muted/30 border-border/50 focus:border-electric-blue transition-colors rounded-xl"
                            aria-label="Buscar matérias pelo nome ou descrição"
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onValueChange={(v) => setCategoryFilter(v as TopicCategory | 'all')}
                        aria-label="Filtrar por categoria"
                    >
                        <SelectTrigger className="w-full md:w-[200px] bg-muted/30 border-border/50 rounded-xl">
                            <Filter className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                            <SelectItem value="all">Todas</SelectItem>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={priorityFilter}
                        onValueChange={(v) => setPriorityFilter(v as TopicPriority | 'all')}
                        aria-label="Filtrar por prioridade"
                    >
                        <SelectTrigger className="w-full md:w-[200px] bg-muted/30 border-border/50 rounded-xl">
                            <SelectValue placeholder="Prioridade" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                            <SelectItem value="all">Todas</SelectItem>
                            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Topics List */}
            {filteredTopics.length === 0 ? (
                <div
                    className="glass-card flex flex-col items-center justify-center py-20 rounded-2xl"
                    role="status"
                    aria-label="Nenhuma matéria encontrada"
                >
                    <div className="p-6 bg-muted/30 rounded-full mb-6">
                        <BookOpen className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <h2 className="text-xl font-black text-foreground uppercase tracking-tighter mb-2 italic">Nenhuma Matéria Encontrada</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm text-center">
                        {topics.length === 0
                            ? 'Sua jornada começa com o primeiro passo. Crie sua primeira matéria de estudo agora!'
                            : 'Não encontramos o que você procura. Tente ajustar seus filtros de busca.'}
                    </p>
                    {topics.length === 0 && (
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-electric-blue hover:bg-electric-blue/80 blue-glow-button"
                            aria-label="Criar primeira matéria"
                        >
                            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                            Criar Primeira Matéria
                        </Button>
                    )}
                </div>
            ) : (
                <ul className="grid gap-6" role="list" aria-label="Lista de matérias">
                    {filteredTopics.map((topic) => {
                        const totalTime = getTotalTimeByTopic(topic.id);
                        const progress = topic.targetHours > 0
                            ? Math.round((totalTime / 3600 / topic.targetHours) * 100)
                            : 0;
                        const isExpanded = expandedTopics.has(topic.id);
                        const objectiveProgress = getObjectiveProgress(topic.id);

                        return (
                            <li
                                key={topic.id}
                                className={`glass-card glass-card-hover rounded-[2rem] overflow-hidden category-${topic.category} group transition-all duration-500 border border-border/20 bg-card/5`}
                                role="article"
                                aria-labelledby={`topic-${topic.id}-title`}
                            >
                                <div className="category-indicator w-1" aria-hidden="true" />
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3
                                                    id={`topic-${topic.id}-title`}
                                                    className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors text-foreground/90"
                                                >
                                                    {topic.name}
                                                </h3>
                                                <div className="flex gap-2" role="list" aria-label="Tags da matéria">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[9px] uppercase font-black border-border/10 text-muted-foreground bg-card/5 rounded-full px-3"
                                                        role="listitem"
                                                    >
                                                        {CATEGORY_LABELS[topic.category]}
                                                    </Badge>
                                                    <Badge
                                                        className={`text-[9px] uppercase font-black rounded-full px-3 ${topic.priority === 'alta' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            topic.priority === 'media' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            } border`}
                                                        role="listitem"
                                                        aria-label={`Prioridade: ${PRIORITY_LABELS[topic.priority]}`}
                                                    >
                                                        {PRIORITY_LABELS[topic.priority]}
                                                    </Badge>
                                                    <Badge
                                                        className={`text-[9px] uppercase font-black rounded-full px-3 ${topic.status === 'dominado' ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                                                            topic.status === 'em_progresso' ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' :
                                                                'bg-card/5 text-muted-foreground border-border/10'
                                                            } border`}
                                                        role="listitem"
                                                        aria-label={`Status: ${STATUS_LABELS[topic.status]}`}
                                                    >
                                                        {STATUS_LABELS[topic.status]}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {topic.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{topic.description}</p>
                                            )}
                                            <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-lg border border-border/20">
                                                    <Clock className="h-3 w-3 text-electric-blue" aria-hidden="true" />
                                                    <span aria-label={`${formatDuration(totalTime)} de ${topic.targetHours} horas`}>
                                                        {formatDuration(totalTime)}
                                                    </span>
                                                    <span className="text-muted-foreground/40" aria-hidden="true">/</span>
                                                    <span>{topic.targetHours}h</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground/60 uppercase font-bold text-[9px]">Progresso</span>
                                                    <span className="font-bold text-foreground" aria-label={`${Math.min(progress, 100)}% completo`}>
                                                        {Math.min(progress, 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="relative h-2 w-full bg-card/5 rounded-full overflow-hidden"
                                                role="progressbar"
                                                aria-valuenow={Math.min(progress, 100)}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-label={`Progresso: ${Math.min(progress, 100)}%`}
                                            >
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-700 ease-out"
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                            </div>

                                            {/* Objectives Progress Mini */}
                                            {objectiveProgress.total > 0 && (
                                                <div className="flex items-center gap-3 pt-2">
                                                    <div className="flex items-center gap-2">
                                                        <Target className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                            Objetivos
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 max-w-[120px]">
                                                        <div className="relative h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                                                            <div
                                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                                                                style={{ width: `${objectiveProgress.percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-foreground">
                                                        {objectiveProgress.completed}/{objectiveProgress.total}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                onClick={() => navigate(`/timer/${topic.id}`)}
                                                onKeyDown={(e) => handleKeyDown(e, topic)}
                                                className="bg-electric-blue hover:bg-electric-blue/80 text-primary-foreground font-bold h-11 px-6 rounded-xl blue-glow-button transition-all duration-300 group-hover:scale-105"
                                                aria-label={`Iniciar sessão de estudo: ${topic.name}`}
                                            >
                                                <Play className="mr-2 h-4 w-4 fill-current" aria-hidden="true" />
                                                Estudar
                                            </Button>
                                            <Button
                                                onClick={() => handleOpenAssessments(topic)}
                                                variant="outline"
                                                className="h-11 px-4 rounded-xl border-border/50 bg-muted/20 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 transition-all"
                                                aria-label={`Ver avaliações: ${topic.name}`}
                                            >
                                                <ClipboardCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                                                Avaliações
                                            </Button>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => toggleTopicExpansion(topic.id)}
                                                    className={`h-11 w-11 rounded-xl border-border/50 transition-all ${isExpanded ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/20 hover:bg-muted/40 hover:text-foreground'}`}
                                                    aria-label={isExpanded ? 'Ocultar objetivos' : 'Ver objetivos'}
                                                    aria-expanded={isExpanded}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => openEditDialog(topic)}
                                                    className="h-11 w-11 rounded-xl border-border/50 bg-muted/20 hover:bg-muted/40 hover:text-foreground transition-all"
                                                    aria-label={`Editar matéria: ${topic.name}`}
                                                >
                                                    <Pencil className="h-4 w-4" aria-hidden="true" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => openDeleteDialog(topic)}
                                                    className="h-11 w-11 rounded-xl border-border/50 bg-muted/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                                                    aria-label={`Excluir matéria: ${topic.name}`}
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Objectives Section */}
                                    {isExpanded && (
                                        <div className="mt-6 pt-6 border-t border-border/20" role="region" aria-label={`Objetivos de ${topic.name}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                                                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                                                        Objetivos de Aprendizagem
                                                    </h4>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAddObjective(topic)}
                                                    className="h-8 rounded-xl border-border/50 bg-muted/20 hover:bg-muted/40 text-xs font-bold"
                                                >
                                                    <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                                                    Adicionar
                                                </Button>
                                            </div>
                                            <LearningObjectiveList
                                                objectives={topic.objectives || []}
                                                onComplete={(objectiveId) => handleCompleteObjective(topic.id, objectiveId)}
                                                onEdit={(objective) => handleEditObjective(topic, objective)}
                                                onDelete={(objectiveId) => handleDeleteObjective(topic.id, objectiveId)}
                                                showFilters={true}
                                                showProgress={true}
                                                emptyMessage="Nenhum objetivo definido. Clique em 'Adicionar' para criar seu primeiro objetivo de aprendizagem."
                                            />
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent
                    className="glass-card border-border/50 max-w-lg"
                    aria-labelledby="create-dialog-title"
                    aria-describedby="create-dialog-description"
                >
                    <DialogHeader>
                        <DialogTitle id="create-dialog-title" className="text-2xl font-black tracking-tight">Nova Matéria</DialogTitle>
                        <DialogDescription id="create-dialog-description" className="sr-only">
                            Preencha os campos para criar uma nova matéria de estudo
                        </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-6 py-6" onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Nome *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Gramática Avançada"
                                className="bg-muted/30 border-border/50 rounded-xl focus:border-electric-blue"
                                aria-required="true"
                                aria-invalid={formData.name.length > 0 && formData.name.length < 3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Descrição</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ex: Regência verbal, nominal e crase"
                                className="bg-muted/30 border-border/50 rounded-xl focus:border-electric-blue"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Categoria</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(v) => setFormData({ ...formData, category: v as TopicCategory })}
                                >
                                    <SelectTrigger id="category" className="bg-muted/30 border-border/50 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card border-border/50">
                                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Prioridade</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(v) => setFormData({ ...formData, priority: v as TopicPriority })}
                                >
                                    <SelectTrigger id="priority" className="bg-muted/30 border-border/50 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card border-border/50">
                                        {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetHours" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Meta Detalhada (Horas)</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="targetHours"
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={formData.targetHours}
                                    onChange={(e) => setFormData({ ...formData, targetHours: parseInt(e.target.value) || 10 })}
                                    className="bg-muted/30 border-border/50 rounded-xl focus:border-electric-blue w-24"
                                    aria-describedby="targetHours-description"
                                />
                                <p id="targetHours-description" className="text-[10px] text-muted-foreground leading-tight">
                                    Tempo sugerido para alcançar a maestria nesta matéria. <br />
                                    Seus stats de progresso serão baseados neste valor.
                                </p>
                            </div>
                        </div>
                    </form>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsCreateOpen(false)}
                            className="rounded-xl hover:bg-accent text-muted-foreground"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-8 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            Criar Matéria
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent
                    className="glass-card border-border/50 max-w-lg"
                    aria-labelledby="edit-dialog-title"
                    aria-describedby="edit-dialog-description"
                >
                    <DialogHeader>
                        <DialogTitle id="edit-dialog-title" className="text-2xl font-black tracking-tight">Ajustar Mestria</DialogTitle>
                        <DialogDescription id="edit-dialog-description" className="sr-only">
                            Edite os campos para atualizar a matéria
                        </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-6 py-6" onSubmit={(e) => { e.preventDefault(); handleEdit(); }}>
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Nome</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-muted/30 border-border/50 rounded-xl focus:border-electric-blue"
                                aria-required="true"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Descrição</Label>
                            <Input
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-muted/30 border-border/50 rounded-xl focus:border-electric-blue"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Categoria</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(v) => setFormData({ ...formData, category: v as TopicCategory })}
                                >
                                    <SelectTrigger id="edit-category" className="bg-muted/30 border-border/50 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card border-border/50">
                                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-priority" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Prioridade</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(v) => setFormData({ ...formData, priority: v as TopicPriority })}
                                >
                                    <SelectTrigger id="edit-priority" className="bg-muted/30 border-border/50 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card border-border/50">
                                        {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-targetHours" className="text-xs font-black uppercase text-muted-foreground tracking-widest">Meta de Horas</Label>
                            <Input
                                id="edit-targetHours"
                                type="number"
                                min="1"
                                max="1000"
                                value={formData.targetHours}
                                onChange={(e) => setFormData({ ...formData, targetHours: parseInt(e.target.value) || 10 })}
                                className="bg-muted/30 border-border/50 rounded-xl focus:border-electric-blue w-24"
                            />
                        </div>
                    </form>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditOpen(false)}
                            className="rounded-xl hover:bg-accent text-muted-foreground"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEdit}
                            className="bg-electric-blue hover:bg-blue-600 text-white font-bold rounded-xl px-8 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                        >
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent
                    className="glass-card border-red-500/20 max-w-md"
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <DialogHeader>
                        <DialogTitle id="delete-dialog-title" className="text-2xl font-black tracking-tight text-red-500">Eliminar Matéria</DialogTitle>
                        <DialogDescription id="delete-dialog-description">
                            Tem certeza que deseja excluir <strong>{selectedTopic?.name}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <div
                            className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-400 leading-relaxed"
                            role="alert"
                        >
                            <p className="font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Trash2 className="h-3 w-3" aria-hidden="true" />
                                Aviso Irreversível
                            </p>
                            Esta ação removerá permanentemente todos os registros, sessões de estudo e XP acumulados nesta matéria.
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteOpen(false)}
                            className="rounded-xl hover:bg-accent text-muted-foreground"
                        >
                            Manter
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 font-bold rounded-xl px-8 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                            Confirmar Exclusão
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Objective Modal */}
            <AddObjectiveModal
                isOpen={isObjectiveModalOpen}
                onClose={() => {
                    setIsObjectiveModalOpen(false);
                    setTopicForObjective(null);
                    setEditingObjective(null);
                }}
                onSubmit={handleObjectiveSubmit}
                topicName={topicForObjective?.name || ''}
                editObjective={editingObjective}
            />

            {/* Assessment Modal */}
            <Dialog open={!!activeAssessmentTopic && !activeAssessment} onOpenChange={(open) => !open && handleCloseAssessmentTopic()}>
                <DialogContent className="glass-card border-border/50 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <ClipboardCheck className="h-6 w-6 text-purple-400" />
                            Avaliações - {activeAssessmentTopic?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Teste seus conhecimentos e acompanhe seu progresso
                        </DialogDescription>
                    </DialogHeader>
                    {activeAssessmentTopic && (
                        <AssessmentList
                            topicId={activeAssessmentTopic.id}
                            onStartAssessment={handleStartAssessment}
                            onViewResults={handleViewAssessmentResults}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Active Assessment View */}
            {activeAssessment && (
                <Dialog open={!!activeAssessment} onOpenChange={(open) => !open && handleAssessmentCancel()}>
                    <DialogContent className="glass-card border-border/50 max-w-4xl max-h-[95vh] overflow-y-auto">
                        <AssessmentView
                            assessment={activeAssessment}
                            onComplete={handleAssessmentComplete}
                            onCancel={handleAssessmentCancel}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
