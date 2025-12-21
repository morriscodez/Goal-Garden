import { ActionItem } from '@prisma/client';
import { Flag } from 'lucide-react';

export function AnnualCard({ item }: { item: ActionItem }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden group hover:shadow-md transition-all">
            <div className="h-24 bg-zinc-900 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 opacity-50" />
                {/* Status Badge */}
                <div className="absolute bottom-2 left-3">
                    <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {item.is_completed ? 'Completed' : 'On Track'}
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h4 className="font-bold text-lg text-zinc-900 line-clamp-2 leading-tight mb-1">{item.title}</h4>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                    {item.description || 'No description provided.'}
                </p>

                {/* Progress Bar (Mock for now, could be real if sub-tasks existed) */}
                <div>
                    <div className="flex justify-between text-[10px] font-semibold text-zinc-500 mb-1">
                        <span>Progress</span>
                        <span>{item.is_completed ? '100%' : '0%'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: item.is_completed ? '100%' : '5%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
