
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import { EditGoalForm } from '@/components/EditGoalForm';

export default async function EditGoalPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    const { id } = await params;

    const goal = await db.goal.findUnique({
        where: {
            id,
            userId: session.user.id
        }
    });

    if (!goal) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <nav className="text-sm text-zinc-500 mb-2">Goals &gt; Edit Goal</nav>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Edit Your Goal</h1>
                <p className="text-zinc-600 mt-2">Refine your vision and keep your compass true.</p>
            </div>

            <EditGoalForm goal={goal} />
        </div>
    );
}
