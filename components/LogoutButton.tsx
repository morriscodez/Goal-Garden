'use client';

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { clsx } from "clsx";

interface LogoutButtonProps {
    isCollapsed?: boolean;
}

export function LogoutButton({ isCollapsed }: LogoutButtonProps) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={clsx(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors",
                isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? "Logout" : undefined}
        >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
        </button>
    );
}
