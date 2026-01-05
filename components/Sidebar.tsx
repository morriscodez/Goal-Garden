'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Flag, Settings, Sprout, ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LogoutButton } from './LogoutButton';

const navItems = [
    { name: 'Goals', href: '/goals', icon: Flag },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Eisenhower Matrix', href: '/dashboard/matrix', icon: Grid2x2 },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    };

    if (!mounted) return null; // Avoid hydration mismatch or flash

    return (
        <div
            className={clsx(
                "flex h-screen flex-col bg-sidebar border-r border-sidebar-border p-4 shrink-0 transition-all duration-300 ease-in-out relative",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </button>

            {/* Logo Section */}
            <Link href="/" className={clsx("mb-8 flex items-center gap-3 px-2 hover:opacity-80 transition-opacity", isCollapsed && "justify-center")}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-primary">
                    <Sprout className="h-5 w-5" />
                </div>
                {!isCollapsed && (
                    <span className="text-xl font-bold text-sidebar-foreground whitespace-nowrap overflow-hidden">Goal Garden</span>
                )}
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={isCollapsed ? item.name : undefined}
                            className={twMerge(
                                clsx(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                                    isCollapsed && "justify-center px-2"
                                )
                            )}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-sidebar-border space-y-1">
                <Link
                    href="/settings"
                    title={isCollapsed ? "Settings" : undefined}
                    className={clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
                        isCollapsed && "justify-center px-2"
                    )}
                >
                    <Settings className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
                <div className="w-full">
                    <LogoutButton isCollapsed={isCollapsed} />
                </div>
            </div>
        </div>
    );
}
