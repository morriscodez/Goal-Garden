'use client';

import { Goal, ActionItem } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
import { format, differenceInDays, addMonths, startOfMonth, endOfMonth, eachMonthOfInterval, min, max, addDays, getDaysInMonth } from "date-fns";
import { clsx } from "clsx";
import { GanttSidebar } from "./GanttSidebar";
import Image from "next/image"; // For avatar integration if needed, but we'll use pure CSS/icons

interface GlobalGanttChartProps {
    goals: (Goal & { actionItems: ActionItem[] })[];
    userImage?: string | null;
}

// CONSTANTS
const PX_PER_DAY = 4; // Width of one day in pixels
const HEADER_HEIGHT = 60;
const ROW_HEIGHT = 80;

export function GlobalGanttChart({ goals }: GlobalGanttChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // 1. Determine Date Range
    // Start: Earliest Goal createdAt (or default to 1 month ago if missing/corrupt) or Today - 1 month
    // End: Latest Goal Deadline or Today + 6 months
    const today = new Date();

    const startDates = goals.map(g => g.createdAt ? new Date(g.createdAt) : new Date());
    const endDates = goals.map(g => g.deadline ? new Date(g.deadline) : addMonths(new Date(), 3));

    // Add buffer
    const minDate = startDates.length ? min([addMonths(min(startDates), -1), addMonths(today, -1)]) : addMonths(today, -1);
    const maxDate = endDates.length ? max([addMonths(max(endDates), 1), addMonths(today, 6)]) : addMonths(today, 6);

    // Normalize to start of month
    const timelineStart = startOfMonth(minDate);
    const timelineEnd = endOfMonth(maxDate);
    const totalDays = differenceInDays(timelineEnd, timelineStart);
    const months = eachMonthOfInterval({ start: timelineStart, end: timelineEnd });

    // 2. Scroll to "Today" on mount
    useEffect(() => {
        if (containerRef.current) {
            const daysSinceStart = differenceInDays(today, timelineStart);
            const scrollPos = (daysSinceStart * PX_PER_DAY) - (containerRef.current.clientWidth / 2);
            containerRef.current.scrollLeft = Math.max(0, scrollPos);
        }
    }, [timelineStart]);

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden flex h-[600px] animate-in fade-in zoom-in-95 duration-500">
            {/* Main Timeline Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">

                {/* Header (Months) */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-x-auto overflow-y-hidden relative custom-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="h-full relative min-w-full" style={{ width: `${totalDays * PX_PER_DAY}px` }}>

                        {/* Month Headers */}
                        <div className="sticky top-0 z-20 flex bg-white border-b border-zinc-100 h-[60px]">
                            {months.map(month => {
                                const days = getDaysInMonth(month);
                                return (
                                    <div
                                        key={month.toISOString()}
                                        className="flex-shrink-0 border-r border-zinc-50 px-2 py-3 text-xs font-bold text-zinc-400 uppercase tracking-widest sticky top-0 bg-white/95 backdrop-blur"
                                        style={{ width: `${days * PX_PER_DAY}px` }}
                                    >
                                        {format(month, 'MMMM yyyy')}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Current Day Indicator Line */}
                        <div
                            className="absolute top-0 bottom-0 border-l-2 border-red-400/50 z-10 pointer-events-none"
                            style={{
                                left: `${differenceInDays(today, timelineStart) * PX_PER_DAY}px`
                            }}
                        >
                            <div className="absolute -top-1 -left-[5px] w-2.5 h-2.5 bg-red-500 rounded-full" />
                            <div className="absolute top-2 left-1 text-[10px] font-bold text-red-500 bg-white/80 px-1 rounded">Today</div>
                        </div>

                        {/* Goal Rows */}
                        <div className="pt-4 pb-10 space-y-4">
                            {goals.map((goal) => {
                                const startDate = goal.createdAt ? new Date(goal.createdAt) : new Date();
                                const endDate = goal.deadline ? new Date(goal.deadline) : addMonths(startDate, 1);

                                const startOffset = differenceInDays(startDate, timelineStart) * PX_PER_DAY;
                                const duration = Math.max(differenceInDays(endDate, startDate), 7); // Min width 7 days
                                const width = duration * PX_PER_DAY;

                                const theme = getGoalTheme(goal.id);

                                return (
                                    <div key={goal.id} className="relative h-[60px] w-full hover:bg-zinc-50/50 transition-colors">
                                        <div
                                            className={clsx(
                                                "absolute top-1/2 -translate-y-1/2 h-8 rounded-full shadow-sm border border-white/20 flex items-center px-4 overflow-hidden whitespace-nowrap group cursor-pointer transition-all hover:shadow-md hover:scale-[1.01]",
                                                theme.bg,
                                                theme.text
                                            )}
                                            style={{
                                                left: `${startOffset}px`,
                                                width: `${width}px`
                                            }}
                                            onClick={() => window.location.href = `/goals/${goal.id}`}
                                        >
                                            <span className="font-semibold text-sm truncate mr-2">{goal.title}</span>

                                            {/* Progress Fill (Overlay) - Optional complexity, standardizing on simple bar for now */}
                                            {/* We could add a darker shade overlay for progress % */}

                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Grid Lines (Vertical Month Dividers extending down) - Optional polish */}
                    </div>
                </div>
            </div>

            {/* Sidebar (Right) */}
            <GanttSidebar goals={goals} />
        </div>
    );
}

// Theme Logic (Consistent with GoalReviewCard)
const THEMES = [
    { name: "blue", bg: "bg-blue-100", text: "text-blue-700" },
    { name: "purple", bg: "bg-purple-100", text: "text-purple-700" },
    { name: "emerald", bg: "bg-emerald-100", text: "text-emerald-700" },
    { name: "orange", bg: "bg-orange-100", text: "text-orange-700" },
    { name: "burgundy", bg: "bg-rose-100", text: "text-rose-700" },
];

function getGoalTheme(id: string) {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return THEMES[hash % THEMES.length];
}
