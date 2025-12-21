'use client';

import { ActionItem } from '@prisma/client';
import { Music } from 'lucide-react';
import { toggleActionItem } from '@/app/actions/interact';
import { clsx } from 'clsx';
import { useTransition } from 'react';

export function DailyCard({ item }: { item: ActionItem }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            await toggleActionItem(item.id, item.goalId);
        });
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Music className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">Streak: {item.current_streak} days</p>
                </div>
            </div>
            {/* Toggle Switch */}
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={clsx(
                    "w-12 h-6 rounded-full p-1 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
                    item.is_completed ? "bg-green-500" : "bg-zinc-200",
                    isPending && "opacity-70 cursor-not-allowed"
                )}
            >
                <div className={clsx(
                    "h-4 w-4 bg-white rounded-full shadow-sm transform transition-transform",
                    item.is_completed ? "translate-x-6" : "translate-x-0"
                )} />
            </button>
        </div>
    );
}
