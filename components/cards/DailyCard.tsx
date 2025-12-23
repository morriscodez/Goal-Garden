'use client';

import { ActionItem } from '@prisma/client';
import { Sprout, Flower2 } from 'lucide-react';
import { toggleActionItem } from '@/app/actions/interact';
import { clsx } from 'clsx';
import { useTransition } from 'react';
import { isSameDay } from 'date-fns';

const FLOWER_COLORS = [
    "bg-rose-100 text-rose-500",
    "bg-purple-100 text-purple-500",
    "bg-sky-100 text-sky-500",
    "bg-amber-100 text-amber-500",
    "bg-pink-100 text-pink-500",
    "bg-indigo-100 text-indigo-500",
];

function getFlowerColor(id: string) {
    const charCode = id.charCodeAt(id.length - 1);
    const index = charCode % FLOWER_COLORS.length;
    return FLOWER_COLORS[index];
}

export function DailyCard({ item }: { item: ActionItem }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        startTransition(async () => {
            await toggleActionItem(item.id, item.goalId);
        });
    };

    // Derived State: Is it effectively completed TODAY?
    const isCompletedToday = item.is_completed &&
        item.last_completed_at &&
        isSameDay(new Date(item.last_completed_at), new Date());

    const flowerColor = getFlowerColor(item.id);

    return (
        <div
            className={clsx(
                "bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-between group hover:shadow-md transition-all select-none",
                isPending && "opacity-50",
                isCompletedToday && "bg-green-50/30 border-green-100"
            )}
        >
            <div className="flex items-center gap-4">
                {/* Garden Themed Interactive Icon */}
                <button
                    onClick={handleToggle}
                    className={clsx(
                        "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-500 ease-out group/icon relative overflow-hidden",
                        isCompletedToday
                            ? clsx(flowerColor, "scale-110 rotate-12")
                            : "bg-zinc-100 text-zinc-400 hover:bg-green-100 hover:text-green-600 hover:scale-105"
                    )}
                >
                    {isCompletedToday ? (
                        <Flower2 className="h-6 w-6 animate-in zoom-in spin-in-12 duration-300" />
                    ) : (
                        <Sprout className="h-6 w-6 transition-transform group-hover/icon:-translate-y-0.5" />
                    )}
                </button>

                <div>
                    <h4 className={clsx("font-bold text-zinc-900 text-sm transition-colors", isCompletedToday && "text-zinc-500 line-through decoration-zinc-300")}>
                        {item.title}
                    </h4>
                    <p className={clsx("text-xs mt-1 transition-colors", isCompletedToday ? "text-green-600 font-medium" : "text-zinc-400")}>
                        {isCompletedToday ? "Done for today!" : `Streak: ${item.current_streak} days`}
                    </p>
                </div>
            </div>
        </div>
    );
}
