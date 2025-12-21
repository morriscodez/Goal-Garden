'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type ReorderItem = {
    id: string;
    sort_order: number;
};

import { auth } from '@/auth';

export async function reorderActionItems(items: ReorderItem[], goalId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Verify ownership
    const goal = await db.goal.findUnique({
        where: { id: goalId, userId: session.user.id }
    });

    if (!goal) return { success: false, error: "Unauthorized" };

    try {
        const transaction = items.map((item) =>
            db.actionItem.update({
                where: { id: item.id },
                data: { sort_order: item.sort_order }
            })
        );

        await db.$transaction(transaction);
        revalidatePath(`/goals/${goalId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to reorder items:', error);
        return { success: false, error: 'Failed to reorder items' };
    }
}
