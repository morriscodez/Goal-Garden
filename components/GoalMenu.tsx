'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Edit, AlertCircle } from 'lucide-react';
import { deleteGoal } from '@/app/actions/goals';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

interface GoalMenuProps {
    goalId: string;
}

export function GoalMenu({ goalId }: GoalMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                if (isOpen) setIsOpen(false);
                setConfirmDelete(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    async function handleDelete() {
        setIsLoading(true);
        await deleteGoal(goalId);
        // The card will likely disappear due to revalidatePath in the action, 
        // but if we are on the detail page we might want to redirect.
        // For the /goals page, revalidation update the list.
        setIsLoading(false);
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent navigating to goal details if card is a link
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                    if (isOpen) setConfirmDelete(false);
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
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-lg shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right"
                    onClick={(e) => e.preventDefault()} // Stop link propagation from menu clicks
                >
                    {!confirmDelete ? (
                        // Initial Menu State
                        <div className="py-1">
                            <Link
                                href={`/goals/${goalId}/edit`}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Edit className="h-4 w-4 text-zinc-400" />
                                Edit Goal
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete(true);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Goal
                            </button>
                        </div>
                    ) : (
                        // Confirmation State
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
                                        setConfirmDelete(false);
                                    }}
                                    className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-1.5 rounded text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
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
