'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { GoalReviewCard } from './GoalReviewCard';

interface SortableGoalCardProps {
    id: string;
    title: string;
    motivation: string | null;
    progress: number;
    deadline: Date | null;
    mode: string;
    color?: string | null;
    isFocused?: boolean;
    disabled?: boolean;
    isComplete?: boolean;
}

export function SortableGoalCard({
    id,
    title,
    motivation,
    progress,
    deadline,
    mode,
    color,
    isFocused,
    disabled,
    isComplete
}: SortableGoalCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.7 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            {/* Drag Handle - only visible when manual sort is enabled */}
            {!disabled && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 p-1.5 bg-card border border-border rounded-lg shadow-md text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            )}
            <GoalReviewCard
                id={id}
                title={title}
                motivation={motivation}
                progress={progress}
                deadline={deadline}
                mode={mode}
                color={color}
                isFocused={isFocused}
                isComplete={isComplete}
            />
        </div>
    );
}
