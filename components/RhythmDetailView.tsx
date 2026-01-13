'use client';

import { useState, useEffect } from 'react';
import { ActionItem } from '@prisma/client';
import { MatchRhythmBoard } from './RhythmBoard';
import { RhythmStatus } from './RhythmStatus';
import { ModeToggle } from './ModeToggle';
import { Eye, Check } from 'lucide-react';
import { clsx } from 'clsx';

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';

interface RhythmDetailViewProps {
    goalId: string;
    daily: ActionItem[];
    weekly: ActionItem[];
    monthly: ActionItem[];
    quarterly: ActionItem[];
    lastActivityDate: Date | null;
}

export function RhythmDetailView({
    goalId,
    daily, weekly, monthly, quarterly,
    lastActivityDate
}: RhythmDetailViewProps) {
    const [visibleColumns, setVisibleColumns] = useState<Frequency[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            setVisibleColumns(['DAILY']);
        } else {
            setVisibleColumns(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']);
        }
    }, []);

    const toggleColumn = (freq: Frequency) => {
        setVisibleColumns([freq]);
        setIsMenuOpen(false);
    };

    const toggleAll = () => {
        setVisibleColumns(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']);
        setIsMenuOpen(false);
    };

    if (!mounted) {
        return null; // or loading skeleton
    }

    const isAllSelected = visibleColumns.length === 4;

    return (
        <div className="space-y-8">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <ModeToggle goalId={goalId} />

                    {/* View Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors shadow-sm"
                        >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>View</span>
                        </button>

                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMenuOpen(false)}
                                />
                                <div className="absolute top-full left-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                                    <button
                                        onClick={toggleAll}
                                        className={clsx(
                                            "w-full text-left px-3 py-2 text-sm font-medium flex items-center justify-between gap-2 transition-colors",
                                            isAllSelected ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        All
                                        {isAllSelected && <Check className="h-4 w-4 text-primary" />}
                                    </button>
                                    <div className="h-px bg-border my-1" />
                                    {(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'] as Frequency[]).map(freq => {
                                        const isSelected = !isAllSelected && visibleColumns.includes(freq) && visibleColumns.length === 1;
                                        return (
                                            <button
                                                key={freq}
                                                onClick={() => toggleColumn(freq)}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 text-sm font-medium flex items-center justify-between gap-2 transition-colors",
                                                    isSelected ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                )}
                                            >
                                                <span className="capitalize">{freq.toLowerCase()}</span>
                                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <RhythmStatus lastActivityDate={lastActivityDate} />
            </div>

            <MatchRhythmBoard
                goalId={goalId}
                daily={daily}
                weekly={weekly}
                monthly={monthly}
                quarterly={quarterly}
                visibleColumns={visibleColumns}
            />
        </div>
    );
}
