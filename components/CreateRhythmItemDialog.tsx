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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-border">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-card-foreground">Add {frequency.toLowerCase()} habit</h3>
                        <p className="text-sm text-muted-foreground">Build consistency step by step.</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 bg-muted rounded-full transition-colors">
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
                        <label className="block text-sm font-semibold text-foreground">What do you want to achieve?</label>
                        <input
                            name="title"
                            required
                            autoFocus
                            placeholder={`e.g. ${frequency === 'DAILY' ? 'Read 10 pages' : frequency === 'WEEKLY' ? 'Go for a long run' : 'Review finances'}`}
                            className="w-full rounded-xl border border-input px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium bg-muted text-foreground placeholder:text-muted-foreground"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:opacity-90 shadow-lg shadow-zinc-900/20 transition-all transform hover:scale-105"
                        >
                            Create Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
