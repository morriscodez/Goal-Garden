'use client';

import { ActionItem } from '@prisma/client';
import { Flag } from 'lucide-react';
import { useTransition, useState, useRef, useEffect } from 'react';
import { updateActionItem } from '@/app/actions/milestones';
import { MilestoneMenu } from '@/components/MilestoneMenu';

export function AnnualCard({ item, isMenuOpen, onMenuToggle }: { item: ActionItem; isMenuOpen?: boolean; onMenuToggle?: (open: boolean) => void }) {
    const [isPending, startTransition] = useTransition();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(item.title);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Focus input when editing starts
    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    const handleTitleSave = async () => {
        setIsEditingTitle(false);
        if (title.trim() === item.title) return; // No change

        startTransition(async () => {
            await updateActionItem(item.id, item.goalId, { title: title });
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            setTitle(item.title); // Revert
            setIsEditingTitle(false);
        }
    };

    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-all relative">
            <div className="h-24 bg-zinc-900 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 opacity-50" />
                {/* Milestone Menu - Absolute Positioned */}
                <div className="absolute top-2 right-2">
                    <MilestoneMenu
                        item={item}
                        goalId={item.goalId}
                        isOpen={!!isMenuOpen}
                        onToggle={(open) => onMenuToggle?.(open)}
                    />
                </div>
            </div>
            <div className="p-4">
                {isEditingTitle ? (
                    <input
                        ref={titleInputRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={handleKeyDown}
                        className="font-bold text-card-foreground text-lg w-full bg-transparent border-b-2 border-blue-500 outline-none p-0 focus:ring-0 mb-1"
                    />
                ) : (
                    <h4
                        onDoubleClick={() => setIsEditingTitle(true)}
                        className="font-bold text-lg text-card-foreground line-clamp-2 leading-tight mb-1 cursor-text"
                        title="Double-click to edit"
                    >
                        {title}
                    </h4>
                )}
            </div>
        </div>
    );
}
