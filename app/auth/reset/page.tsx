'use client';

import { useState } from "react";
import { resetRequest } from "@/app/actions/reset-password";
import { Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPage() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setError("");
        setSuccess("");
        setIsPending(true);

        try {
            const data = await resetRequest(formData);
            setError(data?.error);
            setSuccess(data?.success);
        } catch {
            setError("Something went wrong!");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 text-center space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Mail className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Forgot Password?</h1>
                    <p className="text-sm text-zinc-500">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            disabled={isPending}
                            className="w-full mt-1 rounded-lg border-zinc-200 p-2 text-sm text-zinc-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none border"
                            placeholder="you@example.com"
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">{error}</p>}
                    {success && <div className="text-sm text-green-600 text-center bg-green-50 p-2 rounded flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {success}
                    </div>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 text-white rounded-xl py-3 px-4 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <Link href="/login" className="block text-sm text-zinc-500 hover:text-zinc-900 font-medium">
                    Back to login
                </Link>
            </div>
        </div>
    );
}
