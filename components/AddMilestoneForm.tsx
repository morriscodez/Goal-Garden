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
                className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg transition-colors"
            >
                <Plus className="h-4 w-4" />
                Add Milestone
            </button>
        );
    }

    return (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm mt-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Add New Milestone</h3>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
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
                <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                    <button
                        type="button"
                        onClick={() => setType('ONE_OFF')}
                        className={clsx(
                            "px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all",
                            type === 'ONE_OFF'
                                ? "bg-background text-blue-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
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
                            type === 'RECURRING'
                                ? "bg-background text-blue-600 shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Repeat className="h-4 w-4" />
                        Recurring Habit
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Title</label>
                    <input
                        name="title"
                        required
                        placeholder="e.g. Write Chapter 1"
                        className="w-full rounded-lg border border-input px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-muted text-foreground placeholder:text-muted-foreground"
                    />
                </div>

                {type === 'ONE_OFF' ? (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Deadline (Optional)</label>
                        <input
                            name="deadline"
                            type="date"
                            className="w-full rounded-lg border border-input px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-muted text-foreground dark:color-scheme-dark"
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Frequency</label>
                        <select
                            name="frequency"
                            className="w-full rounded-lg border border-input px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-muted text-foreground"
                        >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                        </select>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Create Milestone
                    </button>
                </div>
            </form>
        </div>
    );
}
