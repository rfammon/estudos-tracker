import React from 'react'
import { LeaderboardEntry, LeaderboardPeriod, LeaderboardCategory as LeaderboardCategoryType, formatScore, PERIOD_CONFIGS, CATEGORY_CONFIGS } from '../../types/leaderboard'

interface LeaderboardUserCardProps {
    entry: LeaderboardEntry | null
    period: LeaderboardPeriod
    category: LeaderboardCategoryType
    totalParticipants: number
}

export const LeaderboardUserCard: React.FC<LeaderboardUserCardProps> = ({
    entry,
    period,
    category,
    totalParticipants
}) => {
    if (!entry) {
        return (
            <div
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                role="region"
                aria-label="Sua posição no ranking"
            >
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>Jogue para aparecer no ranking!</p>
                </div>
            </div>
        )
    }

    const isTopTen = entry.rank <= 10
    const isTopThree = entry.rank <= 3
    const percentile = totalParticipants > 0
        ? Math.round((1 - (entry.rank - 1) / totalParticipants) * 100)
        : 0

    const getRankMessage = (): string => {
        if (entry.rank === 1) return '🏆 Você é o líder!'
        if (isTopThree) return '🌟 Top 3!'
        if (isTopTen) return '💪 Top 10!'
        if (percentile >= 25) return '📈 Subindo!'
        return '🎯 Continue jogando!'
    }

    const getRankBadgeStyles = (): string => {
        if (entry.rank === 1) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
        if (entry.rank === 2) return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
        if (entry.rank === 3) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
        return 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700'
    }

    return (
        <div
            className={`
        rounded-xl p-4 border-2 transition-all duration-300
        ${isTopThree
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border-primary-300 dark:border-primary-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                }
      `}
            role="region"
            aria-label="Sua posição no ranking"
        >
            <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div
                    className={`
            flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2
            ${getRankBadgeStyles()}
          `}
                >
                    <span className="text-2xl font-bold">
                        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <span className="text-xs font-medium opacity-75">
                        {entry.rank <= 3 ? 'Top 3' : 'Posição'}
                    </span>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {entry.userName}
                        </h3>
                        <span className="text-sm">{CATEGORY_CONFIGS[category].icon}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium text-primary-600 dark:text-primary-400">
                            {formatScore(entry.score, category)}
                        </span>

                        {entry.change !== undefined && entry.change !== 0 && (
                            <span className={`flex items-center gap-0.5 ${entry.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {entry.change > 0 ? (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                                {Math.abs(entry.change)} posições
                            </span>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Percentil</span>
                            <span>{percentile}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                style={{ width: `${percentile}%` }}
                                role="progressbar"
                                aria-valuenow={percentile}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="hidden sm:block text-right">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {getRankMessage()}
                    </span>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        de {totalParticipants} participantes
                    </p>
                </div>
            </div>

            {/* Mobile Message */}
            <div className="sm:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {getRankMessage()}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    {PERIOD_CONFIGS[period].name} • {CATEGORY_CONFIGS[category].name}
                </span>
            </div>
        </div>
    )
}

export default LeaderboardUserCard
