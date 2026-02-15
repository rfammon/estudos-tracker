import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    SettingsState,
    UserProfile,
    NotificationSettings,
    PrivacySettings,
    AccessibilitySettings,
    DataSettings,
    AdvancedSettings,
    LocationSettings,
    ConnectedDevice,
    SubscriptionPlan,
    ThemeType,
    Language,
    FontSize
} from '@/types/settings';

const defaultUserProfile: UserProfile = {
    name: 'Usuário',
    email: 'usuario@email.com',
    bio: '',
};

const defaultNotifications: NotificationSettings = {
    push: true,
    pushStudyReminders: true,
    pushAchievements: true,
    pushGamification: true,
    pushMotivational: false,
    email: true,
    emailWeekly: true,
    emailPromotions: false,
    emailTips: true,
    sms: false,
    smsStudyReminders: false,
    smsUrgent: false,
};

const defaultPrivacy: PrivacySettings = {
    shareProgress: false,
    showProfile: true,
    analytics: true,
    dataCollection: true,
    activityStatus: true,
    locationTracking: false,
};

const defaultAccessibility: AccessibilitySettings = {
    reduceMotion: false,
    highContrast: false,
    screenReader: false,
    fontScale: 100,
    colorBlindMode: 'none',
    keyboardNavigation: true,
};

const defaultData: DataSettings = {
    cacheSize: 0,
    autoBackup: false,
    lastBackup: undefined,
    backupFrequency: 'weekly',
    dataRetentionDays: 365,
};

const defaultAdvanced: AdvancedSettings = {
    debugMode: false,
    developerOptions: false,
    experimentalFeatures: false,
    telemetryEnabled: true,
};

const defaultLocation: LocationSettings = {
    enabled: false,
    shareWithOthers: false,
    autoCheckIn: false,
};

const defaultConnectedDevices: ConnectedDevice[] = [
    {
        id: 'current-device',
        name: 'Dispositivo Atual',
        type: 'desktop',
        lastActive: new Date().toISOString(),
        current: true,
    },
];

const defaultSubscription: SubscriptionPlan = {
    name: 'Plano Gratuito',
    status: 'free',
    features: [
        'Acesso básico ao cronômetro',
        ' até 3 matérias',
        'Histórico de 30 dias',
    ],
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            // Perfil
            userProfile: defaultUserProfile,
            setUserProfile: (profile) =>
                set((state) => ({
                    userProfile: { ...state.userProfile, ...profile },
                })),

            // Tema e Interface
            theme: 'cyber-luxe' as ThemeType,
            setTheme: (theme) => set({ theme }),
            fontSize: 'medium' as FontSize,
            setFontSize: (fontSize) => set({ fontSize }),
            compactMode: false,
            setCompactMode: (compactMode) => set({ compactMode }),

            // Idioma
            language: 'pt-BR' as Language,
            setLanguage: (language) => set({ language }),
            region: 'BR',
            setRegion: (region) => set({ region }),

            // Notificações
            notifications: defaultNotifications,
            updateNotifications: (settings) =>
                set((state) => ({
                    notifications: { ...state.notifications, ...settings },
                })),

            // Privacidade
            privacy: defaultPrivacy,
            updatePrivacy: (settings) =>
                set((state) => ({
                    privacy: { ...state.privacy, ...settings },
                })),

            // Localização
            location: defaultLocation,
            updateLocation: (settings) =>
                set((state) => ({
                    location: { ...state.location, ...settings },
                })),

            // Dados
            data: defaultData,
            updateData: (settings) =>
                set((state) => ({
                    data: { ...state.data, ...settings },
                })),

            // Acessibilidade
            accessibility: defaultAccessibility,
            updateAccessibility: (settings) =>
                set((state) => ({
                    accessibility: { ...state.accessibility, ...settings },
                })),

            // Avançado
            advanced: defaultAdvanced,
            updateAdvanced: (settings) =>
                set((state) => ({
                    advanced: { ...state.advanced, ...settings },
                })),

            // Dispositivos conectados
            connectedDevices: defaultConnectedDevices,
            addDevice: (device) =>
                set((state) => ({
                    connectedDevices: [...state.connectedDevices, device],
                })),
            removeDevice: (id) =>
                set((state) => ({
                    connectedDevices: state.connectedDevices.filter((d) => d.id !== id),
                })),

            // Assinatura
            subscription: defaultSubscription,
            updateSubscription: (settings) =>
                set((state) => ({
                    subscription: { ...state.subscription, ...settings },
                })),

            // Ações de dados
            performBackup: async () => {
                // Simular backup
                await new Promise((resolve) => setTimeout(resolve, 1500));
                set((state) => ({
                    data: {
                        ...state.data,
                        lastBackup: new Date().toISOString(),
                    },
                }));
            },

            restoreBackup: async (date: string) => {
                // Simular restauração
                await new Promise((resolve) => setTimeout(resolve, 2000));
                console.log('Backup restaurado:', date);
            },

            clearCache: async () => {
                // Simular limpeza de cache
                await new Promise((resolve) => setTimeout(resolve, 800));
                set((state) => ({
                    data: {
                        ...state.data,
                        cacheSize: 0,
                    },
                }));
            },

            exportData: async () => {
                // Simular exportação
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const state = get();
                return JSON.stringify({
                    profile: state.userProfile,
                    settings: {
                        notifications: state.notifications,
                        privacy: state.privacy,
                        accessibility: state.accessibility,
                    },
                }, null, 2);
            },

            // Ações de conta
            logout: async () => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                // Reset user-specific profile but keep global settings (theme, etc)
                set({ userProfile: defaultUserProfile });
                window.location.href = '/login';
            },

            deleteAccount: async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Reset profile
                set({ userProfile: defaultUserProfile });
                window.location.href = '/';
            },
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({
                userProfile: state.userProfile,
                theme: state.theme,
                fontSize: state.fontSize,
                compactMode: state.compactMode,
                language: state.language,
                region: state.region,
                notifications: state.notifications,
                privacy: state.privacy,
                location: state.location,
                data: state.data,
                accessibility: state.accessibility,
                advanced: state.advanced,
                connectedDevices: state.connectedDevices,
                subscription: state.subscription,
            }),
        }
    )
);

// Expose store for testing
if (import.meta.env?.DEV || typeof window !== 'undefined') {
    (window as any).__SETTINGS_STORE__ = useSettingsStore;
}
