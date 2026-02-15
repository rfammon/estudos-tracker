// Settings Types - Command Center Elite

export type Language = 'pt-BR' | 'en-US' | 'es';
export type ThemeType = 'cyber-luxe' | 'pistachio';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserProfile {
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    createdAt?: string;
}

export interface NotificationSettings {
    push: boolean;
    pushStudyReminders: boolean;
    pushAchievements: boolean;
    pushGamification: boolean;
    pushMotivational: boolean;
    email: boolean;
    emailWeekly: boolean;
    emailPromotions: boolean;
    emailTips: boolean;
    sms: boolean;
    smsStudyReminders: boolean;
    smsUrgent: boolean;
}

export interface PrivacySettings {
    shareProgress: boolean;
    showProfile: boolean;
    analytics: boolean;
    dataCollection: boolean;
    activityStatus: boolean;
    locationTracking: boolean;
}

export interface AccessibilitySettings {
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    fontScale: number;
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    keyboardNavigation: boolean;
}

export interface DataSettings {
    cacheSize: number;
    autoBackup: boolean;
    lastBackup?: string;
    backupFrequency: 'daily' | 'weekly' | 'monthly' | 'manual';
    dataRetentionDays: number;
}

export interface AdvancedSettings {
    debugMode: boolean;
    developerOptions: boolean;
    experimentalFeatures: boolean;
    telemetryEnabled: boolean;
}

export interface LocationSettings {
    enabled: boolean;
    shareWithOthers: boolean;
    autoCheckIn: boolean;
}

export interface ConnectedDevice {
    id: string;
    name: string;
    type: 'mobile' | 'desktop' | 'tablet';
    lastActive: string;
    current: boolean;
}

export interface SubscriptionPlan {
    name: string;
    status: 'free' | 'premium' | 'pro';
    expiresAt?: string;
    features: string[];
}

export interface BackupData {
    date: string;
    size: string;
    items: number;
}

export interface SettingsState {
    // Perfil
    userProfile: UserProfile;
    setUserProfile: (profile: Partial<UserProfile>) => void;

    // Tema e Interface
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    compactMode: boolean;
    setCompactMode: (enabled: boolean) => void;

    // Idioma
    language: Language;
    setLanguage: (language: Language) => void;
    region: string;
    setRegion: (region: string) => void;

    // Notificações
    notifications: NotificationSettings;
    updateNotifications: (settings: Partial<NotificationSettings>) => void;

    // Privacidade
    privacy: PrivacySettings;
    updatePrivacy: (settings: Partial<PrivacySettings>) => void;

    // Localização
    location: LocationSettings;
    updateLocation: (settings: Partial<LocationSettings>) => void;

    // Dados
    data: DataSettings;
    updateData: (settings: Partial<DataSettings>) => void;

    // Acessibilidade
    accessibility: AccessibilitySettings;
    updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;

    // Avançado
    advanced: AdvancedSettings;
    updateAdvanced: (settings: Partial<AdvancedSettings>) => void;

    // Dispositivos conectados
    connectedDevices: ConnectedDevice[];
    addDevice: (device: ConnectedDevice) => void;
    removeDevice: (id: string) => void;

    // Assinatura
    subscription: SubscriptionPlan;
    updateSubscription: (settings: Partial<SubscriptionPlan>) => void;

    // Backup
    performBackup: () => Promise<void>;
    restoreBackup: (date: string) => Promise<void>;
    clearCache: () => Promise<void>;
    exportData: () => Promise<string>;

    // Conta
    logout: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

export interface SettingsCategory {
    id: string;
    title: string;
    description?: string;
    icon: string;
    items: SettingsItem[];
}

export interface SettingsItem {
    id: string;
    type: 'toggle' | 'select' | 'input' | 'slider' | 'button' | 'link' | 'danger';
    label: string;
    description?: string;
    value?: any;
    onChange?: (value: any) => void;
    options?: { label: string; value: string }[];
    danger?: boolean;
    disabled?: boolean;
    loading?: boolean;
}
