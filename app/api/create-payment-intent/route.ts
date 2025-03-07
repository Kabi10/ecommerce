import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // In a real implementation, this would create a payment intent with Stripe
    // For testing purposes, we're just returning a mock client secret
    return NextResponse.json({ clientSecret: 'test_client_secret' });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 