'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableItem({ id, children, disabled }: { id: string; children: React.ReactNode; disabled?: boolean }) {
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
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            {/* Drag Handle - only visible when manual sort is enabled (disabled=false) */}
            {!disabled && (
                <div {...attributes} {...listeners} className="absolute -left-8 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-zinc-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5" />
                </div>
            )}
            <div className={!disabled ? "" : ""}>
                {children}
            </div>
        </div>
    );
}
