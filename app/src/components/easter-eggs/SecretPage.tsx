import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHiddenAchievementsStore } from '../../store/use-hidden-achievements-store';
import { ConfettiEffect } from './ConfettiEffect';

/**
 * SecretPage component - A hidden Easter Egg page
 * Accessible via /easter-egg route
 * 
 * Features:
 * - Special animation and design
 * - Confetti effect on first visit
 * - Hidden message from developers
 * - Rainbow theme unlock hint
 */
export function SecretPage() {
    const navigate = useNavigate();
    const handleSecretPageVisit = useHiddenAchievementsStore((state) => state.handleSecretPageVisit);
    const rainbowThemeUnlocked = useHiddenAchievementsStore((state) => state.rainbowThemeUnlocked);
    const achievements = useHiddenAchievementsStore((state) => state.achievements);

    const [showConfetti, setShowConfetti] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [showSecret, setShowSecret] = useState(false);

    const fullText = 'Você encontrou a página secreta! 🎉';

    // Trigger achievement on first visit
    useEffect(() => {
        const detectiveAchievement = achievements.find((a) => a.id === 'detective');
        if (!detectiveAchievement?.discovered) {
            handleSecretPageVisit();
            setShowConfetti(true);
        }
    }, [handleSecretPageVisit, achievements]);

    // Typewriter effect
    useEffect(() => {
        if (typedText.length < fullText.length) {
            const timeout = setTimeout(() => {
                setTypedText(fullText.slice(0, typedText.length + 1));
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            setTimeout(() => setShowSecret(true), 500);
        }
    }, [typedText, fullText]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden relative">
            {/* Confetti effect */}
            {showConfetti && <ConfettiEffect duration={5000} />}

            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`,
                        }}
                    >
                        <span className="text-4xl opacity-20">
                            {['🎮', '🎯', '🏆', '⭐', '🌟', '💎', '🔮', '🚀'][i % 8]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center p-8 max-w-2xl">
                {/* Glowing title */}
                <h1 className="text-6xl font-bold mb-8 animate-pulse bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                    🎉 Easter Egg! 🎉
                </h1>

                {/* Typewriter text */}
                <div className="text-2xl text-white mb-8 h-16">
                    <span>{typedText}</span>
                    <span className="animate-blink">|</span>
                </div>

                {/* Secret content */}
                {showSecret && (
                    <div className="space-y-6 animate-fade-in">
                        {/* Achievement unlocked */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="text-4xl">🕵️</span>
                                <h2 className="text-2xl font-bold text-white">Conquista Desbloqueada!</h2>
                            </div>
                            <p className="text-purple-200">
                                <strong>Detetive</strong> - Encontrou a página secreta!
                            </p>
                            <p className="text-yellow-400 mt-2">+100 XP</p>
                        </div>

                        {/* Rainbow theme hint */}
                        {rainbowThemeUnlocked && (
                            <div className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 p-[2px] rounded-xl">
                                <div className="bg-gray-900/90 rounded-xl p-4">
                                    <p className="text-white">
                                        🌈 Tema Arco-Íris desbloqueado! Visite as configurações para ativá-lo.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Secret message */}
                        <div className="bg-black/30 backdrop-blur rounded-xl p-6 border border-purple-500/30">
                            <h3 className="text-lg font-semibold text-purple-300 mb-3">
                                💬 Mensagem dos Desenvolvedores
                            </h3>
                            <p className="text-gray-300 italic">
                                "Parabéns por ser curioso! Os melhores segredos são encontrados por aqueles
                                que ousam explorar. Continue assim e você descobrirá muito mais!"
                            </p>
                            <p className="text-purple-400 mt-4 text-sm">
                                — A Equipe de Desenvolvimento
                            </p>
                        </div>

                        {/* Hints for other easter eggs */}
                        <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-purple-300 font-medium mb-2">🔮 Dicas para outros Easter Eggs:</h4>
                            <ul className="text-left text-gray-400 text-sm space-y-1">
                                <li>• Existe um código especial que gamers conhecem...</li>
                                <li>• O console guarda segredos...</li>
                                <li>• Clique, clique, clique...</li>
                                <li>• Horários incomuns trazem recompensas...</li>
                            </ul>
                        </div>

                        {/* Back button */}
                        <button
                            onClick={() => navigate('/')}
                            className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
                        >
                            ← Voltar ao Início
                        </button>
                    </div>
                )}
            </div>

            {/* CSS for animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
}

export default SecretPage;
