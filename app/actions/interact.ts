'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { isSameDay, isSameWeek, isSameMonth, isSameQuarter, isSameYear, subDays, subWeeks, subMonths, subQuarters, subYears, isAfter } from 'date-fns';

import { auth } from '@/auth';

export async function toggleActionItem(id: string, goalId: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    // Verify ownership via goalId (simplest, though technically we could look up item->goal->user)
    const goal = await db.goal.findUnique({
        where: { id: goalId, userId: session.user.id }
    });

    if (!goal) return;

    const item = await db.actionItem.findUnique({
        where: { id }
    });

    if (!item) return;

    const newStatus = !item.is_completed;
    let streak = item.current_streak;

    const now = new Date();
    const lastCompleted = item.last_completed_at ? new Date(item.last_completed_at) : null;

    if (newStatus) {
        // We are marking as completed.
        // Check if this extends the streak.

        if (!lastCompleted) {
            // First time completion
            streak = 1;
        } else {
            // Check based on frequency
            let isConsecutive = false;
            let isSamePeriod = false;

            const frequency = item.frequency || 'DAILY';

            if (frequency === 'DAILY') {
                isSamePeriod = isSameDay(lastCompleted, now);
                // Consecutive if last completion was yesterday
                const yesterday = subDays(now, 1);
                isConsecutive = isSameDay(lastCompleted, yesterday);
            } else if (frequency === 'WEEKLY') {
                isSamePeriod = isSameWeek(lastCompleted, now, { weekStartsOn: 1 });
                // Consecutive if last completion was last week
                const lastWeek = subWeeks(now, 1);
                isConsecutive = isSameWeek(lastCompleted, lastWeek, { weekStartsOn: 1 });
            } else if (frequency === 'MONTHLY') {
                isSamePeriod = isSameMonth(lastCompleted, now);
                const lastMonth = subMonths(now, 1);
                isConsecutive = isSameMonth(lastCompleted, lastMonth);
            } else if (frequency === 'QUARTERLY') {
                isSamePeriod = isSameQuarter(lastCompleted, now);
                const lastQuarter = subQuarters(now, 1);
                isConsecutive = isSameQuarter(lastCompleted, lastQuarter);
            } else if (frequency === 'YEARLY') {
                isSamePeriod = isSameYear(lastCompleted, now);
                const lastYear = subYears(now, 1);
                isConsecutive = isSameYear(lastCompleted, lastYear);
            } else {
                // Default handling
                isSamePeriod = isSameDay(lastCompleted, now);
                isConsecutive = isSameDay(lastCompleted, subDays(now, 1));
            }

            if (isSamePeriod) {
                // Already completed for this period? 
                // E.g. toggled off then on again same day. Restoring previous streak value?
                // Ideally we shouldn't increment if we just toggled.
                // But since we rely on `item.current_streak` which implies "streak at that moment", 
                // if we just toggled off, we probably decremented. So toggling on should increment back.
                streak += 1; // Assuming decrement happened on toggle off.
            } else if (isConsecutive) {
                streak += 1;
            } else {
                // Broken streak
                streak = 1;
            }
        }
    } else {
        // Uncompleting
        // Only decrement if > 0
        streak = Math.max(0, streak - 1);
    }

    await db.actionItem.update({
        where: { id },
        data: {
            is_completed: newStatus,
            last_completed_at: newStatus ? new Date() : item.last_completed_at,
            current_streak: streak
        }
    });



    if (newStatus) {
        await db.itemLog.create({
            data: {
                actionItemId: id,
                value: 1
            }
        });
    } else {
        // Find log for today and delete it
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        await db.itemLog.deleteMany({
            where: {
                actionItemId: id,
                date_logged: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
    }

    revalidatePath(`/goals/${goalId}`);
    revalidatePath(`/dashboard`);
}
