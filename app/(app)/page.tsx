import Link from 'next/link';
import { Plus, ListChecks } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 text-center mb-4 tracking-tight">
                What is your vision for the<br />future?
            </h1>
            <p className="text-zinc-500 text-lg mb-12 text-center max-w-lg">
                Focus on the big picture before diving into the details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {/* Create Goal Card */}
                <Link href="/goals/new" className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-blue-200">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Plus className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Create Goal</h2>
                    <p className="text-zinc-500 mb-8 line-clamp-2">
                        Define a new milestone for your future self. Set clear objectives.
                    </p>
                    <div className="flex items-center gap-2 font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                        Get Started →
                    </div>
                </Link>

                {/* Review Goals Card */}
                <Link href="/goals" className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-blue-200">
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ListChecks className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">Review Goals</h2>
                    <p className="text-zinc-500 mb-8 line-clamp-2">
                        Track progress on your existing path. Stay accountable.
                    </p>
                    <div className="flex items-center gap-2 font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                        View List →
                    </div>
                </Link>
            </div>
        </div>
    );
}
