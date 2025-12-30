"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { clsx } from "clsx";
import { GoalMenu } from "./GoalMenu";

interface GoalReviewCardProps {
    id: string;
    title: string;
    motivation: string | null;
    progress: number;
    deadline: Date | null;
    mode: string;
}

const THEMES = [
    {
        name: "blue",
        bgHeader: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600",
        bgBody: "bg-card",
        chip: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
        accent: "text-blue-600 dark:text-blue-400",
        barBg: "bg-blue-100 dark:bg-blue-900/30",
        barFill: "bg-blue-600 dark:bg-blue-500",
    },
    {
        name: "purple",
        bgHeader: "bg-gradient-to-br from-purple-500 via-fuchsia-600 to-purple-800",
        bgBody: "bg-card",
        chip: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
        accent: "text-purple-600 dark:text-purple-400",
        barBg: "bg-purple-100 dark:bg-purple-900/30",
        barFill: "bg-purple-600 dark:bg-purple-500",
    },
    {
        name: "emerald", // Greenish
        bgHeader: "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700",
        bgBody: "bg-card",
        chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
        accent: "text-emerald-600 dark:text-emerald-400",
        barBg: "bg-emerald-100 dark:bg-emerald-900/30",
        barFill: "bg-emerald-600 dark:bg-emerald-500",
    },
    {
        name: "orange",
        bgHeader: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-600",
        bgBody: "bg-card",
        chip: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
        accent: "text-orange-600 dark:text-orange-400",
        barBg: "bg-orange-100 dark:bg-orange-900/30",
        barFill: "bg-orange-600 dark:bg-orange-500",
    },
    {
        name: "burgundy",
        bgHeader: "bg-gradient-to-br from-rose-500 via-red-600 to-red-900",
        bgBody: "bg-card",
        chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
        accent: "text-[#800020] dark:text-rose-400",
        barBg: "bg-rose-100 dark:bg-rose-900/30",
        barFill: "bg-[#800020] dark:bg-rose-500",
    },
    {
        name: "ocean",
        bgHeader: "bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600",
        bgBody: "bg-card",
        chip: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
        accent: "text-cyan-600 dark:text-cyan-400",
        barBg: "bg-cyan-100 dark:bg-cyan-900/30",
        barFill: "bg-cyan-600 dark:bg-cyan-500",
    },
    {
        name: "berry",
        bgHeader: "bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600",
        bgBody: "bg-card",
        chip: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300",
        accent: "text-pink-600 dark:text-pink-400",
        barBg: "bg-pink-100 dark:bg-pink-900/30",
        barFill: "bg-pink-600 dark:bg-pink-500",
    },
    {
        name: "midnight",
        bgHeader: "bg-gradient-to-br from-slate-700 via-slate-800 to-zinc-900",
        bgBody: "bg-card",
        chip: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
        accent: "text-slate-700 dark:text-slate-400",
        barBg: "bg-slate-100 dark:bg-slate-800/30",
        barFill: "bg-slate-700 dark:bg-slate-500",
    },
    {
        name: "gold",
        bgHeader: "bg-gradient-to-br from-yellow-500 via-amber-500 to-amber-600",
        bgBody: "bg-card",
        chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        accent: "text-amber-600 dark:text-amber-400",
        barBg: "bg-amber-100 dark:bg-amber-900/30",
        barFill: "bg-amber-600 dark:bg-amber-500",
    },
];

export function GoalReviewCard({ id, title, motivation, progress, deadline, mode }: GoalReviewCardProps) {
    // Select theme deterministically based on ID hash
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const themeIndex = hash % THEMES.length;

    const theme = THEMES[themeIndex];

    const formattedDate = deadline ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'No Deadline';

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl shadow-sm ring-1 ring-border transition-all hover:shadow-xl hover:ring-ring bg-card">
            {/* Gradient Header - Pure Visual */}
            <div className={clsx("h-32 w-full relative", theme.bgHeader)}>
                <div className="absolute top-3 right-3">
                    <GoalMenu goalId={id} />
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
