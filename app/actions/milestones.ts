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

export async function toggleMilestoneCompletion(id: string, isCompleted: boolean) {
    try {
        await db.actionItem.update({
            where: { id },
            data: {
                is_completed: isCompleted,
                ...(isCompleted && { last_completed_at: new Date() })
            }
        });

        if (isCompleted) {
            await db.itemLog.create({
                data: {
                    actionItemId: id,
                    value: 1
                }
            });
        } else {
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

        revalidatePath('/goals/[id]');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle completion:', error);
        return { success: false, error: 'Failed to toggle completion' };
    }
}

export async function deleteActionItem(id: string, goalId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.actionItem.delete({
            where: { id }
        });
        revalidatePath(`/goals/${goalId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete milestone" };
    }
}

export async function updateActionItem(id: string, goalId: string, data: { title: string; deadline?: Date | null }) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.actionItem.update({
            where: { id },
            data: {
                title: data.title,
                deadline: data.deadline
            }
        });
        revalidatePath(`/goals/${goalId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to update milestone" };
    }
}

export async function convertActionItemType(id: string, goalId: string, targetType: 'ONE_OFF' | 'RECURRING', frequency?: string | null, deadline?: Date | null) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const data: any = {
            type: targetType,
            frequency: targetType === 'RECURRING' ? frequency : null,
            deadline: targetType === 'RECURRING' ? null : deadline
        };

        if (targetType === 'ONE_OFF' && deadline === undefined) {
            // If implicit conversion without deadline, keep existing or set null?
            // Logic above keeps deadline if passed, else undefined sets it to undefined (no change?)
            // Actually prisma update needs specific value.
            // If undefined, let's explicit null if not passed? No, if undefined it is ignored by Prisma if not in data object?
            // Actually types above: deadline: ... : deadline. If deadline is undefined, it is undefined.
            // But if converting RECURRING -> ONE_OFF, we might want to ensure deadline is handle properly.
            // Let's assume passed deadline is what we want.
        }

        await db.actionItem.update({
            where: { id },
            data
        });
        revalidatePath(`/goals/${goalId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to convert milestone type" };
    }
}

export async function archiveActionItem(id: string, goalId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.actionItem.update({
            where: { id },
            data: { is_archived: true }
        });
        revalidatePath(`/goals/${goalId}`);
        revalidatePath('/dashboard');
        revalidatePath('/archive');
        return { success: true };
    } catch (error) {
        return { error: "Failed to archive action item" };
    }
}

export async function unarchiveActionItem(id: string, goalId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.actionItem.update({
            where: { id },
            data: { is_archived: false }
        });
        revalidatePath(`/goals/${goalId}`);
        revalidatePath('/dashboard');
        revalidatePath('/archive');
        return { success: true };
    } catch (error) {
        return { error: "Failed to unarchive action item" };
    }
}
