'use client';

import { useState, useEffect } from 'react';
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
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { SortableGoalCard } from './SortableGoalCard';
import { reorderGoals } from '@/app/actions/reorder';
import { ArrowDownAZ, Clock, GripVertical, CalendarPlus, CalendarMinus } from 'lucide-react';
import { clsx } from 'clsx';

type SortMode = 'newest' | 'oldest' | 'alphabetical' | 'manual';

interface GoalData {
    id: string;
    title: string;
    motivation: string | null;
    progress: number;
    deadline: Date | null;
    mode: string;
    color?: string | null;
    createdAt: Date;
    sort_order: number;
}

interface GoalGridProps {
    initialGoals: GoalData[];
}

const SORT_OPTIONS: { value: SortMode; label: string; icon: React.ReactNode }[] = [
    { value: 'newest', label: 'Newest', icon: <CalendarPlus className="h-4 w-4" /> },
    { value: 'oldest', label: 'Oldest', icon: <CalendarMinus className="h-4 w-4" /> },
    { value: 'alphabetical', label: 'A → Z', icon: <ArrowDownAZ className="h-4 w-4" /> },
    { value: 'manual', label: 'Manual', icon: <GripVertical className="h-4 w-4" /> },
];

export function GoalGrid({ initialGoals }: GoalGridProps) {
    const [sortMode, setSortMode] = useState<SortMode>(() => {
        // Try to restore from localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('goalSortMode');
            if (saved && ['newest', 'oldest', 'alphabetical', 'manual'].includes(saved)) {
                return saved as SortMode;
            }
        }
        return 'newest';
    });
    const [goals, setGoals] = useState(initialGoals);

    useEffect(() => {
        setGoals(initialGoals);
    }, [initialGoals]);

    // Persist sort mode to localStorage
    useEffect(() => {
        localStorage.setItem('goalSortMode', sortMode);
    }, [sortMode]);

    // Sort goals based on current mode
    const sortedGoals = [...goals].sort((a, b) => {
        switch (sortMode) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'manual':
                return a.sort_order - b.sort_order;
            default:
                return 0;
        }
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = goals.findIndex((g) => g.id === active.id);
            const newIndex = goals.findIndex((g) => g.id === over?.id);

            const newArray = arrayMove(goals, oldIndex, newIndex);

            // Optimistic update
            setGoals(newArray);

            // Prepare updates with new sort_order
            const updates = newArray.map((goal, index) => ({
                id: goal.id,
                sort_order: index
            }));

            // Persist to server
            await reorderGoals(updates);
        }
    };

    const isManualMode = sortMode === 'manual';

    return (
        <div className="space-y-6">
            {/* Sort Toggle */}
            <div className="flex items-center justify-end">
                <div className="bg-card p-1 rounded-lg border border-border shadow-sm flex items-center gap-1">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSortMode(option.value)}
                            className={clsx(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                sortMode === option.value
                                    ? "bg-muted text-primary shadow-sm"
                                    : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                            )}
                        >
                            {option.icon}
                            <span className="hidden sm:inline">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Instruction text for manual mode */}
            {isManualMode && (
                <p className="text-sm text-muted-foreground text-center">
                    Drag cards to reorder them
                </p>
            )}

            {/* Grid with DnD */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sortedGoals.map(g => g.id)}
                    strategy={rectSortingStrategy}
                    disabled={!isManualMode}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedGoals.map((goal) => (
                            <SortableGoalCard
                                key={goal.id}
                                id={goal.id}
                                title={goal.title}
                                motivation={goal.motivation}
                                progress={goal.progress}
                                deadline={goal.deadline}
                                mode={goal.mode}
                                color={goal.color}
                                disabled={!isManualMode}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
