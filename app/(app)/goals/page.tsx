import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { GoalReviewCard } from "@/components/GoalReviewCard";

export default async function GoalsReviewPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const goals = await db.goal.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            actionItems: true
        },
        orderBy: {
            deadline: 'asc' // Show soonest deadlines first
        }
    });

    // Helper to calculate progress
    const calculateProgress = (goal: any) => {
        const items = goal.actionItems || [];
        if (items.length === 0) return 0;

        const completed = items.filter((item: any) => item.is_completed).length;
        return Math.round((completed / items.length) * 100);
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Current Long-Term Goals</h1>
                        <p className="text-zinc-500 mt-1">Track your progress towards your biggest achievements.</p>
                    </div>
                    {/* Add New Goal Button */}
                    <a
                        href="/goals/new"
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        + Add New Goal
                    </a>
                </div>

                {/* Filters/Tabs (Placeholder for now, just "All Goals") */}
                <div className="flex gap-2 pb-4 overflow-x-auto">
                    <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm">
                        All Goals
                    </button>
                    {/* Future: Categories */}
                </div>

                {/* Goals Grid */}
                {goals.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
                        <h3 className="text-lg font-medium text-zinc-900">No goals found</h3>
                        <p className="text-zinc-500 mt-2 mb-6">You haven't set any long-term goals yet.</p>
                        <a href="/goals/new" className="text-blue-600 font-semibold hover:underline">Create your first goal &rarr;</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal, index) => (
                            <GoalReviewCard
                                key={goal.id}
                                id={goal.id}
                                title={goal.title}
                                motivation={goal.motivation}
                                progress={calculateProgress(goal)}
                                deadline={goal.deadline}
                                mode={goal.mode}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
