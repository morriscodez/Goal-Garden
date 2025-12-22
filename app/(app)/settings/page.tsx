import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SettingsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    return (
        <div className="space-y-8">
            <div>
                <nav className="text-sm text-zinc-500 mb-2">App &gt; Settings</nav>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2">Manage your account settings and preferences.</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Preferences</h2>
                        <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
