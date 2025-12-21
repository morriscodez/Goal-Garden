'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleActionItem(id: string, goalId: string) {
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

    revalidatePath(`/goals/${goalId}`);
}
