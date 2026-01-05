import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AddMilestoneForm } from '@/components/AddMilestoneForm';
import { ModeToggle } from '@/components/ModeToggle';

import { MatchRhythmBoard } from '@/components/RhythmBoard';
import { DeadlineBoard } from '@/components/DeadlineBoard';
import { GoalMenu } from '@/components/GoalMenu';
import { RhythmStatus } from '@/components/RhythmStatus';
import { GoalHeader } from '@/components/GoalHeader';

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

    // Calculate Last Activity for Vibe Check
    // We consider ANY completion (recurring or one-off) as activity.
    const lastActivityDate = goal.actionItems.reduce((latest: Date | null, item: any) => {
        if (!item.last_completed_at) return latest;
        const itemDate = new Date(item.last_completed_at);
        return !latest || itemDate > latest ? itemDate : latest;
    }, null);

    return (
        <div className="mx-auto max-w-5xl p-8 space-y-8 pb-20">
            <GoalHeader goal={{
                id: goal.id,
                title: goal.title,
                motivation: goal.motivation,
                color: goal.color
            }} />

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <ModeToggle goalId={goal.id} />
                </div>

                {mode === 'RHYTHM' && (
                    <RhythmStatus lastActivityDate={lastActivityDate} />
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
