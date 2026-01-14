
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = "test@example.com"; // adjust if needed, or find first user
    // Find a user
    const user = await prisma.user.findFirst();

    if (!user) {
        console.log("No user found.");
        return;
    }

    console.log(`Found user: ${user.email} (${user.id})`);

    const completedGoals = await prisma.goal.findMany({
        where: {
            userId: user.id,
            is_completed: true
        }
    });

    console.log(`Found ${completedGoals.length} completed goals.`);

    if (completedGoals.length === 0) {
        console.log("Seeding dummy completed goals for testing...");

        const themes = ["blue", "emerald", "orange", "berry", "midnight"];
        const plantTitles = [
            "Refactor API",
            "Run 5K",
            "Save $500",
            "Finish Novel Draft",
            "Learn Rust"
        ];

        for (let i = 0; i < 5; i++) {
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - (Math.random() * 60 + 5)); // 5 to 65 days ago

            const completedAt = new Date(); // now
            // updated at is completed at proxy

            await prisma.goal.create({
                data: {
                    title: plantTitles[i],
                    userId: user.id,
                    mode: "deadline",
                    color: themes[i],
                    is_completed: true,
                    createdAt: createdAt,
                    updatedAt: completedAt, // This sets our approximate completion date
                    actionItems: {
                        create: Array.from({ length: Math.floor(Math.random() * 10) + 1 }).map((_, j) => ({
                            title: `Step ${j}`,
                            type: "task",
                            is_completed: true
                        }))
                    }
                }
            });
            console.log(`Created completed goal: ${plantTitles[i]}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
