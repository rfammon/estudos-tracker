import { memo } from 'react';
import { SkillTree, SKILL_CATEGORY_LABELS, SKILL_CATEGORY_COLORS, SkillCategory } from '@/types/skill-tree';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target } from 'lucide-react';

interface SkillTreeProgressProps {
    tree: SkillTree;
    showDetails?: boolean;
}

export const SkillTreeProgress = memo(function SkillTreeProgress({
    tree,
    showDetails = true,
}: SkillTreeProgressProps) {
    const percentage = tree.totalNodes > 0
        ? Math.round((tree.completedNodes / tree.totalNodes) * 100)
        : 0;

    // Calculate nodes by category
    const categoryStats = Object.keys(SKILL_CATEGORY_LABELS).reduce((acc, cat) => {
        const category = cat as SkillCategory;
        const nodes = tree.nodes.filter(n => n.category === category);
        const completed = nodes.filter(n => n.completed).length;
        acc[category] = {
            total: nodes.length,
            completed,
            percentage: nodes.length > 0 ? Math.round((completed / nodes.length) * 100) : 0,
        };
        return acc;
    }, {} as Record<SkillCategory, { total: number; completed: number; percentage: number }>);

    // Calculate total XP bonus earned
    const totalXpBonus = tree.nodes
        .filter(n => n.completed)
        .reduce((sum, n) => sum + n.xpBonus, 0);

    return (
        <div className="space-y-6">
            {/* Main Progress */}
            <div className="glass-card border-border/20 rounded-2xl p-6 bg-card/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${tree.color}20` }}
                        >
                            {tree.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">{tree.name}</h3>
                            <p className="text-xs text-muted-foreground">{tree.subject}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-foreground">{percentage}%</p>
                        <p className="text-xs text-muted-foreground">
                            {tree.completedNodes}/{tree.totalNodes} skills
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <Progress
                        value={percentage}
                        className="h-4"
                        style={{
                            // @ts-expect-error CSS custom property
                            '--progress-background': tree.color,
                        }}
                    />
                </div>

                {/* Quick Stats */}
                {showDetails && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-3 rounded-xl bg-muted/10">
                            <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                            <p className="text-lg font-bold text-foreground">{tree.completedNodes}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Completos</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-muted/10">
                            <Target className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-lg font-bold text-foreground">{tree.totalNodes - tree.completedNodes}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Restantes</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-muted/10">
                            <Star className="h-5 w-5 mx-auto mb-1 text-yellow-400" />
                            <p className="text-lg font-bold text-foreground">+{totalXpBonus}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">XP Bônus</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Category Breakdown */}
            {showDetails && (
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(categoryStats).map(([category, stats]) => (
                        <div
                            key={category}
                            className="glass-card border-border/20 rounded-xl p-4 bg-card/5"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className="text-xs font-bold uppercase tracking-wider"
                                    style={{ color: SKILL_CATEGORY_COLORS[category as SkillCategory] }}
                                >
                                    {SKILL_CATEGORY_LABELS[category as SkillCategory]}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {stats.completed}/{stats.total}
                                </span>
                            </div>
                            <div className="relative h-2">
                                <div className="absolute inset-0 bg-muted/20 rounded-full" />
                                <div
                                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${stats.percentage}%`,
                                        backgroundColor: SKILL_CATEGORY_COLORS[category as SkillCategory],
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});

// Compact version for sidebar/overview
export const SkillTreeProgressCompact = memo(function SkillTreeProgressCompact({
    tree,
}: {
    tree: SkillTree;
}) {
    const percentage = tree.totalNodes > 0
        ? Math.round((tree.completedNodes / tree.totalNodes) * 100)
        : 0;

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-border/20">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${tree.color}20` }}
            >
                {tree.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{tree.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted/20 rounded-full">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${percentage}%`,
                                backgroundColor: tree.color,
                            }}
                        />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{percentage}%</span>
                </div>
            </div>
            {tree.completedNodes === tree.totalNodes && tree.totalNodes > 0 && (
                <Trophy className="h-5 w-5 text-yellow-400" />
            )}
        </div>
    );
});

export default SkillTreeProgress;
