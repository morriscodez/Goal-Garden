'use client';

import { Goal, ActionItem } from "@prisma/client";
import { format, isThisWeek, isSameWeek, isAfter, addWeeks } from "date-fns";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, Calendar } from "lucide-react";

interface GanttSidebarProps {
    goals: (Goal & { actionItems: ActionItem[] })[];
}

export function GanttSidebar({ goals }: GanttSidebarProps) {
    // 1. Flatten all deadlines (Goal deadlines AND ActionItem deadlines)
    const allDeadlines = goals.flatMap(goal => {
        const items = [
            // Goal Deadline
            ...(goal.deadline ? [{
                id: goal.id,
                title: goal.title,
                date: new Date(goal.deadline),
                type: 'GOAL',
                goalId: goal.id,
                color: getGoalColor(goal.id) // We'll need to share this logic
            }] : []),
            // Milestone Deadlines
            ...goal.actionItems
                .filter(item => item.deadline && !item.is_completed)
                .map(item => ({
                    id: item.id,
                    title: item.title,
                    date: new Date(item.deadline!),
                    type: 'MILESTONE',
                    goalId: goal.id,
                    color: getGoalColor(goal.id)
                }))
        ];
        return items;
    });

    // 2. Sort by date
    allDeadlines.sort((a, b) => a.date.getTime() - b.date.getTime());

    // 3. Filter for upcoming (future only? or recent past?)
    const upcoming = allDeadlines.filter(item => item.date >= new Date(new Date().setHours(0, 0, 0, 0)));

    // 4. Grouping
    const groups = {
        thisWeek: upcoming.filter(item => isThisWeek(item.date)),
        nextWeek: upcoming.filter(item => isSameWeek(item.date, addWeeks(new Date(), 1))),
        later: upcoming.filter(item => isAfter(item.date, addWeeks(new Date(), 2))).slice(0, 5) // Limit later items
    };

    return (
        <div className="w-80 bg-white border-l border-zinc-200 h-full flex flex-col">
            <div className="p-4 border-b border-zinc-100">
                <h3 className="font-semibold text-zinc-900">Upcoming Deadlines</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {groups.thisWeek.length > 0 && (
                    <section>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">This Week</h4>
                        <div className="space-y-3">
                            {groups.thisWeek.map(item => <SidebarItem key={item.id} item={item} />)}
                        </div>
                    </section>
                )}

                {groups.nextWeek.length > 0 && (
                    <section>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Next Week</h4>
                        <div className="space-y-3">
                            {groups.nextWeek.map(item => <SidebarItem key={item.id} item={item} />)}
                        </div>
                    </section>
                )}

                {groups.later.length > 0 && (
                    <section>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Later</h4>
                        <div className="space-y-3">
                            {groups.later.map(item => <SidebarItem key={item.id} item={item} />)}
                        </div>
                    </section>
                )}

                {upcoming.length === 0 && (
                    <p className="text-sm text-zinc-400 text-center py-4">No upcoming deadlines.</p>
                )}
            </div>
        </div>
    );
}

function SidebarItem({ item }: { item: any }) {
    return (
        <Link
            href={`/goals/${item.goalId}`}
            className="block group"
        >
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors">
                <div className={clsx("mt-1 w-2 h-2 rounded-full", item.color.bg)} />
                <div>
                    <p className="text-sm font-medium text-zinc-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                        <Calendar className="w-3 h-3" />
                        <span>{format(item.date, 'MMM d')}</span>
                        {item.type === 'GOAL' && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] font-medium border border-zinc-200">
                                Launch
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Helper duplicating logic for now - ideally refactor to util
const THEMES = [
    { bg: "bg-blue-500" },
    { bg: "bg-purple-600" },
    { bg: "bg-emerald-500" },
    { bg: "bg-orange-500" },
    { bg: "bg-[#800020]" },
];

function getGoalColor(id: string) {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return THEMES[hash % THEMES.length];
}
