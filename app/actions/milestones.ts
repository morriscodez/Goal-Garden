'use server';

import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createMilestone(formData: FormData) {
    const goalId = formData.get('goalId') as string;
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
