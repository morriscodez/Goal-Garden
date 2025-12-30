'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Flag, Settings, LogOut, Sprout } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LogoutButton } from './LogoutButton';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Goals', href: '/goals', icon: Flag },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border p-4 shrink-0 transition-colors duration-200">
            <Link href="/" className="mb-8 flex items-center gap-3 px-2 hover:opacity-80 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Sprout className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-sidebar-foreground">Goal Garden</span>
            </Link>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={twMerge(
                                clsx(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                                )
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                >
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
                <div className="w-full">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}
