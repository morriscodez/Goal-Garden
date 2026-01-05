export interface GoalTheme {
    name: string;
    bgHeader: string;
    bgBody: string;
    chip: string;
    accent: string;
    barBg: string;
    barFill: string;
    borderColor: string;
}

export const THEMES: GoalTheme[] = [
    {
        name: "blue",
        bgHeader: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-blue-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-blue-400 pl-2 pr-2 py-0.5",
        accent: "text-blue-600 dark:text-blue-400",
        barBg: "bg-blue-100 dark:bg-blue-900/30",
        barFill: "bg-blue-600 dark:bg-blue-500",
        borderColor: "border-blue-500/50",
    },
    {
        name: "purple",
        bgHeader: "bg-gradient-to-br from-purple-500 via-fuchsia-600 to-purple-800",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-purple-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-purple-400 pl-2 pr-2 py-0.5",
        accent: "text-purple-600 dark:text-purple-400",
        barBg: "bg-purple-100 dark:bg-purple-900/30",
        barFill: "bg-purple-600 dark:bg-purple-500",
        borderColor: "border-purple-500/50",
    },
    {
        name: "emerald", // Greenish
        bgHeader: "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-emerald-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-emerald-400 pl-2 pr-2 py-0.5",
        accent: "text-emerald-600 dark:text-emerald-400",
        barBg: "bg-emerald-100 dark:bg-emerald-900/30",
        barFill: "bg-emerald-600 dark:bg-emerald-500",
        borderColor: "border-emerald-500/50",
    },
    {
        name: "orange",
        bgHeader: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-600",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-orange-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-orange-400 pl-2 pr-2 py-0.5",
        accent: "text-orange-600 dark:text-orange-400",
        barBg: "bg-orange-100 dark:bg-orange-900/30",
        barFill: "bg-orange-600 dark:bg-orange-500",
        borderColor: "border-orange-500/50",
    },
    {
        name: "burgundy",
        bgHeader: "bg-gradient-to-br from-rose-500 via-red-600 to-red-900",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-rose-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-rose-400 pl-2 pr-2 py-0.5",
        accent: "text-[#800020] dark:text-rose-400",
        barBg: "bg-rose-100 dark:bg-rose-900/30",
        barFill: "bg-[#800020] dark:bg-rose-500",
        borderColor: "border-rose-500/50",
    },
    {
        name: "ocean",
        bgHeader: "bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-cyan-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-cyan-400 pl-2 pr-2 py-0.5",
        accent: "text-cyan-600 dark:text-cyan-400",
        barBg: "bg-cyan-100 dark:bg-cyan-900/30",
        barFill: "bg-cyan-600 dark:bg-cyan-500",
        borderColor: "border-cyan-500/50",
    },
    {
        name: "berry",
        bgHeader: "bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-pink-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-pink-400 pl-2 pr-2 py-0.5",
        accent: "text-pink-600 dark:text-pink-400",
        barBg: "bg-pink-100 dark:bg-pink-900/30",
        barFill: "bg-pink-600 dark:bg-pink-500",
        borderColor: "border-pink-500/50",
    },
    {
        name: "midnight",
        bgHeader: "bg-gradient-to-br from-slate-700 via-slate-800 to-zinc-900",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-slate-600 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-slate-400 pl-2 pr-2 py-0.5",
        accent: "text-slate-700 dark:text-slate-400",
        barBg: "bg-slate-100 dark:bg-slate-800/30",
        barFill: "bg-slate-700 dark:bg-slate-500",
        borderColor: "border-slate-500/50",
    },
    {
        name: "gold",
        bgHeader: "bg-gradient-to-br from-yellow-500 via-amber-500 to-amber-600",
        bgBody: "bg-card",
        chip: "bg-zinc-100 text-zinc-900 border-l-[3px] border-l-amber-500 dark:bg-zinc-800 dark:text-zinc-100 dark:border-l-amber-400 pl-2 pr-2 py-0.5",
        accent: "text-amber-600 dark:text-amber-400",
        barBg: "bg-amber-100 dark:bg-amber-900/30",
        barFill: "bg-amber-600 dark:bg-amber-500",
        borderColor: "border-amber-500/50",
    },
];

export function getGoalTheme(id: string, color?: string | null): GoalTheme {
    if (color) {
        const theme = THEMES.find(t => t.name === color);
        if (theme) return theme;
    }
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const themeIndex = hash % THEMES.length;
    return THEMES[themeIndex];
}
