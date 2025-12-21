'use server';

import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function createGoal(formData: FormData) {
    const title = formData.get('title') as string;
    const motivation = formData.get('motivation') as string;
    const deadlineStr = formData.get('deadline') as string;

    // Hardcoded for now until Auth is implemented
    // In a real app we'd get this from the session
    const userId = 'cmjfx8n7d0000ei26qg2vnxte'; // ID from our verification script/seed
    // First, let's make sure we actually have a user. If the seed user might not be there, we should handle it.
    // For dev, we will assume the verified user exists or find the first one.

    let validUserId = userId;
    const user = await db.user.findFirst();
    if (user) {
        validUserId = user.id;
    } else {
        // fast fail or create one?
        const newUser = await db.user.create({
            data: {
                email: 'demo@example.com',
                name: 'Demo User'
            }
        });
        validUserId = newUser.id;
    }

    const deadline = deadlineStr ? new Date(deadlineStr) : null;

    const goal = await db.goal.create({
        data: {
            title,
            motivation,
            deadline,
            mode: 'DEADLINE', // Defaulting to DEADLINE for now
            userId: validUserId
        }
    });

    redirect(`/goals/${goal.id}`);
}
