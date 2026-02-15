import { useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSkillTreeStore, useGamificationStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    SkillTreeView,
    SkillTreeProgress,
} from '@/components/skill-tree';
import { usePageAnnouncement } from '@/hooks/useAnnouncement';
import {
    ArrowLeft,
    Trophy,
    Star,
    Zap,
    Target,
    Lock,
    Award,
    Crown,
    Medal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Skills() {
    const navigate = useNavigate();

    // Stores
    const {
        trees,
        selectedTreeId,
        selectedNodeId,
        totalXpSpent,
        totalSkillsCompleted,
        achievements,
        initializeTrees,
        selectTree,
        selectNode,
        unlockNode,
        levelUpNode,
        getTotalProgress,
        getUnlockedAchievements,
    } = useSkillTreeStore();

    const { totalPoints, addPoints } = useGamificationStore();

    // Accessibility: Announce page on load
    usePageAnnouncement('Skills - Árvores de Competências');

    // Initialize trees on mount
    useEffect(() => {
        initializeTrees();
    }, [initializeTrees]);

    // Get selected tree
    const selectedTree = useMemo(() => {
        return trees.find(t => t.id === selectedTreeId);
    }, [trees, selectedTreeId]);

    // Get total progress
    const totalProgress = useMemo(() => {
        return getTotalProgress();
    }, [getTotalProgress]);

    // Get unlocked achievements
    const unlockedAchievements = useMemo(() => {
        return getUnlockedAchievements();
    }, [getUnlockedAchievements]);

    // Handle tree selection
    const handleSelectTree = useCallback((treeId: string | null) => {
        selectTree(treeId);
        selectNode(null);
    }, [selectTree, selectNode]);

    // Handle node selection
    const handleSelectNode = useCallback((nodeId: string | null) => {
        selectNode(nodeId);
    }, [selectNode]);

    // Handle node unlock
    const handleUnlockNode = useCallback((nodeId: string) => {
        if (!selectedTreeId) return { success: false, message: 'Nenhuma árvore selecionada' };
        return unlockNode(selectedTreeId, nodeId);
    }, [selectedTreeId, unlockNode]);

    // Handle node level up
    const handleLevelUp = useCallback((nodeId: string) => {
        if (!selectedTreeId) return { success: false, message: 'Nenhuma árvore selecionada', xpSpent: 0, xpBonus: 0 };

        const result = levelUpNode(selectedTreeId, nodeId);

        // If successful and has XP bonus, add to gamification
        if (result.success && result.xpBonus > 0) {
            addPoints(result.xpBonus);
        }

        return result;
    }, [selectedTreeId, levelUpNode, addPoints]);

    // Calculate stats
    const stats = useMemo(() => {
        const totalNodes = trees.reduce((sum, t) => sum + t.totalNodes, 0);
        const completedNodes = trees.reduce((sum, t) => sum + t.completedNodes, 0);
        const unlockedNodes = trees.reduce((sum, t) =>
            sum + t.nodes.filter(n => n.unlocked).length, 0
        );

        return {
            totalNodes,
            completedNodes,
            unlockedNodes,
            totalXpSpent,
            totalSkillsCompleted,
        };
    }, [trees, totalXpSpent, totalSkillsCompleted]);

    return (
        <div className="space-y-6" role="region" aria-label="Página de Skills">
            {/* Header */}
            <header className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Voltar para página anterior"
                >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40 italic">
                        Skills
                    </h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                        Árvores de Competências
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1.5">
                        <Zap className="h-3 w-3 mr-1.5 text-yellow-400" />
                        <span className="font-bold">{totalPoints} XP</span>
                    </Badge>
                </div>
            </header>

            {/* Overall Progress */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                                <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Progresso Total</h2>
                                <p className="text-xs text-muted-foreground">
                                    {stats.completedNodes} de {stats.totalNodes} skills completas
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-black text-foreground">{totalProgress.percentage}%</p>
                            <p className="text-xs text-muted-foreground">concluído</p>
                        </div>
                    </div>

                    <Progress
                        value={totalProgress.percentage}
                        className="h-4"
                    />

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="text-center p-4 rounded-xl bg-muted/10 border border-border/20">
                            <Target className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <p className="text-xl font-bold text-foreground">{stats.unlockedNodes}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Desbloqueadas</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-muted/10 border border-border/20">
                            <Star className="h-5 w-5 mx-auto mb-2 text-yellow-400" />
                            <p className="text-xl font-bold text-foreground">{stats.completedNodes}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Completas</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-muted/10 border border-border/20">
                            <Zap className="h-5 w-5 mx-auto mb-2 text-blue-400" />
                            <p className="text-xl font-bold text-foreground">{stats.totalXpSpent}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">XP Gasto</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-muted/10 border border-border/20">
                            <Medal className="h-5 w-5 mx-auto mb-2 text-emerald-400" />
                            <p className="text-xl font-bold text-foreground">{unlockedAchievements.length}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">Conquistas</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Skill Trees Selection */}
            {!selectedTree && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-400" />
                        Árvores de Competências
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">
                        {trees.map(tree => (
                            <button
                                key={tree.id}
                                onClick={() => handleSelectTree(tree.id)}
                                className="glass-card border-border/20 rounded-[2rem] p-6 bg-card/5 text-left transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label={`Selecionar árvore ${tree.name}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                                        style={{ backgroundColor: `${tree.color}20` }}
                                    >
                                        {tree.icon}
                                    </div>
                                    {tree.completedNodes === tree.totalNodes && tree.totalNodes > 0 && (
                                        <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                                            <Trophy className="h-3 w-3 mr-1" />
                                            Completo
                                        </Badge>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-1">{tree.name}</h3>
                                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{tree.description}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Progresso</span>
                                        <span className="font-bold">
                                            {tree.completedNodes}/{tree.totalNodes}
                                        </span>
                                    </div>
                                    <div className="relative h-2 rounded-full bg-muted/20 overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${tree.totalNodes > 0 ? (tree.completedNodes / tree.totalNodes) * 100 : 0}%`,
                                                backgroundColor: tree.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Tree View */}
            {selectedTree && (
                <div className="space-y-6">
                    {/* Tree Header */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSelectTree(null)}
                            className="rounded-full hover:bg-foreground/10"
                            aria-label="Voltar para lista de árvores"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${selectedTree.color}20` }}
                        >
                            {selectedTree.icon}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-foreground">{selectedTree.name}</h2>
                            <p className="text-xs text-muted-foreground">{selectedTree.description}</p>
                        </div>
                        <Badge
                            variant="outline"
                            style={{ borderColor: selectedTree.color, color: selectedTree.color }}
                            className="px-4 py-2"
                        >
                            {selectedTree.completedNodes}/{selectedTree.totalNodes}
                        </Badge>
                    </div>

                    {/* Tree Progress */}
                    <SkillTreeProgress tree={selectedTree} showDetails={true} />

                    {/* Tree View */}
                    <SkillTreeView
                        tree={selectedTree}
                        selectedNodeId={selectedNodeId}
                        onSelectNode={handleSelectNode}
                        onUnlockNode={handleUnlockNode}
                        onLevelUp={handleLevelUp}
                    />
                </div>
            )}

            {/* Achievements Section */}
            <Card className="glass-card border-border/20 overflow-hidden rounded-[2rem] bg-card/5">
                <CardHeader className="border-b border-border/20">
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-400" />
                        Conquistas de Skills
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {unlockedAchievements.length === 0 ? (
                        <div className="text-center py-8">
                            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Nenhuma conquista desbloqueada ainda</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Complete skills para desbloquear conquistas!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {achievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className={cn(
                                        'flex items-center gap-3 p-4 rounded-xl border transition-all',
                                        achievement.unlocked
                                            ? 'bg-yellow-500/10 border-yellow-500/30'
                                            : 'bg-muted/10 border-border/20 opacity-50'
                                    )}
                                >
                                    <div className={cn(
                                        'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
                                        achievement.unlocked ? 'bg-yellow-500/20' : 'bg-muted/20'
                                    )}>
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn(
                                            'text-sm font-bold truncate',
                                            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                                        )}>
                                            {achievement.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate">
                                            {achievement.description}
                                        </p>
                                    </div>
                                    {achievement.unlocked && (
                                        <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-400">
                                            +{achievement.xpBonus} XP
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Skills;
