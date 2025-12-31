'use client';

import { createGoal } from '@/app/actions/goals';
import { LayoutGrid, Save } from 'lucide-react';

export default function CreateGoalPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <nav className="text-sm text-muted-foreground mb-2">Goals &gt; Create Long-Term Goal</nav>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Define Your Vision</h1>
                <p className="text-muted-foreground mt-2">Set a clear destination. Long-term goals are the compass for your daily actions.</p>
            </div>

            <form action={createGoal} className="space-y-6 max-w-3xl border border-border rounded-2xl p-8 shadow-sm bg-card">

                {/* Goal Title */}
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-semibold text-foreground">Goal Title</label>
                    <input
                        name="title"
                        id="title"
                        type="text"
                        placeholder="e.g., Run a Marathon, Buy a House, Learn Japanese"
                        required
                        className="w-full rounded-xl border border-input bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all"
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
                            className="w-full rounded-xl border border-input bg-muted/50 px-4 py-3 text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
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
                        placeholder="Why is this goal important to you? How will achieving it change your life?"
                        className="w-full rounded-xl border border-input bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
                    />
                </div>

                {/* Divider */}
                <hr className="border-border" />

                <p className="text-sm text-muted-foreground italic">
                    You can add milestones after creating the goal.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button type="button" className="rounded-xl px-6 py-3 font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                        <Save className="h-4 w-4" />
                        Create Goal
                    </button>
                </div>

            </form>
        </div>
    );
}
