import { useEffect } from 'react';
import { useSettingsStore, useThemeStore } from '@/store';

/**
 * Hook to apply all settings across the application
 * This hook ensures settings are applied immediately when changed
 */
export function useApplySettings() {
    const settings = useSettingsStore();
    const { setTheme } = useThemeStore();

    // Apply theme from settings
    useEffect(() => {
        setTheme(settings.theme);
    }, [settings.theme, setTheme]);

    // Apply font size scaling
    useEffect(() => {
        const root = document.documentElement;
        const scale = settings.accessibility.fontScale / 100;
        root.style.fontSize = `${16 * scale}px`;
    }, [settings.accessibility.fontScale]);

    // Apply accessibility settings
    useEffect(() => {
        const root = document.documentElement;

        // Reduce motion
        if (settings.accessibility.reduceMotion) {
            root.style.setProperty('--animation-duration', '0ms');
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }

        // High contrast
        if (settings.accessibility.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
    }, [settings.accessibility.reduceMotion, settings.accessibility.highContrast]);

    // Apply compact mode
    useEffect(() => {
        const root = document.documentElement;
        if (settings.compactMode) {
            root.classList.add('compact-mode');
        } else {
            root.classList.remove('compact-mode');
        }
    }, [settings.compactMode]);

    return settings;
}

/**
 * Hook to get notification preferences
 */
export function useNotificationSettings() {
    const notifications = useSettingsStore((state) => state.notifications);
    return notifications;
}

/**
 * Hook to get privacy settings
 */
export function usePrivacySettings() {
    const privacy = useSettingsStore((state) => state.privacy);
    return privacy;
}

/**
 * Hook to get language settings
 */
export function useLanguageSettings() {
    const language = useSettingsStore((state) => state.language);
    const region = useSettingsStore((state) => state.region);
    return { language, region };
}
