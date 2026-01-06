"use client";

import { getGoalTheme } from "@/lib/goal-themes";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ActionItem } from "@prisma/client";

interface DraggableActionItemProps {
    item: ActionItem & { goal?: { title: string; color: string | null } };
    className?: string;
}

import { Sprout, Flame, Star } from "lucide-react";

// ... existing imports ...

export function DraggableActionItem({ item, className }: DraggableActionItemProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
        data: { item },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const theme = item.goal ? getGoalTheme(item.goalId, item.goal.color) : null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "p-4 rounded-2xl shadow-sm border border-border bg-card text-card-foreground cursor-grab active:cursor-grabbing hover:shadow-md transition-all flex items-start gap-3",
                isDragging && "opacity-50",
                className
            )}
        >
            <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0 text-muted-foreground mt-0.5">
                <Sprout className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        {item.goal && theme && (
                            <span
                                className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", theme.chip)}
                            >
                                {item.goal.title}
                            </span>
                        )}
                        <div className="flex items-center gap-1">
                            {item.is_urgent && (
                                <span title="Urgent">
                                    <Flame className="h-3 w-3 text-red-500 fill-red-500/20" aria-label="Urgent" />
                                </span>
                            )}
                            {item.is_important && (
                                <span title="Important">
                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500/20" aria-label="Important" />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 leading-tight">{item.title}</h4>
                {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {item.description}
                    </p>
                )}
            </div>
        </div>
    );
}
