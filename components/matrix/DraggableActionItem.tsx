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
                "p-3 rounded-lg shadow-sm border bg-card text-card-foreground cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
                isDragging && "opacity-50",
                className
            )}
        >
            <div className="flex items-center justify-between mb-1">
                {item.goal && theme && (
                    <span
                        className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", theme.chip)}
                    >
                        {item.goal.title}
                    </span>
                )}
            </div>
            <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
            {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                </p>
            )}
        </div>
    );
}
