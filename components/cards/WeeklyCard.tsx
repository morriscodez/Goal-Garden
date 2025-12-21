'use client';

import { ActionItem } from '@prisma/client';
import { Headphones, Check } from 'lucide-react';
import { useTransition } from 'react';
import { toggleActionItem } from '@/app/actions/interact';
import { clsx } from 'clsx';

export function WeeklyCard({ item }: { item: ActionItem }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            // For now, treating weekly as a simple toggle for the 'current week's unit'
            // Real implementation would need to handle increments if target_value > 1
            await toggleActionItem(item.id, item.goalId);
        });
    };

    // Calculate progress (mock for now based on completion)
    // If completed, 100%. If not, 0%. 
    // Ideally we use item.current_streak or a dedicated 'value' field.
    const progress = item.is_completed ? 100 : 0;
    const targetDisplay = item.target_value ? `/${item.target_value}` : '';

    return (
        <div
            onClick={handleToggle}
            className={clsx(
                "bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer select-none",
                isPending && "opacity-50",
                item.is_completed && "bg-purple-50"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={clsx(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                    item.is_completed ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"
                )}>
                    {item.is_completed ? <Check className="h-5 w-5" /> : <Headphones className="h-5 w-5" />}
                </div>
                <div>
                    <h4 className={clsx("font-bold text-zinc-900 text-sm", item.is_completed && "text-zinc-500 line-through")}>
                        {item.title}
                    </h4>
                    <p className={clsx("text-xs font-medium mt-1 transition-colors", item.is_completed ? "text-green-600" : "text-purple-600")}>
                        {item.is_completed ? "Done for the week!" : "Log progress"}
                    </p>
                </div>
            </div>

            {/* Circular Progress (Visual only for toggle) */}
            <div className="relative h-10 w-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-zinc-100" />
                <div
                    className={clsx("absolute inset-0 rounded-full border-2 border-transition-all duration-500", item.is_completed ? "border-green-500" : "border-transparent")}
                    style={{ clipPath: item.is_completed ? 'none' : 'inset(0 0 0 0)' }}
                />
                {item.is_completed && <Check className="h-4 w-4 text-green-600 absolute" />}
                {!item.is_completed && (
                    <span className="text-[10px] font-bold text-zinc-400">0{targetDisplay}</span>
                )}
            </div>
        </div>
    );
}
