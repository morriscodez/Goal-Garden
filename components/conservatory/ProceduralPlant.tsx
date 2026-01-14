
"use client";

import React, { useMemo, useState } from 'react';
import { generatePlantSeed, PlantSeed } from '@/lib/plant-generation';
import { PlantPot, PlantStem, PlantFlower, PlantFoliageGroup } from './PlantParts';
import { Goal, ActionItem } from '@prisma/client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProceduralPlantProps {
    goal: Goal & { actionItems?: ActionItem[] };
    className?: string;
}

export const ProceduralPlant: React.FC<ProceduralPlantProps> = ({ goal, className }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Generate seed only when goal changes
    const seed: PlantSeed = useMemo(() => generatePlantSeed(goal), [goal]);

    // Calculate dimensions based on metrics
    const baseHeight = 150;
    const plantHeight = baseHeight * seed.metrics.heightScale;
    const stemCurve = seed.metrics.stemCurve;

    // ViewBox sizing
    const viewBoxWidth = 200;
    const viewBoxHeight = 300;
    const groundY = 250; // The Y position where the pot sits

    const completedDate = goal.updatedAt ? new Date(goal.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unknown';

    return (
        <div
            className={cn("relative group cursor-pointer flex flex-col items-center justify-end h-full", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gardener's Tag Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-20 z-50 bg-black/80 text-white text-xs px-3 py-2 rounded-md shadow-xl backdrop-blur-sm pointer-events-none min-w-[120px] text-center mb-4"
                    >
                        <p className="font-semibold text-sm mb-1 line-clamp-2">{goal.title}</p>
                        <p className="text-zinc-400">Completed {completedDate}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                className={cn("w-full h-auto transition-transform duration-500 ease-out", isHovered ? "scale-110 drop-shadow-2xl brightness-110" : "drop-shadow-md")}
                style={{ maxHeight: '100%' }}
            >
                <foreignObject x={0} y={0} width={viewBoxWidth} height={viewBoxHeight}>
                    {/* Glow effect container only visible on hover if needed, 
                        but standard drop-shadow on SVG usually looks better. 
                        We can use CSS filters on the SVG itself.
                    */}
                </foreignObject>

                {/* Group centered horizontally at bottom */}
                <g transform={`translate(${viewBoxWidth / 2}, ${groundY})`}>

                    {/* Pot */}
                    <PlantPot shape={seed.potShape} color={seed.colors.pot} />

                    {/* Stem & Plant */}
                    {/* Move up to top of pot */}
                    <g transform="translate(0, 0)">
                        <PlantStem
                            height={plantHeight}
                            curve={stemCurve}
                            color={seed.colors.stem}
                            thickness={seed.plantType === "succulent" ? 8 : 3}
                        />

                        {/* Foliage along stem */}
                        {seed.plantType !== "succulent" && (
                            <PlantFoliageGroup
                                stemHeight={plantHeight}
                                stemCurve={stemCurve}
                                density={seed.metrics.density}
                                colors={seed.colors}
                                seed={seed}
                            />
                        )}

                        {/* Top Bloom or Succulent Cluster */}
                        {/* Calculate tip position */}
                        {/* Approximation for quadratic bezier end */}
                        <g transform={`translate(${stemCurve}, ${-plantHeight})`}>
                            {seed.plantType === "flowering" || seed.plantType === "wildflower" || seed.plantType === "exotic" ? (
                                <PlantFlower
                                    x={0}
                                    y={0}
                                    colors={seed.colors}
                                    type={seed.plantType}
                                    scale={1 + (seed.metrics.density * 0.1)} // Denser = slightly bigger bloom
                                />
                            ) : null}

                            {seed.plantType === "succulent" && (
                                <PlantFlower
                                    x={0}
                                    y={10} // Sit slightly lower
                                    colors={seed.colors}
                                    type="succulent"
                                    scale={1.5}
                                />
                            )}
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};
