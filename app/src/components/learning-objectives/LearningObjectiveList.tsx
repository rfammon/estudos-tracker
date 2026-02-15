import { useState, useMemo, useCallback } from 'react';
import {
    LearningObjective,
    BloomLevel,
    BLOOM_LEVEL_LABELS,
} from '@/types';
import { LearningObjectiveCard } from './LearningObjectiveCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Target,
    Filter,
    CheckCircle2,
    Circle,
    ArrowUpDown,
} from 'lucide-react';

interface LearningObjectiveListProps {
    objectives: LearningObjective[];
    onComplete: (objectiveId: string) => void;
    onEdit?: (objective: LearningObjective) => void;
    onDelete?: (objectiveId: string) => void;
    showFilters?: boolean;
    showProgress?: boolean;
    emptyMessage?: string;
}

type SortOption = 'date' | 'bloom' | 'status';
type FilterOption = 'all' | 'completed' | 'pending';

export function LearningObjectiveList({
    objectives,
    onComplete,
    onEdit,
    onDelete,
    showFilters = true,
    showProgress = true,
    emptyMessage = 'Nenhum objetivo de aprendizagem definido.',
}: LearningObjectiveListProps) {
    const [sortBy, setSortBy] = useState<SortOption>('date');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [bloomFilter, setBloomFilter] = useState<BloomLevel | 'all'>('all');

    // Calculate progress
    const progress = useMemo(() => {
        const total = objectives.length;
        const completed = objectives.filter((o) => o.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, percentage };
    }, [objectives]);

    // Filter and sort objectives
    const processedObjectives = useMemo(() => {
        let filtered = [...objectives];

        // Apply status filter
        if (filterBy === 'completed') {
            filtered = filtered.filter((o) => o.completed);
        } else if (filterBy === 'pending') {
            filtered = filtered.filter((o) => !o.completed);
        }

        // Apply bloom level filter
        if (bloomFilter !== 'all') {
            filtered = filtered.filter((o) => o.bloomLevel === bloomFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    if (!a.targetDate) return 1;
                    if (!b.targetDate) return -1;
                    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
                case 'bloom':
                    const bloomOrder: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
                    return bloomOrder.indexOf(a.bloomLevel) - bloomOrder.indexOf(b.bloomLevel);
                case 'status':
                    if (a.completed === b.completed) return 0;
                    return a.completed ? 1 : -1;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [objectives, sortBy, filterBy, bloomFilter]);

    const handleComplete = useCallback(
        (objectiveId: string) => {
            onComplete(objectiveId);
        },
        [onComplete]
    );

    if (objectives.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center py-12 text-center"
                role="status"
                aria-label="Nenhum objetivo"
            >
                <div className="p-4 bg-muted/20 rounded-full mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4" role="region" aria-label="Lista de objetivos de aprendizagem">
            {/* Progress Bar */}
            {showProgress && (
                <div className="glass-card p-4 rounded-2xl border border-border/20 bg-card/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                Progresso dos Objetivos
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-foreground">
                                {progress.completed}/{progress.total}
                            </span>
                            <Badge
                                className={`text-[9px] font-black uppercase tracking-wider rounded-full ${progress.percentage === 100
                                    ? 'bg-emerald-500 text-white'
                                    : progress.percentage >= 50
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {progress.percentage}%
                            </Badge>
                        </div>
                    </div>
                    <div
                        className="relative h-2 w-full bg-muted/20 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${progress.completed} de ${progress.total} objetivos concluídos`}
                    >
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Filters */}
            {showFilters && objectives.length > 1 && (
                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <Select
                        value={filterBy}
                        onValueChange={(v) => setFilterBy(v as FilterOption)}
                    >
                        <SelectTrigger
                            className="w-[140px] h-9 bg-muted/30 border-border/50 rounded-xl text-xs"
                            aria-label="Filtrar por status"
                        >
                            <Filter className="h-3 w-3 mr-1 text-muted-foreground" aria-hidden="true" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                            <SelectItem value="all">
                                <span className="flex items-center gap-2">
                                    <Circle className="h-3 w-3" /> Todos
                                </span>
                            </SelectItem>
                            <SelectItem value="pending">
                                <span className="flex items-center gap-2">
                                    <Circle className="h-3 w-3 text-orange-500" /> Pendentes
                                </span>
                            </SelectItem>
                            <SelectItem value="completed">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Concluídos
                                </span>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Bloom Level Filter */}
                    <Select
                        value={bloomFilter}
                        onValueChange={(v) => setBloomFilter(v as BloomLevel | 'all')}
                    >
                        <SelectTrigger
                            className="w-[160px] h-9 bg-muted/30 border-border/50 rounded-xl text-xs"
                            aria-label="Filtrar por nível de Bloom"
                        >
                            <SelectValue placeholder="Nível Bloom" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                            <SelectItem value="all">Todos os níveis</SelectItem>
                            {Object.entries(BLOOM_LEVEL_LABELS).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select
                        value={sortBy}
                        onValueChange={(v) => setSortBy(v as SortOption)}
                    >
                        <SelectTrigger
                            className="w-[140px] h-9 bg-muted/30 border-border/50 rounded-xl text-xs"
                            aria-label="Ordenar por"
                        >
                            <ArrowUpDown className="h-3 w-3 mr-1 text-muted-foreground" aria-hidden="true" />
                            <SelectValue placeholder="Ordenar" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                            <SelectItem value="date">Data</SelectItem>
                            <SelectItem value="bloom">Nível Bloom</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Objectives List */}
            <ul className="space-y-3" role="list" aria-label="Objetivos">
                {processedObjectives.map((objective) => (
                    <li key={objective.id}>
                        <LearningObjectiveCard
                            objective={objective}
                            onComplete={handleComplete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </li>
                ))}
            </ul>

            {/* Empty Filtered State */}
            {processedObjectives.length === 0 && objectives.length > 0 && (
                <div
                    className="flex flex-col items-center justify-center py-8 text-center"
                    role="status"
                >
                    <Filter className="h-6 w-6 text-muted-foreground mb-2" aria-hidden="true" />
                    <p className="text-muted-foreground text-sm">
                        Nenhum objetivo encontrado com os filtros selecionados.
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setFilterBy('all');
                            setBloomFilter('all');
                        }}
                        className="mt-2 text-xs"
                    >
                        Limpar filtros
                    </Button>
                </div>
            )}
        </div>
    );
}
