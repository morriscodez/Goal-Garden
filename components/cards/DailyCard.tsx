'use client';

import { ActionItem } from '@prisma/client';
import { Sprout, Flower2 } from 'lucide-react';
import { toggleActionItem } from '@/app/actions/interact';
import { updateActionItem } from '@/app/actions/milestones';
import { clsx } from 'clsx';
import { useTransition, useState, useRef, useEffect } from 'react';
import { isSameDay, isSameWeek, isSameMonth, isSameQuarter, isSameYear } from 'date-fns';
import { MilestoneMenu } from '@/components/MilestoneMenu';
import { getGoalTheme } from '@/lib/goal-themes';


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

export function DailyCard({ item, isMenuOpen, onMenuToggle, goalName, goalColor, showLogProgress }: { item: ActionItem; isMenuOpen?: boolean; onMenuToggle?: (open: boolean) => void; goalName?: string; goalColor?: string; showLogProgress?: boolean }) {
    const [isPending, startTransition] = useTransition();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(item.title);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    const handleToggle = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        startTransition(async () => {
            await toggleActionItem(item.id, item.goalId);
        });
    };

    const handleTitleSave = async () => {
        setIsEditingTitle(false);
        if (title.trim() === item.title) return; // No change

        startTransition(async () => {
            await updateActionItem(item.id, item.goalId, { title: title });
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            setTitle(item.title); // Revert
            setIsEditingTitle(false);
        }
    };

    // Derived State: Is it effectively completed FOR THE CURRENT PERIOD?
    const isCompletedCurrentPeriod = (() => {
        if (!item.is_completed || !item.last_completed_at) return false;
        const lastDate = new Date(item.last_completed_at);
        const now = new Date();

        switch (item.frequency) {
            case 'DAILY': return isSameDay(lastDate, now);
            case 'WEEKLY': return isSameWeek(lastDate, now, { weekStartsOn: 1 }); // Monday start
            case 'MONTHLY': return isSameMonth(lastDate, now);
            case 'QUARTERLY': return isSameQuarter(lastDate, now);
            case 'YEARLY': return isSameYear(lastDate, now);
            default: return isSameDay(lastDate, now);
        }
    })();

    // Calculate effective streak (reset to 0 if missed a period)
    const effectiveStreak = (() => {
        if (!item.last_completed_at || item.current_streak === 0) return 0;
        const last = new Date(item.last_completed_at);
        const now = new Date();
        // Reset time part for accurate date comparison where needed, though date-fns handles this well.

        switch (item.frequency) {
            case 'DAILY':
                // Valid if Today or Yesterday
                // If Today: Streak inclusive
                // If Yesterday: Streak valid (completed yesterday, pending today)
                if (isSameDay(last, now)) return item.current_streak;

                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                if (isSameDay(last, yesterday)) return item.current_streak;

                return 0; // Missed more than 1 day

            case 'WEEKLY':
                // Valid if This Week or Last Week
                if (isSameWeek(last, now, { weekStartsOn: 1 })) return item.current_streak;

                const lastWeek = new Date(now);
                lastWeek.setDate(lastWeek.getDate() - 7);
                if (isSameWeek(last, lastWeek, { weekStartsOn: 1 })) return item.current_streak;

                return 0;

            case 'MONTHLY':
                if (isSameMonth(last, now)) return item.current_streak;

                const lastMonth = new Date(now);
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                if (isSameMonth(last, lastMonth)) return item.current_streak;

                return 0;

            case 'QUARTERLY':
                if (isSameQuarter(last, now)) return item.current_streak;

                const lastQuarter = new Date(now);
                lastQuarter.setMonth(lastQuarter.getMonth() - 3);
                if (isSameQuarter(last, lastQuarter)) return item.current_streak;

                return 0;

            case 'YEARLY':
                if (isSameYear(last, now)) return item.current_streak;

                const lastYear = new Date(now);
                lastYear.setFullYear(lastYear.getFullYear() - 1);
                if (isSameYear(last, lastYear)) return item.current_streak;

                return 0;

            default:
                return item.current_streak;
        }
    })();

    // Determine status text
    const statusText = (() => {
        if (isCompletedCurrentPeriod) {
            switch (item.frequency) {
                case 'WEEKLY': return "Done for this week!";
                case 'MONTHLY': return "Done for this month!";
                case 'QUARTERLY': return "Done for this quarter!";
                case 'YEARLY': return "Done for this year!";
                case 'DAILY': return "Done for today!";
                default: return "Done for today!";
            }
        }
        if (showLogProgress) return "Log progress";

        const period = (() => {
            switch (item.frequency) {
                case 'DAILY': return 'day';
                case 'WEEKLY': return 'week';
                case 'MONTHLY': return 'month';
                case 'QUARTERLY': return 'quarter';
                case 'YEARLY': return 'year';
                default: return 'time';
            }
        })();

        // Pluralization
        const label = effectiveStreak === 1 ? period : `${period}s`;

        return `Streak: ${effectiveStreak} ${label}`;
    })();

    const flowerColor = getFlowerColor(item.id);
    const theme = getGoalTheme(item.goalId, goalColor);

    return (
        <div
            className={clsx(
                "bg-card p-4 rounded-2xl shadow-sm border border-border flex items-center justify-between group hover:shadow-md transition-all select-none relative",
                isPending && "opacity-50",
                isCompletedCurrentPeriod && "bg-green-50/30 border-green-100 dark:bg-green-900/10 dark:border-green-900/30"
            )}
        >
            <div className="flex items-center gap-4 flex-1">
                {/* Garden Themed Interactive Icon */}
                <button
                    onClick={handleToggle}
                    className={clsx(
                        "h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-500 ease-out group/icon relative overflow-hidden",
                        isCompletedCurrentPeriod
                            ? clsx(flowerColor, "scale-110 rotate-12")
                            : "bg-muted text-muted-foreground hover:bg-green-100 hover:text-green-600 hover:scale-105"
                    )}
                >
                    {isCompletedCurrentPeriod ? (
                        <Flower2 className="h-6 w-6 animate-in zoom-in spin-in-12 duration-300" />
                    ) : (
                        <Sprout className="h-6 w-6 transition-transform group-hover/icon:-translate-y-0.5" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    {goalName && (
                        <div className="mb-1">
                            <span className={clsx("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium transition-colors", theme.chip)}>
                                {goalName}
                            </span>
                        </div>
                    )}
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleSave}
                            onKeyDown={handleKeyDown}
                            className="font-bold text-card-foreground text-sm w-full bg-transparent border-b-2 border-blue-500 outline-none p-0 focus:ring-0"
                        />
                    ) : (
                        <h4
                            onDoubleClick={() => setIsEditingTitle(true)}
                            className={clsx(
                                "font-bold text-card-foreground text-sm transition-colors cursor-text leading-tight",
                                isCompletedCurrentPeriod && "text-muted-foreground line-through decoration-zinc-300 dark:decoration-zinc-700"
                            )}
                            title="Double-click to edit"
                        >
                            {title}
                        </h4>
                    )}
                    <p className={clsx("text-xs mt-1 transition-colors", isCompletedCurrentPeriod ? "text-green-600 dark:text-green-400 font-medium" : "text-muted-foreground")}>
                        {statusText}
                    </p>
                </div>

                {/* Milestone Menu */}
                <div className="flex-shrink-0 ml-1">
                    <MilestoneMenu
                        item={item}
                        goalId={item.goalId}
                        isOpen={!!isMenuOpen}
                        onToggle={(open) => onMenuToggle?.(open)}
                    />
                </div>
            </div>
        </div>
    );
}
