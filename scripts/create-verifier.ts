
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = "verifier@example.com";
    const password = "password";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upsert user
    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
            email,
            password: hashedPassword,
            name: "Verifier",
        }
    });

    console.log(`User ${email} created/updated.`);

    // Check goals
    const goalsBefore = await prisma.goal.count({ where: { userId: user.id } });
    if (goalsBefore < 5) {
        console.log("Seeding goals for verifier...");
        const themes = ["blue", "emerald", "orange", "berry", "midnight"];
        for (let i = 0; i < 5; i++) {
            await prisma.goal.create({
                data: {
                    title: `Test Plant ${i}`,
                    userId: user.id,
                    mode: "deadline",
                    color: themes[i],
                    is_completed: true,
                    updatedAt: new Date(), // Just completed
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 10 + 5)), // Variable duration
                }
            });
        }
    }
    console.log("Verifier ready.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
