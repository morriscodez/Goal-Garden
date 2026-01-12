'use server';

import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
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

    // Get the highest existing sort_order for this user's goals
    const maxSortOrder = await db.goal.aggregate({
        where: { userId },
        _max: { sort_order: true }
    });

    const newSortOrder = (maxSortOrder._max.sort_order ?? -1) + 1;

    const goal = await db.goal.create({
        data: {
            title,
            motivation,
            deadline,
            mode: 'DEADLINE', // Defaulting to DEADLINE for now
            userId,
            sort_order: newSortOrder
        }
    });


    redirect(`/goals/${goal.id}`);
}

export async function deleteGoal(goalId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.goal.delete({
            where: {
                id: goalId,
                userId: session.user.id
            }
        });

        revalidatePath('/goals');
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete goal" };
    }
}

export async function updateGoal(goalId: string, data: { title: string; motivation?: string; deadline?: Date }) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.goal.update({
            where: {
                id: goalId,
                userId: session.user.id
            },
            data: {
                title: data.title,
                motivation: data.motivation,
                deadline: data.deadline
            }
        });

        revalidatePath(`/goals/${goalId}`);
        revalidatePath('/goals');

        return { success: true };
    } catch (error) {
        return { error: "Failed to update goal" };
    }
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

export async function updateGoalColor(goalId: string, color: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.goal.update({
            where: {
                id: goalId,
                userId: session.user.id
            },
            data: {
                color
            }
        });

        revalidatePath('/goals');
        revalidatePath(`/goals/${goalId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to update color" };
    }
}

export async function toggleGoalFocus(goalId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // Get current focus state
        const goal = await db.goal.findUnique({
            where: { id: goalId, userId: session.user.id },
            select: { is_focused: true }
        });

        if (!goal) return { error: "Goal not found" };

        // Toggle the focus state
        await db.goal.update({
            where: {
                id: goalId,
                userId: session.user.id
            },
            data: {
                is_focused: !goal.is_focused
            }
        });

        revalidatePath('/goals');
        return { success: true, is_focused: !goal.is_focused };
    } catch (error) {
        return { error: "Failed to toggle focus" };
    }
}
