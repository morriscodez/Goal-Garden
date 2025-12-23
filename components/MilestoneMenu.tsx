import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { deleteActionItem } from '@/app/actions/milestones';
import { ActionItem } from '@prisma/client';
import { clsx } from 'clsx';

interface MilestoneMenuProps {
    item: ActionItem;
    goalId: string;
    isOpen: boolean;
    onToggle: (open: boolean) => void;
}

export function MilestoneMenu({ item, goalId, isOpen, onToggle }: MilestoneMenuProps) {
    // Internal state only for sub-interactions
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                if (isOpen) onToggle(false);
                setConfirmDelete(false); // Reset state
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onToggle]);

    async function handleDelete() {
        setIsLoading(true);
        await deleteActionItem(item.id, goalId);
        // No need to set loading false or close menu as component will likely unmount or re-render
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle(!isOpen);
                    if (isOpen) setConfirmDelete(false); // Reset if toggling closed
                }}
                className={clsx(
                    "transition-colors p-1 rounded-md hover:bg-zinc-100",
                    isOpen ? "text-zinc-600 bg-zinc-100" : "text-zinc-400 hover:text-zinc-600"
                )}
                title="Options"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl shadow-zinc-200 border border-zinc-100 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    {!confirmDelete ? (
                        // Initial Menu State
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(true);
                            }}
                            className="w-full text-left px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Milestone
                        </button>
                    ) : (
                        // Confirmation State (Inline)
                        <div className="p-2 bg-red-50/50">
                            <div className="flex items-center gap-2 px-1 mb-2 text-red-700">
                                <AlertCircle className="h-3 w-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Are you sure?</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConfirmDelete(false);
                                    }}
                                    className="flex-1 bg-white border border-red-100 text-zinc-600 px-2 py-1.5 rounded text-xs font-medium hover:bg-zinc-50 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                    className="flex-1 bg-red-600 text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
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
