import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { Resend } from 'resend'
import { SignJWT } from 'jose'
import { getJwtSecretKey } from '@/lib/auth'

const prisma = new PrismaClient()
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Input validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate input
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })

    if (!user) {
      // Don't reveal whether a user exists
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 }
      )
    }

    // Generate JWT reset token that expires in 1 hour
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .setIssuedAt()
      .sign(new TextEncoder().encode(getJwtSecretKey()))

    // Send reset email if Resend is configured
    if (resend) {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
      
      await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: email,
        subject: 'Reset your password',
        html: `
          <h1>Reset Your Password</h1>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      })
    } else {
      console.warn('Resend API key not configured. Password reset email not sent.')
      // For development, log the reset URL
      if (process.env.NODE_ENV === 'development') {
        console.log(`Reset URL (dev only): ${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`)
      }
    }

    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive a password reset link.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Password reset request error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 