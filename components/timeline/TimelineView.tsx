'use client';

import { Goal, ActionItem } from "@prisma/client";
import { TimelineNode } from "./TimelineNode";
import { Flag } from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";

interface TimelineViewProps {
    goal: Goal & { actionItems: ActionItem[] };
}

export function TimelineView({ goal }: TimelineViewProps) {
    // Filter for ONE_OFF items (milestones) and One-Time tasks
    // Sort logic should ideally match "Deadline" mode (by Date or manual sort_order)
    // For timeline, Date order usually makes the most sense visually
    const milestones = goal.actionItems
        .filter((item: ActionItem) => item.deadline) // Show any item with a deadline
        .sort((a: ActionItem, b: ActionItem) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });

    return (
        <div className="relative py-10">
            {/* Start Node (Today/Start) - Optional, we'll start with first milestone */}

            {milestones.length === 0 && (
                <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-400 mb-2">No milestones planted yet.</p>
                </div>
            )}

            {/* Milestones Vine */}
            <div className="space-y-0">
                {milestones.map((item: ActionItem, index: number) => (
                    <TimelineNode
                        key={item.id}
                        item={item}
                        index={index}
                        isLast={false} // The true "Last" is the Goal Deadline
                    />
                ))}
            </div>

            {/* Final Goal Node */}
            {goal.deadline && (
                <div className="relative flex items-center justify-between md:justify-center w-full mt-4">
                    <div className="w-5/12 hidden md:block text-right pr-8">
                        {/* Optional text */}
                    </div>

                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex flex-col items-center">
                        {/* Connector from last milestone */}
                        <div className="absolute bottom-10 w-1 h-12 bg-green-200 dark:bg-green-900/40 rounded-full" />

                        <div className={clsx(
                            "relative z-10 h-14 w-14 rounded-full flex items-center justify-center shadow-lg border-4 transition-all animate-in zoom-in duration-700 delay-300",
                            (goal.consistency_score || 0) >= 100
                                ? "bg-amber-100 text-amber-600 border-amber-200 scale-110"
                                : "bg-zinc-900 text-white border-zinc-200 dark:border-zinc-700"
                        )}>
                            <Flag className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="w-full pl-16 md:w-5/12 md:pl-8">
                        <div className="p-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl shadow-xl inline-block animate-in slide-in-from-bottom-4 fade-in duration-700">
                            <h3 className="font-bold text-lg">{goal.title}</h3>
                            <p className="opacity-80 text-sm">{format(new Date(goal.deadline), 'MMMM do, yyyy')}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
