// scripts/verify-db.ts
import { db } from '../lib/db';

async function main() {
    console.log('Verifying database connection...');

    // Create a test user
    const email = `test-${Date.now()}@example.com`;
    console.log(`Creating user with email: ${email}`);

    const user = await db.user.create({
        data: {
            email,
            name: 'Test User',
            goals: {
                create: {
                    title: 'Verify Database',
                    mode: 'DEADLINE',
                    actionItems: {
                        create: {
                            title: 'Run verification script',
                            type: 'ONE_OFF',
                            is_completed: true
                        }
                    }
                }
            }
        },
        include: {
            goals: {
                include: {
                    actionItems: true
                }
            }
        }
    });

    console.log('User created successfully:', user.id);
    console.log('Goals created:', user.goals.length);
    console.log('First Goal:', user.goals[0].title);
    console.log('Action Items:', user.goals[0].actionItems[0].title);

    // Clean up
    console.log('Cleaning up...');
    await db.user.delete({ where: { id: user.id } });
    console.log('Verification complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
