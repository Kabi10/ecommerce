import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { jwtVerify } from 'jose'
import { getJwtSecretKey } from '@/lib/auth'

const prisma = new PrismaClient()

// Input validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = resetPasswordSchema.parse(body)
    
    // Verify JWT token
    const { payload } = await jwtVerify(
      validatedData.token,
      new TextEncoder().encode(getJwtSecretKey())
    )

    if (!payload.userId || typeof payload.userId !== 'string') {
      return NextResponse.json(
        { message: 'Invalid reset token' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hash(validatedData.password, 12)

    // Update user's password
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Password reset error:', error)
    return NextResponse.json(
      { message: 'Invalid or expired reset token' },
      { status: 400 }
    )
  }
} 