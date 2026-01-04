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
    red: "bg-red-50/50 border-red-100 hover:bg-red-50",
    orange: "bg-orange-50/50 border-orange-100 hover:bg-orange-50",
    blue: "bg-blue-50/50 border-blue-100 hover:bg-blue-50",
    green: "bg-green-50/50 border-green-100 hover:bg-green-50",
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
