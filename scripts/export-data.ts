// scripts/export-data.ts
// Exports all database data to a JSON file for backup/seeding purposes

import { db } from '../lib/db';
import fs from 'fs';
import path from 'path';

interface ExportedData {
    exportedAt: string;
    users: Array<{
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
        password: string | null;
        goals: Array<{
            id: string;
            title: string;
            motivation: string | null;
            deadline: Date | null;
            mode: string;
            consistency_score: number;
            color: string | null;
            createdAt: Date;
            updatedAt: Date;
            actionItems: Array<{
                id: string;
                title: string;
                description: string | null;
                type: string;
                sort_order: number;
                is_completed: boolean;
                last_completed_at: Date | null;
                deadline: Date | null;
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
                    date_logged: Date;
                    value: number;
                }>;
            }>;
        }>;
    }>;
}

async function exportData(): Promise<void> {
    console.log('🌱 Goal Garden - Data Export');
    console.log('============================\n');

    // Fetch all users with their complete data structure
    const users = await db.user.findMany({
        include: {
            goals: {
                include: {
                    actionItems: {
                        include: {
                            logs: true
                        }
                    }
                }
            }
        }
    });

    console.log(`📊 Found ${users.length} user(s)`);

    let totalGoals = 0;
    let totalActionItems = 0;
    let totalLogs = 0;

    users.forEach(user => {
        console.log(`  👤 ${user.email}: ${user.goals.length} goal(s)`);
        totalGoals += user.goals.length;
        user.goals.forEach(goal => {
            totalActionItems += goal.actionItems.length;
            goal.actionItems.forEach(item => {
                totalLogs += item.logs.length;
            });
        });
    });

    console.log(`\n📈 Total: ${totalGoals} goals, ${totalActionItems} action items, ${totalLogs} logs`);

    // Prepare export data (excluding accounts and sessions for security)
    const exportData: ExportedData = {
        exportedAt: new Date().toISOString(),
        users: users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            password: user.password, // Include password hash for full restoration
            goals: user.goals.map(goal => ({
                id: goal.id,
                title: goal.title,
                motivation: goal.motivation,
                deadline: goal.deadline,
                mode: goal.mode,
                consistency_score: goal.consistency_score,
                color: goal.color,
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt,
                actionItems: goal.actionItems.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    type: item.type,
                    sort_order: item.sort_order,
                    is_completed: item.is_completed,
                    last_completed_at: item.last_completed_at,
                    deadline: item.deadline,
                    progress_percent: item.progress_percent,
                    frequency: item.frequency,
                    widget_type: item.widget_type,
                    target_value: item.target_value,
                    unit: item.unit,
                    current_streak: item.current_streak,
                    is_important: item.is_important,
                    is_urgent: item.is_urgent,
                    logs: item.logs.map(log => ({
                        id: log.id,
                        date_logged: log.date_logged,
                        value: log.value
                    }))
                }))
            }))
        }))
    };

    // Write to JSON file
    const outputPath = path.join(__dirname, '../prisma/seed-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

    console.log(`\n✅ Data exported successfully to: ${outputPath}`);
    console.log('\n💡 To restore this data, run: npx tsx scripts/seed.ts');
}

exportData()
    .catch((e) => {
        console.error('❌ Export failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
