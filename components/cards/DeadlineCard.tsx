'use client';

import { ActionItem } from '@prisma/client';
import { updateActionItemDeadline } from '@/app/actions/milestones';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState, useTransition } from 'react';
import { clsx } from 'clsx';

export function DeadlineCard({ item }: { item: ActionItem }) {
    const [isPending, startTransition] = useTransition();
    // Initialize with existing deadline or today's date string for input if null (optional)
    const [date, setDate] = useState(
        item.deadline ? format(item.deadline, 'yyyy-MM-dd') : ''
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDateStr = e.target.value;
        setDate(newDateStr);

        startTransition(async () => {
            const newDate = newDateStr ? new Date(newDateStr) : null;
            await updateActionItemDeadline(item.id, newDate);
        });
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                {/* Icon based on completion or just generic */}
                <div className={clsx(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                    item.is_completed ? "bg-green-100 text-green-600" : "bg-blue-50 text-blue-600"
                )}>
                    <CalendarIcon className="h-6 w-6" />
                </div>

                <div>
                    <h4 className={clsx(
                        "font-bold text-zinc-900 text-base",
                        item.is_completed && "line-through text-zinc-400"
                    )}>
                        {item.title}
                    </h4>
                    {/* Simplified metadata, hiding frequency as requested */}
                    {!item.deadline && (
                        <p className="text-xs text-orange-500 font-medium mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            No deadline set
                        </p>
                    )}
                    {item.deadline && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Due {format(item.deadline, 'MMMM do, yyyy')}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Date Picker Input */}
                <div className="relative">
                    <input
                        type="date"
                        value={date}
                        onChange={handleChange}
                        className={clsx(
                            "pl-9 pr-3 py-2 rounded-xl border bg-zinc-50 text-sm font-medium outline-none focus:ring-2 transition-all cursor-pointer",
                            date ? "border-zinc-200 text-zinc-900" : "border-orange-200 text-orange-600 focus:border-orange-500 focus:ring-orange-200"
                        )}
                    />
                    <CalendarIcon className={clsx(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none",
                        date ? "text-zinc-400" : "text-orange-500"
                    )} />
                </div>
            </div>
        </div>
    );
}
