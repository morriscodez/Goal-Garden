'use client';

import { useState } from "react";
import { resetPassword } from "@/app/actions/reset-password";
import { useSearchParams, useRouter } from "next/navigation";
import { Key, CheckCircle } from "lucide-react";
import Link from "next/link";

import { Suspense } from 'react';

function NewPasswordForm() {
    const searchParams = useSearchParams();

    // Robust token extraction:
    let token = searchParams.get("token");

    // Fallback: Check if the token is embedded in a key due to malformed URL (e.g. ?token%3Dvalue)
    if (!token) {
        searchParams.forEach((_, key) => {
            if (key.startsWith("token=")) {
                token = key.replace("token=", "");
            }
        });
    }

    const router = useRouter();

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setIsPending] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (formData: FormData) => {
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsPending(true);

        try {
            // Token is now inside formData
            const data = await resetPassword(formData);
            setError(data?.error);
            setSuccess(data?.success);

            if (data?.success) {
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
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
                        <Key className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Reset Password</h1>
                    <p className="text-sm text-zinc-500">
                        Enter your new password below.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4 text-left">
                    <input type="hidden" name="token" value={token || ""} />

                    <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase">New Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            disabled={isPending}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 rounded-lg border-zinc-200 p-2 text-sm text-zinc-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none border"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase">Confirm Password</label>
                        <input
                            type="password"
                            required
                            disabled={isPending}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full mt-1 rounded-lg border-zinc-200 p-2 text-sm text-zinc-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none border"
                            placeholder="••••••••"
                        />
                    </div>

                    {!token && (
                        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                            Warning: Token missing from URL. Please check your link.
                        </div>
                    )}
                    {/* Debugging helpers check */}
                    {token && token.includes("%") && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            Error: URL seems encoded. Try replacing "%3D" with "=" in the address bar.
                        </div>
                    )}

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
                        {isPending ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <Link href="/login" className="block text-sm text-zinc-500 hover:text-zinc-900 font-medium">
                    Back to login
                </Link>
            </div>
        </div>
    );
}

export default function NewPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewPasswordForm />
        </Suspense>
    );
}
