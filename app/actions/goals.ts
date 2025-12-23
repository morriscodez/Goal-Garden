'use server';

import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function createGoal(formData: FormData) {
    const title = formData.get('title') as string;
    const motivation = formData.get('motivation') as string;
    const deadlineStr = formData.get('deadline') as string;

    const session = await auth();

    if (!session?.user?.id) {
        // Should catch this in middleware, but double check.
        redirect('/login');
    }

    const userId = session.user.id;

    const deadline = deadlineStr ? new Date(deadlineStr) : null;

    const goal = await db.goal.create({
        data: {
            title,
            motivation,
            deadline,
            mode: 'DEADLINE', // Defaulting to DEADLINE for now
            userId
        }
    });


    redirect(`/goals/${goal.id}`);
}

export async function updateGoalDeadline(goalId: string, deadline: Date) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.goal.update({
            where: {
                id: goalId,
                userId: session.user.id
            },
            data: {
                deadline
            }
        });

        return { success: true };
    } catch (error) {
        return { error: "Failed to update deadline" };
    }
}
