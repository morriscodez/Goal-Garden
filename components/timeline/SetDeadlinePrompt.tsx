'use client';

import { Calendar } from "lucide-react";
import { useState, useTransition } from "react";
import { updateGoalDeadline } from "@/app/actions/goals";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

export function SetDeadlinePrompt({ goalId }: { goalId: string }) {
    const [date, setDate] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return;

        startTransition(async () => {
            // Append time to ensure consistent day interpretation
            const deadlineDate = new Date(date + 'T12:00:00');
            await updateGoalDeadline(goalId, deadlineDate);
            router.refresh();
        });
    };

    return (
        <div className="border border-dashed border-border rounded-3xl p-12 text-center bg-card">
            <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Plant Your Timeline</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                To visualize your milestones on a timeline, this goal needs a final deadline. Sort of like knowing when the harvest will be!
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-4 py-2 border border-input rounded-xl bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className={clsx(
                        "px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity",
                        isPending && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {isPending ? "Setting..." : "Set Deadline"}
                </button>
            </form>
        </div>
    );
}
