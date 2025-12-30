'use server';

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;

    if (!name || name.trim().length === 0) {
        return { error: "Name is required" };
    }

    try {
        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name: name.trim()
            }
        });

        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { error: "Failed to update profile" };
    }
}

import { signOut } from "@/auth";

export async function deleteAccount() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        await db.user.delete({
            where: {
                id: session.user.id
            }
        });

        await signOut({ redirect: true, redirectTo: "/" });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete account:", error);
        return { error: "Failed to delete account" };
    }
}

