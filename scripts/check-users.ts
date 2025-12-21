import { db } from "../lib/db";

async function main() {
    const users = await db.user.findMany({
        include: { accounts: true },
    });

    console.log("Found users:", users.length);
    users.forEach(u => {
        console.log(`User: ${u.email}`);
        console.log(` - Has Password: ${!!u.password}`);
        console.log(` - Accounts: ${u.accounts.map(a => a.provider).join(", ")}`);
    });
}

main();
