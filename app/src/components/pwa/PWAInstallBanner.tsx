import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallBanner() {
    const { isInstallable, installApp, dismissPrompt } = usePWAInstall();

    if (!isInstallable) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom-4">
            <button
                onClick={dismissPrompt}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
            >
                <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Download className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm">Instalar Aplicativo</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Adicione o Estudos Tracker à tela inicial para acesso rápido e offline.
                    </p>
                </div>
            </div>
            <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={installApp} className="flex-1">
                    Instalar
                </Button>
                <Button size="sm" variant="outline" onClick={dismissPrompt}>
                    Agora não
                </Button>
            </div>
        </div>
    );
}
