"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function fetchMatrixItems(goalId?: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    try {
        const where: any = {
            goal: {
                userId: session.user.id,
            },
        };

        if (goalId) {
            where.goalId = goalId;
        }

        const items = await db.actionItem.findMany({
            where,
            include: {
                goal: {
                    select: {
                        title: true,
                        color: true,
                    },
                },
            },
            orderBy: {
                sort_order: "asc",
            },
        });

        return { items };
    } catch (error) {
        console.error("Failed to fetch matrix items:", error);
        return { error: "Failed to fetch items" };
    }
}

export async function updateItemPriority(
    id: string,
    config: {
        is_urgent: boolean | null;
        is_important: boolean | null;
    }
) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    try {
        // Verify ownership
        const item = await db.actionItem.findFirst({
            where: {
                id,
                goal: {
                    userId: session.user.id,
                },
            },
        });

        if (!item) {
            return { error: "Item not found or unauthorized" };
        }

        const updatedItem = await db.actionItem.update({
            where: { id },
            data: {
                is_urgent: config.is_urgent,
                is_important: config.is_important,
            },
        });

        revalidatePath("/dashboard/matrix");
        revalidatePath(`/goals/${updatedItem.goalId}/matrix`);
        revalidatePath("/dashboard");

        return { success: true, item: updatedItem };
    } catch (error) {
        console.error("Failed to update item priority:", error);
        return { error: "Failed to update item" };
    }
}
