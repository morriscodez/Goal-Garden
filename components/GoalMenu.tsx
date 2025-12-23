'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2, X, AlertTriangle, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteGoal, updateGoal } from '@/app/actions/goals';
import { clsx } from 'clsx';
import { format } from 'date-fns';

interface GoalMenuProps {
    goal: {
        id: string;
        title: string;
        motivation: string | null;
        deadline: Date | null;
    };
}

export function GoalMenu({ goal }: GoalMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
                <MoreHorizontal className="h-6 w-6" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100">
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setShowEdit(true);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                    >
                        <Pencil className="h-4 w-4 text-zinc-400" />
                        Edit Goal
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setShowDelete(true);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-zinc-100"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Goal
                    </button>
                </div>
            )}

            {/* Edit Modal */}
            {showEdit && (
                <EditGoalDialog
                    goal={goal}
                    onClose={() => setShowEdit(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDelete && (
                <DeleteGoalDialog
                    goalId={goal.id}
                    goalTitle={goal.title}
                    onClose={() => setShowDelete(false)}
                />
            )}
        </div>
    );
}

function EditGoalDialog({ goal, onClose }: { goal: GoalMenuProps['goal'], onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const title = formData.get('title') as string;
        const motivation = formData.get('motivation') as string;
        const deadlineStr = formData.get('deadline') as string;
        const deadline = deadlineStr ? new Date(deadlineStr) : undefined;

        await updateGoal(goal.id, { title, motivation, deadline });
        setIsLoading(false);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-zinc-900">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Edit Goal</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 p-1 bg-zinc-100 rounded-full">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-zinc-700">Goal Title</label>
                        <input
                            name="title"
                            defaultValue={goal.title}
                            required
                            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-zinc-700">Motivation</label>
                        <textarea
                            name="motivation"
                            defaultValue={goal.motivation || ''}
                            rows={3}
                            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-zinc-700">Target Deadline</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="deadline"
                                defaultValue={goal.deadline ? format(new Date(goal.deadline), 'yyyy-MM-dd') : ''}
                                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pl-10"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 transition-all"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteGoalDialog({ goalId, goalTitle, onClose }: { goalId: string, goalTitle: string, onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleConfirm() {
        setIsLoading(true);
        await deleteGoal(goalId);
        // We do not set loading false here because we are redirecting
        router.push('/goals'); // Client-side redirect to ensure state refresh
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-zinc-900">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200 border-2 border-red-100">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-zinc-900">Delete Goal?</h3>
                        <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
                            Are you sure you want to delete <span className="font-semibold text-zinc-900">"{goalTitle}"</span>?
                            <br />
                            This will permanently remove the goal and all its milestones. This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full mt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-5 py-2.5 rounded-xl font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 transition-colors shadow-lg shadow-red-500/20"
                        >
                            {isLoading ? 'Deleting...' : 'Delete Goal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
