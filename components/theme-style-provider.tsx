'use client';

import * as React from 'react';

type ThemeStyle = 'navy' | 'forest' | 'obsidian';

interface ThemeStyleContextType {
    themeStyle: ThemeStyle;
    setThemeStyle: (style: ThemeStyle) => void;
}

const ThemeStyleContext = React.createContext<ThemeStyleContextType | undefined>(undefined);

export function ThemeStyleProvider({ children }: { children: React.ReactNode }) {
    const [themeStyle, setThemeStyle] = React.useState<ThemeStyle>('navy');
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        // Load from local storage
        const saved = localStorage.getItem('theme-style') as ThemeStyle;
        if (saved && ['navy', 'forest', 'obsidian'].includes(saved)) {
            setThemeStyle(saved);
        }
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) return;

        // Persist to local storage
        localStorage.setItem('theme-style', themeStyle);

        // Update document attribute
        const root = document.documentElement;
        root.setAttribute('data-theme-style', themeStyle);

    }, [themeStyle, mounted]);

    // Prevent hydration mismatch by rendering children only after mount, 
    // or by accepting that server differs from client initially. 
    // However, to avoid flash, we ideally want to read this in a script in head, 
    // but for this MVP, useEffect is fine though it may flash.
    // For now we render children always but the effect applies the attribute.

    return (
        <ThemeStyleContext.Provider value={{ themeStyle, setThemeStyle }}>
            {children}
        </ThemeStyleContext.Provider>
    );
}

export function useThemeStyle() {
    const context = React.useContext(ThemeStyleContext);
    if (context === undefined) {
        throw new Error('useThemeStyle must be used within a ThemeStyleProvider');
    }
    return context;
}
