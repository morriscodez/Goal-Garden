import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AddMilestoneForm } from '@/components/AddMilestoneForm';
import { ModeToggle } from '@/components/ModeToggle';
import { Flag, TrendingUp, MoreHorizontal } from 'lucide-react';
import { MatchRhythmBoard } from '@/components/RhythmBoard';
import { DeadlineBoard } from '@/components/DeadlineBoard';
import { GoalMenu } from '@/components/GoalMenu';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function GoalDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ mode?: string }>
}) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const { id } = await params;
    const { mode: modeParam } = await searchParams;
    const mode = modeParam || 'RHYTHM';

    const goal = await db.goal.findUnique({
        where: {
            id,
            userId: session.user.id
        },
        include: {
            actionItems: true
        }
    });

    if (!goal) {
        notFound();
    }

    // Grouping for Rhythm View
    const dailyItems = goal.actionItems.filter((i: any) => i.type === 'RECURRING' && i.frequency === 'DAILY');
    const weeklyItems = goal.actionItems.filter((i: any) => i.type === 'RECURRING' && i.frequency === 'WEEKLY');
    const monthlyItems = goal.actionItems.filter((i: any) => i.type === 'RECURRING' && i.frequency === 'MONTHLY');
    const annualItems = goal.actionItems.filter((i: any) => i.type === 'RECURRING' && i.frequency === 'ANNUAL');

    // For Deadline view, we explicitly filter for non-recurring items (Milestones/One-off)
    // so the board isn't cluttered with daily habits.
    const deadlineItems = goal.actionItems
        .filter((i: any) => i.type !== 'RECURRING')
        .sort((a: any, b: any) => a.sort_order - b.sort_order);

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Banner Card */}
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-8 md:p-12 shadow-2xl">
                {/* Background "Image" abstraction */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-transparent z-10" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />

                <div className="relative z-20 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm border border-white/10">
                            <Flag className="h-3 w-3" />
                            Long-term Goal
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{goal.title}</h1>

                        {goal.motivation && (
                            <p className="text-zinc-300 text-lg leading-relaxed max-w-xl">
                                Why: {goal.motivation}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-4 min-w-[200px]">
                        <GoalMenu goalId={goal.id} />
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <ModeToggle goalId={goal.id} />
                </div>

                {mode === 'RHYTHM' && (
                    <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-zinc-100 shadow-sm w-full md:w-auto">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Overall Rhythm</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-zinc-900">92%</span>
                                <span className="text-sm font-medium text-green-500">consistency</span>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-zinc-100 mx-2" />
                        <div className="flex-1 w-32 h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full w-[92%]" />
                        </div>
                        <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>
                )}
            </div>

            {/* View Content */}
            {mode === 'RHYTHM' ? (
                <MatchRhythmBoard
                    goalId={goal.id}
                    daily={dailyItems}
                    weekly={weeklyItems}
                    monthly={monthlyItems}
                    annually={annualItems}
                />
            ) : (
                <DeadlineBoard goalId={goal.id} initialItems={deadlineItems} />
            )}
        </div>
    );
}
