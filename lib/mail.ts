export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmationLink = `http://localhost:3000/auth/new-password?token=${token}`;

    console.log("==========================================");
    console.log("📧 MOCK EMAIL SENDING 📧");
    console.log(`To: ${email}`);
    console.log(`Subject: Reset your password`);
    console.log(`Link: ${confirmationLink}`);
    console.log("==========================================");

    // In a real app, integrate Resend here:
    // await resend.emails.send({ ... })
};
