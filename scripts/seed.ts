// scripts/seed.ts
// Seeds the database from an exported JSON backup file

import { db } from '../lib/db';
import fs from 'fs';
import path from 'path';

interface SeedData {
    exportedAt: string;
    users: Array<{
        id: string;
        name: string | null;
        email: string;
        emailVerified: string | null;
        image: string | null;
        password: string | null;
        goals: Array<{
            id: string;
            title: string;
            motivation: string | null;
            deadline: string | null;
            mode: string;
            consistency_score: number;
            color: string | null;
            createdAt: string;
            updatedAt: string;
            actionItems: Array<{
                id: string;
                title: string;
                description: string | null;
                type: string;
                sort_order: number;
                is_completed: boolean;
                last_completed_at: string | null;
                deadline: string | null;
                progress_percent: number;
                frequency: string | null;
                widget_type: string | null;
                target_value: number | null;
                unit: string | null;
                current_streak: number;
                is_important: boolean | null;
                is_urgent: boolean | null;
                logs: Array<{
                    id: string;
                    date_logged: string;
                    value: number;
                }>;
            }>;
        }>;
    }>;
}

async function seed(): Promise<void> {
    console.log('🌱 Goal Garden - Database Seeder');
    console.log('================================\n');

    // Read seed data file
    const seedFilePath = path.join(__dirname, '../prisma/seed-data.json');

    if (!fs.existsSync(seedFilePath)) {
        console.error('❌ Seed file not found at:', seedFilePath);
        console.log('\n💡 To create a seed file, first run: npx tsx scripts/export-data.ts');
        process.exit(1);
    }

    const rawData = fs.readFileSync(seedFilePath, 'utf-8');
    const seedData: SeedData = JSON.parse(rawData);

    console.log(`📅 Using seed data exported at: ${seedData.exportedAt}`);
    console.log(`👥 Found ${seedData.users.length} user(s) to seed\n`);

    // Ask for confirmation (check for --force flag)
    const forceMode = process.argv.includes('--force');

    if (!forceMode) {
        console.log('⚠️  WARNING: This will add data to your database.');
        console.log('   If users already exist, they will be skipped.\n');
        console.log('   Run with --force to skip this warning.\n');

        // Continue anyway for non-interactive mode
        console.log('   Proceeding with seed...\n');
    }

    let usersCreated = 0;
    let usersSkipped = 0;
    let goalsCreated = 0;
    let actionItemsCreated = 0;
    let logsCreated = 0;

    for (const userData of seedData.users) {
        console.log(`\n👤 Processing user: ${userData.email}`);

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            console.log(`   ⏭️  User already exists, skipping...`);
            usersSkipped++;
            continue;
        }

        // Create user with all nested data
        try {
            await db.user.create({
                data: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    emailVerified: userData.emailVerified ? new Date(userData.emailVerified) : null,
                    image: userData.image,
                    password: userData.password,
                    goals: {
                        create: userData.goals.map(goal => ({
                            id: goal.id,
                            title: goal.title,
                            motivation: goal.motivation,
                            deadline: goal.deadline ? new Date(goal.deadline) : null,
                            mode: goal.mode,
                            consistency_score: goal.consistency_score,
                            color: goal.color,
                            createdAt: new Date(goal.createdAt),
                            updatedAt: new Date(goal.updatedAt),
                            actionItems: {
                                create: goal.actionItems.map(item => ({
                                    id: item.id,
                                    title: item.title,
                                    description: item.description,
                                    type: item.type,
                                    sort_order: item.sort_order,
                                    is_completed: item.is_completed,
                                    last_completed_at: item.last_completed_at ? new Date(item.last_completed_at) : null,
                                    deadline: item.deadline ? new Date(item.deadline) : null,
                                    progress_percent: item.progress_percent,
                                    frequency: item.frequency,
                                    widget_type: item.widget_type,
                                    target_value: item.target_value,
                                    unit: item.unit,
                                    current_streak: item.current_streak,
                                    is_important: item.is_important,
                                    is_urgent: item.is_urgent,
                                    logs: {
                                        create: item.logs.map(log => ({
                                            id: log.id,
                                            date_logged: new Date(log.date_logged),
                                            value: log.value
                                        }))
                                    }
                                }))
                            }
                        }))
                    }
                }
            });

            usersCreated++;
            userData.goals.forEach(goal => {
                goalsCreated++;
                goal.actionItems.forEach(item => {
                    actionItemsCreated++;
                    logsCreated += item.logs.length;
                });
            });

            console.log(`   ✅ Created user with ${userData.goals.length} goal(s)`);
        } catch (error) {
            console.error(`   ❌ Failed to create user:`, error);
        }
    }

    console.log('\n================================');
    console.log('📊 Seed Summary:');
    console.log(`   👥 Users created: ${usersCreated}`);
    console.log(`   ⏭️  Users skipped: ${usersSkipped}`);
    console.log(`   🎯 Goals created: ${goalsCreated}`);
    console.log(`   📋 Action items created: ${actionItemsCreated}`);
    console.log(`   📝 Logs created: ${logsCreated}`);
    console.log('\n✅ Seed completed successfully!');
}

seed()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
