"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Focus } from "lucide-react";
import { clsx } from "clsx";
import { GoalMenu } from "./GoalMenu";

import { getGoalTheme } from "@/lib/goal-themes";

interface GoalReviewCardProps {
    id: string;
    title: string;
    motivation: string | null;
    progress: number;
    deadline: Date | null;
    mode: string;
    color?: string | null;
    isFocused?: boolean;
}

export function GoalReviewCard({ id, title, motivation, progress, deadline, mode, color, isFocused }: GoalReviewCardProps) {
    const theme = getGoalTheme(id, color);

    const formattedDate = deadline ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'No Deadline';

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-border transition-all hover:shadow-xl hover:ring-ring bg-card">
            {/* Gradient Header - Pure Visual */}
            <div className={clsx("h-32 w-full relative", theme.bgHeader)}>
                {/* Focus indicator */}
                {isFocused && (
                    <div className="absolute top-3 left-3 p-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full shadow-sm" title="Focused">
                        <Focus className="h-4 w-4 text-amber-500" />
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <GoalMenu goalId={id} isFocused={isFocused} />
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col p-5 space-y-4">

                {/* Title */}
                <h3 className="text-xl font-bold leading-tight text-card-foreground line-clamp-2">
                    {title}
                </h3>

                {/* Motivation (replaces 'save $50k...' text from mockup) */}
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {motivation || "No description provided."}
                </p>

                {/* Progress Section */}
                <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        <span>Progress</span>
                        <span className={theme.accent}>{progress}%</span>
                    </div>
                    <div className={clsx("h-2 w-full rounded-full overflow-hidden", theme.barBg)}>
                        <div
                            className={clsx("h-full rounded-full transition-all duration-500", theme.barFill)}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span>Target: {formattedDate}</span>
                    </div>

                    <Link
                        href={`/goals/${id}`}
                        className={clsx(
                            "flex items-center gap-1 text-sm font-bold hover:gap-2 transition-all",
                            theme.accent
                        )}
                    >
                        Details <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
