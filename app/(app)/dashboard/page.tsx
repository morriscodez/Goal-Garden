import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Plus, Activity, Clock } from "lucide-react"
import { DailyCard } from "@/components/cards/DailyCard"
import { DeadlineCard } from "@/components/cards/DeadlineCard"
import { StreakWidget } from "@/components/StreakWidget"
import { RhythmToggle } from "@/components/dashboard/RhythmToggle"
import { DeadlineFilter } from "@/components/dashboard/DeadlineFilter"

export default async function DashboardPage({
    searchParams,
}: {
    searchParams?: Promise<{ rhythm?: string; deadlineDays?: string }>
}) {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const rhythm = (await searchParams)?.rhythm || 'DAILY';
    const deadlineDaysStr = (await searchParams)?.deadlineDays || '7';
    const deadlineDays = parseInt(deadlineDaysStr, 10) || 7;

    const frequencyMap: Record<string, string> = {
        'DAILY': 'DAILY',
        'WEEKLY': 'WEEKLY',
        'MONTHLY': 'MONTHLY',
        'QUARTERLY': 'QUARTERLY'
    };
    const frequency = frequencyMap[rhythm] || 'DAILY';

    const rhythmLabels: Record<string, string> = {
        'DAILY': 'Daily habits',
        'WEEKLY': 'Weekly targets',
        'MONTHLY': 'Monthly goals',
        'QUARTERLY': 'Quarterly objectives'
    };
    const rhythmLabel = rhythmLabels[rhythm] || 'Daily habits';

    // 1. Fetch Rhythm Items (Frequency based on toggle)
    const rhythmItems = await db.actionItem.findMany({
        where: {
            goal: { userId: session.user.id, is_archived: false },
            frequency: frequency as any,
            is_archived: false
        },
        include: {
            goal: {
                select: { title: true, color: true }
            }
        },
        orderBy: {
            sort_order: 'asc'
        }
    });

    // 2. Fetch Upcoming Deadlines
    // Based on user selected threshold (deadlineDays)
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);

    const upcomingDeadlines = await db.actionItem.findMany({
        where: {
            goal: { userId: session.user.id, is_archived: false },
            deadline: {
                not: null,
                lte: deadlineDate
            },
            is_completed: false, // Only show pending for "coming at me fast"
            is_archived: false
        },
        include: {
            goal: {
                select: { title: true, color: true }
            }
        },
        orderBy: {
            deadline: 'asc'
        },
        // Remove take: 10 to let user see all within their chosen window, or keep it?
        // User asked to see items "whose deadlines are within the next X days". 
        // Implies we show them all. 
        // But let's keep a reasonable limit if it gets huge, though for now "all" is safer interpretation of request.
    });

    // 3. Calculate Streak
    // Fetch logs for user
    const logs = await db.itemLog.findMany({
        where: {
            actionItem: {
                goal: { userId: session.user.id }
            }
        },
        select: {
            date_logged: true
        },
        orderBy: {
            date_logged: 'desc'
        }
    });

    // Calculate consecutive days allowing for 1 skip day
    // "streak increments as long as a user marks at least one item complete for the day"
    // "If the user goes more than one day without marking ... streak resets to 0 days"

    // Use UTC dates for consistency
    const uniqueDates = Array.from(new Set(logs.map(l => l.date_logged.toISOString().split('T')[0])));
    let streak = 0;

    if (uniqueDates.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayDate = new Date(todayStr);
        const latestLogDate = new Date(uniqueDates[0]);

        const diffTime = todayDate.getTime() - latestLogDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Streak is active if diff is 0 (Today), 1 (Yesterday), or 2 (One day skipped)
        if (diffDays <= 2) {
            streak = 1;
            for (let i = 0; i < uniqueDates.length - 1; i++) {
                const current = new Date(uniqueDates[i]);
                const next = new Date(uniqueDates[i + 1]);
                const gapTime = current.getTime() - next.getTime();
                const gapDays = Math.floor(gapTime / (1000 * 60 * 60 * 24));

                // If gap is 1 (consecutive) or 2 (one day skipped), streak continues
                if (gapDays <= 2) {
                    streak++;
                } else {
                    break;
                }
            }
        }
    }


    // Calculate visible goals for the matrix filter
    const visibleGoalIds = Array.from(new Set([
        ...rhythmItems.map(i => i.goalId),
        ...upcomingDeadlines.map(i => i.goalId)
    ]));
    const matrixLink = visibleGoalIds.length > 0
        ? `/dashboard/matrix?filterGoals=${visibleGoalIds.join(',')}`
        : "/dashboard/matrix";

    return (
        <div className="mx-auto max-w-5xl p-8 space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Seasonal Drivers</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Ready to conquer the day, {session.user.name}?</p>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Rhythm Section: Habits & Periodic Tasks */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 p-1.5 rounded-lg dark:bg-green-900/30 dark:text-green-400">
                                    <Activity className="h-5 w-5" />
                                </span>
                                Rhythm
                                <span className="text-sm font-normal text-muted-foreground ml-2 hidden sm:inline-block">
                                    {rhythmLabel} to clear
                                </span>
                            </h2>
                            <RhythmToggle />
                        </div>

                        {rhythmItems.length === 0 ? (
                            <div className="p-8 border border-dashed rounded-2xl text-center bg-zinc-50/50 dark:bg-zinc-900/30">
                                <p className="text-muted-foreground text-sm">No items found for this frequency.</p>
                                <Link href="/goals" className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block">Check your goals</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {rhythmItems.map(item => (
                                    <DailyCard
                                        key={item.id}
                                        item={item}
                                        goalName={item.goal.title}
                                        goalColor={item.goal.color || undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Deadline Section: Upcoming */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                                    <Clock className="h-5 w-5" />
                                </span>
                                Deadline
                                <span className="text-sm font-normal text-muted-foreground ml-2">Big milestones coming up</span>
                            </h2>
                            <DeadlineFilter />
                        </div>

                        {upcomingDeadlines.length === 0 ? (
                            <div className="p-8 border border-dashed rounded-2xl text-center bg-zinc-50/50 dark:bg-zinc-900/30">
                                <p className="text-muted-foreground text-sm">No upcoming deadlines within {deadlineDays} days.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {upcomingDeadlines.map(item => (
                                    <DeadlineCard
                                        key={item.id}
                                        item={item}
                                        goalName={item.goal.title}
                                        goalColor={item.goal.color || undefined}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar / Widget Area */}
                <div className="space-y-6">
                    <StreakWidget streak={streak} />

                    {/* Prioritize Widget */}
                    <div className="bg-card border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-2 text-zinc-900 dark:text-zinc-50">Prioritize</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            Overwhelmed? Use the Eisenhower Matrix to sort your tasks by urgency and importance.
                        </p>
                        <Link
                            href={matrixLink}
                            className="block w-full py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-center rounded-xl text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                        >
                            Open Matrix
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
