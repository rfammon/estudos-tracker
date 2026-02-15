import React from 'react'
import { LeaderboardPeriod, PERIOD_CONFIGS, formatTimeRemaining } from '../../types/leaderboard'

interface LeaderboardTabsProps {
    activePeriod: LeaderboardPeriod
    onPeriodChange: (period: LeaderboardPeriod) => void
    showCountdown?: boolean
}

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({
    activePeriod,
    onPeriodChange,
    showCountdown = true
}) => {
    const periods: LeaderboardPeriod[] = ['daily', 'weekly', 'monthly', 'all-time']

    const getTabStyles = (period: LeaderboardPeriod): string => {
        const isActive = period === activePeriod

        if (isActive) {
            return `
        bg-primary/10 text-primary border border-primary/20 
        shadow-[0_0_15px_rgba(37,99,235,0.1)] scale-105
      `
        }

        return `
      bg-muted/30 text-muted-foreground hover:text-foreground border border-transparent hover:bg-muted/50
    `
    }

    return (
        <div className="space-y-3">
            {/* Period Tabs */}
            <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Períodos do ranking"
            >
                {periods.map(period => {
                    const config = PERIOD_CONFIGS[period]
                    const isActive = period === activePeriod

                    return (
                        <button
                            key={period}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`leaderboard-panel-${period}`}
                            id={`leaderboard-tab-${period}`}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => onPeriodChange(period)}
                            className={`
                px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${getTabStyles(period)}
              `}
                        >
                            <span className="flex items-center gap-1.5">
                                {period === 'daily' && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                                {period === 'weekly' && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                                {period === 'monthly' && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                    </svg>
                                )}
                                {period === 'all-time' && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                )}
                                {config.name}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Countdown Timer */}
            {showCountdown && activePeriod !== 'all-time' && (
                <div
                    className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest"
                    aria-live="polite"
                >
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTimeRemaining(PERIOD_CONFIGS[activePeriod].getEndDate())}</span>
                    <span className="opacity-30">•</span>
                    <span className="text-[9px] lowercase font-medium italic">{PERIOD_CONFIGS[activePeriod].resetDescription}</span>
                </div>
            )}
        </div>
    )
}

export default LeaderboardTabs
