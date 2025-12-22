"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Appearance
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Select your preferred theme.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-2 max-w-md">
                <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-transparent'}`}
                >
                    <Sun className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Light</span>
                </button>

                <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-transparent'}`}
                >
                    <Moon className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Dark</span>
                </button>

                <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-between rounded-xl border-2 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${theme === 'system' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800 bg-transparent'}`}
                >
                    <span className="mb-2 h-6 w-6 flex items-center justify-center font-bold text-lg">A</span>
                    <span className="text-sm font-medium">System</span>
                </button>
            </div>
        </div>
    )
}
