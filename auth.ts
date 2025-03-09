import NextAuth from "next-auth"
import { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
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
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.id) {
        const customToken = token as CustomJWT
        customToken.id = user.id
        customToken.role = user.role
        return customToken
      }
      
      // For OAuth sign-ins, create or update the user in the database
      if (account && account.provider && token.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: token.email }
          });
          
          if (existingUser) {
            // Update existing user with latest OAuth info
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: token.name,
                image: token.picture,
              }
            });
            
            token.id = existingUser.id;
            token.role = existingUser.role;
          } else {
            // Create new user from OAuth
            const newUser = await prisma.user.create({
              data: {
                email: token.email,
                name: token.name,
                image: token.picture,
                role: 'USER',
              }
            });
            
            token.id = newUser.id;
            token.role = newUser.role;
          }
        } catch (error) {
          console.error('Error syncing OAuth user:', error);
        }
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