"use client";

import { useState, useRef, useEffect } from "react";
import { ActionItem, Goal } from "@prisma/client";
import { MatrixContainer } from "./MatrixContainer";
import { Check, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface MatrixFilterWrapperProps {
    initialItems: (ActionItem & { goal?: { title: string; color: string | null } })[];
    goals: Goal[];
}

export function MatrixFilterWrapper({ initialItems, goals }: MatrixFilterWrapperProps) {
    const searchParams = useSearchParams();
    const filterGoalsParam = searchParams.get('filterGoals');

    const [selectedGoalIds, setSelectedGoalIds] = useState<Set<string>>(() => {
        if (filterGoalsParam) {
            const ids = filterGoalsParam.split(',');
            // Only include IDs that actually exist in the goals list
            const validIds = ids.filter(id => goals.some(g => g.id === id));
            if (validIds.length > 0) {
                return new Set(validIds);
            }
        }
        return new Set(goals.map((g) => g.id));
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleGoal = (goalId: string) => {
        const newSelected = new Set(selectedGoalIds);
        if (newSelected.has(goalId)) {
            newSelected.delete(goalId);
        } else {
            newSelected.add(goalId);
        }
        setSelectedGoalIds(newSelected);
    };

    const filteredItems = initialItems.filter((item) =>
        selectedGoalIds.has(item.goalId)
    );

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between px-4">
                <h1 className="text-2xl font-bold">Eisenhower Matrix</h1>
                <div className="flex items-center gap-2 relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={cn(
                            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                            "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2"
                        )}
                    >
                        <Filter className="h-4 w-4" />
                        Filter Goals
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 top-10 z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2">
                            <div className="px-2 py-1.5 text-sm font-semibold">Filter by Goal</div>
                            <div className="-mx-1 my-1 h-px bg-muted" />
                            <div className="max-h-64 overflow-y-auto">
                                {goals.map((goal) => {
                                    const isSelected = selectedGoalIds.has(goal.id);
                                    return (
                                        <div
                                            key={goal.id}
                                            onClick={() => toggleGoal(goal.id)}
                                            className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                        >
                                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                                {isSelected && <Check className="h-4 w-4" />}
                                            </span>
                                            <span className="flex items-center gap-2 truncate">
                                                <span
                                                    className="w-2 h-2 rounded-full shrink-0"
                                                    style={{ backgroundColor: goal.color || "#ccc" }}
                                                />
                                                <span className="truncate">{goal.title}</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <MatrixContainer initialItems={filteredItems} />
            </div>
        </div>
    );
}
