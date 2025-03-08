import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json(
      { 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || 'unknown'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Service unavailable',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
} 