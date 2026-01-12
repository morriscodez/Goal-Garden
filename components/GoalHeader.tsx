'use client';

import { Flag } from 'lucide-react';
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
        isComplete?: boolean;
    };
}

export function GoalHeader({ goal }: GoalHeaderProps) {
    const [isMotivationExpanded, setIsMotivationExpanded] = useState(false);
    const hasLongMotivation = (goal.motivation?.length || 0) > 100;
    const theme = getGoalTheme(goal.id, goal.color);

    return (
        <div className="flex flex-col gap-4 bg-green-50/30 border-green-100 dark:bg-green-900/10 dark:border-green-900/30 rounded-2xl p-6 border shadow-sm">
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
                    <GoalMenu goalId={goal.id} isComplete={goal.isComplete} />
                </div>
            </div>

            {goal.motivation && (
                <div className="relative group">
                    <div
                        className={`text-muted-foreground text-sm leading-relaxed max-w-3xl cursor-pointer hover:text-foreground transition-colors ${!isMotivationExpanded && hasLongMotivation ? 'line-clamp-2' : ''
                            }`}
                        onClick={() => hasLongMotivation && setIsMotivationExpanded(!isMotivationExpanded)}
                    >
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
