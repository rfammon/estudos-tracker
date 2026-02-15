import { cn } from '@/lib/utils';
import {
    User,
    Lock,
    Bell,
    Palette,
    Globe,
    Smartphone,
    CreditCard,
    Database,
    Accessibility,
    Share2,
    MapPin,
    HelpCircle,
    FileText,
    LogOut,
    Trash2,
    ChevronRight,
    type LucideIcon,
} from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    badge?: string;
}

interface SettingsNavProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const navItems: NavItem[] = [
    { id: 'account', label: 'Conta', icon: User },
    { id: 'privacy', label: 'Privacidade e Segurança', icon: Lock },
    { id: 'personalization', label: 'Personalização', icon: Palette },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'language', label: 'Idioma e Região', icon: Globe },
    { id: 'devices', label: 'Dispositivos', icon: Smartphone },
    { id: 'subscription', label: 'Assinatura', icon: CreditCard },
    { id: 'data', label: 'Dados e Armazenamento', icon: Database },
    { id: 'accessibility', label: 'Acessibilidade', icon: Accessibility },
    { id: 'social', label: 'Compartilhamento', icon: Share2 },
    { id: 'location', label: 'Localização', icon: MapPin },
    { id: 'help', label: 'Ajuda e Suporte', icon: HelpCircle },
    { id: 'legal', label: 'Termos e Privacidade', icon: FileText },
];

const accountItems: NavItem[] = [
    { id: 'logout', label: 'Sair da Conta', icon: LogOut },
    { id: 'delete', label: 'Excluir Conta', icon: Trash2, badge: 'danger' },
];

export function SettingsNav({ activeSection, onSectionChange }: SettingsNavProps) {
    return (
        <nav className="space-y-6">
            {/* Main Settings */}
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-3 mb-3">
                    Configurações
                </h3>
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            data-section={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200',
                                'hover:bg-primary/5 hover:text-foreground',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                activeSection === item.id
                                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_4px_12px_rgba(37,99,235,0.1)]'
                                    : 'text-muted-foreground'
                            )}
                        >
                            <item.icon className={cn(
                                "h-4 w-4 transition-transform",
                                "group-hover:scale-110"
                            )} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                                <span className={cn(
                                    "px-2 py-0.5 text-[10px] font-bold rounded-full",
                                    item.badge === 'danger' && "bg-destructive/10 text-destructive"
                                )}>
                                    {item.badge}
                                </span>
                            )}
                            <ChevronRight className={cn(
                                "h-3 w-3 opacity-0 transition-opacity",
                                activeSection === item.id && "opacity-100"
                            )} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Account Actions */}
            <div className="pt-4 border-t border-border/50">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-3 mb-3">
                    Conta
                </h3>
                <div className="space-y-1">
                    {accountItems.map((item) => (
                        <button
                            key={item.id}
                            data-section={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200',
                                'hover:bg-destructive/5 hover:text-destructive',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                activeSection === item.id && 'bg-destructive/10 text-destructive'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="flex-1 text-left">{item.label}</span>
                            <ChevronRight className={cn(
                                "h-3 w-3 opacity-0 transition-opacity",
                                activeSection === item.id && "opacity-100"
                            )} />
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export type { SettingsNavProps };
