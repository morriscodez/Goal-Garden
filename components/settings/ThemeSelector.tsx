'use client';

import { useThemeStyle } from '@/components/theme-style-provider';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export function ThemeSelector() {
    const { themeStyle, setThemeStyle } = useThemeStyle();

    const themes = [
        {
            id: 'navy',
            name: 'Midnight Navy',
            description: 'Deep blue and indigo tones',
            color: 'bg-[#0f172a]', // Approximation of the navy theme
        },
        {
            id: 'forest',
            name: 'Deep Forest',
            description: 'Rich greens and nature tones',
            color: 'bg-[#14281f]', // Approximation of the forest theme
        },
        {
            id: 'obsidian',
            name: 'Obsidian',
            description: 'Neutral grays and slate',
            color: 'bg-[#18181b]', // Approximation of the obsidian theme
        },
    ] as const;

    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((theme) => {
                const isActive = themeStyle === theme.id;
                return (
                    <button
                        key={theme.id}
                        onClick={() => setThemeStyle(theme.id)}
                        className={clsx(
                            'group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all hover:bg-muted/50',
                            isActive
                                ? 'border-primary ring-1 ring-primary'
                                : 'border-input hover:border-accent-foreground/50'
                        )}
                    >
                        <div className="flex w-full items-center justify-between">
                            <div className={clsx('h-10 w-10 rounded-full border border-border shadow-sm', theme.color)} />
                            {isActive && (
                                <div className="rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <span className="font-semibold text-foreground">{theme.name}</span>
                            <p className="text-xs text-muted-foreground">{theme.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
