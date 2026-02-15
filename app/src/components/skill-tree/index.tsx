// Skill Tree Components - Barrel Export
export { SkillNodeComponent } from './SkillNode';
export { SkillNodeDetails } from './SkillNodeDetails';
export { SkillTreeProgress, SkillTreeProgressCompact } from './SkillTreeProgress';
export { SkillTreeCategory, SkillTreeCategoryCompact } from './SkillTreeCategory';
export { SkillTreeView } from './SkillTreeView';

// Re-export types for convenience
export type {
    SkillNode,
    SkillTree,
    SkillCategory,
    SkillNodeProps,
    SkillTreeViewProps,
    SkillTreeProgressProps,
    SkillTreeCategoryProps,
    SkillNodeDetailsProps,
} from '@/types/skill-tree';

export { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_COLORS } from '@/types/skill-tree';
