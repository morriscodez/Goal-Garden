import Link from 'next/link';
import { Plus, ListChecks, CheckCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/auth-actions";

export default async function LandingPage() {
  const session = await auth();

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

        {session?.user ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-semibold text-zinc-600 hover:text-blue-600">
              Dashboard
            </Link>
            <form action={handleSignOut}>
              <button className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-300 transition-colors">
                Logout
              </button>
            </form>
            <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
              {session.user.image ? (
                <img src={session.user.image} alt="User" className="h-full w-full object-cover" />
              ) : (
                <span>{session.user.name?.[0] || 'U'}</span>
              )}
            </div>
          </div>
        ) : (
          <Link href="/login" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-shadow shadow-sm hover:shadow-md">
            Login
          </Link>
        )}
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
          <Link href={session ? "/goals/new" : "/login"} className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-blue-200">
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
          <Link href={session ? "/goals" : "/login"} className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md hover:ring-blue-200">
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
        <Link href={session ? "/dashboard" : "/login"} className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
          <ListChecks className="h-4 w-4" />
          Switch to Daily/Weekly View
        </Link>
      </div>

      <div className="py-4 text-center text-xs text-zinc-400">
        © 2024 GoalPlanner. All rights reserved.
      </div>
    </div>
  );
}
