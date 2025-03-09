import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET() {
  try {
    // System information
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    // Environment variables check (only checking existence, not values)
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      GITHUB_CLIENT_ID: !!process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: !!process.env.GITHUB_CLIENT_SECRET,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      UPLOADTHING_SECRET: !!process.env.UPLOADTHING_SECRET,
      UPLOADTHING_APP_ID: !!process.env.UPLOADTHING_APP_ID,
    };

    // Database connection test
    let dbStatus = 'Unknown';
    let dbError = null;
    
    try {
      // Simple query to test connection
      await prisma.$queryRaw`SELECT 1 as result`;
      dbStatus = 'Connected';
    } catch (error) {
      dbStatus = 'Error';
      dbError = error instanceof Error ? error.message : 'Unknown database error';
    }

    // Return all diagnostic information
    return NextResponse.json({
      status: 'ok',
      system: systemInfo,
      environment: envVars,
      database: {
        status: dbStatus,
        error: dbError,
      },
    });
  } catch (error) {
    // If anything goes wrong with the diagnostics themselves
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    // Always disconnect from the database
    await prisma.$disconnect();
  }
} 