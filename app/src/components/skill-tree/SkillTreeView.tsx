import { memo, useMemo, useCallback, useState } from 'react';
import {
    SkillTree,
    SkillNode as SkillNodeType,
    SkillCategory,
} from '@/types/skill-tree';
import { SkillNodeComponent } from './SkillNode';
import { SkillNodeDetails } from './SkillNodeDetails';
import { SkillTreeCategory } from './SkillTreeCategory';
import { useGamificationStore } from '@/store';
import { Button } from '@/components/ui/button';
import {
    ZoomIn,
    ZoomOut,
    Grid3X3,
    LayoutList,
} from 'lucide-react';

interface SkillTreeViewProps {
    tree: SkillTree;
    selectedNodeId: string | null;
    onSelectNode: (nodeId: string | null) => void;
    onUnlockNode: (nodeId: string) => { success: boolean; message: string };
    onLevelUp: (nodeId: string) => { success: boolean; message: string; xpSpent: number; xpBonus: number };
}

type ViewMode = 'tree' | 'categories';

export const SkillTreeView = memo(function SkillTreeView({
    tree,
    selectedNodeId,
    onSelectNode,
    onUnlockNode,
    onLevelUp,
}: SkillTreeViewProps) {
    const { totalPoints } = useGamificationStore();
    const [viewMode, setViewMode] = useState<ViewMode>('categories');
    const [zoom, setZoom] = useState(1);

    const selectedNode = useMemo(() => {
        return tree.nodes.find(n => n.id === selectedNodeId);
    }, [tree.nodes, selectedNodeId]);

    const nodesByCategory = useMemo(() => {
        const categories: Record<SkillCategory, SkillNodeType[]> = {
            fundamentos: [],
            tecnicas: [],
            avancado: [],
            especializacao: [],
        };

        tree.nodes.forEach(node => {
            categories[node.category].push(node);
        });

        return categories;
    }, [tree.nodes]);

    const handleNodeSelect = useCallback((nodeId: string) => {
        onSelectNode(nodeId === selectedNodeId ? null : nodeId);
    }, [selectedNodeId, onSelectNode]);

    const handleCloseDetails = useCallback(() => {
        onSelectNode(null);
    }, [onSelectNode]);

    const handleUnlock = useCallback((nodeId: string) => {
        return onUnlockNode(nodeId);
    }, [onUnlockNode]);

    const handleLevelUp = useCallback((nodeId: string) => {
        return onLevelUp(nodeId);
    }, [onLevelUp]);

    // Calculate tree layout positions for visual view
    const nodePositions = useMemo(() => {
        const positions: Record<string, { x: number; y: number }> = {};
        const categoryOrder: SkillCategory[] = ['fundamentos', 'tecnicas', 'avancado', 'especializacao'];

        categoryOrder.forEach((category, categoryIndex) => {
            const nodes = nodesByCategory[category];
            const startY = categoryIndex * 200;

            nodes.forEach((node, nodeIndex) => {
                const spacing = 150;
                const totalWidth = (nodes.length - 1) * spacing;
                const startX = -totalWidth / 2;

                positions[node.id] = {
                    x: startX + nodeIndex * spacing,
                    y: startY,
                };
            });
        });

        return positions;
    }, [nodesByCategory]);

    // Calculate connections between nodes
    const connections = useMemo(() => {
        const lines: { from: string; to: string; fromPos: { x: number; y: number }; toPos: { x: number; y: number } }[] = [];

        tree.nodes.forEach(node => {
            node.prerequisites.forEach(prereqId => {
                const fromPos = nodePositions[prereqId];
                const toPos = nodePositions[node.id];

                if (fromPos && toPos) {
                    lines.push({
                        from: prereqId,
                        to: node.id,
                        fromPos,
                        toPos,
                    });
                }
            });
        });

        return lines;
    }, [tree.nodes, nodePositions]);

    return (
        <div className="space-y-6">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'categories' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('categories')}
                        className="rounded-xl"
                    >
                        <LayoutList className="h-4 w-4 mr-2" />
                        Categorias
                    </Button>
                    <Button
                        variant={viewMode === 'tree' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('tree')}
                        className="rounded-xl"
                    >
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        Árvore
                    </Button>
                </div>

                {viewMode === 'tree' && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                            className="rounded-lg h-8 w-8"
                            aria-label="Diminuir zoom"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground w-12 text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                            className="rounded-lg h-8 w-8"
                            aria-label="Aumentar zoom"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Categories View */}
            {viewMode === 'categories' && (
                <div className="space-y-6">
                    {(['fundamentos', 'tecnicas', 'avancado', 'especializacao'] as SkillCategory[]).map(category => (
                        <SkillTreeCategory
                            key={category}
                            category={category}
                            nodes={nodesByCategory[category]}
                            onSelectNode={handleNodeSelect}
                            selectedNodeId={selectedNodeId}
                        />
                    ))}
                </div>
            )}

            {/* Tree View */}
            {viewMode === 'tree' && (
                <div className="glass-card border-border/20 rounded-[2rem] overflow-hidden bg-card/5">
                    <div
                        className="relative overflow-auto"
                        style={{ height: '600px' }}
                        role="img"
                        aria-label={`Visualização em árvore de ${tree.name}`}
                    >
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: 'center center',
                                minWidth: '100%',
                                minHeight: '100%',
                            }}
                        >
                            {/* SVG for connections */}
                            <svg
                                className="absolute inset-0 pointer-events-none"
                                style={{ width: '100%', height: '100%' }}
                                aria-hidden="true"
                            >
                                {connections.map((conn, index) => {
                                    const fromNode = tree.nodes.find(n => n.id === conn.from);
                                    const toNode = tree.nodes.find(n => n.id === conn.to);
                                    const isCompleted = fromNode?.completed && toNode?.completed;
                                    const isActive = fromNode?.completed && toNode?.unlocked;

                                    return (
                                        <line
                                            key={index}
                                            x1={`calc(50% + ${conn.fromPos.x}px)`}
                                            y1={`calc(50% + ${conn.fromPos.y}px + 40px)`}
                                            x2={`calc(50% + ${conn.toPos.x}px)`}
                                            y2={`calc(50% + ${conn.toPos.y}px - 40px)`}
                                            stroke={isCompleted ? '#22C55E' : isActive ? '#3B82F6' : '#6B7280'}
                                            strokeWidth="2"
                                            strokeDasharray={isActive && !isCompleted ? '5,5' : 'none'}
                                            className="transition-all duration-300"
                                            style={{
                                                filter: isCompleted ? 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.5))' : 'none',
                                            }}
                                        />
                                    );
                                })}
                            </svg>

                            {/* Nodes */}
                            <div className="relative" style={{ width: '100%', height: '100%' }}>
                                {tree.nodes.map(node => {
                                    const pos = nodePositions[node.id];
                                    if (!pos) return null;

                                    return (
                                        <div
                                            key={node.id}
                                            className="absolute"
                                            style={{
                                                left: `calc(50% + ${pos.x}px - 32px)`,
                                                top: `calc(50% + ${pos.y}px - 32px)`,
                                            }}
                                        >
                                            <SkillNodeComponent
                                                node={node}
                                                isSelected={selectedNodeId === node.id}
                                                onSelect={handleNodeSelect}
                                                size="md"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 p-4 border-t border-border/20">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                            <span className="text-xs text-muted-foreground">Bloqueado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-xs text-muted-foreground">Disponível</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-muted-foreground">Completo</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Node Details */}
            {selectedNode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg max-h-[90vh] overflow-auto">
                        <SkillNodeDetails
                            node={selectedNode}
                            tree={tree}
                            userXp={totalPoints}
                            onClose={handleCloseDetails}
                            onUnlock={handleUnlock}
                            onLevelUp={handleLevelUp}
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

export default SkillTreeView;
