import { Sidebar } from '@/components/Sidebar';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-8">
                <div className="mx-auto max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
