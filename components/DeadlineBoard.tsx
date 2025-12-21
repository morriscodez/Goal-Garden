'use client';

import { useState, useEffect } from 'react';
import { ActionItem } from '@prisma/client';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { DeadlineCard } from './cards/DeadlineCard';
import { SortableItem } from './SortableItem';
import { reorderActionItems } from '@/app/actions/reorder';
import { AlignJustify, CalendarClock } from 'lucide-react';
import { clsx } from 'clsx';
import { AddMilestoneForm } from './AddMilestoneForm';

export function DeadlineBoard({
    goalId,
    initialItems
}: {
    goalId: string;
    initialItems: ActionItem[]
}) {
    const [isDateSorted, setIsDateSorted] = useState(true);
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    // Derived sorted items for display
    const displayedItems = [...items].sort((a, b) => {
        if (isDateSorted) {
            // Sort by Date
            if (a.deadline && b.deadline) return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            if (a.deadline) return -1; // Deadlines first
            if (b.deadline) return 1;
            return 0;
        } else {
            // Sort by Order
            return a.sort_order - b.sort_order;
        }
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            // Calculate new items based on current items
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);

            const newArray = arrayMove(items, oldIndex, newIndex);

            // Optimistic update
            setItems(newArray);

            // Update sort_order for all affected items
            const updates = newArray.map((item, index) => ({
                id: item.id,
                sort_order: index
            }));

            // Server action side-effect outside state update
            await reorderActionItems(updates, goalId);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-end">
                <div className="bg-zinc-100 p-1 rounded-lg flex items-center">
                    <button
                        onClick={() => setIsDateSorted(true)}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all",
                            isDateSorted ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                        )}
                    >
                        <CalendarClock className="h-3.5 w-3.5" />
                        Sort by Date
                    </button>
                    <button
                        onClick={() => setIsDateSorted(false)}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all",
                            !isDateSorted ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                        )}
                    >
                        <AlignJustify className="h-3.5 w-3.5" />
                        Manual Order
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={displayedItems.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={isDateSorted} // Disable DnD when sorted by date
                >
                    <div className="space-y-3">
                        {displayedItems.map((item) => (
                            <SortableItem key={item.id} id={item.id} disabled={isDateSorted}>
                                <DeadlineCard item={item} />
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <AddMilestoneForm goalId={goalId} />
        </div>
    );
}
