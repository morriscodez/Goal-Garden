'use client';

import { ActionItem } from "@prisma/client";
import { clsx } from "clsx";
import { format } from "date-fns";
import { Sprout, Flower2, Clock } from "lucide-react";
import { getFlowerColor } from "@/lib/constants";

interface TimelineNodeProps {
    item: ActionItem;
    index: number;
    isLast: boolean;
}

export function TimelineNode({ item, index, isLast }: TimelineNodeProps) {
    // Alternating layout: even on left, odd on right
    const isLeft = index % 2 === 0;
    const flowerColor = getFlowerColor(item.id);

    return (
        <div className={clsx("relative flex items-center justify-between md:justify-center w-full mb-8 group")}>

            {/* Left Content */}
            <div className="w-5/12 hidden md:block text-right pr-8">
                {isLeft && (
                    <div className="animate-in slide-in-from-right-4 duration-500 fade-in">
                        <h3 className={clsx("font-bold text-lg", item.is_completed ? "text-muted-foreground line-through decoration-green-500/40 dark:decoration-green-400/40" : "text-zinc-900 dark:text-zinc-100")}>
                            {item.title}
                        </h3>
                        {item.deadline && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                {format(new Date(item.deadline), 'MMM d, yyyy')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Center Line & Node */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex flex-col items-center h-full">
                {/* The Vine Line */}
                {!isLast && (
                    <div className="absolute top-10 w-1 h-full bg-green-200 dark:bg-green-900/40 rounded-full" />
                )}

                {/* The Node Icon */}
                <div className={clsx(
                    "relative z-10 h-10 w-10 rounded-full border-4 flex items-center justify-center transition-all duration-500",
                    item.is_completed
                        ? clsx(flowerColor, "border-green-200 dark:border-green-900 scale-110")
                        : "bg-background border-border text-muted-foreground"
                )}>
                    {item.is_completed ? (
                        <Flower2 className="h-5 w-5 animate-in zoom-in spin-in-12 duration-500" />
                    ) : (
                        <Sprout className="h-5 w-5" />
                    )}
                </div>
            </div>

            {/* Right Content */}
            <div className="hidden md:block w-5/12 pl-8">
                {!isLeft && (
                    <div className="animate-in slide-in-from-left-4 duration-500 fade-in">
                        <h3 className={clsx("font-bold text-lg", item.is_completed ? "text-muted-foreground line-through decoration-green-500/40 dark:decoration-green-400/40" : "text-zinc-900 dark:text-zinc-100")}>
                            {item.title}
                        </h3>
                        {item.deadline && (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                {format(new Date(item.deadline), 'MMM d, yyyy')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile View (Always Right of Line) */}
            <div className="w-full pl-16 md:hidden">
                <div>
                    <h3 className={clsx("font-bold text-base", item.is_completed ? "text-muted-foreground line-through decoration-green-500/40 dark:decoration-green-400/40" : "text-foreground")}>
                        {item.title}
                    </h3>
                    {item.deadline && (
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(item.deadline), 'MMM d, yyyy')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
