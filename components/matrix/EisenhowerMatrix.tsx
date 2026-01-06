"use client";

import { ActionItem } from "@prisma/client";
import { MatrixQuadrant } from "./MatrixQuadrant";

interface EisenhowerMatrixProps {
    items: (ActionItem & { goal?: { title: string; color: string | null } })[];
}

export function EisenhowerMatrix({ items }: EisenhowerMatrixProps) {
    // Filter items for each quadrant
    const urgentImportant = items.filter((i) => i.is_urgent && i.is_important);
    const urgentNotImportant = items.filter((i) => i.is_urgent && !i.is_important);
    const notUrgentImportant = items.filter((i) => !i.is_urgent && i.is_important);
    const notUrgentNotImportant = items.filter(
        (i) => !i.is_urgent && !i.is_important && i.is_urgent !== null && i.is_important !== null
    );

    return (
        <div className="grid grid-cols-2 grid-rows-2 h-full gap-4 p-4 min-h-[600px]">
            <MatrixQuadrant
                id="ur_im"
                title="Urgent & Important"
                description="Do it now. Crises, deadlines, problems."
                items={urgentImportant}
                variant="red"
            />
            <MatrixQuadrant
                id="ur_not_im"
                title="Urgent but Not Important"
                description="Delegate it. Interruptions, some calls/emails."
                items={urgentNotImportant}
                variant="orange"
            />
            <MatrixQuadrant
                id="not_ur_im"
                title="Important but Not Urgent"
                description="Schedule it. Planning, relationship building."
                items={notUrgentImportant}
                variant="blue"
            />
            <MatrixQuadrant
                id="not_ur_not_im"
                title="Not Urgent & Not Important"
                description="Delete it. Time wasters, busy work."
                items={notUrgentNotImportant}
                variant="green"
            />
        </div>
    );
}
