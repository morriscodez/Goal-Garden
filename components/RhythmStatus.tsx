'use client';

import { clsx } from 'clsx';
import { Sun, Sprout, Wind, CloudRain, Droplets, Leaf } from 'lucide-react';
import { differenceInHours, differenceInDays } from 'date-fns';

interface RhythmStatusProps {
    lastActivityDate: Date | null;
}

export function RhythmStatus({ lastActivityDate }: RhythmStatusProps) {
    let status: 'BLOOMING' | 'GROWING' | 'RESTING' | 'NEEDS_WATER' = 'NEEDS_WATER';

    if (lastActivityDate) {
        const now = new Date();
        const diffHours = differenceInHours(now, lastActivityDate);
        const diffDays = differenceInDays(now, lastActivityDate);

        if (diffHours < 24) {
            status = 'BLOOMING';
        } else if (diffDays < 3) {
            status = 'GROWING';
        } else if (diffDays < 7) {
            status = 'RESTING';
        } else {
            status = 'NEEDS_WATER';
        }
    }

    const config = {
        BLOOMING: {
            text: "Status: Blooming",
            icon: Sun,
            styles: "bg-amber-100 text-amber-500 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
        },
        GROWING: {
            text: "Status: Growing",
            icon: Sprout,
            styles: "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
        },
        RESTING: {
            text: "Status: Resting",
            icon: Leaf,
            styles: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
            // User asked for "Muted Sage (slate w/ green tint)" -> "bg-slate-100 text-slate-500". 
            // Let's try slate/green mix or just slate as requested.
            // Requirement: "Muted Sage text-slate-500 bg-slate-100 (with a green tint)"
            // I'll stick to slate/zinc for "Resting" to look calm, maybe emerald-50/slate-500?
            // Let's use Slate as primary.
        },
        NEEDS_WATER: {
            text: "Status: Needs Water",
            icon: Droplets,
            styles: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-800"
            // Requirement: "Warm Stone text-stone-400 bg-stone-50"
            // Tailwind 'stone' is avail. Let's use Stone/Amber for warmth.
        }
    };

    // Override colors to match specific user request more closely
    const userConfig = {
        ...config,
        RESTING: {
            ...config.RESTING,
            styles: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
        },
        NEEDS_WATER: {
            ...config.NEEDS_WATER,
            styles: "bg-stone-100 text-stone-500 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700"
        }
    };

    const current = userConfig[status];
    const Icon = current.icon;

    return (
        <div className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors shadow-sm",
            current.styles
        )}>
            <Icon className="h-4 w-4" />
            <span>{current.text}</span>
        </div>
    );
}
