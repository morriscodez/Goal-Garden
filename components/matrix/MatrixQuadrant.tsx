"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { DraggableActionItem } from "./DraggableActionItem";
import { ActionItem } from "@prisma/client";

interface MatrixQuadrantProps {
    id: string; // "urgent-important", "urgent-not-important", etc.
    title: string;
    description?: string;
    items: (ActionItem & { goal?: { title: string; color: string | null } })[];
    className?: string;
    variant?: "red" | "orange" | "blue" | "green";
}

const variantStyles = {
    red: "bg-background border-red-200",
    orange: "bg-background border-orange-200",
    blue: "bg-background border-blue-200",
    green: "bg-background border-green-200",
};

export function MatrixQuadrant({
    id,
    title,
    description,
    items,
    className,
    variant = "blue",
}: MatrixQuadrantProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col h-full rounded-xl border-2 border-dashed p-4 transition-colors",
                variantStyles[variant],
                isOver && "bg-opacity-100 border-solid ring-2 ring-offset-2",
                className
            )}
        >
            <div className="mb-4">
                <h3 className="font-semibold text-lg">{title}</h3>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
                {items.map((item) => (
                    <DraggableActionItem key={item.id} item={item} />
                ))}
                {items.length === 0 && (
                    <div className="h-full flex items-center justify-center text-muted-foreground/40 text-sm italic py-8">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
}
