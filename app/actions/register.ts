'use server';

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function register(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password || !name) {
        return { error: "Missing required fields" };
    }

    const existingUser = await db.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    return { success: true };
}
