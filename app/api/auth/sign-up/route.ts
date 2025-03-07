import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // In a real implementation, this would create a user in the database
    // For testing purposes, we're just returning a mock success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during sign up:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 