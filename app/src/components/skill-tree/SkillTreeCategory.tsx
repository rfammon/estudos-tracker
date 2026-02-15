import { memo } from 'react';
import {
    SkillNode as SkillNodeType,
    SkillCategory,
    SKILL_CATEGORY_LABELS,
    SKILL_CATEGORY_COLORS,
} from '@/types/skill-tree';
import { SkillNodeComponent } from './SkillNode';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, CheckCircle } from 'lucide-react';

interface SkillTreeCategoryProps {
    category: SkillCategory;
    nodes: SkillNodeType[];
    onSelectNode: (nodeId: string) => void;
    selectedNodeId: string | null;
}

export const SkillTreeCategory = memo(function SkillTreeCategory({
    category,
    nodes,
    onSelectNode,
    selectedNodeId,
}: SkillTreeCategoryProps) {
    const categoryColor = SKILL_CATEGORY_COLORS[category];
    const categoryLabel = SKILL_CATEGORY_LABELS[category];

    const completedNodes = nodes.filter(n => n.completed).length;
    const unlockedNodes = nodes.filter(n => n.unlocked).length;
    const totalNodes = nodes.length;

    const progressPercentage = totalNodes > 0
        ? Math.round((completedNodes / totalNodes) * 100)
        : 0;

    const isComplete = completedNodes === totalNodes && totalNodes > 0;
    const isStarted = unlockedNodes > 0;

    return (
        <div
            className="glass-card border-border/20 rounded-[2rem] p-6 bg-card/5"
            role="region"
            aria-labelledby={`category-${category}-title`}
        >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${categoryColor}20` }}
                    >
                        {isComplete ? (
                            <CheckCircle className="h-5 w-5" style={{ color: categoryColor }} />
                        ) : isStarted ? (
                            <Unlock className="h-5 w-5" style={{ color: categoryColor }} />
                        ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                    <div>
                        <h3
                            id={`category-${category}-title`}
                            className="font-bold text-foreground"
                            style={{ color: isComplete ? categoryColor : undefined }}
                        >
                            {categoryLabel}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {completedNodes}/{totalNodes} completos
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isComplete && (
                        <Badge
                            variant="success"
                            className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                        >
                            Completo
                        </Badge>
                    )}
                    <Badge
                        variant="outline"
                        style={{ borderColor: categoryColor, color: categoryColor }}
                    >
                        {progressPercentage}%
                    </Badge>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 mb-6 rounded-full bg-muted/20 overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${progressPercentage}%`,
                        backgroundColor: categoryColor,
                    }}
                />
            </div>

            {/* Nodes Grid */}
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
                role="list"
                aria-label={`Skills de ${categoryLabel}`}
            >
                {nodes.map(node => (
                    <div key={node.id} role="listitem">
                        <SkillNodeComponent
                            node={node}
                            isSelected={selectedNodeId === node.id}
                            onSelect={onSelectNode}
                            size="md"
                        />
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {nodes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Nenhuma skill nesta categoria</p>
                </div>
            )}
        </div>
    );
});

// Compact horizontal layout for mobile
export const SkillTreeCategoryCompact = memo(function SkillTreeCategoryCompact({
    category,
    nodes,
    onSelectNode,
    selectedNodeId,
}: SkillTreeCategoryProps) {
    const categoryColor = SKILL_CATEGORY_COLORS[category];
    const categoryLabel = SKILL_CATEGORY_LABELS[category];

    const completedNodes = nodes.filter(n => n.completed).length;
    const totalNodes = nodes.length;

    return (
        <div className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColor }}
                />
                <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: categoryColor }}
                >
                    {categoryLabel}
                </span>
                <span className="text-xs text-muted-foreground">
                    ({completedNodes}/{totalNodes})
                </span>
            </div>

            {/* Horizontal Scrollable Nodes */}
            <div
                className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
                role="list"
                aria-label={`Skills de ${categoryLabel}`}
            >
                {nodes.map(node => (
                    <div key={node.id} role="listitem" className="flex-shrink-0">
                        <SkillNodeComponent
                            node={node}
                            isSelected={selectedNodeId === node.id}
                            onSelect={onSelectNode}
                            size="sm"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default SkillTreeCategory;
