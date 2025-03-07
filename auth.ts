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

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  providers: [],
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
  theme: {
    logo: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
  },
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig) 