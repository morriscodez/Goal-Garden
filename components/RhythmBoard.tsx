'use client';

import { useState } from 'react';
import { ActionItem } from '@prisma/client';

import { Sun, Calendar, CalendarDays, Flag, Plus } from 'lucide-react';
import { DailyCard } from './cards/DailyCard';
import { WeeklyCard } from './cards/WeeklyCard';
import { MonthlyCard } from './cards/MonthlyCard';
import { AnnualCard } from './cards/AnnualCard';
import { CreateRhythmItemDialog } from './CreateRhythmItemDialog';

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';

export function MatchRhythmBoard({
    goalId,
    daily, weekly, monthly, annually
}: {
    goalId: string;
    daily: ActionItem[];
    weekly: ActionItem[];
    monthly: ActionItem[];
    annually: ActionItem[];
}) {
    const [activeFrequency, setActiveFrequency] = useState<Frequency | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* DAILY COLUMN */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Sun className="h-5 w-5 text-green-500" />
                            <h3 className="font-bold text-lg text-foreground">Daily</h3>
                        </div>
                        <button
                            onClick={() => setActiveFrequency('DAILY')}
                            className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {daily.map(item => (
                            <DailyCard
                                key={item.id}
                                item={item}
                                isMenuOpen={activeMenuId === item.id}
                                onMenuToggle={(open) => setActiveMenuId(open ? item.id : null)}
                            />
                        ))}
                        {/* Empty State / Prompt handled by button below or if truly empty */}

                        <button
                            onClick={() => setActiveFrequency('DAILY')}
                            className="w-full border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-sidebar-ring hover:bg-muted transition-all gap-2 group"
                        >
                            <Plus className="h-6 w-6 group-hover:text-foreground" />
                            <span className="text-xs font-semibold group-hover:text-foreground">Add Daily Habit</span>
                        </button>
                    </div>
                </div>

                {/* WEEKLY COLUMN */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-500" />
                            <h3 className="font-bold text-lg text-foreground">Weekly</h3>
                        </div>
                        <button
                            onClick={() => setActiveFrequency('WEEKLY')}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {weekly.map(item => (
                            <WeeklyCard
                                key={item.id}
                                item={item}
                                isMenuOpen={activeMenuId === item.id}
                                onMenuToggle={(open) => setActiveMenuId(open ? item.id : null)}
                            />
                        ))}

                        <button
                            onClick={() => setActiveFrequency('WEEKLY')}
                            className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all gap-2 group"
                        >
                            <Plus className="h-6 w-6 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                            <span className="text-xs font-semibold group-hover:text-foreground">Add Weekly Habit</span>
                        </button>
                    </div>
                </div>

                {/* MONTHLY COLUMN */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-green-500" />
                            <h3 className="font-bold text-lg text-foreground">Monthly</h3>
                        </div>
                        <button
                            onClick={() => setActiveFrequency('MONTHLY')}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {monthly.map(item => (
                            <MonthlyCard
                                key={item.id}
                                item={item}
                                isMenuOpen={activeMenuId === item.id}
                                onMenuToggle={(open) => setActiveMenuId(open ? item.id : null)}
                            />
                        ))}

                        {/* Add Button Mock */}
                        <button
                            onClick={() => setActiveFrequency('MONTHLY')}
                            className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all gap-2 group"
                        >
                            <Plus className="h-6 w-6 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                            <span className="text-xs font-semibold group-hover:text-foreground">Add Monthly Goal</span>
                        </button>
                    </div>
                </div>

                {/* ANNUALLY COLUMN */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Flag className="h-5 w-5 text-green-500" />
                            <h3 className="font-bold text-lg text-foreground">Annually</h3>
                        </div>
                        <button
                            onClick={() => setActiveFrequency('ANNUAL')}
                            className="text-zinc-400 hover:text-zinc-600 p-1 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {annually.map(item => (
                            <AnnualCard
                                key={item.id}
                                item={item}
                                isMenuOpen={activeMenuId === item.id}
                                onMenuToggle={(open) => setActiveMenuId(open ? item.id : null)}
                            />
                        ))}

                        <button
                            onClick={() => setActiveFrequency('ANNUAL')}
                            className="w-full border-2 border-dashed border-zinc-200 rounded-2xl p-4 flex flex-col items-center justify-center text-zinc-400 hover:border-zinc-300 hover:bg-zinc-50 transition-all gap-2 group"
                        >
                            <Plus className="h-6 w-6 group-hover:text-zinc-600" />
                            <span className="text-xs font-semibold group-hover:text-foreground">Add Annual Goal</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CreateRhythmItemDialog
                isOpen={!!activeFrequency}
                frequency={activeFrequency!}
                goalId={goalId}
                onClose={() => setActiveFrequency(null)}
            />
        </>
    );
}
