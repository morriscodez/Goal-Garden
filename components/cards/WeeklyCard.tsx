import { ActionItem } from '@prisma/client';
import { Headphones } from 'lucide-react';

export function WeeklyCard({ item }: { item: ActionItem }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Headphones className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-green-600 font-medium mt-1">Log progress</p>
                </div>
            </div>
            {/* Circular Progress (Mock) */}
            <div className="relative h-10 w-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-zinc-100" />
                <div className="absolute inset-0 rounded-full border-2 border-green-500 border-t-transparent border-l-transparent -rotate-45" />
                <span className="text-[10px] font-bold text-zinc-900">1/2</span>
            </div>
        </div>
    );
}
