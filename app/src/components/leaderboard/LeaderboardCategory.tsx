import React from 'react'
import { LeaderboardCategory as LeaderboardCategoryType, CATEGORY_CONFIGS } from '../../types/leaderboard'

interface LeaderboardCategoryProps {
    activeCategory: LeaderboardCategoryType
    onCategoryChange: (category: LeaderboardCategoryType) => void
    layout?: 'horizontal' | 'grid'
}

export const LeaderboardCategory: React.FC<LeaderboardCategoryProps> = ({
    activeCategory,
    onCategoryChange,
    layout = 'horizontal'
}) => {
    const categories: LeaderboardCategoryType[] = ['xp', 'streak', 'sessions', 'objectives', 'assessments']

    const getCategoryStyles = (category: LeaderboardCategoryType): string => {
        const isActive = category === activeCategory

        if (isActive) {
            return `
        bg-white/50 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-primary/40
        text-primary scale-105
      `
        }

        return `
      bg-muted/10 border-border/10
      text-muted-foreground hover:text-foreground hover:bg-muted/20
    `
    }

    const containerStyles = layout === 'grid'
        ? 'grid grid-cols-2 sm:grid-cols-5 gap-3'
        : 'flex flex-wrap gap-2.5'

    return (
        <div
            className={containerStyles}
            role="group"
            aria-label="Categorias do ranking"
        >
            {categories.map(category => {
                const config = CATEGORY_CONFIGS[category]
                const isActive = category === activeCategory

                return (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        aria-pressed={isActive}
                        className={`
              flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-3 rounded-xl border
              transition-all duration-300 text-[10px] font-black uppercase tracking-widest
              focus:outline-none focus:ring-2 focus:ring-primary/50
              ${getCategoryStyles(category)}
            `}
                        title={config.description}
                    >
                        <span className="text-xl" aria-hidden="true">
                            {config.icon}
                        </span>
                        <span className="hidden sm:inline">{config.nameShort}</span>
                        <span className="sm:hidden text-[8px] opacity-70 mt-0.5">{config.nameShort}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default LeaderboardCategory
