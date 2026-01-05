"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { clsx } from "clsx"

type Rhythm = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY"

const RHYTHM_OPTIONS: { value: Rhythm; label: string }[] = [
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "QUARTERLY", label: "Quarterly" },
]

export function RhythmToggle() {
    const searchParams = useSearchParams()
    const router = useRouter()

    // Default to DAILY if not specified or invalid
    const currentRhythm = (searchParams.get("rhythm") as Rhythm) || "DAILY"

    const handleSelect = (rhythm: Rhythm) => {
        const params = new URLSearchParams(searchParams)
        if (rhythm === "DAILY") {
            params.delete("rhythm")
        } else {
            params.set("rhythm", rhythm)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
            {RHYTHM_OPTIONS.map((option) => {
                const isSelected = currentRhythm === option.value
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
