'use client';

import { Goal, ActionItem } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
import { format, differenceInDays, addMonths, startOfMonth, endOfMonth, eachMonthOfInterval, min, max, addDays, getDaysInMonth } from "date-fns";
import { clsx } from "clsx";
import { GanttSidebar } from "./GanttSidebar";
import Image from "next/image"; // For avatar integration if needed, but we'll use pure CSS/icons
import { Flag, Droplet } from "lucide-react";

interface GlobalGanttChartProps {
    goals: (Goal & { actionItems: ActionItem[] })[];
    userImage?: string | null;
}

// CONSTANTS
const PX_PER_DAY = 40; // Width of one day in pixels
const HEADER_HEIGHT = 60;
const ROW_HEIGHT = 80;

// THEMES (Available for fallback or new goals)
const THEMES = [
    { name: "blue", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
    { name: "purple", bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-600" },
    { name: "emerald", bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    { name: "orange", bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
    { name: "burgundy", bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
];

function getGoalTheme(id: string, colorPref?: string | null) {
    if (colorPref) {
        // Map common color names to our theme structure if possible
        // Or construct a custom theme object based on the color string
        // For simplicity, we'll try to match standard palette names, or fallback to hash
        const match = THEMES.find(t => t.name.toLowerCase() === colorPref.toLowerCase());
        if (match) return match;

        // Implement custom color handling here if the colorPref is a hex code or other format
        // For now, if it's a known Tailwind color name like 'blue-500', we might need a mapping
        // Assuming colorPref is a simple name like "blue", "red", etc. from the Goal color picker
    }

    // Fallback to hash
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return THEMES[hash % THEMES.length];
}

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
            const todayPos = daysSinceStart * PX_PER_DAY;

            // Calculate center position: Target - (Visible Width / 2)
            const scrollPos = todayPos - (containerRef.current.clientWidth / 2);

            // Ensure we don't scroll past bounds (though simplified here)
            containerRef.current.scrollLeft = Math.max(0, scrollPos);
        }
    }, [timelineStart]);

    return (
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden flex h-[600px] animate-in fade-in zoom-in-95 duration-500">
            {/* Main Timeline Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">

                {/* Header (Months & Days) */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-x-auto overflow-y-auto relative custom-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="min-h-full relative min-w-full" style={{ width: `${totalDays * PX_PER_DAY}px` }}>

                        {/* Month Headers */}
                        <div className="sticky top-0 z-50 flex bg-card border-b border-border h-[60px]">
                            {months.map(month => {
                                const daysInMonth = getDaysInMonth(month);
                                const monthWidth = daysInMonth * PX_PER_DAY;

                                return (
                                    <div
                                        key={month.toISOString()}
                                        className="flex-shrink-0 border-r border-border/50 relative"
                                        style={{ width: `${monthWidth}px` }}
                                    >
                                        {/* Month Label */}
                                        <div className="sticky left-0 px-2 py-1 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-card/95 backdrop-blur z-10 w-full truncate">
                                            {format(month, 'MMMM yyyy')}
                                        </div>

                                        {/* Day Grid/Labels */}
                                        <div className="flex h-full items-end pb-2">
                                            {Array.from({ length: daysInMonth }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 border-r border-border/30 h-1/2 flex items-end justify-center text-[10px] text-muted-foreground/50"
                                                >
                                                    {i + 1}
                                                </div>
                                            ))}
                                        </div>
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
                            <div className="absolute top-2 left-1 text-[10px] font-bold text-red-500 bg-card/80 px-1 rounded">Today</div>
                        </div>

                        {/* Goal Rows */}
                        <div className="pt-4 pb-10 space-y-4">
                            {goals.map((goal) => {
                                const startDate = goal.createdAt ? new Date(goal.createdAt) : new Date();
                                const endDate = goal.deadline ? new Date(goal.deadline) : addMonths(startDate, 1);

                                const startOffset = differenceInDays(startDate, timelineStart) * PX_PER_DAY;
                                const duration = Math.max(differenceInDays(endDate, startDate), 7); // Min width 7 days
                                const width = duration * PX_PER_DAY;

                                const theme = getGoalTheme(goal.id, goal.color);

                                // Milestones
                                const milestones = goal.actionItems?.filter(item => item.deadline) || [];

                                return (
                                    <div key={goal.id} className="relative h-[80px] w-full hover:bg-muted/30 transition-colors group">

                                        {/* Milestone Indicators (Floating Above) */}
                                        {milestones.map(milestone => {
                                            if (!milestone.deadline) return null;
                                            const mDate = new Date(milestone.deadline);
                                            const mOffset = differenceInDays(mDate, timelineStart) * PX_PER_DAY;

                                            // Render as floating markers above the bar
                                            return (
                                                <div
                                                    key={milestone.id}
                                                    className="absolute top-4 -translate-y-1/2 z-30 group/milestone cursor-pointer"
                                                    style={{ left: `${mOffset}px` }}
                                                    title={`${milestone.title} - ${format(mDate, 'MMM d')}`}
                                                >
                                                    <div className={clsx(
                                                        "transition-transform hover:scale-125",
                                                        milestone.is_completed ? "text-green-500" : (theme.text)
                                                    )}>
                                                        <Droplet className="w-5 h-5" />
                                                    </div>

                                                    {/* Tooltip on hover */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-lg shadow-xl border border-border opacity-0 group-hover/milestone:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-40">
                                                        {milestone.title}
                                                        <span className="opacity-50 mx-1">•</span>
                                                        <span className="opacity-70">{format(mDate, 'MMM d')}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Goal Bar Container (Bottom) */}
                                        <div
                                            className={clsx(
                                                "absolute bottom-4 h-8 rounded-full shadow-sm border flex items-center px-4 overflow-visible whitespace-nowrap cursor-pointer transition-all hover:shadow-md hover:scale-[1.005]",
                                                theme.bg,
                                                theme.text,
                                                theme.border || "border-white/20"
                                            )}
                                            style={{
                                                left: `${startOffset}px`,
                                                width: `${width}px`
                                            }}
                                            onClick={() => window.location.href = `/goals/${goal.id}`}
                                        >
                                            <span className="font-semibold text-sm truncate mr-2 sticky left-0">{goal.title}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar (Right) */}
            <GanttSidebar goals={goals} />
        </div>
    );
}
