'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Clock, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export function ModeToggle({ goalId }: { goalId: string }) {
    const searchParams = useSearchParams();
    const currentMode = searchParams.get('mode') || 'DEADLINE'; // Default to Deadline mode

    return (
        <div className="flex items-center gap-1 bg-card p-1 rounded-full border border-border shadow-sm">
            <Link
                href={`/goals/${goalId}?mode=DEADLINE`}
                className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                    currentMode === 'DEADLINE'
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                )}
            >
                <Clock className="h-4 w-4" />
                Deadline
            </Link>
            <Link
                href={`/goals/${goalId}?mode=RHYTHM`}
                className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                    currentMode === 'RHYTHM'
                        ? "bg-green-500 text-white shadow-md"
                        : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                )}
            >
                <Activity className="h-4 w-4" />
                Rhythm
            </Link>
        </div>
    );
}
