export const FLOWER_COLORS = [
    "bg-rose-100 text-rose-500",    // Pink/Rose
    "bg-purple-100 text-purple-500", // Violet/Purple
    "bg-sky-100 text-sky-500",      // Blue/Sky
    "bg-amber-100 text-amber-500",   // Yellow/Amber
    "bg-pink-100 text-pink-500",    // Pink
    "bg-indigo-100 text-indigo-500", // Indigo
];

export function getFlowerColor(id: string) {
    const charCode = id.charCodeAt(id.length - 1);
    const index = charCode % FLOWER_COLORS.length;
    return FLOWER_COLORS[index];
}
