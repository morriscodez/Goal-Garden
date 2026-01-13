import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

import { format } from "date-fns";

/**
 * Formats a date using UTC components to avoid local timezone shifts.
 * This is useful when the date represents a specific day (like a deadline) 
 * regardless of the user's local time.
 */
export function formatDateUTC(date: Date | string | null | undefined, formatStr: string): string {
    if (!date) return "";
    const d = new Date(date);
    // Create a UTC-based date by adding the timezone offset
    // This effectively "shifts" the time so that local formatting displays the UTC date
    const utcDate = new Date(d.valueOf() + d.getTimezoneOffset() * 60 * 1000);
    return format(utcDate, formatStr);
}
