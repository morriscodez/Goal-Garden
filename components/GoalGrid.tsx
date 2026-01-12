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
    rectSortingStrategy,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableGoalCard } from './SortableGoalCard';
import { SortableGoalListItem } from './SortableGoalListItem';
import { reorderGoals } from '@/app/actions/reorder';
import { ArrowDownAZ, GripVertical, CalendarPlus, CalendarMinus, LayoutGrid, List, Focus } from 'lucide-react';
import { clsx } from 'clsx';

type SortMode = 'newest' | 'oldest' | 'alphabetical' | 'manual' | 'focus';
type ViewMode = 'cards' | 'list';

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
    is_focused: boolean;
}

interface GoalGridProps {
    initialGoals: GoalData[];
}

const SORT_OPTIONS: { value: SortMode; label: string; icon: React.ReactNode }[] = [
    { value: 'newest', label: 'Newest', icon: <CalendarPlus className="h-4 w-4" /> },
    { value: 'oldest', label: 'Oldest', icon: <CalendarMinus className="h-4 w-4" /> },
    { value: 'alphabetical', label: 'A → Z', icon: <ArrowDownAZ className="h-4 w-4" /> },
    { value: 'manual', label: 'Manual', icon: <GripVertical className="h-4 w-4" /> },
    { value: 'focus', label: 'Focus', icon: <Focus className="h-4 w-4" /> },
];

export function GoalGrid({ initialGoals }: GoalGridProps) {
    const [sortMode, setSortMode] = useState<SortMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('goalSortMode');
            if (saved && ['newest', 'oldest', 'alphabetical', 'manual', 'focus'].includes(saved)) {
                return saved as SortMode;
            }
        }
        return 'newest';
    });

    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('goalViewMode');
            if (saved && ['cards', 'list'].includes(saved)) {
                return saved as ViewMode;
            }
        }
        return 'cards';
    });

    // Track previous sort mode for returning from focus mode
    const [previousSortMode, setPreviousSortMode] = useState<SortMode>('newest');

    const [goals, setGoals] = useState(initialGoals);

    useEffect(() => {
        setGoals(initialGoals);
    }, [initialGoals]);

    // Persist preferences to localStorage and track previous mode
    useEffect(() => {
        localStorage.setItem('goalSortMode', sortMode);
        // When entering focus mode, save the current mode to return to
        if (sortMode === 'focus') {
            // previousSortMode was already set before this change
        }
    }, [sortMode]);

    // Handler to enter focus mode while saving the current mode
    const enterFocusMode = () => {
        if (sortMode !== 'focus') {
            setPreviousSortMode(sortMode);
        }
        setSortMode('focus');
    };

    // Handler to exit focus mode and return to previous mode
    const exitFocusMode = () => {
        setSortMode(previousSortMode);
    };

    useEffect(() => {
        localStorage.setItem('goalViewMode', viewMode);
    }, [viewMode]);

    // Filter goals if focus mode is selected
    const isFocusMode = sortMode === 'focus';
    const filteredGoals = isFocusMode
        ? goals.filter(g => g.is_focused)
        : goals;

    // Sort goals based on current mode
    const sortedGoals = [...filteredGoals].sort((a, b) => {
        switch (sortMode) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'manual':
                return a.sort_order - b.sort_order;
            case 'focus':
                // When in focus mode, sort by sort_order (manual order)
                return a.sort_order - b.sort_order;
            default:
                return 0;
        }
    });

    const focusedCount = goals.filter(g => g.is_focused).length;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
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
    const isListView = viewMode === 'list';

    return (
        <div className="space-y-6">
            {/* Controls Row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* View Toggle */}
                <div className="bg-card p-1 rounded-lg border border-border shadow-sm flex items-center">
                    <button
                        onClick={() => setViewMode('cards')}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            viewMode === 'cards'
                                ? "bg-muted text-primary shadow-sm"
                                : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                        )}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span className="hidden sm:inline">Cards</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={clsx(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            viewMode === 'list'
                                ? "bg-muted text-primary shadow-sm"
                                : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                        )}
                    >
                        <List className="h-4 w-4" />
                        <span className="hidden sm:inline">List</span>
                    </button>
                </div>

                {/* Sort Toggle (including Focus) */}
                <div className="bg-card p-1 rounded-lg border border-border shadow-sm flex items-center gap-1">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => option.value === 'focus' ? enterFocusMode() : setSortMode(option.value)}
                            disabled={option.value === 'focus' && focusedCount === 0}
                            className={clsx(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                sortMode === option.value
                                    ? "bg-muted text-primary shadow-sm"
                                    : option.value === 'focus' && focusedCount === 0
                                        ? "text-muted-foreground/40 cursor-not-allowed"
                                        : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                            )}
                            title={option.value === 'focus' && focusedCount === 0 ? "No goals marked for focus" : undefined}
                        >
                            <span>
                                {option.icon}
                            </span>
                            <span className="hidden sm:inline">{option.label}</span>
                            {option.value === 'focus' && focusedCount > 0 && (
                                <span className={clsx(
                                    "text-xs px-1.5 py-0.5 rounded-full",
                                    sortMode === 'focus'
                                        ? "bg-primary/20 text-primary"
                                        : "bg-muted text-muted-foreground"
                                )}>
                                    {focusedCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Focus Mode Banner */}
            {isFocusMode && (
                <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground">
                        <Focus className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Focus Mode — Showing {focusedCount} focused goal{focusedCount !== 1 ? 's' : ''}</span>
                    </div>
                    <button
                        onClick={exitFocusMode}
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        Exit Focus Mode
                    </button>
                </div>
            )}


            {/* Empty state for focus mode */}
            {isFocusMode && sortedGoals.length === 0 && (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Focus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No focused goals</h3>
                    <p className="text-muted-foreground mt-1">Mark goals as focused from their menu to see them here.</p>
                </div>
            )}

            {/* Content with DnD */}
            {sortedGoals.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sortedGoals.map(g => g.id)}
                        strategy={isListView ? verticalListSortingStrategy : rectSortingStrategy}
                        disabled={!isManualMode}
                    >
                        {isListView ? (
                            /* List View */
                            <div className="space-y-2">
                                {sortedGoals.map((goal) => (
                                    <SortableGoalListItem
                                        key={goal.id}
                                        id={goal.id}
                                        title={goal.title}
                                        motivation={goal.motivation}
                                        progress={goal.progress}
                                        deadline={goal.deadline}
                                        mode={goal.mode}
                                        color={goal.color}
                                        isFocused={goal.is_focused}
                                        disabled={!isManualMode}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Card Grid View */
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
                                        isFocused={goal.is_focused}
                                        disabled={!isManualMode}
                                    />
                                ))}
                            </div>
                        )}
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
