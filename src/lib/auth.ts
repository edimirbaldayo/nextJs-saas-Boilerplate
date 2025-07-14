import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma, getUserWithRoles } from "./db"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔍 Auth attempt for email:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          console.log('👤 User found:', user ? 'Yes' : 'No')
          console.log('🔐 User has password:', user?.password ? 'Yes' : 'No')
          console.log('✅ User is active:', user?.isActive)

          if (!user || !user.password) {
            console.log('❌ User not found or no password')
            return null
          }

          if (!user.isActive) {
            console.log('❌ User is not active')
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('🔑 Password valid:', isPasswordValid)

          if (!isPasswordValid) {
            console.log('❌ Invalid password')
            return null
          }

          console.log('✅ Authentication successful for:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name || 'User',
          }
        } catch (error) {
          console.error('💥 Database error during auth:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        // Fetch user roles when user first logs in
        try {
          const userWithRoles = await getUserWithRoles(user.id)
          if (userWithRoles) {
            const roles = userWithRoles.userRoles.map(ur => ur.role.name)
            token.roles = roles
          }
        } catch (error) {
          console.error('Error fetching user roles:', error)
        }
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string
        session.user.roles = token.roles || []
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development',
} 