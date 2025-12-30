"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <div className="grid grid-cols-3 gap-2">
            <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-between rounded-xl border-2 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all ${theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-transparent'}`}
                title="Light Mode"
            >
                <Sun className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Light</span>
            </button>

            <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-between rounded-xl border-2 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all ${theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-transparent'}`}
                title="Dark Mode"
            >
                <Moon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Dark</span>
            </button>

            <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-between rounded-xl border-2 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all ${theme === 'system' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-transparent'}`}
                title="System Theme"
            >
                <span className="h-5 w-5 mb-1 flex items-center justify-center font-bold">A</span>
                <span className="text-xs font-medium">Auto</span>
            </button>
        </div>
    )
}
