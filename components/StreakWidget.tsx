import { Flame } from 'lucide-react';
import { clsx } from 'clsx';

export function StreakWidget({ streak }: { streak: number }) {
    return (
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="h-32 w-32" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <Flame className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-white/90 uppercase tracking-wider text-sm">Current Streak</span>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{streak}</span>
                    <span className="text-xl font-medium text-white/80">days</span>
                </div>

                <p className="mt-2 text-white/80 text-sm font-medium">
                    {streak > 0
                        ? "You're on fire! Keep the momentum going."
                        : "Complete an action item to start your streak!"}
                </p>
            </div>
        </div>
    );
}
