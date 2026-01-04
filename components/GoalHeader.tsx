'use client';

import { Flag, Grid2x2 } from 'lucide-react';
import { GoalMenu } from '@/components/GoalMenu';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getGoalTheme } from '@/lib/goal-themes';
import { clsx } from 'clsx';
import Link from 'next/link';

interface GoalHeaderProps {
    goal: {
        id: string;
        title: string;
        motivation?: string | null;
        color?: string | null;
    };
}

export function GoalHeader({ goal }: GoalHeaderProps) {
    const [isMotivationExpanded, setIsMotivationExpanded] = useState(false);
    const hasLongMotivation = (goal.motivation?.length || 0) > 100;
    const theme = getGoalTheme(goal.id, goal.color);

    return (
        <div className="flex flex-col gap-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            <Flag className="h-3 w-3" />
                            Long-term Goal
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl truncate">
                        {goal.title}
                    </h1>
                </div>

                <div className="pt-1 flex items-center gap-2">
                    <Link href={`/goals/${goal.id}/matrix`} title="Prioritize with Eisenhower Matrix">
                        <button className="transition-colors p-1.5 rounded-full text-zinc-500 hover:text-zinc-700 hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm">
                            <Grid2x2 className="h-5 w-5" />
                        </button>
                    </Link>
                    <GoalMenu goalId={goal.id} />
                </div>
            </div>

            {goal.motivation && (
                <div className="relative group">
                    <div
                        className={`text-muted-foreground text-sm leading-relaxed max-w-3xl cursor-pointer hover:text-foreground transition-colors ${!isMotivationExpanded && hasLongMotivation ? 'line-clamp-2' : ''
                            }`}
                        onClick={() => hasLongMotivation && setIsMotivationExpanded(!isMotivationExpanded)}
                    >
                        <span className="font-medium text-foreground mr-1">Why:</span>
                        {goal.motivation}

                        {hasLongMotivation && (
                            <button
                                className="inline-flex items-center gap-1 ml-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {isMotivationExpanded ? (
                                    <>Less <ChevronUp className="h-3 w-3" /></>
                                ) : (
                                    <>More <ChevronDown className="h-3 w-3" /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
