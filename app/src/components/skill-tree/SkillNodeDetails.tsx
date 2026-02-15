import { memo } from 'react';
import { cn } from '@/lib/utils';
import {
    SkillNode,
    SkillTree,
    SKILL_CATEGORY_LABELS,
    SKILL_CATEGORY_COLORS,
} from '@/types/skill-tree';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    X,
    Lock,
    CheckCircle,
    Star,
    Zap,
    TrendingUp,
    Target,
} from 'lucide-react';

interface SkillNodeDetailsProps {
    node: SkillNode;
    tree: SkillTree;
    userXp: number;
    onClose: () => void;
    onUnlock: (nodeId: string) => { success: boolean; message: string };
    onLevelUp: (nodeId: string) => { success: boolean; message: string; xpSpent: number; xpBonus: number };
}

export const SkillNodeDetails = memo(function SkillNodeDetails({
    node,
    tree,
    userXp,
    onClose,
    onUnlock,
    onLevelUp,
}: SkillNodeDetailsProps) {
    const categoryColor = SKILL_CATEGORY_COLORS[node.category];
    const categoryLabel = SKILL_CATEGORY_LABELS[node.category];

    const currentXpCost = node.level < node.maxLevel ? node.xpCost[node.level] || node.xpCost[node.xpCost.length - 1] : 0;
    const canAfford = userXp >= currentXpCost;
    const canUnlock = !node.unlocked && node.prerequisites.every(prereqId => {
        const prereqNode = tree.nodes.find(n => n.id === prereqId);
        return prereqNode?.completed;
    });

    const prerequisiteNodes = node.prerequisites.map(prereqId =>
        tree.nodes.find(n => n.id === prereqId)
    ).filter(Boolean);

    const childNodes = node.children.map(childId =>
        tree.nodes.find(n => n.id === childId)
    ).filter(Boolean);

    const handleUnlock = () => {
        onUnlock(node.id);
    };

    const handleLevelUp = () => {
        onLevelUp(node.id);
    };

    return (
        <div
            className="glass-card border-border/20 rounded-[2rem] p-6 space-y-6 bg-card/5"
            role="dialog"
            aria-labelledby="skill-node-title"
            aria-describedby="skill-node-description"
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2',
                            node.completed
                                ? 'bg-emerald-500/20 border-emerald-500/50'
                                : node.unlocked
                                    ? 'bg-primary/20 border-primary/50'
                                    : 'bg-muted/20 border-muted-foreground/20'
                        )}
                    >
                        {node.completed ? (
                            <CheckCircle className="h-7 w-7 text-emerald-400" />
                        ) : !node.unlocked ? (
                            <Lock className="h-6 w-6 text-muted-foreground" />
                        ) : (
                            node.icon
                        )}
                    </div>
                    <div>
                        <h2 id="skill-node-title" className="text-xl font-black tracking-tight text-foreground">
                            {node.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge
                                variant="outline"
                                style={{ borderColor: categoryColor, color: categoryColor }}
                            >
                                {categoryLabel}
                            </Badge>
                            {node.completed && (
                                <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    Completo
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full hover:bg-foreground/10"
                    aria-label="Fechar detalhes"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Description */}
            <p id="skill-node-description" className="text-muted-foreground text-sm leading-relaxed">
                {node.description}
            </p>

            {/* Progress */}
            {node.unlocked && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-bold">
                            Nível {node.level} / {node.maxLevel}
                        </span>
                    </div>
                    <div className="relative">
                        <Progress
                            value={node.progress}
                            className="h-3"
                            style={{
                                // @ts-expect-error CSS custom property
                                '--progress-background': categoryColor,
                            }}
                        />
                        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                            <span>0%</span>
                            <span>{node.progress.toFixed(0)}%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* XP Cost & Bonus */}
            {!node.completed && node.unlocked && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/20">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <Zap className="h-4 w-4" />
                            <span>Custo XP</span>
                        </div>
                        <p className={cn(
                            'text-lg font-black',
                            canAfford ? 'text-foreground' : 'text-red-400'
                        )}>
                            {currentXpCost} XP
                        </p>
                        {!canAfford && (
                            <p className="text-[10px] text-red-400 mt-1">
                                XP necessário: {currentXpCost - userXp}
                            </p>
                        )}
                    </div>
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/20">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <Star className="h-4 w-4" />
                            <span>Bônus ao Completar</span>
                        </div>
                        <p className="text-lg font-black text-yellow-400">
                            +{node.xpBonus} XP
                        </p>
                    </div>
                </div>
            )}

            {/* Prerequisites */}
            {node.prerequisites.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Pré-requisitos
                    </h3>
                    <div className="space-y-2">
                        {prerequisiteNodes.map(prereq => prereq && (
                            <div
                                key={prereq.id}
                                className={cn(
                                    'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                                    prereq.completed
                                        ? 'bg-emerald-500/10 border-emerald-500/30'
                                        : 'bg-muted/10 border-border/20'
                                )}
                            >
                                <div className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center text-sm',
                                    prereq.completed ? 'bg-emerald-500/20' : 'bg-muted/20'
                                )}>
                                    {prereq.completed ? (
                                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                                    ) : (
                                        prereq.icon
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={cn(
                                        'text-sm font-medium',
                                        prereq.completed ? 'text-emerald-400' : 'text-muted-foreground'
                                    )}>
                                        {prereq.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {SKILL_CATEGORY_LABELS[prereq.category]}
                                    </p>
                                </div>
                                {prereq.completed && (
                                    <Badge variant="success" className="text-[10px]">
                                        OK
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Unlocks (Children) */}
            {node.children.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Desbloqueia
                    </h3>
                    <div className="space-y-2">
                        {childNodes.map(child => child && (
                            <div
                                key={child.id}
                                className={cn(
                                    'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                                    child.unlocked
                                        ? 'bg-primary/10 border-primary/30'
                                        : 'bg-muted/10 border-border/20'
                                )}
                            >
                                <div className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center text-sm',
                                    child.unlocked ? 'bg-primary/20' : 'bg-muted/20'
                                )}>
                                    {child.icon}
                                </div>
                                <div className="flex-1">
                                    <p className={cn(
                                        'text-sm font-medium',
                                        child.unlocked ? 'text-foreground' : 'text-muted-foreground'
                                    )}>
                                        {child.name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {SKILL_CATEGORY_LABELS[child.category]}
                                    </p>
                                </div>
                                {child.completed && (
                                    <Badge variant="success" className="text-[10px]">
                                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                        Completo
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                {!node.unlocked && canUnlock && (
                    <Button
                        onClick={handleUnlock}
                        className="flex-1 h-12 rounded-xl font-bold"
                        aria-label="Desbloquear skill"
                    >
                        <Lock className="h-4 w-4 mr-2" />
                        Desbloquear
                    </Button>
                )}

                {node.unlocked && !node.completed && (
                    <Button
                        onClick={handleLevelUp}
                        disabled={!canAfford}
                        className={cn(
                            'flex-1 h-12 rounded-xl font-bold',
                            canAfford && 'bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90'
                        )}
                        aria-label={`Subir de nível por ${currentXpCost} XP`}
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        {canAfford ? `Subir Nível (${currentXpCost} XP)` : 'XP Insuficiente'}
                    </Button>
                )}

                {node.completed && (
                    <div className="flex-1 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle className="h-5 w-5" />
                        Skill Completa!
                    </div>
                )}

                <Button
                    variant="outline"
                    onClick={onClose}
                    className="h-12 rounded-xl px-6"
                >
                    Fechar
                </Button>
            </div>

            {/* Current XP Display */}
            <div className="text-center text-sm text-muted-foreground">
                Seu XP atual: <span className="font-bold text-foreground">{userXp} XP</span>
            </div>
        </div>
    );
});

export default SkillNodeDetails;
