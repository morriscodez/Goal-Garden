import { ActionItem } from '@prisma/client';
import { Video } from 'lucide-react';

export function MonthlyCard({ item }: { item: ActionItem }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                    <Video className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1">Completed 2 days ago</p>
                </div>
            </div>
            {/* Checkbox */}
            <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
        </div>
    );
}
