"use client";

import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import { useState } from "react";
import { ActionItem } from "@prisma/client";
import { updateItemPriority } from "@/app/actions/matrix";
import { MatrixInbox } from "./MatrixInbox";
import { EisenhowerMatrix } from "./EisenhowerMatrix";
import { DraggableActionItem } from "./DraggableActionItem";
import { createPortal } from "react-dom";

interface MatrixContainerProps {
    initialItems: (ActionItem & { goal?: { title: string; color: string | null } })[];
    goalId?: string; // Optional: if provided, we might limit queries or context
}

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
};

export function MatrixContainer({ initialItems }: MatrixContainerProps) {
    const [items, setItems] = useState(initialItems);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const itemId = active.id as string;
        const containerId = over.id as string;

        // Determine new state based on containerId
        let is_urgent: boolean | null = null;
        let is_important: boolean | null = null;

        switch (containerId) {
            case "ur_im":
                is_urgent = true;
                is_important = true;
                break;
            case "ur_not_im":
                is_urgent = true;
                is_important = false;
                break;
            case "not_ur_im":
                is_urgent = false;
                is_important = true;
                break;
            case "not_ur_not_im":
                is_urgent = false;
                is_important = false;
                break;
            case "inbox":
                is_urgent = null;
                is_important = null;
                break;
            default:
                // Dropped on something else (maybe self or inside list), ignore or handle if it's a specific drop zone
                // For now, if over.id isn't one of our known containers, we assume no change in "quadrant"
                // But drag-and-drop usually drops ON the droppable container. 
                // If sorting implementation is added later, we check data.sortable
                return;
        }

        // Optimistic update
        const oldItems = [...items];
        const updatedItems = items.map((item) => {
            if (item.id === itemId) {
                return { ...item, is_urgent, is_important };
            }
            return item;
        });

        setItems(updatedItems);

        // Persist to server
        const result = await updateItemPriority(itemId, { is_urgent, is_important });

        if (result.error) {
            // Revert on error
            console.error(result.error);
            setItems(oldItems);
        }
    }

    // Filter items into Inbox (unprioritized) vs Implemented
    // Logic: Inbox items are where EITHER is null (based on user request: "When the values for the two fields are null, then the action item should be in the inbox")
    // Actually, user said "When the values for the two fields are null, then the action item should be in the inbox."
    // And "Users should be able to move an item back into that inbox if they change their mind."
    // So strictly, Inbox = (urgent == null || important == null) OR specifically (urgent == null AND important == null)?
    // "users can sort their action items ... into a quadrant"
    // "The value should begin as null"
    // I will treat "Inbox" as the state where it hasn't been assigned a specific quadrant.
    // So if EITHER is null, it's not in a quadrant.
    const inboxItems = items.filter(
        (i) => i.is_urgent === null || i.is_important === null
    );

    // Matrix items are those where BOTH are boolean
    const matrixItems = items.filter(
        (i) => i.is_urgent !== null && i.is_important !== null
    );

    const activeItem = items.find((i) => i.id === activeId);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[calc(100vh-4rem)] max-h-[900px]">
                <MatrixInbox items={inboxItems} />
                <div className="flex-1 overflow-hidden bg-background">
                    <EisenhowerMatrix items={matrixItems} />
                </div>
            </div>

            {createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeItem ? (
                        <div className="w-[300px]">
                            <DraggableActionItem item={activeItem} />
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
