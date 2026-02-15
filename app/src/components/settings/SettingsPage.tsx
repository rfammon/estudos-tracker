import * as React from 'react';
import { cn } from '@/lib/utils';
import { useSettingsStore, useThemeStore, useOnboardingStore } from '@/store';
import { SettingsToggle } from './SettingsToggle';
import { SettingsNav } from './SettingsNav';
import {
    User,
    Lock,
    Bell,
    Palette,
    Globe,
    Smartphone,
    Database,
    Accessibility,
    Share2,
    MapPin,
    HelpCircle,
    FileText,
    LogOut,
    Trash2,
    Moon,
    Sun,
    Check,
    AlertTriangle,
    Loader2,
    Download,
    Trash,
    ChevronRight,
    Sparkles,
    Mail,
    MessageSquare,
    Shield,
    Eye,
    BellRing,
    Clock,
    MapPinned,
    Save,
    ShieldCheck,
    Zap,
    Keyboard,
    Laptop,
    Tablet,
    Smartphone as SmartphoneIcon,
    Clock3,
    Star,
    Crown,
    CreditCard as CreditCardIcon,
    Receipt,
    Gift,
    CheckCircle,
    AlertCircle,
    Info,
    ExternalLink,
    Send,
    Phone,
    Share,
    Users,
    Contrast,
    Maximize,
    Lightbulb,
    RotateCcw,
    Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function SettingsPage() {
    const [activeSection, setActiveSection] = React.useState('account');
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
    const [isBackingUp, setIsBackingUp] = React.useState(false);
    const [isClearingCache, setIsClearingCache] = React.useState(false);
    const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const settings = useSettingsStore();
    const { theme, setTheme } = useThemeStore();
    const { resetOnboarding, completed: onboardingCompleted } = useOnboardingStore();

    const showToast = (message: string, type: 'success' | 'error' = 'success', details?: string) => {
        setToast({ message: details ? `${message}: ${details}` : message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // UI Stability: Reset scroll on section change
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeSection]);

    const handleBackup = async () => {
        setIsBackingUp(true);
        try {
            await settings.performBackup();
            showToast('Backup realizado com sucesso!');
        } catch (error: any) {
            showToast('Erro ao fazer backup', 'error', error.message);
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleClearCache = async () => {
        setIsClearingCache(true);
        try {
            await settings.clearCache();
            showToast('Cache limpo com sucesso!');
        } catch (error: any) {
            showToast('Erro ao limpar cache', 'error', error.message);
        } finally {
            setIsClearingCache(false);
        }
    };

    const handleExportData = async () => {
        try {
            const data = await settings.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `command-center-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Dados exportados com sucesso!');
        } catch (error: any) {
            showToast('Erro ao exportar dados', 'error', error.message);
        }
    };

    const handleLogout = async () => {
        await settings.logout();
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showToast('A imagem deve ter menos de 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            settings.setUserProfile({ avatar: base64 });
            showToast('Foto atualizada com sucesso!');
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        settings.setUserProfile({ avatar: undefined });
        showToast('Foto removida');
    };

    const triggerPhotoUpload = () => {
        document.getElementById('avatar-upload')?.click();
    };

    const handleDeleteAccount = async () => {
        await settings.deleteAccount();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Navigation */}
            <div className="lg:hidden">
                <Select value={activeSection} onValueChange={setActiveSection}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma seção" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="account">Conta</SelectItem>
                        <SelectItem value="privacy">Privacidade e Segurança</SelectItem>
                        <SelectItem value="personalization">Personalização</SelectItem>
                        <SelectItem value="notifications">Notificações</SelectItem>
                        <SelectItem value="language">Idioma e Região</SelectItem>
                        <SelectItem value="devices">Dispositivos</SelectItem>
                        <SelectItem value="subscription">Assinatura</SelectItem>
                        <SelectItem value="data">Dados e Armazenamento</SelectItem>
                        <SelectItem value="accessibility">Acessibilidade</SelectItem>
                        <SelectItem value="social">Compartilhamento</SelectItem>
                        <SelectItem value="location">Localização</SelectItem>
                        <SelectItem value="help">Ajuda e Suporte</SelectItem>
                        <SelectItem value="legal">Termos e Privacidade</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-6">
                    <Card className="glass-card border-border/20">
                        <CardContent className="p-4">
                            <SettingsNav
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie suas preferências e configurações do aplicativo
                    </p>
                </div>

                {/* Account Section */}
                {activeSection === 'account' && (
                    <Card className="glass-card border-border/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Perfil do Usuário
                            </CardTitle>
                            <CardDescription>
                                Gerencie suas informações pessoais
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary/10">
                                    {settings.userProfile.avatar ? (
                                        <img
                                            src={settings.userProfile.avatar}
                                            alt="Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-10 w-10 text-primary" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" size="sm" onClick={triggerPhotoUpload}>
                                        Alterar Foto
                                    </Button>
                                    {settings.userProfile.avatar && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={handleRemovePhoto}
                                        >
                                            Remover Foto
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Profile Fields */}
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Nome</label>
                                    <Input
                                        value={settings.userProfile.name}
                                        onChange={(e) => settings.setUserProfile({ name: e.target.value })}
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        type="email"
                                        value={settings.userProfile.email}
                                        onChange={(e) => settings.setUserProfile({ email: e.target.value })}
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Bio</label>
                                    <Input
                                        value={settings.userProfile.bio || ''}
                                        onChange={(e) => settings.setUserProfile({ bio: e.target.value })}
                                        placeholder="Conte um pouco sobre você..."
                                    />
                                </div>
                            </div>

                            <Button className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alterações
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Privacy Section */}
                {activeSection === 'privacy' && (
                    <Card className="glass-card border-border/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                Privacidade e Segurança
                            </CardTitle>
                            <CardDescription>
                                Controle sua privacidade e configurações de segurança
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SettingsToggle
                                checked={settings.privacy.showProfile}
                                onCheckedChange={(checked) => settings.updatePrivacy({ showProfile: checked })}
                                label="Perfil Público"
                                description="Permitir que outros vejam seu perfil"
                                icon={<Eye className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.privacy.shareProgress}
                                onCheckedChange={(checked) => settings.updatePrivacy({ shareProgress: checked })}
                                label="Compartilhar Progresso"
                                description="Compartilhar seu progresso com outros usuários"
                                icon={<Share2 className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.privacy.activityStatus}
                                onCheckedChange={(checked) => settings.updatePrivacy({ activityStatus: checked })}
                                label="Status de Atividade"
                                description="Mostrar quando você está online"
                                icon={<Clock3 className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.privacy.analytics}
                                onCheckedChange={(checked) => settings.updatePrivacy({ analytics: checked })}
                                label="Analytics"
                                description="Enviar dados anônimos para melhorar o app"
                                icon={<ShieldCheck className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.privacy.dataCollection}
                                onCheckedChange={(checked) => settings.updatePrivacy({ dataCollection: checked })}
                                label="Coleta de Dados"
                                description="Permitir coleta de dados para personalização"
                                icon={<Database className="h-4 w-4" />}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Personalization Section */}
                {activeSection === 'personalization' && (
                    <Card className="glass-card border-border/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-primary" />
                                Personalização
                            </CardTitle>
                            <CardDescription>
                                Customize a aparência do aplicativo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Theme Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Tema</label>
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                                    <button
                                        onClick={() => setTheme('cyber-luxe')}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                                            theme === 'cyber-luxe'
                                                ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                                                : 'border-border hover:border-primary/50'
                                        )}
                                    >
                                        <Moon className="h-5 w-5 text-primary" />
                                        <div className="text-left">
                                            <span className="text-sm font-medium block">Cyber Luxe</span>
                                            <span className="text-xs text-muted-foreground">Escuro</span>
                                        </div>
                                        {theme === 'cyber-luxe' && <Check className="h-4 w-4 text-primary ml-auto" />}
                                    </button>
                                    <button
                                        onClick={() => setTheme('pistachio')}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                                            theme === 'pistachio'
                                                ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                                : 'border-border hover:border-primary/50'
                                        )}
                                    >
                                        <Sun className="h-5 w-5 text-emerald-500" />
                                        <div className="text-left">
                                            <span className="text-sm font-medium block">Pistachio</span>
                                            <span className="text-xs text-muted-foreground">Claro</span>
                                        </div>
                                        {theme === 'pistachio' && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
                                    </button>
                                    <button
                                        onClick={() => setTheme('material-light')}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                                            theme === 'material-light'
                                                ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                                                : 'border-border hover:border-primary/50'
                                        )}
                                    >
                                        <Palette className="h-5 w-5 text-indigo-500" />
                                        <div className="text-left">
                                            <span className="text-sm font-medium block">Material Light</span>
                                            <span className="text-xs text-muted-foreground">Suave</span>
                                        </div>
                                        {theme === 'material-light' && <Check className="h-4 w-4 text-indigo-500 ml-auto" />}
                                    </button>
                                    <button
                                        onClick={() => setTheme('material-dark')}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                                            theme === 'material-dark'
                                                ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                                : 'border-border hover:border-primary/50'
                                        )}
                                    >
                                        <Sparkles className="h-5 w-5 text-purple-400" />
                                        <div className="text-left">
                                            <span className="text-sm font-medium block">Material Dark</span>
                                            <span className="text-xs text-muted-foreground">Moderno</span>
                                        </div>
                                        {theme === 'material-dark' && <Check className="h-4 w-4 text-purple-400 ml-auto" />}
                                    </button>
                                </div>
                            </div>


                            {/* Font Size */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Tamanho da Fonte</label>
                                <Select
                                    value={settings.fontSize}
                                    onValueChange={(value: 'small' | 'medium' | 'large') => settings.setFontSize(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Pequeno</SelectItem>
                                        <SelectItem value="medium">Médio</SelectItem>
                                        <SelectItem value="large">Grande</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Compact Mode */}
                            <SettingsToggle
                                checked={settings.compactMode}
                                onCheckedChange={settings.setCompactMode}
                                label="Modo Compacto"
                                description="Reduzir espaçamento para mostrar mais conteúdo"
                                icon={<Maximize className="h-4 w-4" />}
                            />

                            {/* Animations */}
                            <SettingsToggle
                                checked={!settings.accessibility.reduceMotion}
                                onCheckedChange={(checked) => settings.updateAccessibility({ reduceMotion: !checked })}
                                label="Animações"
                                description="Ativar animações e transições"
                                icon={<Zap className="h-4 w-4" />}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                    <div className="space-y-4">
                        <Card className="glass-card border-border/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-primary" />
                                    Notificações Push
                                </CardTitle>
                                <CardDescription>
                                    Configure quais notificações deseja receber
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <SettingsToggle
                                    checked={settings.notifications.push}
                                    onCheckedChange={(checked) => settings.updateNotifications({ push: checked })}
                                    label="Notificações Push"
                                    description="Ativar notificações push"
                                    icon={<BellRing className="h-4 w-4" />}
                                />
                                {settings.notifications.push && (
                                    <>
                                        <div className="pl-4 border-l-2 border-border space-y-3">
                                            <SettingsToggle
                                                checked={settings.notifications.pushStudyReminders}
                                                onCheckedChange={(checked) => settings.updateNotifications({ pushStudyReminders: checked })}
                                                label="Lembretes de Estudo"
                                                description="Lembretes para estudar"
                                                icon={<Clock className="h-4 w-4" />}
                                            />
                                            <SettingsToggle
                                                checked={settings.notifications.pushAchievements}
                                                onCheckedChange={(checked) => settings.updateNotifications({ pushAchievements: checked })}
                                                label="Conquistas"
                                                description="Notificações de conquistas desbloqueadas"
                                                icon={<Star className="h-4 w-4" />}
                                            />
                                            <SettingsToggle
                                                checked={settings.notifications.pushGamification}
                                                onCheckedChange={(checked) => settings.updateNotifications({ pushGamification: checked })}
                                                label="Gamificação"
                                                description="Atualizações de níveis e pontos"
                                                icon={<Sparkles className="h-4 w-4" />}
                                            />
                                            <SettingsToggle
                                                checked={settings.notifications.pushMotivational}
                                                onCheckedChange={(checked) => settings.updateNotifications({ pushMotivational: checked })}
                                                label="Mensagens Motivacionais"
                                                description="Frases motivacionais diárias"
                                                icon={<Sparkles className="h-4 w-4" />}
                                            />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-border/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    Notificações por Email
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <SettingsToggle
                                    checked={settings.notifications.email}
                                    onCheckedChange={(checked) => settings.updateNotifications({ email: checked })}
                                    label="Notificações por Email"
                                    description="Receber emails do aplicativo"
                                    icon={<Mail className="h-4 w-4" />}
                                />
                                {settings.notifications.email && (
                                    <div className="pl-4 border-l-2 border-border space-y-3">
                                        <SettingsToggle
                                            checked={settings.notifications.emailWeekly}
                                            onCheckedChange={(checked) => settings.updateNotifications({ emailWeekly: checked })}
                                            label="Resumo Semanal"
                                            description="Resumo do seu progresso semanal"
                                            icon={<Mail className="h-4 w-4" />}
                                        />
                                        <SettingsToggle
                                            checked={settings.notifications.emailTips}
                                            onCheckedChange={(checked) => settings.updateNotifications({ emailTips: checked })}
                                            label="Dicas de Estudo"
                                            description="Dicas e truques para estudar melhor"
                                            icon={<Lightbulb className="h-4 w-4" />}
                                        />
                                        <SettingsToggle
                                            checked={settings.notifications.emailPromotions}
                                            onCheckedChange={(checked) => settings.updateNotifications({ emailPromotions: checked })}
                                            label="Promoções"
                                            description="Ofertas e promoções especiais"
                                            icon={<Gift className="h-4 w-4" />}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-border/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Notificações SMS
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <SettingsToggle
                                    checked={settings.notifications.sms}
                                    onCheckedChange={(checked) => settings.updateNotifications({ sms: checked })}
                                    label="Notificações SMS"
                                    description="Receber mensagens de texto"
                                    icon={<Phone className="h-4 w-4" />}
                                />
                                {settings.notifications.sms && (
                                    <div className="pl-4 border-l-2 border-border space-y-3">
                                        <SettingsToggle
                                            checked={settings.notifications.smsStudyReminders}
                                            onCheckedChange={(checked) => settings.updateNotifications({ smsStudyReminders: checked })}
                                            label="Lembretes de Estudo"
                                            description="Lembretes via SMS"
                                            icon={<Clock className="h-4 w-4" />}
                                        />
                                        <SettingsToggle
                                            checked={settings.notifications.smsUrgent}
                                            onCheckedChange={(checked) => settings.updateNotifications({ smsUrgent: checked })}
                                            label="Urgentes"
                                            description="Apenas notificações urgentes"
                                            icon={<AlertTriangle className="h-4 w-4" />}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Language Section */}
                {activeSection === 'language' && (
                    <Card className="glass-card border-border/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Idioma e Região
                            </CardTitle>
                            <CardDescription>
                                Configure o idioma e preferências regionais
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Idioma</label>
                                <Select
                                    value={settings.language}
                                    onValueChange={(value: 'pt-BR' | 'en-US' | 'es') => settings.setLanguage(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                                        <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Região</label>
                                <Select
                                    value={settings.region}
                                    onValueChange={settings.setRegion}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BR">Brasil</SelectItem>
                                        <SelectItem value="US">Estados Unidos</SelectItem>
                                        <SelectItem value="PT">Portugal</SelectItem>
                                        <SelectItem value="ES">Espanha</SelectItem>
                                        <SelectItem value="AR">Argentina</SelectItem>
                                        <SelectItem value="MX">México</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Devices Section */}
                {activeSection === 'devices' && (
                    <Card className="glass-card border-border/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-primary" />
                                Dispositivos Conectados
                            </CardTitle>
                            <CardDescription>
                                Gerencie os dispositivos que têm acesso à sua conta
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {settings.connectedDevices.map((device) => (
                                <div
                                    key={device.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-lg border",
                                        device.current ? 'border-primary/30 bg-primary/5' : 'border-border'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {device.type === 'desktop' && <Laptop className="h-5 w-5 text-muted-foreground" />}
                                        {device.type === 'tablet' && <Tablet className="h-5 w-5 text-muted-foreground" />}
                                        {device.type === 'mobile' && <SmartphoneIcon className="h-5 w-5 text-muted-foreground" />}
                                        <div>
                                            <span className="text-sm font-medium">{device.name}</span>
                                            <span className="text-xs text-muted-foreground block">
                                                Última vez: {new Date(device.lastActive).toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>
                                    {device.current && (
                                        <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                                            Atual
                                        </span>
                                    )}
                                    {!device.current && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => settings.removeDevice(device.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Subscription Section */}
                {activeSection === 'subscription' && (
                    <Card className="glass-card border-border/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCardIcon className="h-5 w-5 text-primary" />
                                Assinatura
                            </CardTitle>
                            <CardDescription>
                                Gerencie seu plano de assinatura
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Plan */}
                            <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {settings.subscription.status === 'free' && <Star className="h-5 w-5 text-muted-foreground" />}
                                        {settings.subscription.status === 'premium' && <Crown className="h-5 w-5 text-yellow-500" />}
                                        {settings.subscription.status === 'pro' && <Crown className="h-5 w-5 text-purple-500" />}
                                        <span className="font-semibold">{settings.subscription.name}</span>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-1 text-xs font-medium rounded-full",
                                        settings.subscription.status === 'free' && "bg-muted text-muted-foreground",
                                        settings.subscription.status === 'premium' && "bg-yellow-500/20 text-yellow-500",
                                        settings.subscription.status === 'pro' && "bg-purple-500/20 text-purple-500"
                                    )}>
                                        {settings.subscription.status === 'free' ? 'Gratuito' : settings.subscription.status === 'premium' ? 'Premium' : 'Pro'}
                                    </span>
                                </div>
                                <ul className="space-y-1">
                                    {settings.subscription.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Upgrade Button */}
                            {settings.subscription.status === 'free' && (
                                <Button className="w-full">
                                    <Crown className="h-4 w-4 mr-2" />
                                    Upgrade para Premium
                                </Button>
                            )}

                            {/* Payment History */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Histórico de Pagamentos</h4>
                                <div className="text-center py-8 text-muted-foreground">
                                    <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Nenhum pagamento realizado</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Data Section */}
                {activeSection === 'data' && (
                    <div className="space-y-4">
                        <Card className="glass-card border-border/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5 text-primary" />
                                    Armazenamento e Cache
                                </CardTitle>
                                <CardDescription>
                                    Gerencie o armazenamento do aplicativo
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Storage Usage */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Uso de armazenamento</span>
                                        <span className="text-muted-foreground">{settings.data.cacheSize} MB</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min((settings.data.cacheSize / 500) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <SettingsToggle
                                    checked={settings.data.autoBackup}
                                    onCheckedChange={(checked) => settings.updateData({ autoBackup: checked })}
                                    label="Backup Automático"
                                    description="Fazer backup automaticamente"
                                    icon={<Save className="h-4 w-4" />}
                                />

                                {settings.data.autoBackup && (
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium">Frequência de Backup</label>
                                        <Select
                                            value={settings.data.backupFrequency}
                                            onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'manual') =>
                                                settings.updateData({ backupFrequency: value })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">Diário</SelectItem>
                                                <SelectItem value="weekly">Semanal</SelectItem>
                                                <SelectItem value="monthly">Mensal</SelectItem>
                                                <SelectItem value="manual">Manual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Last Backup */}
                                {settings.data.lastBackup && (
                                    <div className="text-sm text-muted-foreground">
                                        Último backup: {new Date(settings.data.lastBackup).toLocaleString('pt-BR')}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleBackup}
                                        disabled={isBackingUp}
                                    >
                                        {isBackingUp ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4 mr-2" />
                                        )}
                                        Fazer Backup
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleExportData}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Exportar
                                    </Button>
                                </div>

                                {isBackingUp && (
                                    <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Processando e criptografando backup...</span>
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    className="w-full text-destructive hover:text-destructive"
                                    onClick={handleClearCache}
                                    disabled={isClearingCache}
                                >
                                    {isClearingCache ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Trash className="h-4 w-4 mr-2" />
                                    )}
                                    Limpar Cache
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Accessibility Section */}
                {activeSection === 'accessibility' && (
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Accessibility className="h-5 w-5 text-primary" />
                                Acessibilidade
                            </CardTitle>
                            <CardDescription>
                                Configure opções de acessibilidade
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SettingsToggle
                                checked={settings.accessibility.reduceMotion}
                                onCheckedChange={(checked) => settings.updateAccessibility({ reduceMotion: checked })}
                                label="Reduzir Animações"
                                description="Minimizar animações e transições"
                                icon={<Zap className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.accessibility.highContrast}
                                onCheckedChange={(checked) => settings.updateAccessibility({ highContrast: checked })}
                                label="Alto Contraste"
                                description="Aumentar contraste de cores"
                                icon={<Contrast className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.accessibility.screenReader}
                                onCheckedChange={(checked) => settings.updateAccessibility({ screenReader: checked })}
                                label="Modo Leitor de Tela"
                                description="Otimizar para leitores de tela"
                                icon={<Eye className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.accessibility.keyboardNavigation}
                                onCheckedChange={(checked) => settings.updateAccessibility({ keyboardNavigation: checked })}
                                label="Navegação por Teclado"
                                description="Habilitar atalhos de teclado"
                                icon={<Keyboard className="h-4 w-4" />}
                            />

                            <div className="space-y-3 pt-4">
                                <label className="text-sm font-medium">Escala da Fonte: {settings.accessibility.fontScale}%</label>
                                <input
                                    type="range"
                                    min="80"
                                    max="150"
                                    value={settings.accessibility.fontScale}
                                    onChange={(e) => settings.updateAccessibility({ fontScale: Number(e.target.value) })}
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Social Section */}
                {activeSection === 'social' && (
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="h-5 w-5 text-primary" />
                                Compartilhamento
                            </CardTitle>
                            <CardDescription>
                                Configure preferências de compartilhamento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SettingsToggle
                                checked={settings.privacy.shareProgress}
                                onCheckedChange={(checked) => settings.updatePrivacy({ shareProgress: checked })}
                                label="Compartilhar Progresso"
                                description="Permitir compartilhamento do seu progresso"
                                icon={<Share className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.privacy.showProfile}
                                onCheckedChange={(checked) => settings.updatePrivacy({ showProfile: checked })}
                                label="Perfil Visível"
                                description="Seu perfil pode ser encontrado por outros"
                                icon={<Users className="h-4 w-4" />}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Location Section */}
                {activeSection === 'location' && (
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Localização
                            </CardTitle>
                            <CardDescription>
                                Configure permissões de localização
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SettingsToggle
                                checked={settings.location.enabled}
                                onCheckedChange={(checked) => settings.updateLocation({ enabled: checked })}
                                label="Serviços de Localização"
                                description="Permitir acesso à localização"
                                icon={<MapPinned className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.location.shareWithOthers}
                                onCheckedChange={(checked) => settings.updateLocation({ shareWithOthers: checked })}
                                label="Compartilhar Localização"
                                description="Compartilhar sua localização com outros"
                                icon={<Share className="h-4 w-4" />}
                            />
                            <SettingsToggle
                                checked={settings.location.autoCheckIn}
                                onCheckedChange={(checked) => settings.updateLocation({ autoCheckIn: checked })}
                                label="Check-in Automático"
                                description="Registrar localização automaticamente"
                                icon={<MapPin className="h-4 w-4" />}
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Help Section */}
                {activeSection === 'help' && (
                    <div className="space-y-4">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5 text-primary" />
                                    Ajuda e Suporte
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Perguntas Frequentes (FAQ)
                                    <ChevronRight className="h-4 w-4 ml-auto" />
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Send className="h-4 w-4 mr-2" />
                                    Fale Conosco
                                    <ChevronRight className="h-4 w-4 ml-auto" />
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Enviar Feedback
                                    <ChevronRight className="h-4 w-4 ml-auto" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Rocket className="h-5 w-5 text-primary" />
                                    Onboarding
                                </CardTitle>
                                <CardDescription>
                                    Refaça o tutorial inicial do aplicativo
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full",
                                            onboardingCompleted ? "bg-green-500" : "bg-yellow-500"
                                        )} />
                                        <div>
                                            <span className="text-sm font-medium">Status do Onboarding</span>
                                            <span className="text-xs text-muted-foreground block">
                                                {onboardingCompleted ? "Completo" : "Pendente"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        resetOnboarding();
                                        showToast('Onboarding reiniciado! A página será recarregada.');
                                        setTimeout(() => window.location.reload(), 1500);
                                    }}
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Refazer Tutorial de Boas-vindas
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    Sobre o App
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Versão</span>
                                    <span>1.0.0</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Build</span>
                                    <span>2026.02.14</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Legal Section */}
                {activeSection === 'legal' && (
                    <div className="space-y-4">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Termos e Privacidade
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Termos de Uso
                                    <ExternalLink className="h-4 w-4 ml-auto" />
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Política de Privacidade
                                    <ExternalLink className="h-4 w-4 ml-auto" />
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Licenças de Código Aberto
                                    <ExternalLink className="h-4 w-4 ml-auto" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Logout Action */}
                {activeSection === 'logout' && (
                    <Card className="glass-card border-yellow-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-500">
                                <LogOut className="h-5 w-5" />
                                Sair da Conta
                            </CardTitle>
                            <CardDescription>
                                Você será desconectado do aplicativo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                                onClick={() => setShowLogoutDialog(true)}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair da Conta
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Delete Account Action */}
                {activeSection === 'delete' && (
                    <Card className="glass-card border-destructive/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Trash2 className="h-5 w-5" />
                                Excluir Conta
                            </CardTitle>
                            <CardDescription>
                                Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir Minha Conta
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Logout Dialog */}
            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sair da Conta</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja sair? Você precisará fazer login novamente para usar o aplicativo.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
                            Cancelar
                        </Button>
                        <Button variant="default" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Excluir Conta</DialogTitle>
                        <DialogDescription>
                            Esta ação é <strong>irreversível</strong>. Todos os seus dados, incluindo histórico de estudos, conquistas e configurações serão excluídos permanentemente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="text-sm font-medium">Esta ação não pode ser desfeita</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir Definivamente
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Toast Notification */}
            {toast && (
                <div className={cn(
                    "fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-5",
                    toast.type === 'success' && "bg-emerald-500 text-white",
                    toast.type === 'error' && "bg-destructive text-white"
                )}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' && <CheckCircle className="h-4 w-4" />}
                        {toast.type === 'error' && <AlertCircle className="h-4 w-4" />}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

