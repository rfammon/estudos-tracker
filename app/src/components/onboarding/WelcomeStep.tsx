import { OnboardingStep } from './OnboardingStep';
import { cn } from '@/lib/utils';

interface WelcomeStepProps {
    userName?: string;
    className?: string;
}

export function WelcomeStep({ userName = 'Estudante', className }: WelcomeStepProps) {
    return (
        <div className={cn('flex flex-col items-center', className)}>
            <OnboardingStep
                icon="🎉"
                title={`Bem-vindo, ${userName}!`}
                description="Vamos conhecer o Estudos Tracker, seu novo companheiro de estudos para concursos e exames."
            >
                {/* Feature highlights */}
                <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
                    <FeatureCard
                        icon="⏱️"
                        title="Timer Inteligente"
                        description="Cronômetro para suas sessões"
                    />
                    <FeatureCard
                        icon="📊"
                        title="Evolução"
                        description="Acompanhe seu progresso"
                    />
                    <FeatureCard
                        icon="🏆"
                        title="Conquistas"
                        description="Gamificação motivadora"
                    />
                    <FeatureCard
                        icon="📚"
                        title="Organização"
                        description="Matérias e tópicos"
                    />
                </div>

                {/* Motivational message */}
                <div className="mt-8 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                    <p className="text-slate-300 text-sm md:text-base">
                        💡 <span className="text-cyan-400 font-medium">Dica:</span> Complete o onboarding para desbloquear sua primeira conquista!
                    </p>
                </div>
            </OnboardingStep>
        </div>
    );
}

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center p-4 rounded-xl',
                'bg-slate-800/50 border border-slate-700/50',
                'hover:border-cyan-500/30 hover:bg-slate-800/80',
                'transition-all duration-300',
                'group cursor-default'
            )}
        >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">
                {icon}
            </span>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
            <p className="text-xs text-slate-400 text-center">{description}</p>
        </div>
    );
}
