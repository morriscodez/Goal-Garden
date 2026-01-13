'use client';

import { useState } from 'react';
import { ActionItem } from '@prisma/client';

import { Sun, Calendar, CalendarDays, Flag, Plus } from 'lucide-react';
import { DailyCard } from './cards/DailyCard';
import { WeeklyCard } from './cards/WeeklyCard';
import { MonthlyCard } from './cards/MonthlyCard';
import { QuarterlyCard } from './cards/QuarterlyCard';
import { CreateRhythmItemDialog } from './CreateRhythmItemDialog';

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';

export function MatchRhythmBoard({
    goalId,
    daily, weekly, monthly, quarterly,
    visibleColumns = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']
}: {
    goalId: string;
    daily: ActionItem[];
    weekly: ActionItem[];
    monthly: ActionItem[];
    quarterly: ActionItem[];
    visibleColumns?: Frequency[];
}) {
    const [activeFrequency, setActiveFrequency] = useState<Frequency | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // Dynamic grid columns based on visible count
    const gridCols = visibleColumns.length === 1 ? 'grid-cols-1' :
        visibleColumns.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            visibleColumns.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2 xl:grid-cols-4';

    return (
        <>
            <div className={`grid ${gridCols} gap-6`}>
                {/* DAILY COLUMN */}
                {visibleColumns.includes('DAILY') && (
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
                                    showLogProgress={true}
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
                )}

                {/* WEEKLY COLUMN */}
                {visibleColumns.includes('WEEKLY') && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-green-500" />
                                <h3 className="font-bold text-lg text-foreground">Weekly</h3>
                            </div>
                            <button
                                onClick={() => setActiveFrequency('WEEKLY')}
                                className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full transition-colors"
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
                                className="w-full border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-sidebar-ring hover:bg-muted transition-all gap-2 group"
                            >
                                <Plus className="h-6 w-6 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                                <span className="text-xs font-semibold group-hover:text-foreground">Add Weekly Habit</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* MONTHLY COLUMN */}
                {visibleColumns.includes('MONTHLY') && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-green-500" />
                                <h3 className="font-bold text-lg text-foreground">Monthly</h3>
                            </div>
                            <button
                                onClick={() => setActiveFrequency('MONTHLY')}
                                className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full transition-colors"
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
                                className="w-full border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-sidebar-ring hover:bg-muted transition-all gap-2 group"
                            >
                                <Plus className="h-6 w-6 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                                <span className="text-xs font-semibold group-hover:text-foreground">Add Monthly Habit</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* QUARTERLY COLUMN */}
                {visibleColumns.includes('QUARTERLY') && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <Flag className="h-5 w-5 text-green-500" />
                                <h3 className="font-bold text-lg text-foreground">Quarterly</h3>
                            </div>
                            <button
                                onClick={() => setActiveFrequency('QUARTERLY')}
                                className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {quarterly.map(item => (
                                <QuarterlyCard
                                    key={item.id}
                                    item={item}
                                    isMenuOpen={activeMenuId === item.id}
                                    onMenuToggle={(open) => setActiveMenuId(open ? item.id : null)}
                                />
                            ))}

                            <button
                                onClick={() => setActiveFrequency('QUARTERLY')}
                                className="w-full border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center text-muted-foreground hover:border-sidebar-ring hover:bg-muted transition-all gap-2 group"
                            >
                                <Plus className="h-6 w-6 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                                <span className="text-xs font-semibold group-hover:text-foreground">Add Quarterly Habit</span>
                            </button>
                        </div>
                    </div>
                )}
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
