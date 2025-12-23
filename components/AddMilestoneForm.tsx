'use client';

import { useState } from 'react';
import { createMilestone } from '@/app/actions/milestones';
import { Plus, X, Calendar, Repeat } from 'lucide-react';
import { clsx } from 'clsx';

export function AddMilestoneForm({ goalId }: { goalId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('ONE_OFF'); // ONE_OFF | RECURRING

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
                <Plus className="h-4 w-4" />
                Add Milestone
            </button>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm mt-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-900">Add New Milestone</h3>
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form action={async (formData) => {
                await createMilestone(formData);
                setIsOpen(false);
            }} className="space-y-4">
                <input type="hidden" name="goalId" value={goalId} />
                <input type="hidden" name="type" value={type} />

                {/* Type Selection */}
                <div className="flex gap-2 p-1 bg-zinc-100 rounded-lg w-fit">
                    <button
                        type="button"
                        onClick={() => setType('ONE_OFF')}
                        className={clsx(
                            "px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all",
                            type === 'ONE_OFF' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                        )}
                    >
                        <Calendar className="h-4 w-4" />
                        One-Time Deadline
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('RECURRING')}
                        className={clsx(
                            "px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all",
                            type === 'RECURRING' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                        )}
                    >
                        <Repeat className="h-4 w-4" />
                        Recurring Habit
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-700">Title</label>
                    <input name="title" required placeholder="e.g. Write Chapter 1" className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>

                {type === 'ONE_OFF' ? (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-700">Deadline (Optional)</label>
                        <input name="deadline" type="date" className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-700">Frequency</label>
                        <select name="frequency" className="w-full rounded-lg border border-zinc-200 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800">
                        Create Milestone
                    </button>
                </div>
            </form>
        </div>
    );
}
