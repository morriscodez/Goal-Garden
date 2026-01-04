'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Edit, AlertCircle, Palette, ChevronRight, ArrowLeft } from 'lucide-react';
import { deleteGoal, updateGoalColor } from '@/app/actions/goals';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import { THEMES } from '@/lib/goal-themes';

interface GoalMenuProps {
    goalId: string;
}

export function GoalMenu({ goalId }: GoalMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'main' | 'colors' | 'delete'>('main');
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                if (isOpen) {
                    setIsOpen(false);
                    setView('main'); // Reset view on close
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    async function handleDelete() {
        setIsLoading(true);
        await deleteGoal(goalId);
        setIsLoading(false);
        setIsOpen(false);
    }

    async function handleColorSelect(colorName: string) {
        setIsLoading(true);
        await updateGoalColor(goalId, colorName);
        setIsLoading(false);
        setIsOpen(false);
        setView('main');
    }

    const resetMenu = () => {
        setView('main');
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                    if (!isOpen) setView('main');
                }}
                className={clsx(
                    "transition-colors p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-black/50 backdrop-blur-sm",
                    isOpen ? "text-zinc-900 bg-white/50" : "text-zinc-500 hover:text-zinc-700"
                )}
                title="Options"
            >
                <MoreVertical className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-64 bg-popover rounded-lg shadow-xl ring-1 ring-border overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right"
                    onClick={(e) => e.preventDefault()}
                >
                    {view === 'main' && (
                        <div className="py-1">
                            <Link
                                href={`/goals/${goalId}/edit`}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Edit className="h-4 w-4 text-zinc-400" />
                                Edit Goal
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setView('colors');
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted flex items-center justify-between gap-2 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-zinc-400" />
                                    Change Color
                                </div>
                                <ChevronRight className="h-4 w-4 text-zinc-400" />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setView('delete');
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Goal
                            </button>
                        </div>
                    )}

                    {view === 'colors' && (
                        <div className="p-2">
                            <div className="flex items-center gap-2 mb-2 px-2 py-1">
                                <button onClick={resetMenu} className="hover:bg-muted p-1 rounded-md -ml-1">
                                    <ArrowLeft className="h-4 w-4 text-zinc-500" />
                                </button>
                                <span className="text-sm font-semibold text-foreground">Select Color</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 p-1 max-h-48 overflow-y-auto">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleColorSelect(theme.name);
                                        }}
                                        className={clsx(
                                            "h-8 rounded-md border shadow-sm transition-transform hover:scale-105 hover:ring-2 ring-primary ring-offset-1",
                                            theme.bgHeader
                                        )}
                                        title={theme.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'delete' && (
                        <div className="p-3 bg-red-50/50 dark:bg-red-900/10">
                            <div className="flex items-start gap-2 mb-3">
                                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-0.5">Delete this goal?</p>
                                    <p className="text-[10px] text-red-600/80 dark:text-red-400/70 leading-tight">
                                        This will permanently delete the goal and all associated milestones.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setView('main');
                                    }}
                                    className="flex-1 bg-background border border-border text-foreground px-2 py-1.5 rounded text-xs font-medium hover:bg-muted transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                    className="flex-1 bg-red-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                    disabled={isLoading}
                                >
                                    {isLoading ? '...' : (
                                        <>
                                            <Trash2 className="h-3 w-3" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
