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
                className="bg-muted/10 rounded-[2rem] p-8 border border-border/10 text-center"
                role="region"
                aria-label="Sua posição no ranking"
            >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                    Jogue para aparecer no ranking!
                </p>
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
        if (entry.rank === 1) return 'bg-yellow-100/50 text-yellow-700 border-yellow-200/50'
        if (entry.rank === 2) return 'bg-slate-100/50 text-slate-700 border-slate-200/50'
        if (entry.rank === 3) return 'bg-amber-100/50 text-amber-700 border-amber-200/50'
        return 'bg-primary/10 text-primary border-primary/20'
    }

    return (
        <div
            className={`
        rounded-[2rem] p-6 border transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]
        ${isTopThree
                    ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 ring-1 ring-primary/5'
                    : 'bg-white/80 dark:bg-white/5 border-border/10 backdrop-blur-xl'
                }
      `}
            role="region"
            aria-label="Sua posição no ranking"
        >
            <div className="flex items-center gap-4">
                {/* Rank Badge */}
                <div
                    className={`
            flex flex-col items-center justify-center w-20 h-20 rounded-2xl border transition-transform duration-500 group-hover:scale-110
            ${getRankBadgeStyles()}
          `}
                >
                    <span className="text-3xl font-black tracking-tighter shrink-0">
                        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">
                        {entry.rank <= 3 ? 'Top 3' : 'Posição'}
                    </span>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-xl tracking-tighter text-foreground truncate">
                            {entry.userName}
                        </h3>
                        <span className="text-base animate-bounce">{CATEGORY_CONFIGS[category].icon}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
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
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">
                            <span>Percentil de Nível</span>
                            <span>{percentile}%</span>
                        </div>
                        <div className="h-1.5 bg-muted/20 rounded-full overflow-hidden p-[2px]">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
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
                    <span className="text-xs font-black uppercase tracking-widest text-foreground/80">
                        {getRankMessage()}
                    </span>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tight mt-1">
                        de {totalParticipants} alunos
                    </p>
                </div>
            </div>

            {/* Mobile Message */}
            <div className="sm:hidden mt-4 pt-4 border-t border-border/10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">
                    {getRankMessage()}
                </span>
                <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    {PERIOD_CONFIGS[period].name} • {CATEGORY_CONFIGS[category].name}
                </span>
            </div>
        </div>
    )
}

export default LeaderboardUserCard
