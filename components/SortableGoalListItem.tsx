'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { GoalListItem } from './GoalListItem';

interface SortableGoalListItemProps {
    id: string;
    title: string;
    motivation: string | null;
    progress: number;
    deadline: Date | null;
    mode: string;
    color?: string | null;
    isFocused?: boolean;
    disabled?: boolean;
}

export function SortableGoalListItem({
    id,
    title,
    motivation,
    progress,
    deadline,
    mode,
    color,
    isFocused,
    disabled
}: SortableGoalListItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        // Elevate z-index when dragging OR when menu is open
        zIndex: isDragging ? 100 : isMenuOpen ? 50 : 'auto',
        opacity: isDragging ? 0.7 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group flex items-center gap-2">
            {/* Drag Handle - only visible when manual sort is enabled */}
            {!disabled && (
                <div
                    {...attributes}
                    {...listeners}
                    className="p-1.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            )}
            <div className="flex-1">
                <GoalListItem
                    id={id}
                    title={title}
                    motivation={motivation}
                    progress={progress}
                    deadline={deadline}
                    mode={mode}
                    color={color}
                    isFocused={isFocused}
                    onMenuOpenChange={setIsMenuOpen}
                />
            </div>
        </div>
    );
}
