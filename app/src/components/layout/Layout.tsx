import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    BookOpen,
    Timer,
    Settings,
    GraduationCap,
    TrendingUp,
    Calendar,
    Moon,
    Leaf,
    User,
    History as HistoryIcon,
    Trophy,
    BarChart3,
    LogOut,
    ClipboardList,
    type LucideIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettingsStore } from '@/store';
import { SkipLinks } from '@/components/accessibility';
import {
    KonamiCode,
    ClickCounter,
    HiddenAchievementNotification
} from '@/components/easter-eggs';
import { useHiddenAchievementsStore } from '@/store/use-hidden-achievements-store';
import { logEasterEggMessage } from '@/store/use-hidden-achievements-store';
import { RealtimeNotifications } from '@/components/RealtimeNotifications';
import { OnlineUsersBadge } from '@/components/OnlineUsers';

interface LayoutProps {
    children: React.ReactNode;
}

interface NavItem {
    to: string;
    icon: LucideIcon;
    label: string;
    description: string;
}

const navItems: NavItem[] = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Visão geral dos estudos' },
    { to: '/topics', icon: BookOpen, label: 'Matérias', description: 'Gerenciar matérias de estudo' },
    { to: '/timer', icon: Timer, label: 'Cronômetro', description: 'Timer de sessões de estudo' },
    { to: '/plan', icon: Calendar, label: 'Plano', description: 'Plano de estudos' },
    { to: '/plano-portugues', icon: ClipboardList, label: 'Português', description: 'Plano de estudos de Português' },
    { to: '/history', icon: HistoryIcon, label: 'Histórico', description: 'Histórico de sessões' },
    { to: '/evolution', icon: TrendingUp, label: 'Evolução', description: 'Estatísticas e progresso' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', description: 'Dashboard de analytics' },
    { to: '/skills', icon: Trophy, label: 'Skills', description: 'Árvores de competências' },
];

