import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AddMilestoneForm } from '@/components/AddMilestoneForm';
import { ModeToggle } from '@/components/ModeToggle';
import { Flag, TrendingUp, MoreHorizontal, Calendar, Repeat } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

// We will create these components next
import { MatchRhythmBoard } from '@/components/RhythmBoard';

export default async function GoalDetailPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ mode?: string }>
}) {
    const { id } = await params;
    const { mode: modeParam } = await searchParams;
    const mode = modeParam || 'RHYTHM';

    const goal = await db.goal.findUnique({
        where: { id },
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
    // Schema has ANNUAL, so good.

    // For Deadline view, just show everything sorted by deadline or sort_order
    const deadlineItems = [...goal.actionItems].sort((a, b) => {
        if (a.deadline && b.deadline) return a.deadline.getTime() - b.deadline.getTime();
        return 0;
    });

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
                        <button className="text-white/60 hover:text-white transition-colors">
                            <MoreHorizontal className="h-6 w-6" />
                        </button>
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
                <div className="space-y-4">
                    {/* Reuse the list view from before, simplified */}
                    {deadlineItems.map((m) => (
                        <div key={m.id} className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${m.type === 'RECURRING' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {m.type === 'RECURRING' ? <Repeat className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-zinc-900">{m.title}</h4>
                                    <div className="text-xs text-zinc-500 flex gap-2">
                                        {m.type === 'RECURRING' && <span>Every {m.frequency?.toLowerCase()}</span>}
                                        {m.type === 'ONE_OFF' && m.deadline && <span>Due {format(m.deadline, 'MMM d')}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <AddMilestoneForm goalId={goal.id} />
                </div>
            )}
        </div>
    );
}
