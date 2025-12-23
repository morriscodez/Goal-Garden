'use client';

import { updateGoal } from '@/app/actions/goals';
import { Save, Calendar } from 'lucide-react';
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
            className="space-y-6 max-w-3xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm bg-white dark:bg-zinc-900"
        >

            {/* Goal Title */}
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">Goal Title</label>
                <input
                    name="title"
                    id="title"
                    type="text"
                    defaultValue={goal.title}
                    placeholder="e.g., Run a Marathon, Buy a House, Learn Japanese"
                    required
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
            </div>

            {/* Target Deadline */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label htmlFor="deadline" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">Target Deadline</label>
                    <span className="text-xs text-zinc-400">Optional</span>
                </div>
                <div className="relative">
                    <input
                        name="deadline"
                        id="deadline"
                        type="date"
                        defaultValue={goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Motivation */}
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label htmlFor="motivation" className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">Motivation</label>
                    <span className="text-xs text-zinc-400">Optional</span>
                </div>
                <textarea
                    name="motivation"
                    id="motivation"
                    rows={4}
                    defaultValue={goal.motivation || ''}
                    placeholder="Why is this goal important to you? How will achieving it change your life?"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                    href="/goals"
                    className="rounded-xl px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

        </form>
    );
}
