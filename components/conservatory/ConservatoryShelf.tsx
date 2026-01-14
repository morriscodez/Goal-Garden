
import React from 'react';
import { ProceduralPlant } from './ProceduralPlant';
import { Goal, ActionItem } from '@prisma/client';

interface ConservatoryShelfProps {
    monthStr: string; // e.g., "January 2026"
    goals: (Goal & { actionItems?: ActionItem[] })[];
}

export const ConservatoryShelf: React.FC<ConservatoryShelfProps> = ({ monthStr, goals }) => {
    // Determine shelf height based on max plant size? 
    // For now we assume a fixed comfortable height or dynamic but plants are roughly same scale.
    // The design shows a wooden frame.

    return (
        <div className="w-full flex flex-col items-center mb-16 px-4 md:px-12">
            {/* Shelf Label */}
            <div className="w-full max-w-5xl flex justify-start mb-2">
                <h2 className="text-xl md:text-2xl font-serif text-white drop-shadow-md pl-4 bg-black/30 px-3 py-1 rounded-t-lg backdrop-blur-sm self-start inline-block border-t border-x border-white/10">{monthStr}</h2>
            </div>

            {/* Wooden Frame Container */}
            <div className="relative w-full max-w-6xl min-h-[300px] bg-[#8B5A2B]/40 dark:bg-[#5D4037]/40 border-x-8 border-t-8 border-[#8B5A2B] dark:border-[#5D4037] rounded-t-lg shadow-2xl flex items-end justify-center pb-8 pt-12 px-8 overflow-hidden backdrop-blur-sm">

                {/* Background Glass Effect (Optional, implied by 'conservatory') */}
                <div className="absolute inset-0 bg-blue-50/10 dark:bg-blue-900/5 pointer-events-none" />

                {/* Plants Row */}
                <div className="flex flex-wrap items-end justify-center gap-8 md:gap-16 z-10 w-full">
                    {goals.map(goal => (
                        <div key={goal.id} className="w-32 md:w-40 h-64 md:h-80 flex-shrink-0">
                            <ProceduralPlant goal={goal} />
                        </div>
                    ))}
                </div>

                {/* Shelf Bottom Board */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#8B5A2B] dark:bg-[#5D4037] shadow-lg rounded-sm transform translate-y-4" />
                <div className="absolute bottom-[-16px] left-[-8px] right-[-8px] h-4 bg-[#5D3A15] dark:bg-[#3E2723] shadow-xl rounded-b-md" />
            </div>
        </div>
    );
};
