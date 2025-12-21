import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = credentials.email as string
                const password = credentials.password as string

                if (!email || !password) return null

                const user = await db.user.findUnique({
                    where: { email }
                })

                if (!user || !user.password) return null

                const passwordsMatch = await bcrypt.compare(password, user.password)

                if (passwordsMatch) return user

                return null
            }
        })
    ]
})
