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
        bg-white dark:bg-gray-800 shadow-md border-primary-500 dark:border-primary-400
        text-primary-600 dark:text-primary-300
      `
        }

        return `
      bg-transparent border-transparent
      text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300
      hover:bg-gray-50 dark:hover:bg-gray-700/50
    `
    }

    const containerStyles = layout === 'grid'
        ? 'grid grid-cols-3 sm:grid-cols-5 gap-2'
        : 'flex flex-wrap gap-2'

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
              flex items-center gap-2 px-3 py-2 rounded-lg border-2 
              transition-all duration-200 text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              dark:focus:ring-offset-gray-800
              ${getCategoryStyles(category)}
            `}
                        title={config.description}
                    >
                        <span className="text-lg" aria-hidden="true">
                            {config.icon}
                        </span>
                        <span className="hidden sm:inline">{config.nameShort}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default LeaderboardCategory
