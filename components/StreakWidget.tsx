import { Sprout } from 'lucide-react';
import Image from 'next/image';

export function StreakWidget({ streak }: { streak: number }) {
    return (
        <div className="relative rounded-3xl overflow-hidden shadow-lg group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/streak-bg.jpg"
                    alt="Garden Background"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="relative z-10 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                        <Sprout className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-white/90 uppercase tracking-wider text-sm drop-shadow-lg">Current Streak</span>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white drop-shadow-lg">{streak}</span>
                    <span className="text-xl font-medium text-white/90 drop-shadow-lg">days</span>
                </div>

                <p className="mt-2 text-white/90 text-sm font-medium drop-shadow-lg">
                    {streak > 0
                        ? "Your garden is growing! Keep the momentum going."
                        : "Complete an action item to start your streak!"}
                </p>
            </div>
        </div>
    );
}
