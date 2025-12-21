'use client';

import { useState } from 'react';
import { createMilestone } from '@/app/actions/milestones';
import { X, Calendar, Repeat } from 'lucide-react';
import { clsx } from 'clsx';

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL';

export function CreateRhythmItemDialog({
    isOpen,
    onClose,
    goalId,
    frequency
}: {
    isOpen: boolean;
    onClose: () => void;
    goalId: string;
    frequency: Frequency;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-zinc-900">Add {frequency.toLowerCase()} habit</h3>
                        <p className="text-sm text-zinc-500">Build consistency step by step.</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 bg-zinc-100 rounded-full">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form action={async (formData) => {
                    await createMilestone(formData);
                    onClose();
                }} className="space-y-6">
                    <input type="hidden" name="goalId" value={goalId} />
                    <input type="hidden" name="type" value="RECURRING" />
                    <input type="hidden" name="frequency" value={frequency} />

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-zinc-900">What do you want to achieve?</label>
                        <input
                            name="title"
                            required
                            autoFocus
                            placeholder={`e.g. ${frequency === 'DAILY' ? 'Read 10 pages' : frequency === 'WEEKLY' ? 'Go for a long run' : 'Review finances'}`}
                            className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 transition-all transform hover:scale-105"
                        >
                            Create Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
