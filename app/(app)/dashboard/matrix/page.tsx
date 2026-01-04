import { fetchMatrixItems } from "@/app/actions/matrix";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { MatrixFilterWrapper } from "@/components/matrix/MatrixFilterWrapper";
import { redirect } from "next/navigation";

export default async function MatrixPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { items } = await fetchMatrixItems();

    const goals = await db.goal.findMany({
        where: {
            userId: session.user.id,
        },
        select: {
            id: true,
            title: true,
            color: true,
            mode: true,
            consistency_score: true,
            deadline: true,
            motivation: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            // We select all Goal fields to match Goal type required by MatrixFilterWrapper props
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="h-full p-6">
            <MatrixFilterWrapper initialItems={items || []} goals={goals} />
        </div>
    );
}