export function Layout({ children }: LayoutProps) {
    const { theme, toggleTheme } = useThemeStore();
    const { userProfile } = useSettingsStore();
    const { signOut } = useAuth();
    const location = useLocation();
    const handlePageVisit = useHiddenAchievementsStore((state) => state.handlePageVisit);

    // Log console Easter egg message on first load
    useEffect(() => {
        logEasterEggMessage();
    }, []);

    // Track page visits for explorer achievement
    useEffect(() => {
        const pageMap: Record<string, string> = {
            '/dashboard': 'dashboard',
            '/topics': 'topics',
            '/timer': 'timer',
            '/plan': 'plan',
            '/plano-portugues': 'plano-portugues',
            '/history': 'history',
            '/evolution': 'evolution',
            '/analytics': 'analytics',
            '/skills': 'skills',
            '/settings': 'settings',
        };

        const page = pageMap[location.pathname];
        if (page) {
            handlePageVisit(page);
        }
    }, [location.pathname, handlePageVisit]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        // Also sync dark class for tailwind utilities if needed
        if (theme === 'cyber-luxe') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="min-h-screen bg-transparent">
            {/* Easter Egg Detectors */}
            <KonamiCode />
            <HiddenAchievementNotification />

            {/* Skip Links for keyboard navigation */}
            <SkipLinks
                links={[
                    { targetId: 'main-content', label: 'Pular para o conteúdo principal' },
                    { targetId: 'main-navigation', label: 'Pular para a navegação' },
                ]}
            />

            {/* Desktop Sidebar */}
            <aside
                className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50"
                aria-label="Barra lateral"
            >
                <div className="flex flex-col flex-grow glass-card border-r-0 pt-8 overflow-y-auto">
                    {/* Logo/Brand - with ClickCounter for Easter Egg */}
                    <ClickCounter>
                        <div className="flex items-center gap-3 px-8 mb-12 group cursor-pointer">
                            <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 blue-glow-button transition-all duration-700 group-hover:rotate-[360deg]">
                                <GraduationCap className="h-7 w-7 text-primary" aria-hidden="true" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter text-foreground leading-none">COMMAND</h1>
                                <p className="text-[9px] uppercase font-black tracking-[0.4em] text-primary/60 mt-1">Center • Elite</p>
                            </div>
                        </div>
                    </ClickCounter>

                    {/* Navigation */}
                    <nav
                        id="main-navigation"
                        className="flex-1 px-4 space-y-2"
                        aria-label="Navegação principal"
                    >
                        <div className="px-4 mb-4">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4 italic">Operações Principais</p>
                        </div>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }: { isActive: boolean }) =>
                                    cn(
                                        'group flex items-center gap-4 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-4 focus-visible:ring-primary/50',
                                        isActive
                                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_4px_20px_rgba(37,99,235,0.08)] scale-[1.02]'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-transparent'
                                    )
                                }
                                aria-label={item.description}
                            >
                                <item.icon
                                    className={cn(
                                        "h-4 w-4 transition-all duration-300",
                                        "group-hover:scale-110 group-active:scale-95"
                                    )}
                                    aria-hidden="true"
                                />
                                <span>{item.label}</span>
                                <div className="ml-auto w-1 h-1 rounded-full bg-primary opacity-0 group-[.active]:opacity-100 transition-opacity shadow-[0_0_12px_rgba(37,99,235,0.9)]" />
                            </NavLink>
                        ))}
                    </nav>

                    {/* App Status / User Info Placeholder */}
                    <div className="px-6 py-6 border-t border-border/20">
                        <div className="p-4 rounded-2xl bg-muted/10 border border-border/20 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="flex-1 h-10 justify-start hover:bg-primary/5 rounded-xl px-2 transition-all group"
                                >
                                    <NavLink
                                        to="/settings"
                                        aria-label="Abrir configurações"
                                    >
                                        <Settings className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                                        <span className="text-xs font-bold text-muted-foreground/80 group-hover:text-foreground transition-colors">Config</span>
                                    </NavLink>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="h-10 w-10 flex items-center justify-center hover:bg-primary/5 rounded-xl transition-all group"
                                    aria-label={theme === 'cyber-luxe' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                                >
                                    {theme === 'cyber-luxe' ? (
                                        <Leaf className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                                    ) : (
                                        <Moon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="md:pl-64 flex flex-col min-h-screen">
                {/* Fixed Header */}
                <header
                    className="sticky top-0 z-40 w-full glass-card border-b border-border/20 backdrop-blur-xl px-4 md:px-8 py-3"
                    role="banner"
                >
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        {/* Mobile Branding */}
                        <div className="flex items-center gap-2 md:hidden">
                            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                                <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-black tracking-tighter text-foreground">COMMAND</span>
                        </div>

                        {/* Desktop Spacer (Header content pushed to right) */}
                        <div className="hidden md:block" />

                        {/* User Profile Info */}
                        <div className="flex items-center gap-3">
                            {/* Online Users Badge */}
                            <OnlineUsersBadge />

                            {/* Realtime Notifications */}
                            <RealtimeNotifications />

                            <NavLink
                                to="/settings"
                                className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-foreground/5 transition-all border border-transparent hover:border-border/20 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label={`Configurações da conta de ${userProfile.name}`}
                            >
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                                        {userProfile.name}
                                    </span>
                                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tight">
                                        Elite Member
                                    </span>
                                </div>
                                <div
                                    className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-all shadow-[0_0_15px_rgba(37,99,235,0.05)]"
                                    aria-hidden="true"
                                >
                                    {userProfile.avatar ? (
                                        <img
                                            src={userProfile.avatar}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            </NavLink>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={signOut}
                                className="h-9 w-9 flex items-center justify-center hover:bg-red-500/10 rounded-full transition-all group"
                                title="Sair"
                                aria-label="Sair da conta"
                            >
                                <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                            </Button>
                        </div>
                    </div>
                </header>

                <main
                    id="main-content"
                    className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow"
                    role="main"
                    tabIndex={-1}
                >
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/20 backdrop-blur-xl"
                aria-label="Navegação móvel"
            >
                <ul className="flex justify-around py-3" role="list">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }: { isActive: boolean }) =>
                                    cn(
                                        'flex flex-col items-center gap-1.5 px-4 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-300',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                        isActive
                                            ? 'text-primary scale-110'
                                            : 'text-muted-foreground'
                                    )
                                }
                                aria-label={item.description}
                            >
                                <item.icon className="h-5 w-5" aria-hidden="true" />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
