'use server';

import { db } from "@/lib/db";
import { generatePasswordResetToken, getPasswordResetTokenByToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const resetRequest = async (formData: FormData) => {
    try {
        const email = formData.get("email") as string;

        if (!email) {
            return { error: "Email is required" };
        }

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (!existingUser) {
            return { success: "If an account exists, a reset email has been sent." };
        }

        const passwordResetToken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

        return { success: "If an account exists, a reset email has been sent." };
    } catch (error) {
        console.error("RESET REQUEST ERROR:", error);
        return { error: "Something went wrong on the server." };
    }
};

export const resetPassword = async (formData: FormData) => {
    const password = formData.get("password") as string;
    const token = formData.get("token") as string;

    if (!token) {
        return { error: "Missing token!" };
    }

    if (!password) {
        return { error: "Password is required" };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await db.user.findUnique({
        where: { email: existingToken.email }
    });

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    });

    await db.passwordResetToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "Password updated!" };
};
