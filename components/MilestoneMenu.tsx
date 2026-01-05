import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Trash2, AlertCircle, Repeat, Calendar, ArrowRightLeft, X } from 'lucide-react';
import { deleteActionItem, convertActionItemType } from '@/app/actions/milestones';
import { ActionItem } from '@prisma/client';
import { clsx } from 'clsx';

interface MilestoneMenuProps {
    item: ActionItem;
    goalId: string;
    isOpen: boolean;
    onToggle: (open: boolean) => void;
}

export function MilestoneMenu({ item, goalId, isOpen, onToggle }: MilestoneMenuProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showConvertMenu, setShowConvertMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                if (isOpen) onToggle(false);
                setConfirmDelete(false);
                setShowConvertMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onToggle]);

    async function handleDelete() {
        setIsLoading(true);
        await deleteActionItem(item.id, goalId);
    }

    async function handleConvert(targetType: 'ONE_OFF' | 'RECURRING', frequency?: string) {
        setIsLoading(true);
        await convertActionItemType(item.id, goalId, targetType, frequency);
        onToggle(false);
        setIsLoading(false);
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle(!isOpen);
                    if (isOpen) {
                        setConfirmDelete(false);
                        setShowConvertMenu(false);
                    }
                }}
                className={clsx(
                    "transition-colors p-1 rounded-md hover:bg-muted",
                    isOpen ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground"
                )}
                title="Options"
            >
                <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-popover rounded-lg shadow-xl border border-border overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    {!confirmDelete && !showConvertMenu ? (
                        // Initial Menu State
                        <div className="py-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.type === 'ONE_OFF') {
                                        setShowConvertMenu(true);
                                    } else {
                                        handleConvert('ONE_OFF');
                                    }
                                }}

                                className="w-full text-left px-3 py-2.5 text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors border-b border-border"
                            >
                                <ArrowRightLeft className="h-3.5 w-3.5 text-zinc-400" />
                                {item.type === 'ONE_OFF' ? 'Convert to Rhythm' : 'Convert to Milestone'}
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete(true);
                                }}
                                className="w-full text-left px-3 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete Item
                            </button>
                        </div>
                    ) : showConvertMenu ? (
                        // Conversion Submenu
                        <div className="bg-muted/30">
                            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    {item.type === 'ONE_OFF' ? 'Choose Frequency' : 'Confirm Conversion'}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowConvertMenu(false); }}
                                    className="text-zinc-400 hover:text-zinc-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>

                            {item.type === 'ONE_OFF' && (
                                <div className="p-1 space-y-0.5">
                                    {['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'].map((freq) => (
                                        <button
                                            key={freq}
                                            onClick={(e) => { e.stopPropagation(); handleConvert('RECURRING', freq); }}
                                            className="w-full text-left px-3 py-2 rounded text-xs font-medium text-foreground hover:bg-background hover:text-primary hover:shadow-sm transition-all flex items-center gap-2"
                                            disabled={isLoading}
                                        >
                                            <Repeat className="h-3 w-3 text-zinc-400" />
                                            Make {freq.charAt(0) + freq.slice(1).toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Confirmation State (Inline)
                        <div className="p-2 bg-red-50/50 dark:bg-red-900/10">
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
            )
            }
        </div >
    );
}
