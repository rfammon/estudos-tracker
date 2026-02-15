import React from 'react'
import { LeaderboardEntry as LeaderboardEntryType, getRankBg, getRankColor, formatScore } from '../../types/leaderboard'
import { CURRENT_USER_ID } from '../../store/use-leaderboard-store'

interface LeaderboardEntryProps {
    entry: LeaderboardEntryType
    category: 'xp' | 'streak' | 'sessions' | 'objectives' | 'assessments'
    isHighlighted?: boolean
    showRankBadge?: boolean
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
    entry,
    category,
    isHighlighted = false,
    showRankBadge = true
}) => {
    const isCurrentUser = entry.userId === CURRENT_USER_ID
    const isTopThree = entry.rank <= 3

    const getMedalEmoji = (rank: number): string => {
        switch (rank) {
            case 1: return '🥇'
            case 2: return '🥈'
            case 3: return '🥉'
            default: return ''
        }
    }

    const getChangeIndicator = () => {
        if (entry.change === undefined || entry.change === 0) {
            return (
                <span className="text-gray-400 text-sm" aria-label="Sem alteração">
                    —
                </span>
            )
        }

        if (entry.change > 0) {
            return (
                <span
                    className="flex items-center text-green-500 text-sm font-medium"
                    aria-label={`Subiu ${entry.change} posições`}
                >
                    <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    {entry.change}
                </span>
            )
        }

        return (
            <span
                className="flex items-center text-red-500 text-sm font-medium"
                aria-label={`Caiu ${Math.abs(entry.change)} posições`}
            >
                <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {Math.abs(entry.change)}
            </span>
        )
    }

    return (
        <div
            className={`
        flex items-center gap-3 p-3 rounded-lg transition-all duration-200
        ${isTopThree ? getRankBg(entry.rank) : 'bg-white dark:bg-gray-800'}
        ${isHighlighted || isCurrentUser ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}
        ${isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
        hover:shadow-md
      `}
            role="listitem"
            aria-label={`${entry.rank}º lugar: ${entry.userName} com ${formatScore(entry.score, category)}`}
        >
            {/* Rank */}
            <div
                className={`
          flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg
          ${isTopThree ? getRankColor(entry.rank) : 'text-gray-500 dark:text-gray-400'}
          ${isTopThree ? 'bg-white dark:bg-gray-700 shadow-sm' : 'bg-gray-100 dark:bg-gray-700'}
        `}
                aria-hidden="true"
            >
                {showRankBadge && isTopThree ? (
                    <span className="text-xl">{getMedalEmoji(entry.rank)}</span>
                ) : (
                    <span>{entry.rank}</span>
                )}
            </div>

            {/* Avatar */}
            <div
                className={`
          flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold
          ${isCurrentUser
                        ? 'bg-primary-500 text-white'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-200'
                    }
        `}
                aria-hidden="true"
            >
                {entry.avatar || entry.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${isCurrentUser ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                        {entry.userName}
                    </span>
                    {isCurrentUser && (
                        <span className="px-1.5 py-0.5 text-xs bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 rounded">
                            Você
                        </span>
                    )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatScore(entry.score, category)}
                </span>
            </div>

            {/* Change Indicator */}
            <div className="flex items-center justify-end w-12">
                {getChangeIndicator()}
            </div>
        </div>
    )
}

export default LeaderboardEntry
