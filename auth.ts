import NextAuth from "next-auth"
import { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import type { JWT as NextAuthJWT } from "next-auth/jwt"

const prisma = new PrismaClient()

interface CustomJWT extends NextAuthJWT {
  id: string
  role?: string
}

declare module "next-auth" {
  interface User {
    id?: string
    role?: string
  }
  interface Session {
    user: {
      id: string
      role?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
    email?: string | null
    name?: string | null
    image?: string | null
  }
}

export const config = {
  theme: {
    logo: "/images/logo.png",
  },
  providers: [
    Credentials({
      async authorize(credentials: Record<string, unknown>) {
        if (typeof credentials?.email !== 'string' || typeof credentials?.password !== 'string') {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) return null

          const passwordsMatch = await bcrypt.compare(credentials.password, user.password)

          if (!passwordsMatch) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error('Error in authorize:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const customToken = token as CustomJWT
        customToken.id = user.id
        customToken.role = user.role
        return customToken
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const customToken = token as CustomJWT
        session.user.id = customToken.id
        session.user.role = customToken.role
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config) 