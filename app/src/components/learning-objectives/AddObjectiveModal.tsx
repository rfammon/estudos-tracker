import { useState, useCallback, useEffect } from 'react';
import {
    LearningObjective,
    LearningObjectiveFormData,
    BloomLevel,
    BLOOM_LEVEL_LABELS,
    BLOOM_LEVEL_DESCRIPTIONS,
    BLOOM_LEVEL_XP,
    BLOOM_LEVEL_COLORS,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Sparkles, Calendar, Info } from 'lucide-react';

interface AddObjectiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: LearningObjectiveFormData) => void;
    topicName: string;
    editObjective?: LearningObjective | null;
}

const DEFAULT_BLOOM_LEVEL: BloomLevel = 'understand';

export function AddObjectiveModal({
    isOpen,
    onClose,
    onSubmit,
    topicName,
    editObjective,
}: AddObjectiveModalProps) {
    const [description, setDescription] = useState('');
    const [bloomLevel, setBloomLevel] = useState<BloomLevel>(DEFAULT_BLOOM_LEVEL);
    const [targetDate, setTargetDate] = useState('');
    const [errors, setErrors] = useState<{ description?: string }>({});

    // Reset form when modal opens/closes or editObjective changes
    useEffect(() => {
        if (isOpen) {
            if (editObjective) {
                setDescription(editObjective.description);
                setBloomLevel(editObjective.bloomLevel);
                setTargetDate(editObjective.targetDate || '');
            } else {
                setDescription('');
                setBloomLevel(DEFAULT_BLOOM_LEVEL);
                setTargetDate('');
            }
            setErrors({});
        }
    }, [isOpen, editObjective]);

    const validateForm = useCallback(() => {
        const newErrors: { description?: string } = {};

        if (!description.trim()) {
            newErrors.description = 'A descrição é obrigatória';
        } else if (description.trim().length < 10) {
            newErrors.description = 'A descrição deve ter pelo menos 10 caracteres';
        } else if (description.trim().length > 500) {
            newErrors.description = 'A descrição deve ter no máximo 500 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [description]);

    const handleSubmit = useCallback(() => {
        if (!validateForm()) return;

        const data: LearningObjectiveFormData = {
            description: description.trim(),
            bloomLevel,
            targetDate: targetDate || undefined,
        };

        onSubmit(data);
        onClose();
    }, [description, bloomLevel, targetDate, validateForm, onSubmit, onClose]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
            }
        },
        [handleSubmit]
    );

    const selectedBloomColors = BLOOM_LEVEL_COLORS[bloomLevel];
    const selectedXp = BLOOM_LEVEL_XP[bloomLevel];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="glass-card border-border/50 max-w-lg"
                aria-labelledby="objective-modal-title"
                aria-describedby="objective-modal-description"
            >
                <DialogHeader>
                    <DialogTitle
                        id="objective-modal-title"
                        className="text-2xl font-black tracking-tight flex items-center gap-2"
                    >
                        <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                        {editObjective ? 'Editar Objetivo' : 'Novo Objetivo de Aprendizagem'}
                    </DialogTitle>
                    <DialogDescription id="objective-modal-description" className="sr-only">
                        {editObjective
                            ? 'Edite os campos para atualizar o objetivo de aprendizagem'
                            : 'Preencha os campos para criar um novo objetivo de aprendizagem'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    {/* Topic Name */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/20 rounded-xl border border-border/20">
                        <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span className="text-xs text-muted-foreground">
                            Matéria: <span className="font-bold text-foreground">{topicName}</span>
                        </span>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="objective-description"
                            className="text-xs font-black uppercase tracking-widest text-muted-foreground"
                        >
                            Descrição do Objetivo *
                        </Label>
                        <Textarea
                            id="objective-description"
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ex: Compreender e aplicar as regras de acentuação gráfica em textos diversos"
                            className={`bg-muted/30 border-border/50 rounded-xl min-h-[100px] resize-none focus:border-electric-blue ${errors.description ? 'border-red-500' : ''
                                }`}
                            aria-required="true"
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? 'description-error' : undefined}
                        />
                        {errors.description && (
                            <p id="description-error" className="text-xs text-red-500" role="alert">
                                {errors.description}
                            </p>
                        )}
                        <p className="text-[10px] text-muted-foreground">
                            {description.length}/500 caracteres
                        </p>
                    </div>

                    {/* Bloom Level */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="bloom-level"
                            className="text-xs font-black uppercase tracking-widest text-muted-foreground"
                        >
                            Nível Cognitivo (Taxonomia de Bloom)
                        </Label>
                        <Select
                            value={bloomLevel}
                            onValueChange={(v) => setBloomLevel(v as BloomLevel)}
                        >
                            <SelectTrigger
                                id="bloom-level"
                                className={`bg-muted/30 border-border/50 rounded-xl ${selectedBloomColors.border}`}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-card border-border/50">
                                {Object.entries(BLOOM_LEVEL_LABELS).map(([key, label]) => {
                                    const colors = BLOOM_LEVEL_COLORS[key as BloomLevel];
                                    const xp = BLOOM_LEVEL_XP[key as BloomLevel];
                                    return (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center justify-between gap-4 w-full">
                                                <span>{label}</span>
                                                <Badge
                                                    className={`text-[9px] font-black ${colors.bg} ${colors.text} rounded-full`}
                                                >
                                                    +{xp} XP
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>

                        {/* Bloom Level Description */}
                        <div
                            className={`p-3 rounded-xl ${selectedBloomColors.bg} ${selectedBloomColors.border} border`}
                        >
                            <p className="text-xs text-muted-foreground">
                                <span className={`font-bold ${selectedBloomColors.text}`}>
                                    {BLOOM_LEVEL_LABELS[bloomLevel]}:
                                </span>{' '}
                                {BLOOM_LEVEL_DESCRIPTIONS[bloomLevel]}
                            </p>
                        </div>

                        {/* XP Preview */}
                        <div className="flex items-center gap-2 text-xs">
                            <Sparkles className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                            <span className="text-muted-foreground">XP ao concluir:</span>
                            <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-black rounded-full">
                                +{selectedXp} XP
                            </Badge>
                        </div>
                    </div>

                    {/* Target Date */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="target-date"
                            className="text-xs font-black uppercase tracking-widest text-muted-foreground"
                        >
                            Data Meta (opcional)
                        </Label>
                        <div className="relative">
                            <Input
                                id="target-date"
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className="bg-muted/30 border-border/50 rounded-xl pr-10"
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <Calendar
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            Defina uma data limite para alcançar este objetivo
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-xl hover:bg-accent text-muted-foreground"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-electric-blue hover:bg-electric-blue/80 text-primary-foreground font-bold rounded-xl px-8 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    >
                        {editObjective ? 'Salvar Alterações' : 'Criar Objetivo'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
