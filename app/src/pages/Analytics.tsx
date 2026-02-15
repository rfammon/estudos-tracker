import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/analytics';
import { usePageAnnouncement } from '@/hooks/useAnnouncement';

export function Analytics() {
    const navigate = useNavigate();

    // Accessibility: Announce page on load
    usePageAnnouncement('Analytics - Dashboard de Progresso');

    return (
        <div className="space-y-6" role="region" aria-label="Página de Analytics">
            <header className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="rounded-full hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Voltar para página anterior"
                >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                <div>
                    <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40 italic">
                        Analytics
                    </h1>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                        Dashboard de progresso e insights
                    </p>
                </div>
            </header>

            <AnalyticsDashboard />
        </div>
    );
}
