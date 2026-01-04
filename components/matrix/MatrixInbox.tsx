"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { DraggableActionItem } from "./DraggableActionItem";
import { ActionItem } from "@prisma/client";
import { Inbox } from "lucide-react";

interface MatrixInboxProps {
    items: (ActionItem & { goal?: { title: string; color: string | null } })[];
    className?: string;
}

export function MatrixInbox({ items, className }: MatrixInboxProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: "inbox",
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col h-full bg-muted/30 border-r border-border p-4 w-80 shrink-0 transition-colors",
                isOver && "bg-muted/50 ring-2 ring-inset ring-primary/20",
                className
            )}
        >
            <div className="flex items-center gap-2 mb-6">
                <Inbox className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-lg">Inbox</h3>
                <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full ml-auto">
                    {items.length}
                </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
                {items.map((item) => (
                    <DraggableActionItem key={item.id} item={item} />
                ))}
                {items.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-8 px-4">
                        <p className="mb-2">No unprioritized items</p>
                        <p className="text-xs text-muted-foreground/70">
                            Drag items back here to remove them from the matrix
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
