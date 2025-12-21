'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

type ReorderItem = {
    id: string;
    sort_order: number;
};

export async function reorderActionItems(items: ReorderItem[], goalId: string) {
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
