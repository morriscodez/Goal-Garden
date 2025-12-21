import Link from 'next/link';
import { Plus, ListChecks, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-zinc-900">GoalPlanner</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Logout
          </button>
          <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold">
            D
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-10">
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
          <Link href="/dashboard" className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-blue-200">
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
      </main>

      {/* Footer Toggle */}
      <div className="py-8 flex justify-center">
        <button className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
          <ListChecks className="h-4 w-4" />
          Switch to Daily/Weekly View
        </button>
      </div>

      <div className="py-4 text-center text-xs text-zinc-400">
        © 2024 GoalPlanner. All rights reserved.
      </div>
    </div>
  );
}
