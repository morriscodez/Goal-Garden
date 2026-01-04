import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Plus, Flower2, Clock } from "lucide-react"
import { DailyCard } from "@/components/cards/DailyCard"
import { DeadlineCard } from "@/components/cards/DeadlineCard"
import { StreakWidget } from "@/components/StreakWidget"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    // 1. Fetch Daily Habits (Frequency = DAILY)
    const dailyHabits = await db.actionItem.findMany({
        where: {
            goal: { userId: session.user.id },
            frequency: 'DAILY'
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

    // 2. Fetch Upcoming Deadlines (Has deadline, not completed OR completed recently?)
    // "What big milestones are coming at me fast?" -> due in the next 7 days.
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingDeadlines = await db.actionItem.findMany({
        where: {
            goal: { userId: session.user.id },
            deadline: {
                not: null,
                lte: sevenDaysFromNow
            },
            is_completed: false // Only show pending for "coming at me fast"
        },
        include: {
            goal: {
                select: { title: true, color: true }
            }
        },
        orderBy: {
            deadline: 'asc'
        },
        take: 10
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

    // Calculate consecutive days
    const uniqueDates = Array.from(new Set(logs.map(l => l.date_logged.toISOString().split('T')[0])));
    let streak = 0;

    if (uniqueDates.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // If today is in list, we start counting from today.
        // If today is NOT in list, but yesterday IS, we start from yesterday (streak kept alive but not extended yet).
        // If neither, streak is 0.

        let currentDateStr = uniqueDates[0] === today ? today : (uniqueDates.includes(yesterday) ? yesterday : null);

        if (currentDateStr) {
            streak = 1;
            let checkDate = new Date(currentDateStr);

            // Iterate backwards
            while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                const prevDateStr = checkDate.toISOString().split('T')[0];
                if (uniqueDates.includes(prevDateStr)) {
                    streak++;
                } else {
                    break;
                }
            }
        }
    }


    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Daily Drivers</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Ready to conquer the day, {session.user.name}?</p>
                </div>
                <Link href="/goals/new" className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Goal
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Rhythm Section: Daily Habits */}
                    <section>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                            <span className="bg-green-100 text-green-700 p-1.5 rounded-lg dark:bg-green-900/30 dark:text-green-400">
                                <Flower2 className="h-5 w-5" />
                            </span>
                            Rhythm
                            <span className="text-sm font-normal text-muted-foreground ml-2">Daily habits to clear</span>
                        </h2>

                        {dailyHabits.length === 0 ? (
                            <div className="p-8 border border-dashed rounded-2xl text-center bg-zinc-50/50 dark:bg-zinc-900/30">
                                <p className="text-muted-foreground text-sm">No daily habits set up yet.</p>
                                <Link href="/goals" className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block">Check your goals</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {dailyHabits.map(item => (
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
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                                <Clock className="h-5 w-5" />
                            </span>
                            Deadline
                            <span className="text-sm font-normal text-muted-foreground ml-2">Big milestones coming up</span>
                        </h2>

                        {upcomingDeadlines.length === 0 ? (
                            <div className="p-8 border border-dashed rounded-2xl text-center bg-zinc-50/50 dark:bg-zinc-900/30">
                                <p className="text-muted-foreground text-sm">No upcoming deadlines.</p>
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

                    {/* Quick Stats or other widgets can go here */}
                    <div className="bg-card border rounded-3xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Focus Mode</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Need to focus? Switch to the dedicated focus view for your daily tasks.
                        </p>
                        <button className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-300">
                            Enter Focus Mode
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
