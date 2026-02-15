import { memo } from 'react';
import { cn } from '@/lib/utils';
import { SkillNode as SkillNodeType, SKILL_CATEGORY_COLORS } from '@/types/skill-tree';
import { Lock, CheckCircle, Star } from 'lucide-react';

interface SkillNodeProps {
    node: SkillNodeType;
    isSelected: boolean;
    onSelect: (nodeId: string) => void;
    size?: 'sm' | 'md' | 'lg';
}

export const SkillNodeComponent = memo(function SkillNodeComponent({
    node,
    isSelected,
    onSelect,
    size = 'md',
}: SkillNodeProps) {
    const categoryColor = SKILL_CATEGORY_COLORS[node.category];

    const sizeClasses = {
        sm: 'w-12 h-12 text-lg',
        md: 'w-16 h-16 text-2xl',
        lg: 'w-20 h-20 text-3xl',
    };

    const getStatusStyles = () => {
        if (node.completed) {
            return {
                container: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
                ring: 'ring-2 ring-emerald-500/50',
                icon: 'text-emerald-400',
            };
        }

        if (node.unlocked) {
            if (node.level > 0) {
                return {
                    container: 'bg-gradient-to-br from-primary/20 to-primary/30 border-primary/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]',
                    ring: 'ring-2 ring-primary/50',
                    icon: 'text-primary',
                };
            }
            return {
                container: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/40 hover:border-blue-500/60',
                ring: '',
                icon: 'text-blue-400',
            };
        }

        // Locked
        return {
            container: 'bg-muted/20 border-muted-foreground/20 opacity-60',
            ring: '',
            icon: 'text-muted-foreground',
        };
    };

    const styles = getStatusStyles();

    const handleClick = () => {
        if (node.unlocked || node.prerequisites.length === 0) {
            onSelect(node.id);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                disabled={!node.unlocked && node.prerequisites.length > 0}
                className={cn(
                    'relative rounded-2xl border-2 transition-all duration-300',
                    'flex items-center justify-center',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    sizeClasses[size],
                    styles.container,
                    styles.ring,
                    isSelected && 'ring-2 ring-offset-2 ring-offset-background scale-110',
                    node.unlocked && 'cursor-pointer hover:scale-105 active:scale-95',
                    !node.unlocked && node.prerequisites.length > 0 && 'cursor-not-allowed'
                )}
                aria-label={`${node.name} - ${node.completed ? 'Completo' : node.unlocked ? 'Disponível' : 'Bloqueado'}`}
                aria-pressed={isSelected}
                role="button"
                tabIndex={node.unlocked || node.prerequisites.length === 0 ? 0 : -1}
            >
                {/* Icon */}
                <span className={cn('transition-transform duration-300', isSelected && 'scale-110')}>
                    {node.completed ? (
                        <CheckCircle className={cn('h-6 w-6', styles.icon)} />
                    ) : !node.unlocked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <span className="text-2xl">{node.icon}</span>
                    )}
                </span>

                {/* Level indicator */}
                {node.unlocked && !node.completed && (
                    <div className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                        {node.level}/{node.maxLevel}
                    </div>
                )}

                {/* Completed star */}
                {node.completed && (
                    <div className="absolute -top-1 -right-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                )}

                {/* Progress ring for in-progress nodes */}
                {node.unlocked && !node.completed && node.level > 0 && (
                    <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-muted/20"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke={categoryColor}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${node.progress * 2.89} 289`}
                            className="transition-all duration-500"
                        />
                    </svg>
                )}

                {/* Pulse animation for unlocked but not started */}
                {node.unlocked && node.level === 0 && (
                    <div className="absolute inset-0 rounded-2xl animate-pulse bg-primary/10" />
                )}
            </button>

            {/* Name label */}
            <span
                className={cn(
                    'text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px] leading-tight',
                    node.completed ? 'text-emerald-400' : node.unlocked ? 'text-foreground' : 'text-muted-foreground'
                )}
            >
                {node.name}
            </span>
        </div>
    );
});

export default SkillNodeComponent;
