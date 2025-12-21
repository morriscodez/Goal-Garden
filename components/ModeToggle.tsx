'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Clock, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export function ModeToggle({ goalId }: { goalId: string }) {
    const searchParams = useSearchParams();
    const currentMode = searchParams.get('mode') || 'RHYTHM'; // Default to Rhythm as per new mockup focus? Or match DB? 
    // Let's default to RHYTHM for this specific view based on user request "how I'd like the goal details page to look while in Rhythm mode"

    return (
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-zinc-200 shadow-sm">
            <Link
                href={`/goals/${goalId}?mode=DEADLINE`}
                className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                    currentMode === 'DEADLINE'
                        ? "bg-zinc-900 text-white shadow-md"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
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
                        : "text-zinc-500 hover:text-green-600 hover:bg-green-50"
                )}
            >
                <Activity className="h-4 w-4" />
                Rhythm
            </Link>
        </div>
    );
}
