'use client';

import { ArchiveRestore } from 'lucide-react';
import { unarchiveActionItem } from '@/app/actions/milestones';
import { useState } from 'react';

interface ArchivedActionItemCardProps {
    item: {
        id: string;
        title: string;
        goalId: string;
        type: string;
        frequency: string | null;
    };
    goalTitle: string;
    goalColor: string | null;
}

export function ArchivedActionItemCard({ item, goalTitle, goalColor }: ArchivedActionItemCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleUnarchive() {
        setIsLoading(true);
        await unarchiveActionItem(item.id, item.goalId);
        setIsLoading(false);
    }

    const typeLabel = item.type === 'RECURRING'
        ? `${item.frequency?.charAt(0)}${item.frequency?.slice(1).toLowerCase()} Habit`
        : 'Milestone';

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {goalColor && (
                    <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: goalColor }}
                    />
                )}
                <div>
                    <span className="font-medium text-foreground">{item.title}</span>
                    <p className="text-xs text-muted-foreground">
                        {goalTitle} • {typeLabel}
                    </p>
                </div>
            </div>
            <button
                onClick={handleUnarchive}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors shrink-0"
            >
                <ArchiveRestore className="h-4 w-4" />
                {isLoading ? '...' : 'Restore'}
            </button>
        </div>
    );
}
