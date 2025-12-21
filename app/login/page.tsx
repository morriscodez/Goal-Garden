'use client';

import { signIn } from "next-auth/react"; // Use client-side signIn for Credentials to avoid full page reload issues on error
import { Sprout } from "lucide-react";
import { useState } from "react";
import { register } from "@/app/actions/register";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setError("");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const name = formData.get("name") as string;

        try {
            if (isRegister) {
                const res = await register(formData);
                if (res?.error) {
                    setError(res.error);
                    return;
                }

                // Registration successful, now login
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setError("Registration succeeded but login failed.");
                } else {
                    router.push("/");
                    router.refresh();
                }
            } else {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setError("Invalid email or password");
                } else {
                    router.push("/");
                    router.refresh();
                }
            }
        } catch (e) {
            // If register action threw NEXT_REDIRECT, it's good.
            // But client-side handler catches it? No, server action redirect acts like a navigation.
            // Wait, register is a server action. 
            // If I call it directly, it should work.
            if ((e as Error).message === "NEXT_REDIRECT") {
                return; // Allow redirect
            }
            setError("An error occurred. Please try again.");
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 text-center space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <Sprout className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                        {isRegister ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-sm text-zinc-500">
                        {isRegister
                            ? "Join Goal Garden and start growing."
                            : "Plant your seeds of ambition and watch them grow."}
                    </p>
                </div>

                <div className="space-y-4">
                    <form action={handleSubmit} className="space-y-4 text-left">
                        {isRegister && (
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Name</label>
                                <input name="name" type="text" required className="w-full mt-1 rounded-lg border-zinc-200 p-2 text-sm text-zinc-900 bg-white focus:ring-2 focus:ring-green-500 outline-none border" placeholder="Your Name" />
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase">Email</label>
                            <input name="email" type="email" required className="w-full mt-1 rounded-lg border-zinc-200 p-2 text-sm text-zinc-900 bg-white focus:ring-2 focus:ring-green-500 outline-none border" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase">Password</label>
                            <input name="password" type="password" required className="w-full mt-1 rounded-lg border-zinc-200 p-2 text-sm text-zinc-900 bg-white focus:ring-2 focus:ring-green-500 outline-none border" placeholder="••••••••" />
                        </div>

                        {!isRegister && (
                            <div className="flex justify-end">
                                <Link href="/auth/reset" className="text-xs text-zinc-500 hover:text-zinc-900 font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white rounded-xl py-3 px-4 text-sm font-semibold hover:bg-green-700 transition-colors"
                        >
                            {isRegister ? "Sign Up" : "Sign In"}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-zinc-500">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl py-3 px-4 text-sm font-semibold hover:bg-zinc-50 transition-all"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google
                    </button>

                    <p className="text-sm text-zinc-500">
                        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="font-semibold text-green-600 hover:text-green-500"
                        >
                            {isRegister ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
