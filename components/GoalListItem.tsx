"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Focus } from "lucide-react";
import { clsx } from "clsx";
import { GoalMenu } from "./GoalMenu";
import { getGoalTheme } from "@/lib/goal-themes";

interface GoalListItemProps {
    id: string;
    title: string;
    motivation: string | null;
    progress: number;
    deadline: Date | null;
    mode: string;
    color?: string | null;
    isFocused?: boolean;
    onMenuOpenChange?: (isOpen: boolean) => void;
}

export function GoalListItem({ id, title, motivation, progress, deadline, mode, color, isFocused, onMenuOpenChange }: GoalListItemProps) {
    const theme = getGoalTheme(id, color);

    const formattedDate = deadline ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Deadline';

    return (
        <div className="group flex items-center gap-4 p-4 rounded-xl bg-card ring-1 ring-border hover:ring-ring hover:shadow-md transition-all">
            {/* Color indicator */}
            <div className={clsx("w-2 h-12 rounded-full shrink-0", theme.barFill)} />

            {/* Main content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-card-foreground truncate">
                        {title}
                    </h3>
                    {isFocused && (
                        <span title="Focused">
                            <Focus className="h-4 w-4 text-amber-500 shrink-0" />
                        </span>
                    )}
                </div>
                {motivation && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {motivation}
                    </p>
                )}
            </div>

            {/* Progress bar */}
            <div className="hidden sm:flex items-center gap-3 w-32 shrink-0">
                <div className={clsx("h-2 flex-1 rounded-full overflow-hidden", theme.barBg)}>
                    <div
                        className={clsx("h-full rounded-full transition-all duration-500", theme.barFill)}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className={clsx("text-xs font-bold w-8 text-right", theme.accent)}>
                    {progress}%
                </span>
            </div>

            {/* Deadline */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 w-28">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formattedDate}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <Link
                    href={`/goals/${id}`}
                    className={clsx(
                        "flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all",
                        theme.accent
                    )}
                >
                    <span className="hidden sm:inline">View</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
                <GoalMenu goalId={id} isFocused={isFocused} onOpenChange={onMenuOpenChange} />
            </div>
        </div>
    );
}
