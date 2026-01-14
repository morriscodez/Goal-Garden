
import { Goal, ActionItem } from "@prisma/client";

// --- Types ---

export type PlantType =
    | "flowering"
    | "foliage"
    | "wildflower"
    | "succulent"
    | "exotic";

export type PotShape = "round" | "square" | "tapered";

export interface PlantSeed {
    seedValue: number;
    plantType: PlantType;
    potShape: PotShape;
    metrics: PlantMetrics;
    colors: PlantColors;
}

export interface PlantMetrics {
    heightScale: number; // 0.5 to 1.5, based on duration
    density: number;     // 1 to 5 (or more), based on action items
    stemCurve: number;   // -20 to 20 degrees, random but seeded
}

export interface PlantColors {
    primary: string;    // Petal / leaf main color
    secondary: string;  // Center / highlight
    stem: string;       // Stem / trunk color
    pot: string;        // Pot color
}


// --- Constants ---

const THEME_TO_PLANT_TYPE: Record<string, PlantType> = {
    // Warm/Floral
    "berry": "flowering",
    "burgundy": "exotic",   // Dark purple/red -> Exotic
    "orange": "flowering",
    "gold": "flowering",    // Amber/Gold -> Flowering (Marigold)

    // Greens
    "emerald": "foliage",

    // Blues
    "blue": "wildflower",
    "ocean": "foliage",   // Teal/Cyan -> Foliage

    // Dark/Neutral
    "midnight": "succulent", // Dark Grey/Blue -> Succulent
    "purple": "exotic",      // Deep purple -> Exotic
};

const POT_COLORS = [
    "#E07A5F", // Terracotta
    "#8D99AE", // Slate Grey
    "#F4D35E", // Sandstone (Yellowish)
    "#D6CCC2", // Clay (Beige)
    "#5D4037", // Dark Earth
];

// --- PRNG (Linear Congruential Generator) ---

export class Prng {
    private seed: number;

    constructor(seedString: string) {
        this.seed = this.hashString(seedString);
    }

    private hashString(str: string): number {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Returns number between 0 and 1
    public next(): number {
        const a = 1664525;
        const c = 1013904223;
        const m = Math.pow(2, 32);
        this.seed = (a * this.seed + c) % m;
        return this.seed / m;
    }

    // Returns number between min and max
    public range(min: number, max: number): number {
        return min + (this.next() * (max - min));
    }

    // Returns random integer between min and max (inclusive)
    public intRange(min: number, max: number): number {
        return Math.floor(this.range(min, max + 1));
    }

    // Returns random element from array
    public pick<T>(arr: T[]): T {
        return arr[this.intRange(0, arr.length - 1)];
    }
}


// --- Main Generation Logic ---

export function generatePlantSeed(goal: Goal & { actionItems?: ActionItem[] }): PlantSeed {
    const prng = new Prng(goal.id);

    // 1. Plant Type
    // Default to 'foliage' if color is undefined or unknown (shouldn't happen often)
    const colorKey = goal.color?.toLowerCase() || "emerald";
    // Handle edge cases where color might be a hex or not in our map, specifically mapping the 'theme names'
    // 'blue', 'purple', 'emerald', 'orange', 'burgundy', 'ocean', 'berry', 'midnight', 'gold'
    // If exact match isn't found, we try to guess or default.
    let plantType = THEME_TO_PLANT_TYPE[colorKey];

    if (!plantType) {
        // Fallbacks for standard CSS colors if they sneak in
        if (colorKey.includes("red") || colorKey.includes("pink")) plantType = "flowering";
        else if (colorKey.includes("green") || colorKey.includes("teal")) plantType = "foliage";
        else if (colorKey.includes("blue")) plantType = "wildflower";
        else if (colorKey.includes("gray") || colorKey.includes("black")) plantType = "succulent";
        else plantType = "foliage"; // Ultimate fallback
    }

    // 2. Metrics (Growth)
    // Duration: Height = (completedAt - createdAt). 
    // Using updatedAt as proxy for completedAt.
    const created = new Date(goal.createdAt).getTime();
    const completed = new Date(goal.updatedAt).getTime(); // Proxy
    let durationDays = Math.max(1, (completed - created) / (1000 * 60 * 60 * 24));

    // Cap duration impact to avoid excessively tall/short plants
    // Assume "average" good goal takes 2 weeks (14 days). 
    // Short < 3 days. Long > 30 days.
    let heightScale = 1.0;
    if (durationDays < 5) heightScale = 0.7 + (durationDays / 20); // 0.7 - 0.95
    else if (durationDays > 60) heightScale = 1.4;
    else {
        // Map 5..60 to 0.95..1.4
        heightScale = 0.95 + ((durationDays - 5) / 55) * 0.45;
    }

    // Density: Action items count
    const itemCount = goal.actionItems ? goal.actionItems.length : 0;
    let density = 1;
    if (itemCount === 0) density = 1;
    else if (itemCount <= 3) density = 2;
    else if (itemCount <= 8) density = 3;
    else if (itemCount <= 15) density = 4;
    else density = 5;

    // Prng variations on metrics
    heightScale += prng.range(-0.05, 0.05); // slight jitter

    const metrics: PlantMetrics = {
        heightScale,
        density,
        stemCurve: prng.range(-15, 15),
    };

    // 3. Colors
    // We can enhance this to pull specific shades from the goal-themes.ts if we imported it,
    // but for now let's map seeds to nice palettes.
    const plantColors: PlantColors = {
        primary: getPrimaryColor(colorKey, plantType),
        secondary: getSecondaryColor(colorKey, plantType),
        stem: plantType === "succulent" ? "#6B8E23" : "#4A6741", // Darker green for standard, olive for succulent
        pot: prng.pick(POT_COLORS),
    };

    // 4. Pot Shape
    const potShape = prng.pick<PotShape>(["round", "square", "tapered"]);

    return {
        seedValue: prng.next(), // A generic float seed for sub-components if needed
        plantType,
        potShape,
        metrics,
        colors: plantColors,
    };
}

function getPrimaryColor(themeName: string, type: PlantType): string {
    // Map theme names to specific hex logic suitable for SVG fills
    // These should be slightly "natural" adaptations of the UI neon colors
    switch (themeName) {
        case "berry": return "#FF1493"; // Deep Pink / Hibiscus
        case "burgundy": return "#800020"; // Burgundy
        case "orange": return "#FF8C00"; // Dark Orange / Marigold
        case "gold": return "#FFD700"; // Gold
        case "emerald": return "#4caf50"; // Standard Leaf Green (used if foliage color needs variation)
        case "blue": return "#4169E1"; // Royal Blue (Wildflower)
        case "ocean": return "#008080"; // Teal
        case "midnight": return "#2F4F4F"; // Dark Slate Gray (Succulent)
        case "purple": return "#8A2BE2"; // Blue Violet
        default: return "#4ADE80"; // Fallback green
    }
}

function getSecondaryColor(themeName: string, type: PlantType): string {
    // Used for centers of flowers, slight gradients, or accents
    if (type === "foliage") return "#A8E6CF"; // Light green highlight
    if (type === "succulent") return "#8FBC8F"; // Dark Sea Green
    if (themeName === "blue") return "#E6E6FA"; // Lavender highlight for blue bells
    return "#FFFACD"; // LemonChiffon default center for flowers
}
