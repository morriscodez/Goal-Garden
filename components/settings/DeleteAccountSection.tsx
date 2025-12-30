'use client';

import { useState } from 'react';
import { deleteAccount } from '@/app/actions/settings';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

export function DeleteAccountSection() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        setIsLoading(true);
        await deleteAccount();
        // Redirect happens in server action, but just in case
        setIsLoading(false);
    }

    return (
        <div className="rounded-2xl border border-red-100 bg-red-50/50 dark:border-red-900/20 dark:bg-red-900/10 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-700 dark:text-red-300 mb-6">
                Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <button
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-white text-red-600 border border-red-200 hover:bg-red-50 h-10 px-4 py-2 dark:bg-red-950 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/40"
            >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
            </button>

            {/* Confirmation Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-border">
                        <div className="flex items-center gap-4 mb-4 text-red-600 dark:text-red-400">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Delete Account?</h3>
                        </div>

                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Are you sure you want to delete your account? All of your goals, milestones, and progress will be <strong className="text-foreground">permanently removed</strong>. This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Yes, Delete My Account'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
