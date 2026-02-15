import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'cyber-luxe' | 'pistachio' | 'material-light' | 'material-dark';

interface ThemeState {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'cyber-luxe',
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => {
                const themes: ThemeType[] = ['cyber-luxe', 'pistachio', 'material-light', 'material-dark'];
                const currentIndex = themes.indexOf(state.theme);
                const nextIndex = (currentIndex + 1) % themes.length;
                return { theme: themes[nextIndex] };
            }),
        }),

        {
            name: 'theme-storage',
        }
    )
);

if (process.env.NODE_ENV === 'development') {
    (window as any).__THEME_STORE__ = useThemeStore;
}
