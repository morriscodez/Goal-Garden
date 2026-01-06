import { fetchMatrixItems } from "@/app/actions/matrix";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MatrixContainer } from "@/components/matrix/MatrixContainer";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function GoalMatrixPage({ params }: PageProps) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { items } = await fetchMatrixItems(id);

    const goal = await db.goal.findUnique({
        where: {
            id,
            userId: session.user.id,
        },
    });

    if (!goal) {
        redirect("/dashboard");
    }

    return (
        <div className="h-full flex flex-col p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Link href={`/goals/${id}`}>
                    <button className={cn(
                        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                        "hover:bg-accent hover:text-accent-foreground h-10 w-10"
                    )}>
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Eisenhower Matrix
                        <span
                            className="text-sm font-normal px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: goal.color || "#ccc" }}
                        >
                            {goal.title}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Progress, not perfection</p>
                </div>
            </div>
            <div className="flex-1">
                <MatrixContainer initialItems={items || []} goalId={id} />
            </div>
        </div>
    );
}
