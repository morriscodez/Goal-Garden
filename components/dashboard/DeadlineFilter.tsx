"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { clsx } from "clsx"

const DEADLINE_OPTIONS = [
    { value: "7", label: "7 Days" },
    { value: "14", label: "14 Days" },
    { value: "30", label: "30 Days" },
    { value: "60", label: "60 Days" },
]

export function DeadlineFilter() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Default to 14 if not specified
    const currentDays = searchParams.get("deadlineDays") || "14"

    const handleSelect = (days: string) => {
        const params = new URLSearchParams(searchParams)
        if (days === "14") {
            params.delete("deadlineDays") // Default clean URL
        } else {
            params.set("deadlineDays", days)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
            {DEADLINE_OPTIONS.map((option) => {
                const isSelected = currentDays === option.value
                return (
                    <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={clsx(
                            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                            isSelected
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                        )}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
