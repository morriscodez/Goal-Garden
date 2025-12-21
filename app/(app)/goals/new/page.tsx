'use client';

import { createGoal } from '@/app/actions/goals';
import { LayoutGrid, Save } from 'lucide-react';

export default function CreateGoalPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <nav className="text-sm text-zinc-500 mb-2">Goals &gt; Create Long-Term Goal</nav>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Define Your Vision</h1>
                <p className="text-zinc-600 mt-2">Set a clear destination. Long-term goals are the compass for your daily actions.</p>
            </div>

            <form action={createGoal} className="space-y-6 max-w-3xl border border-zinc-200 rounded-2xl p-8 shadow-sm bg-white">

                {/* Goal Title */}
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-semibold text-zinc-900">Goal Title</label>
                    <input
                        name="title"
                        id="title"
                        type="text"
                        placeholder="e.g., Run a Marathon, Buy a House, Learn Japanese"
                        required
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>

                {/* Target Deadline */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label htmlFor="deadline" className="block text-sm font-semibold text-zinc-900">Target Deadline</label>
                        <span className="text-xs text-zinc-400">Optional</span>
                    </div>
                    <div className="relative">
                        <input
                            name="deadline"
                            id="deadline"
                            type="date"
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label htmlFor="motivation" className="block text-sm font-semibold text-zinc-900">Motivation</label>
                        <span className="text-xs text-zinc-400">Optional</span>
                    </div>
                    <textarea
                        name="motivation"
                        id="motivation"
                        rows={4}
                        placeholder="Why is this goal important to you? How will achieving it change your life?"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                </div>

                {/* Divider */}
                <hr className="border-zinc-100" />

                <p className="text-sm text-zinc-500 italic">
                    You can add milestones after creating the goal.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button type="button" className="rounded-xl px-6 py-3 font-medium text-zinc-600 hover:bg-zinc-100">
                        Cancel
                    </button>
                    <button type="submit" className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                        <Save className="h-4 w-4" />
                        Create Goal
                    </button>
                </div>

            </form>
        </div>
    );
}
