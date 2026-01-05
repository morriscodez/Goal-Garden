import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileForm } from "@/components/settings/ProfileForm";
import Link from "next/link";
import { DeleteAccountSection } from "@/components/settings/DeleteAccountSection";
import { ThemeSelector } from "@/components/settings/ThemeSelector";

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
        <div className="mx-auto max-w-5xl p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Section */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-card-foreground mb-6">Profile</h2>
                    <div className="max-w-xl">
                        <ProfileForm user={user} />
                    </div>
                </div>

                {/* Account Section */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-card-foreground mb-6">Account</h2>
                    <div className="space-y-6 max-w-xl">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
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
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-card-foreground">Preferences</h2>

                    {/* Dark/Light Mode */}
                    <div className="mt-4 border-t border-border pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-foreground">Dark Mode</label>
                                <p className="text-sm text-muted-foreground">Toggle between light and dark backgrounds.</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Color Theme */}
                    <div className="mt-6 border-t border-border pt-6">
                        <div className="space-y-4">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-foreground">Color Theme</label>
                                <p className="text-sm text-muted-foreground">Choose your preferred color palette for dark mode.</p>
                            </div>
                            <ThemeSelector />
                        </div>
                    </div>
                </div>

                {/* Delete Account Section */}
                <DeleteAccountSection />
            </div>
        </div>
    );
}
