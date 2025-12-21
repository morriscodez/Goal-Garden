'use client';

import { ActionItem } from '@prisma/client';
import { Video, Check } from 'lucide-react';
import { useTransition } from 'react';
import { toggleActionItem } from '@/app/actions/interact';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export function MonthlyCard({ item }: { item: ActionItem }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            await toggleActionItem(item.id, item.goalId);
        });
    };

    return (
        <div
            onClick={handleToggle}
            className={clsx(
                "bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer select-none",
                isPending && "opacity-50",
                item.is_completed && "bg-zinc-50"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={clsx(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                    item.is_completed ? "bg-green-100 text-green-600" : "bg-teal-100 text-teal-600"
                )}>
                    {item.is_completed ? <Check className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </div>
                <div>
                    <h4 className={clsx("font-bold text-sm", item.is_completed ? "text-zinc-500 line-through" : "text-zinc-900")}>
                        {item.title}
                    </h4>
                    {item.last_completed_at && (
                        <p className="text-xs text-zinc-400 mt-1">
                            Completed {formatDistanceToNow(item.last_completed_at)} ago
                        </p>
                    )}
                </div>
            </div>

            {/* Checkbox */}
            <div className={clsx(
                "h-6 w-6 rounded-full flex items-center justify-center transition-all border-2",
                item.is_completed ? "bg-green-500 border-green-500 text-white" : "bg-transparent border-zinc-200 group-hover:border-teal-400"
            )}>
                {item.is_completed && <Check className="w-3.5 h-3.5" />}
            </div>
        </div>
    );
}
