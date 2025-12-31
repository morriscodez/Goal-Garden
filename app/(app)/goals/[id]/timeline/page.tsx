import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { TimelineView } from "@/components/timeline/TimelineView";
import { SetDeadlinePrompt } from "@/components/timeline/SetDeadlinePrompt";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TimelinePage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user?.id) return redirect("/login");

    const { id } = await params;

    // Fetch goal with actionItems for timeline
    const goal = await db.goal.findUnique({
        where: {
            id,
            userId: session.user.id
        },
        include: {
            actionItems: true
        }
    });

    if (!goal) return notFound();
    if (goal.userId !== session.user.id) return redirect("/goals");

    return (
        <div className="min-h-screen bg-background p-6 sm:p-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href={`/goals/${id}?mode=DEADLINE`}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Goal Details
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">{goal.title}</h1>
                    <p className="text-muted-foreground mt-1">Timeline to completion</p>
                </div>

                {!goal.deadline ? (
                    <SetDeadlinePrompt goalId={goal.id} />
                ) : (
                    <TimelineView goal={goal} />
                )}
            </div>
        </div>
    );
}
