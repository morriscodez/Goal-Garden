import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileForm } from "@/components/settings/ProfileForm";
import Link from "next/link";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="space-y-8">
            <div>
                <nav className="text-sm text-zinc-500 mb-2">App &gt; Settings</nav>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Section */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Profile</h2>
                    <div className="max-w-xl">
                        <ProfileForm user={user} />
                    </div>
                </div>

                {/* Account Section */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Account</h2>
                    <div className="space-y-6 max-w-xl">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Email Address
                            </label>
                            <div className="flex h-10 w-full items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                                {user.email}
                            </div>
                            <p className="text-xs text-zinc-500">
                                Your email address is managed by your provider and cannot be changed here.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <Link href="/auth/reset" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline">
                                Reset Password
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Preferences</h2>
                    <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Appearance</label>
                                <p className="text-sm text-zinc-500">Customize the look and feel of the application.</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Delete Account Section */}
                <DeleteAccountSection />
            </div>
        </div>
    );
}
