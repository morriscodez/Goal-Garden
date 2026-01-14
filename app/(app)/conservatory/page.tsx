
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ConservatoryShelf } from "@/components/conservatory/ConservatoryShelf";
import { ConservatoryBackground } from "@/components/conservatory/ConservatoryBackground";
import { Goal, ActionItem } from "@prisma/client";

export default async function ConservatoryPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    // Fetch completed goals
    const goals = await db.goal.findMany({
        where: {
            userId: session.user.id,
            is_completed: true,
        },
        include: {
            actionItems: true,
        },
        orderBy: {
            updatedAt: 'desc', // Using updatedAt as proxy for completedAt
        },
    });

    // Group goals by Month/Year
    // Only goals with is_completed=true use updatedAt as "completed date"
    const groups: Record<string, (Goal & { actionItems: ActionItem[] })[]> = {};

    goals.forEach(goal => {
        const date = new Date(goal.updatedAt);
        const key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(goal as Goal & { actionItems: ActionItem[] });
    });

    // Sort keys (Month Year) descending
    // Since goals are already sorted by date desc, the keys should appear in order of first encounter if we iterate?
    // Actually standard Object keys order isn't guaranteed, so let's rely on the list of keys we generate from the sorted goals.
    const sortedKeys = Array.from(new Set(goals.map(g => {
        return new Date(g.updatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    })));

    return (
        <main className="flex-1 w-full min-h-screen relative overscroll-none text-slate-800 dark:text-slate-100">
            <ConservatoryBackground />

            {/* Header */}
            <div className="w-full py-12 flex flex-col items-center justify-center text-center space-y-2 select-none relative z-10">
                <h6 className="text-sm font-medium uppercase tracking-widest text-white/90 drop-shadow-md">Archive</h6>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg">The Conservatory</h1>
                <p className="max-w-md text-white/90 mt-2 drop-shadow-md text-shadow-sm">
                    A collection of your completed goals, grown into a living garden.
                </p>
            </div>

            {/* Conservatory Space */}
            <div className="w-full flex flex-col items-center pb-24 relative z-10 overflow-hidden">
                {/* No grid decor needed as we have image background now */}

                {goals.length === 0 ? (
                    <div className="mt-20 text-center text-slate-400">
                        <p>No completed goals yet.</p>
                        <p className="text-sm">Complete a goal to plant your first seed.</p>
                    </div>
                ) : (
                    sortedKeys.map(key => (
                        <ConservatoryShelf
                            key={key}
                            monthStr={key}
                            goals={groups[key]}
                        />
                    ))
                )}
            </div>
        </main>
    );
}
