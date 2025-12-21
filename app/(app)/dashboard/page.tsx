import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/login")
    }

    const goals = await db.goal.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            deadline: 'asc'
        },
        include: {
            actionItems: true
        }
    })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-zinc-500 mt-1">Welcome back, {session.user.name}</p>
                </div>
                <Link href="/goals/new" className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Goal
                </Link>
            </div>

            {goals.length === 0 ? (
                <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                    <p className="text-zinc-500">You don't have any goals yet.</p>
                    <Link href="/goals/new" className="text-green-600 font-bold hover:underline mt-2 inline-block">
                        Create your first goal &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => (
                        <Link key={goal.id} href={`/goals/${goal.id}`} className="group block bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                            <h3 className="text-xl font-bold text-zinc-900 group-hover:text-green-700 transition-colors">{goal.title}</h3>
                            {goal.motivation && <p className="text-zinc-500 text-sm mt-2 line-clamp-2">{goal.motivation}</p>}
                            <div className="mt-6 flex items-center justify-between">
                                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{goal.actionItems.length} Milestones</span>
                                <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
