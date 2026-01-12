import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ArchivedGoalCard } from "@/components/ArchivedGoalCard";
import { ArchivedActionItemCard } from "@/components/ArchivedActionItemCard";
import { Archive } from "lucide-react";

export default async function ArchivePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch archived goals
    const archivedGoals = await db.goal.findMany({
        where: {
            userId: session.user.id,
            is_archived: true
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    // Fetch archived action items (from non-archived goals)
    const archivedActionItems = await db.actionItem.findMany({
        where: {
            goal: {
                userId: session.user.id,
                is_archived: false
            },
            is_archived: true
        },
        include: {
            goal: {
                select: { title: true, color: true }
            }
        },
        orderBy: {
            last_completed_at: 'desc'
        }
    });

    const hasArchivedContent = archivedGoals.length > 0 || archivedActionItems.length > 0;

    return (
        <div className="mx-auto max-w-5xl p-8 space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
                    <span className="bg-zinc-100 text-zinc-600 p-2 rounded-lg dark:bg-zinc-800 dark:text-zinc-400">
                        <Archive className="h-6 w-6" />
                    </span>
                    Archive
                </h1>
                <p className="text-muted-foreground mt-2">
                    Completed goals and action items you've archived. Restore them anytime.
                </p>
            </div>

            {!hasArchivedContent ? (
                <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                    <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No archived items</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        When you archive completed goals or action items, they'll appear here.
                        Archiving helps keep your active views focused and clutter-free.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Archived Goals Section */}
                    {archivedGoals.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">
                                Archived Goals ({archivedGoals.length})
                            </h2>
                            <div className="space-y-3">
                                {archivedGoals.map(goal => (
                                    <ArchivedGoalCard key={goal.id} goal={goal} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Archived Action Items Section */}
                    {archivedActionItems.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-4">
                                Archived Action Items ({archivedActionItems.length})
                            </h2>
                            <div className="space-y-3">
                                {archivedActionItems.map(item => (
                                    <ArchivedActionItemCard
                                        key={item.id}
                                        item={item}
                                        goalTitle={item.goal.title}
                                        goalColor={item.goal.color}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
