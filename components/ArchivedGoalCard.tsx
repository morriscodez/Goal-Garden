'use client';

import { ArchiveRestore } from 'lucide-react';
import { unarchiveGoal } from '@/app/actions/goals';
import { useState } from 'react';

interface ArchivedGoalCardProps {
    goal: {
        id: string;
        title: string;
        color: string | null;
    };
}

export function ArchivedGoalCard({ goal }: ArchivedGoalCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleUnarchive() {
        setIsLoading(true);
        await unarchiveGoal(goal.id);
        setIsLoading(false);
    }

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {goal.color && (
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: goal.color }}
                    />
                )}
                <span className="font-medium text-foreground">{goal.title}</span>
            </div>
            <button
                onClick={handleUnarchive}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
                <ArchiveRestore className="h-4 w-4" />
                {isLoading ? '...' : 'Restore'}
            </button>
        </div>
    );
}
