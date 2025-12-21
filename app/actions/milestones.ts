'use server';

import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createMilestone(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return;

    const goalId = formData.get('goalId') as string;

    // Verify ownership
    const goal = await db.goal.findUnique({
        where: { id: goalId, userId: session.user.id }
    });

    if (!goal) {
        throw new Error("Unauthorized");
    }

    const title = formData.get('title') as string;
    const type = formData.get('type') as string; // 'ONE_OFF' or 'RECURRING'

    // Common fields
    const data: any = {
        goalId,
        title,
        type,
        is_completed: false
    };

    if (type === 'ONE_OFF') {
        const deadlineStr = formData.get('deadline') as string;
        if (deadlineStr) {
            data.deadline = new Date(deadlineStr);
        }
    } else if (type === 'RECURRING') {
        data.frequency = formData.get('frequency') as string; // DAILY, WEEKLY etc
        data.widget_type = 'CHECKBOX'; // Defaulting for now
    }

    await db.actionItem.create({
        data
    });

    revalidatePath(`/goals/${goalId}`);
}

export async function updateActionItemDeadline(id: string, deadline: Date | null) {
    try {
        await db.actionItem.update({
            where: { id },
            data: { deadline }
        });
        revalidatePath('/goals/[id]'); // Revalidate all goal pages for simplicity
        return { success: true };
    } catch (error) {
        console.error('Failed to update deadline:', error);
        return { success: false, error: 'Failed to update deadline' };
    }
}
