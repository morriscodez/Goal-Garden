'use client';

import { updateGoal } from '@/app/actions/goals';
import { Calendar } from 'lucide-react';
import { Goal } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';

interface EditGoalFormProps {
    goal: Goal;
}

export function EditGoalForm({ goal }: EditGoalFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <form
            action={async (formData) => {
                setIsLoading(true);
                const title = formData.get('title') as string;
                const motivation = formData.get('motivation') as string;
                const deadlineStr = formData.get('deadline') as string;
                const deadline = deadlineStr ? new Date(deadlineStr) : undefined;

                await updateGoal(goal.id, { title, motivation, deadline });
                setIsLoading(false);
                router.push('/goals');
            }}
            className="space-y-6 max-w-3xl border border-border rounded-2xl p-8 shadow-sm bg-card"
        >

            {/* Goal Title */}
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-foreground">Goal Title</label>
                <input
                    name="title"
                    id="title"
                    type="text"
                    defaultValue={goal.title}
                    placeholder="e.g., Run a Marathon, Buy a House, Learn Japanese"
                    required
                    className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
            </div>

            {/* Target Deadline */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label htmlFor="deadline" className="block text-sm font-semibold text-foreground">Target Deadline</label>
                    <span className="text-xs text-muted-foreground">Optional</span>
                </div>
                <div className="relative">
                    <input
                        name="deadline"
                        id="deadline"
                        type="date"
                        defaultValue={goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''}
                        className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-foreground outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                </div>
            </div>

            {/* Motivation */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label htmlFor="motivation" className="block text-sm font-semibold text-foreground">Motivation</label>
                    <span className="text-xs text-muted-foreground">Optional</span>
                </div>
                <textarea
                    name="motivation"
                    id="motivation"
                    rows={4}
                    defaultValue={goal.motivation || ''}
                    placeholder="Why is this goal important to you? How will achieving it change your life?"
                    className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Link
                    href="/goals"
                    className="rounded-xl px-6 py-3 font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

        </form>
    );
}
