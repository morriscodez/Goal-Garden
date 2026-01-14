
import React from 'react';
import { PlantSeed, PlantColors, PotShape } from '@/lib/plant-generation';

interface PartProps {
    seed: PlantSeed;
    colors: PlantColors;
}

export const PlantPot: React.FC<{ shape: PotShape; color: string; width?: number; height?: number }> = ({
    shape,
    color,
    width = 60,
    height = 50
}) => {
    // Center x is assumed to be 0 for the group reusable positioning, 
    // but here we render relative to a viewBox of like -50 to 50
    // Actually simpler to just render paths.

    let path = "";
    const w = width / 2;
    const h = height;

    switch (shape) {
        case "round":
            // A rounded pot
            path = `M -${w} 0 L -${w * 0.8} ${h} Q 0 ${h + 10} ${w * 0.8} ${h} L ${w} 0 Z`;
            break;
        case "square":
            // Slightly tapered square
            path = `M -${w} 0 L -${w * 0.8} ${h} L ${w * 0.8} ${h} L ${w} 0 Z`;
            break;
        case "tapered":
            // Strongly tapered V shape
            path = `M -${w} 0 L -${w * 0.4} ${h} L ${w * 0.4} ${h} L ${w} 0 Z`;
            break;
    }

    // Add a rim
    const rim = `M -${w + 5} -5 L -${w + 5} 0 L ${w + 5} 0 L ${w + 5} -5 Z`;

    return (
        <g className="drop-shadow-sm">
            <path d={path} fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            <path d={rim} fill={color} filter="brightness(1.1)" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        </g>
    );
};

export const PlantStem: React.FC<{ height: number; curve: number; color: string; thickness?: number }> = ({
    height,
    curve,
    color,
    thickness = 4
}) => {
    // Draw a quadratic bezier from (0,0) (top of pot) to (curve, -height)
    // The control point gives it the bend.

    const endX = curve;
    const endY = -height;
    const ctrlX = curve * 0.5; // simple curve
    const ctrlY = -height * 0.5;

    return (
        <path
            d={`M 0 0 Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
            stroke={color}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="round"
        />
    );
};

export const PlantLeaf: React.FC<{ x: number; y: number; angle: number; color: string; scale?: number }> = ({
    x, y, angle, color, scale = 1
}) => {
    // A simple oval leaf shape
    return (
        <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale})`}>
            {/* Leaf shape: two quadratic curves */}
            <path d="M 0 0 Q 15 -10 30 0 Q 15 10 0 0 Z" fill={color} opacity={0.9} />
            {/* Central vein */}
            <path d="M 0 0 L 25 0" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        </g>
    );
};

export const PlantFlower: React.FC<{ x: number; y: number; colors: PlantColors; type: string; scale?: number }> = ({
    x, y, colors, type, scale = 1
}) => {
    // Choose shape based on type

    const renderPetals = () => {
        if (type === "wildflower") {
            // Unordered small petals (like bluebell/hydrangea cluster)
            return (
                <g>
                    <circle r="10" fill={colors.primary} />
                    <circle cy="-5" r="8" fill={colors.primary} opacity={0.8} />
                    <circle cx="5" cy="5" r="8" fill={colors.primary} opacity={0.8} />
                    <circle cx="-5" cy="5" r="8" fill={colors.primary} opacity={0.8} />
                </g>
            );
        } else if (type === "succulent") {
            // Rosette shape
            const petals = [];
            for (let i = 0; i < 8; i++) {
                petals.push(
                    <ellipse key={i} rx="6" ry="12" fill={colors.primary} transform={`rotate(${i * 45}) translate(0, -8)`} />
                )
            }
            return <g>{petals}</g>;
        } else {
            // Standard 5-petal flower
            const petals = [];
            for (let i = 0; i < 5; i++) {
                petals.push(
                    <path key={i} d="M 0 0 Q 10 -20 20 0 Q 10 20 0 0 Z" fill={colors.primary} transform={`rotate(${i * 72}) translate(0, -5)`} />
                )
            }
            return <g>{petals}<circle r="5" fill={colors.secondary} /></g>;
        }
    };

    return (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {renderPetals()}
        </g>
    );
};

// A complex component that assembles leaves along the stem based on seed
export const PlantFoliageGroup: React.FC<{
    stemHeight: number;
    stemCurve: number;
    density: number;
    colors: PlantColors;
    seed: PlantSeed;
}> = ({ stemHeight, stemCurve, density, colors, seed }) => {
    const leaves = [];

    // We walk up the stem and place leaves.
    // Use the seeded PRNG logic implicitly by just using determinstic math or the seed attributes.
    // Since we don't have the prng instance here, we'll try to be somewhat deterministic based on density loops.

    const leafCount = density * 2 + 2; // 4 to 12 leaves

    for (let i = 0; i < leafCount; i++) {
        const t = (i + 1) / (leafCount + 1); // 0 to 1 position along stem

        // Approximate Bezier position
        // P(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        // P0=(0,0), P1=(curve/2, -height/2), P2=(curve, -height)

        const invT = 1 - t;
        const p1x = stemCurve * 0.5;
        const p1y = -stemHeight * 0.5;
        const p2x = stemCurve;
        const p2y = -stemHeight;

        const x = (2 * invT * t * p1x) + (t * t * p2x);
        const y = (2 * invT * t * p1y) + (t * t * p2y);

        // Alternate sides
        const side = i % 2 === 0 ? 1 : -1;
        const angle = -45 * side + (seed.seedValue * 1000 % 20); // Some randomness from seedValue

        // Don't put leaves too low
        if (t > 0.2) {
            leaves.push(
                <PlantLeaf
                    key={i}
                    x={x}
                    y={y}
                    angle={angle * (t < 0.5 ? 1 : 0.8)} // Leaves point up more near top
                    color={colors.stem === "#6B8E23" ? colors.secondary : colors.primary} // Succulents/Foliage logic mix
                    scale={0.5 + (0.5 * (1 - t))} // Smaller leaves at top
                />
            );
        }
    }

    return <g>{leaves}</g>;
}
