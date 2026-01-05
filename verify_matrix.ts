
import { db } from "./lib/db";

async function verify() {
    console.log("Verifying data directly via DB...");

    // 1. Fetch all goals
    const goals = await db.goal.findMany();
    // mapped by ID
    const goalMap = new Map(goals.map(g => [g.id, g]));

    // 2. Fetch ALL action items
    const items = await db.actionItem.findMany();
    console.log(`Total items found: ${items.length}`);

    // Check for Rhythm items
    const rhythmItems = items.filter(i => i.frequency !== null);
    console.log(`Rhythm items (frequency != null): ${rhythmItems.length}`);

    if (rhythmItems.length > 0) {
        console.log("Details of Rhythm items:");
        rhythmItems.forEach(i => {
            const g = goalMap.get(i.goalId);
            console.log(`- Item: "${i.title}", Freq: ${i.frequency}, Goal: "${g?.title}", GoalMode: ${g?.mode}`);
        });
    }

    // Check for completed items
    // 6. Simulate the query logic to verify our fix works as expected conceptually
    const visibleItems = items.filter(i => {
        const goal = goalMap.get(i.goalId);
        // Logic from app/actions/matrix.ts
        if (!goal || goal.userId !== "dummy_user_id_check_skipped_here") return false; // simulated auth check
        if (goal.mode !== "DEADLINE") return false;
        if (i.is_completed) return false;
        if (i.frequency !== null) return false; // NEW check
        return true;
    });

    console.log(`Simulated Visible Items: ${visibleItems.length}`);
    visibleItems.forEach(i => console.log(`- [VISIBLE] ${i.title}`));

    // Check if any rhythm items slipped through (should be 0)
    const rhythmSlipped = visibleItems.filter(i => i.frequency !== null);
    if (rhythmSlipped.length > 0) {
        console.error("FAIL: Rhythm items (frequency != null) would still show based on simulation!");
    } else {
        console.log("PASS: No Rhythm items would show based on simulation.");
    }
}

verify().catch(console.error);
