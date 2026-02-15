import { useState, useCallback } from 'react';
import {
    LearningObjective,
    BLOOM_LEVEL_LABELS,
    BLOOM_LEVEL_COLORS,
    BLOOM_LEVEL_XP,
    BLOOM_LEVEL_DESCRIPTIONS,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle2,
    Circle,
    Calendar,
    Trash2,
    Pencil,
    Sparkles,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LearningObjectiveCardProps {
    objective: LearningObjective;
    onComplete: (objectiveId: string) => void;
    onEdit?: (objective: LearningObjective) => void;
    onDelete?: (objectiveId: string) => void;
    isExpanded?: boolean;
    showActions?: boolean;
}

export function LearningObjectiveCard({
    objective,
    onComplete,
    onEdit,
    onDelete,
    isExpanded: initialExpanded = false,
    showActions = true,
}: LearningObjectiveCardProps) {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);

    const bloomColors = BLOOM_LEVEL_COLORS[objective.bloomLevel];
    const xpValue = BLOOM_LEVEL_XP[objective.bloomLevel];

    const handleToggleComplete = useCallback(() => {
        if (!objective.completed) {
            onComplete(objective.id);
        }
    }, [objective, onComplete]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleToggleComplete();
            }
        },
        [handleToggleComplete]
    );

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "d 'de' MMM, yyyy", { locale: ptBR });
    };

    return (
        <div
            className={`group relative rounded-2xl border transition-all duration-300 ${objective.completed
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : `${bloomColors.bg} ${bloomColors.border}`
                }`}
            role="article"
            aria-labelledby={`objective-${objective.id}-title`}
            aria-describedby={`objective-${objective.id}-desc`}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Completion Checkbox */}
                    <button
                        onClick={handleToggleComplete}
                        onKeyDown={handleKeyDown}
                        className={`flex-shrink-0 mt-0.5 transition-all duration-300 ${objective.completed
                            ? 'text-emerald-500'
                            : 'text-muted-foreground hover:text-primary'
                            }`}
                        aria-label={
                            objective.completed
                                ? 'Objetivo concluído'
                                : 'Marcar como concluído'
                        }
                        aria-pressed={objective.completed}
                        disabled={objective.completed}
                    >
                        {objective.completed ? (
                            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <Circle className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4
                                id={`objective-${objective.id}-title`}
                                className={`font-bold text-sm ${objective.completed
                                    ? 'text-emerald-400 line-through'
                                    : 'text-foreground'
                                    }`}
                            >
                                {objective.description}
                            </h4>
                            <Badge
                                className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border ${bloomColors.bg} ${bloomColors.text} ${bloomColors.border}`}
                            >
                                {BLOOM_LEVEL_LABELS[objective.bloomLevel]}
                            </Badge>
                        </div>

                        {/* XP Badge */}
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-yellow-500" aria-hidden="true" />
                                <span className="font-bold text-yellow-500">+{xpValue} XP</span>
                            </span>
                            {objective.targetDate && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" aria-hidden="true" />
                                    <span>
                                        {objective.completed
                                            ? `Concluído em ${objective.completedAt ? formatDate(objective.completedAt) : ''}`
                                            : `Meta: ${formatDate(objective.targetDate)}`}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {showActions && !objective.completed && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onEdit(objective)}
                                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20"
                                    aria-label="Editar objetivo"
                                >
                                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onDelete(objective.id)}
                                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                    aria-label="Excluir objetivo"
                                >
                                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Expand/Collapse Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
                        aria-expanded={isExpanded}
                        aria-controls={`objective-${objective.id}-details`}
                        aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                    <div
                        id={`objective-${objective.id}-details`}
                        className="mt-3 pt-3 border-t border-border/20"
                    >
                        <p
                            id={`objective-${objective.id}-desc`}
                            className="text-xs text-muted-foreground leading-relaxed"
                        >
                            <span className="font-bold uppercase tracking-wider text-foreground/60 mr-1">
                                {BLOOM_LEVEL_LABELS[objective.bloomLevel]}:
                            </span>
                            {BLOOM_LEVEL_DESCRIPTIONS[objective.bloomLevel]}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                            <span>
                                Criado em: {formatDate(objective.createdAt)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Completed Overlay Effect */}
            {objective.completed && (
                <div
                    className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent"
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
