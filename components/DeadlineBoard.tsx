'use client';

import { useState, useEffect } from 'react';
import { ActionItem } from '@prisma/client';
import Link from 'next/link';
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
import { AlignJustify, CalendarClock, Calendar, ArrowUpDown, GripVertical, Filter, CheckCircle2, Circle, ListTodo, Grid2x2 } from 'lucide-react';
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
    const [filterMode, setFilterMode] = useState<'all' | 'incomplete'>('all');
    const [items, setItems] = useState(initialItems);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    // Derived sorted items for display
    const displayedItems = [...items]
        .filter(item => filterMode === 'all' || !item.is_completed)
        .sort((a, b) => {
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

    const toggleSort = () => {
        setIsDateSorted(prev => !prev);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Milestones
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isDateSorted
                            ? "Sorted by upcoming deadlines"
                            : "Drag and drop to prioritize your tasks"
                        }
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">

                    <button
                        onClick={() => setFilterMode(prev => prev === 'all' ? 'incomplete' : 'all')}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            filterMode === 'incomplete'
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        {filterMode === 'all' ? (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                All
                            </>
                        ) : (
                            <>
                                <Circle className="h-4 w-4" />
                                Incomplete
                            </>
                        )}
                    </button>
                    <div className="w-px h-4 bg-zinc-300 mx-1" />
                    <Link
                        href={`/goals/${goalId}/timeline`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background shadow-sm transition-all"
                    >
                        <ListTodo className="h-4 w-4" />
                        Timeline View
                    </Link>
                    <div className="w-px h-4 bg-zinc-300 mx-1" />
                    <Link
                        href={`/goals/${goalId}/matrix`}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background shadow-sm transition-all"
                    >
                        <Grid2x2 className="h-4 w-4" />
                        Matrix
                    </Link>
                    <div className="w-px h-4 bg-zinc-300 mx-1" />
                    <button
                        onClick={toggleSort}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            isDateSorted
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        {isDateSorted ? (
                            <>
                                <ArrowUpDown className="h-4 w-4" />
                                Date Sort
                            </>
                        ) : (
                            <>
                                <GripVertical className="h-4 w-4" />
                                Manual Order
                            </>
                        )}
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={displayedItems.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={isDateSorted} // Disable DnD when sorted by date
                >
                    <div className="space-y-3">
                        {displayedItems.map((item) => (
                            <SortableItem
                                key={item.id}
                                id={item.id}
                                disabled={isDateSorted}
                                zIndexOverride={activeMenuId === item.id ? 50 : undefined}
                            >
                                <DeadlineCard
                                    item={item}
                                    isMenuOpen={activeMenuId === item.id}
                                    onMenuToggle={(open) => setActiveMenuId(open ? item.id : null)}
                                />
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <AddMilestoneForm goalId={goalId} />
        </div>
    );
}
