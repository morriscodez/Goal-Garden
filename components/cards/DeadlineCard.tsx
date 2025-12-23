import { ActionItem } from '@prisma/client';
import { updateActionItemDeadline, toggleMilestoneCompletion, updateActionItem } from '@/app/actions/milestones';
import { format, differenceInCalendarDays, startOfToday } from 'date-fns';
import { Clock, Sprout, Flower2 } from 'lucide-react';
import { useState, useTransition, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { MilestoneMenu } from '@/components/MilestoneMenu';

const FLOWER_COLORS = [
    "bg-rose-100 text-rose-500",
    "bg-purple-100 text-purple-500",
    "bg-sky-100 text-sky-500",
    "bg-amber-100 text-amber-500",
    "bg-pink-100 text-pink-500",
    "bg-indigo-100 text-indigo-500",
];

function getFlowerColor(id: string) {
    const charCode = id.charCodeAt(id.length - 1);
    const index = charCode % FLOWER_COLORS.length;
    return FLOWER_COLORS[index];
}

export function DeadlineCard({ item, isMenuOpen, onMenuToggle }: { item: ActionItem; isMenuOpen?: boolean; onMenuToggle?: (open: boolean) => void }) {
    const [isPending, startTransition] = useTransition();

    // Optimistic state for immediate UI feedback
    const [isCompleted, setIsCompleted] = useState(item.is_completed);

    // Inline Editing State
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(item.title);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Initialize with existing deadline or today's date string for input if null (optional)
    const [date, setDate] = useState(
        item.deadline ? format(item.deadline, 'yyyy-MM-dd') : ''
    );

    const flowerColor = getFlowerColor(item.id);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    const handleToggle = () => {
        const newState = !isCompleted;
        setIsCompleted(newState); // Optimistic update

        startTransition(async () => {
            await toggleMilestoneCompletion(item.id, newState);
        });
    };

    const handleTitleSave = async () => {
        setIsEditingTitle(false);
        if (title.trim() === item.title) return; // No change

        // Optimistic update handled by local state 'title'
        startTransition(async () => {
            await updateActionItem(item.id, item.goalId, { title: title });
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            setTitle(item.title); // Revert
            setIsEditingTitle(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDateStr = e.target.value;
        setDate(newDateStr);

        startTransition(async () => {
            // Create date object and adjust for timezone offset to ensure "noon" time to avoid date shifting
            const newDate = newDateStr ? new Date(newDateStr + 'T12:00:00') : null;
            await updateActionItemDeadline(item.id, newDate);
        });
    };

    return (
        <div className={clsx(
            "p-5 rounded-2xl border shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300",
            isCompleted
                ? "bg-green-50/30 border-green-100"
                : "bg-white border-zinc-200"
        )}>
            <div className="flex items-center gap-4 flex-1">
                {/* Garden Themed Interactive Icon */}
                <button
                    onClick={handleToggle}
                    className={clsx(
                        "h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-500 ease-out group/icon relative overflow-hidden",
                        isCompleted
                            ? clsx(flowerColor, "scale-110 rotate-12")
                            : "bg-zinc-100 text-zinc-400 hover:bg-green-100 hover:text-green-600 hover:scale-105"
                    )}
                >
                    {isCompleted ? (
                        <Flower2 className="h-6 w-6 animate-in zoom-in spin-in-12 duration-300" />
                    ) : (
                        <Sprout className="h-6 w-6 transition-transform group-hover/icon:-translate-y-0.5" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleSave}
                            onKeyDown={handleKeyDown}
                            className="font-bold text-zinc-900 text-base w-full bg-transparent border-b-2 border-blue-500 outline-none p-0 focus:ring-0"
                        />
                    ) : (
                        <h4
                            onDoubleClick={() => setIsEditingTitle(true)}
                            className={clsx(
                                "font-bold text-zinc-900 text-base transition-colors truncate cursor-text",
                                isCompleted && "text-zinc-500 line-through decoration-zinc-300"
                            )}
                            title="Double-click to edit"
                        >
                            {title}
                        </h4>
                    )}

                    {!item.deadline && (
                        <p className="text-xs text-zinc-400 font-medium mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            No deadline set
                        </p>
                    )}

                    {item.deadline && (() => {
                        const today = startOfToday();
                        const deadlineDate = new Date(item.deadline);
                        const diffDays = differenceInCalendarDays(deadlineDate, today);

                        let message = "";
                        let colorClass = "text-zinc-500";

                        if (isCompleted) {
                            message = "Completed";
                            colorClass = "text-green-600 font-bold";
                        } else if (diffDays < 0) {
                            message = "Deadline passed - set a new deadline?";
                            colorClass = "text-red-500 font-medium";
                        } else if (diffDays === 0) {
                            message = "Due today";
                            colorClass = "text-blue-600 font-bold";
                        } else if (diffDays === 1) {
                            message = "Due tomorrow";
                            colorClass = "text-blue-600 font-semibold";
                        } else if (diffDays <= 14) {
                            message = `Due in ${diffDays} days`;
                            colorClass = "text-orange-600 font-medium";
                        } else {
                            message = `Due ${format(item.deadline!, 'MMMM do, yyyy')}`;
                            colorClass = "text-zinc-500";
                        }

                        return (
                            <p className={clsx("text-xs mt-0.5 transition-colors", colorClass)}>
                                {message}
                            </p>
                        );
                    })()}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Date Picker Input */}
                <div className={clsx(
                    "relative transition-opacity duration-300",
                    isCompleted && "opacity-50 pointer-events-none grayscale"
                )}>
                    <input
                        type="date"
                        value={date}
                        onClick={(e) => e.stopPropagation()}
                        onChange={handleChange}
                        className={clsx(
                            "pl-9 pr-3 py-2 rounded-xl border bg-zinc-50 text-sm font-medium outline-none focus:ring-2 transition-all cursor-pointer w-36",
                            date
                                ? "border-zinc-200 text-zinc-900"
                                : "border-zinc-200 text-zinc-400 focus:border-blue-500 focus:ring-blue-100"
                        )}
                    />
                    <Clock className={clsx(
                        "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none",
                        date ? "text-zinc-400" : "text-zinc-400"
                    )} />
                </div>

                {/* Milestone Menu */}
                <MilestoneMenu
                    item={item}
                    goalId={item.goalId}
                    isOpen={!!isMenuOpen}
                    onToggle={(open) => onMenuToggle?.(open)}
                />
            </div>
        </div>
    );
}
