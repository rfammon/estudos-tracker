import { useGamificationStore, ACHIEVEMENTS, Achievement } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabLabel } from '@/components/ui/tabs';
import {
    Trophy,
    Flame,
    Star,
    Target,
    Lock,
    Unlock,
    Crown,
    Award,
    Medal,
    Gem
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicTime {
    topicId: string;
    topicName: string;
    totalTime: number;
}

interface GamificationOverviewProps {
    topicTimes?: TopicTime[];
}

export function GamificationOverview({ topicTimes = [] }: GamificationOverviewProps) {
    const {
        totalPoints,
        currentStreak,
        bestStreak,
        totalSessions,
        totalStudyTime,
        masteredTopics,
        getCurrentLevel,
        getPointsToNextLevel,
        getProgressToNextLevel,
        unlockedAchievements,
    } = useGamificationStore();

    const currentLevel = getCurrentLevel();
    const pointsToNext = getPointsToNextLevel();
    const progressPercent = getProgressToNextLevel();

    // Sort topic times for leaderboard
    const sortedTopics = [...topicTimes]
        .sort((a, b) => b.totalTime - a.totalTime)
        .slice(0, 5);

    const getAchievementProgress = (achievement: Achievement): number => {
        switch (achievement.type) {
            case 'sessions':
                return (totalSessions / achievement.requirement) * 100;
            case 'streak':
                return (currentStreak / achievement.requirement) * 100;
            case 'totalTime':
                return (totalStudyTime / achievement.requirement) * 100;
            case 'points':
                return (totalPoints / achievement.requirement) * 100;
            case 'topics':
                return (masteredTopics / achievement.requirement) * 100;
            default:
                return 0;
        }
    };

    const getLevelIcon = () => {
        if (currentLevel.number >= 10) return <Crown className="h-8 w-8 text-yellow-500" aria-hidden="true" />;
        if (currentLevel.number >= 7) return <Award className="h-8 w-8 text-purple-500" aria-hidden="true" />;
        if (currentLevel.number >= 4) return <Medal className="h-8 w-8 text-blue-500" aria-hidden="true" />;
        return <Star className="h-8 w-8 text-green-500" aria-hidden="true" />;
    };

    const getLevelIconLabel = () => {
        if (currentLevel.number >= 10) return 'Ícone de coroa - nível mestre';
        if (currentLevel.number >= 7) return 'Ícone de prêmio - nível avançado';
        if (currentLevel.number >= 4) return 'Ícone de medalha - nível intermediário';
        return 'Ícone de estrela - nível iniciante';
    };

    return (
        <div className="space-y-6" role="region" aria-label="Visão geral de gamificação">
            {/* Level and Points Card */}
            <Card
                className="bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                role="region"
                aria-label={`Nível ${currentLevel.number}: ${currentLevel.name}`}
            >
                <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                        <div
                            className="p-4 bg-white/20 rounded-full"
                            role="img"
                            aria-label={getLevelIconLabel()}
                        >
                            {getLevelIcon()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl font-bold">Nível {currentLevel.number}</span>
                                <span className="text-xl font-semibold text-purple-200">{currentLevel.name}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-300" aria-hidden="true" />
                                <span className="font-semibold" aria-label={`${totalPoints} pontos totais`}>
                                    {totalPoints} pontos
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm text-purple-100">
                                    <span id="next-level-label">Próximo nível</span>
                                    <span>
                                        {currentLevel.number < 10
                                            ? `${pointsToNext} pontos restantes`
                                            : 'Nível máximo!'
                                        }
                                    </span>
                                </div>
                                <Progress
                                    value={progressPercent}
                                    className="h-2 bg-white/30"
                                    indicatorClassName="bg-yellow-400"
                                    label="Progresso para o próximo nível"
                                    aria-labelledby="next-level-label"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                role="list"
                aria-label="Estatísticas do jogador"
            >
                <Card role="listitem">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <Flame className="h-6 w-6 text-orange-500 mb-2" aria-hidden="true" />
                        <div
                            className="text-2xl font-bold"
                            aria-label={`${currentStreak} dias consecutivos`}
                        >
                            {currentStreak}
                        </div>
                        <div className="text-xs text-muted-foreground">Dias seguidos</div>
                    </CardContent>
                </Card>
                <Card role="listitem">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <Trophy className="h-6 w-6 text-amber-500 mb-2" aria-hidden="true" />
                        <div
                            className="text-2xl font-bold"
                            aria-label={`${bestStreak} dias de recorde`}
                        >
                            {bestStreak}
                        </div>
                        <div className="text-xs text-muted-foreground">Recorde</div>
                    </CardContent>
                </Card>
                <Card role="listitem">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <Target className="h-6 w-6 text-blue-500 mb-2" aria-hidden="true" />
                        <div
                            className="text-2xl font-bold"
                            aria-label={`${totalSessions} sessões completadas`}
                        >
                            {totalSessions}
                        </div>
                        <div className="text-xs text-muted-foreground">Sessões</div>
                    </CardContent>
                </Card>
                <Card role="listitem">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <Gem className="h-6 w-6 text-green-500 mb-2" aria-hidden="true" />
                        <div
                            className="text-2xl font-bold"
                            aria-label={`${masteredTopics} matérias dominadas`}
                        >
                            {masteredTopics}
                        </div>
                        <div className="text-xs text-muted-foreground">Dominadas</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for Achievements and Leaderboard */}
            <Tabs
                defaultValue="achievements"
                className="w-full"
                aria-label="Conquistas e ranking"
            >
                <TabsList className="w-full" aria-label="Abas de conquistas e ranking">
                    <TabsTrigger
                        value="achievements"
                        className="flex-1"
                        aria-label={`Conquistas: ${unlockedAchievements.length} de ${ACHIEVEMENTS.length} desbloqueadas`}
                    >
                        <TabLabel
                            icon={<Trophy className="h-4 w-4" />}
                            badge={unlockedAchievements.length}
                        >
                            Conquistas
                        </TabLabel>
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="flex-1">
                        <TabLabel icon={<Award className="h-4 w-4" />}>
                            Ranking
                        </TabLabel>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="achievements" className="mt-4">
                    <div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        role="list"
                        aria-label="Lista de conquistas"
                    >
                        {ACHIEVEMENTS.map((achievement) => {
                            const isUnlocked = unlockedAchievements.includes(achievement.id);
                            const progress = getAchievementProgress(achievement);

                            return (
                                <Card
                                    key={achievement.id}
                                    className={cn(
                                        "relative overflow-hidden transition-all duration-300",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        isUnlocked
                                            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 hover:shadow-md'
                                            : 'bg-gray-50 border-gray-200'
                                    )}
                                    role="listitem"
                                    aria-label={isUnlocked
                                        ? `Conquista desbloqueada: ${achievement.name}. ${achievement.description}`
                                        : `Conquista bloqueada. Progresso: ${Math.round(progress)}%`
                                    }
                                    tabIndex={0}
                                >
                                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                                        <div
                                            className={cn(
                                                "text-3xl",
                                                !isUnlocked && 'grayscale opacity-40'
                                            )}
                                            role="img"
                                            aria-label={isUnlocked ? achievement.name : 'Conquista bloqueada'}
                                        >
                                            {achievement.icon}
                                        </div>
                                        <div>
                                            <h3 className={cn(
                                                "font-semibold text-sm",
                                                isUnlocked ? 'text-amber-800' : 'text-gray-600'
                                            )}>
                                                {isUnlocked ? achievement.name : '???'}
                                            </h3>
                                            <p className={cn(
                                                "text-xs",
                                                isUnlocked ? 'text-amber-700' : 'text-gray-500'
                                            )}>
                                                {isUnlocked ? achievement.description : 'Complete para desbloquear'}
                                            </p>
                                        </div>

                                        {!isUnlocked && (
                                            <div className="w-full mt-2">
                                                <div
                                                    className="h-1.5 bg-gray-200 rounded-full overflow-hidden"
                                                    role="progressbar"
                                                    aria-valuenow={Math.round(progress)}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-label={`${Math.round(progress)}% completo`}
                                                >
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full transition-all"
                                                        style={{ width: `${Math.min(100, progress)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute top-2 right-2" aria-hidden="true">
                                            {isUnlocked ? (
                                                <Unlock className="h-4 w-4 text-amber-500" />
                                            ) : (
                                                <Lock className="h-4 w-4 text-gray-400" />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" aria-hidden="true" />
                                Matérias Mais Estudadas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {sortedTopics.length === 0 ? (
                                <div
                                    className="text-center py-8 text-muted-foreground"
                                    role="status"
                                    aria-label="Nenhuma matéria estudada ainda"
                                >
                                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                                    <p>Nenhuma matéria estudada ainda</p>
                                    <p className="text-sm">Comece a estudar para aparecer no ranking!</p>
                                </div>
                            ) : (
                                <ol
                                    className="space-y-3"
                                    aria-label="Ranking de matérias mais estudadas"
                                >
                                    {sortedTopics.map((topic, index) => {
                                        const hours = Math.floor(topic.totalTime / 3600);
                                        const minutes = Math.floor((topic.totalTime % 3600) / 60);
                                        const timeLabel = hours > 0 ? `${hours} horas e ${minutes} minutos` : `${minutes} minutos`;

                                        return (
                                            <li
                                                key={topic.topicId}
                                                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                tabIndex={0}
                                                aria-label={`${index + 1}º lugar: ${topic.topicName}, ${timeLabel} de estudo`}
                                            >
                                                <div
                                                    className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                                                        index === 0 && 'bg-yellow-400 text-yellow-900',
                                                        index === 1 && 'bg-gray-300 text-gray-700',
                                                        index === 2 && 'bg-amber-600 text-white',
                                                        index > 2 && 'bg-gray-200 text-gray-600'
                                                    )}
                                                    aria-label={`${index + 1}º lugar`}
                                                >
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{topic.topicName}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold" aria-label={timeLabel}>
                                                        {hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
