import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Input validation schema
const adminSignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  secretKey: z.string(), // Add a secret key for additional security
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = adminSignUpSchema.parse(body)

    // Verify secret key (in production, use a secure environment variable)
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'your-development-secret-key'
    if (validatedData.secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { message: 'Invalid secret key' },
        { status: 403 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'ADMIN', // Set role to ADMIN
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'Admin user created successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Admin signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 