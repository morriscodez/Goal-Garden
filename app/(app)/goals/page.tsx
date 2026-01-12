import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { GoalGrid } from "@/components/GoalGrid";
import { GlobalGanttChart } from "@/components/timeline/GlobalGanttChart";
import { clsx } from "clsx";

export default async function GoalsReviewPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const view = typeof searchParams?.view === 'string' ? searchParams.view : 'grid';

    const goals = await db.goal.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            actionItems: true
        },
    });

    // Helper to calculate progress
    const calculateProgress = (goal: typeof goals[0]) => {
        const items = goal.actionItems || [];
        if (items.length === 0) return 0;

        const completed = items.filter((item) => item.is_completed).length;
        return Math.round((completed / items.length) * 100);
    };

    // Transform goals data for the GoalGrid component
    const goalsWithProgress = goals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        motivation: goal.motivation,
        progress: calculateProgress(goal),
        deadline: goal.deadline,
        mode: goal.mode,
        color: goal.color,
        createdAt: goal.createdAt,
        sort_order: goal.sort_order,
        is_focused: goal.is_focused,
    }));

    return (
        <div className="min-h-screen bg-background p-8">
            <div className={clsx(
                "mx-auto space-y-8",
                view === 'timeline' ? "max-w-full" : "max-w-7xl"
            )}>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Current Long-Term Goals</h1>
                        <p className="text-muted-foreground mt-1">Visualize your roadmap and upcoming deadlines.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* View Toggle */}
                        <div className="bg-card p-1 rounded-lg border border-border shadow-sm flex items-center">
                            <a
                                href="/goals?view=grid"
                                className={clsx(
                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                    view === 'grid'
                                        ? "bg-muted text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                Grid
                            </a>
                            <a
                                href="/goals?view=timeline"
                                className={clsx(
                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                    view === 'timeline'
                                        ? "bg-muted text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                Timeline
                            </a>
                        </div>

                        {/* Add New Goal Button */}
                        <a
                            href="/goals/new"
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        >
                            + Add New Goal
                        </a>
                    </div>
                </div>

                {/* Content Area */}
                {view === 'timeline' ? (
                    <GlobalGanttChart goals={goals as any} />
                ) : (
                    /* Grid View */
                    goals.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                            <h3 className="text-lg font-medium text-foreground">No goals found</h3>
                            <p className="text-muted-foreground mt-2 mb-6">You haven't set any long-term goals yet.</p>
                            <a href="/goals/new" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Create your first goal &rarr;</a>
                        </div>
                    ) : (
                        <GoalGrid initialGoals={goalsWithProgress} />
                    )
                )}
            </div>
        </div>
    );
}
