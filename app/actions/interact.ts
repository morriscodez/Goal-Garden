'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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

    // Simple streak logic: if completing, increment. If uncompleting, decrement (basic undo).
    // Real habit apps needs complex date logic, but this suffices for MVP.
    let streak = item.current_streak;
    if (newStatus) {
        streak += 1;
    } else {
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
