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
        flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 border
        ${isTopThree ? getRankBg(entry.rank) : 'bg-white/40 dark:bg-white/5 border-border/5'}
        ${isHighlighted || isCurrentUser ? 'ring-2 ring-primary/40 border-primary/20 shadow-lg shadow-primary/5 scale-[1.01]' : 'border-transparent'}
        ${isCurrentUser && !isTopThree ? 'bg-primary/5' : ''}
        hover:shadow-xl hover:scale-[1.02] hover:bg-white/80 dark:hover:bg-white/10 group
      `}
            role="listitem"
            aria-label={`${entry.rank}º lugar: ${entry.userName} com ${formatScore(entry.score, category)}`}
        >
            {/* Rank */}
            <div
                className={`
          flex items-center justify-center w-12 h-12 rounded-2xl font-black text-xl tracking-tighter transition-transform duration-500 group-hover:rotate-12
          ${isTopThree ? getRankColor(entry.rank) : 'text-muted-foreground/40'}
          ${isTopThree ? 'bg-white/80 dark:bg-white/10 shadow-sm border border-white/20' : 'bg-muted/10'}
        `}
                aria-hidden="true"
            >
                {showRankBadge && isTopThree ? (
                    <span className="text-2xl drop-shadow-md">{getMedalEmoji(entry.rank)}</span>
                ) : (
                    <span>{entry.rank}</span>
                )}
            </div>

            {/* Avatar */}
            <div
                className={`
          flex items-center justify-center w-12 h-12 rounded-2xl text-xs font-black uppercase tracking-tighter
          ${isCurrentUser
                        ? 'bg-primary text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                        : 'bg-gradient-to-br from-muted/20 to-muted/40 text-muted-foreground border border-border/5'
                    }
        `}
                aria-hidden="true"
            >
                {entry.avatar || entry.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className={`font-black text-base tracking-tight truncate ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                        {entry.userName}
                    </span>
                    {isCurrentUser && (
                        <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-primary text-white rounded-full">
                            Você
                        </span>
                    )}
                </div>
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
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
