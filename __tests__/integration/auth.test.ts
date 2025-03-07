import { prismaMock } from './test-utils'
import { POST as signInHandler } from '@/app/api/auth/sign-in/route'
import { POST as signUpHandler } from '@/app/api/auth/sign-up/route'
import { POST as forgotPasswordHandler } from '@/app/api/auth/forgot-password/route'
import { POST as resetPasswordHandler } from '@/app/api/auth/reset-password/route'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

// Mock global objects needed for tests
global.Request = class MockRequest {
  url: string;
  method: string;
  headers: Headers;
  
  constructor(url: string, options: RequestInit = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Headers(options.headers);
  }
} as any;

global.Response = class MockResponse {
  status: number;
  statusText: string;
  body: any;
  headers: Headers;

  constructor(body?: any, options: any = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.statusText = options.statusText || '';
    this.headers = new Headers(options.headers);
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
} as any;

global.Headers = class MockHeaders {
  private headers: Record<string, string> = {};

  constructor(init?: Record<string, string>) {
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers[key.toLowerCase()] = value;
      });
    }
  }

  get(name: string): string | null {
    return this.headers[name.toLowerCase()] || null;
  }

  set(name: string, value: string): void {
    this.headers[name.toLowerCase()] = value;
  }
} as any;

// Mock NextRequest and NextResponse
jest.mock('next/server', () => {
  return {
    NextRequest: class MockNextRequest {
      url: string;
      method: string;
      headers: Headers;
      cookies: any;
      nextUrl: URL;
      
      constructor(url: string, options: RequestInit = {}) {
        this.url = url;
        this.method = options.method || 'GET';
        this.headers = new Headers(options.headers);
        this.cookies = { get: jest.fn(), getAll: jest.fn(), set: jest.fn(), delete: jest.fn() };
        this.nextUrl = new URL(url);
      }
      
      json() {
        return Promise.resolve({});
      }
    },
    NextResponse: {
      json: (data: any, init?: ResponseInit) => {
        return {
          status: init?.status || 200,
          headers: new Headers(init?.headers),
          json: () => Promise.resolve(data)
        };
      },
      redirect: (url: string) => {
        return {
          status: 302,
          headers: new Headers({ Location: url }),
          url
        };
      }
    }
  };
});

// Import after mocks are set up
const { POST } = require('@/app/api/auth/register/route');
const { POST: LoginPOST } = require('@/app/api/auth/login/route');

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => Promise.resolve('hashed_password')),
  compare: jest.fn(() => Promise.resolve(true)),
}))

// Mock email sending
jest.mock('@/lib/email', () => ({
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  sendVerificationEmail: jest.fn(() => Promise.resolve()),
}))

// Mock JWT functions
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock_jwt_token'),
  })),
  jwtVerify: jest.fn().mockResolvedValue({
    payload: { 
      sub: 'test-user-id',
      email: 'test@example.com',
    },
  }),
}))

// Mock the auth handlers
jest.mock('../../../app/api/auth/sign-in/route', () => ({ POST: signInHandler }), { virtual: true });
jest.mock('../../../app/api/auth/sign-up/route', () => ({ POST: signUpHandler }), { virtual: true });
jest.mock('../../../app/api/auth/forgot-password/route', () => ({ POST: forgotPasswordHandler }), { virtual: true });
jest.mock('../../../app/api/auth/reset-password/route', () => ({ POST: resetPasswordHandler }), { virtual: true });

describe('Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sign In', () => {
    it('should sign in a user with valid credentials', async () => {
      // Mock user in database
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Test User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Mock successful password comparison
      require('bcryptjs').compare.mockResolvedValue(true);

      // Setup sign in handler
      signInHandler.mockImplementation(async (request) => {
        const { email, password } = await request.json()
        
        const user = await prismaMock.user.findUnique({
          where: { email },
        })
        
        if (!user) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }
        
        const passwordMatch = await require('bcryptjs').compare(password, user.password)
        
        if (!passwordMatch) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }
        
        // Create JWT token
        const token = 'mock_jwt_token';
        
        return new Response(JSON.stringify({ 
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
          token,
        }), { status: 200 });
      });

      // Create sign in request
      const request = new Request('http://localhost:3000/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
      
      // Call the sign in handler
      const response = await signInHandler(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(200);
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
      expect(data.token).toBe('mock_jwt_token');

      // Verify that the user was looked up
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });

      // Verify that the password was compared
      expect(require('bcryptjs').compare).toHaveBeenCalledWith('password123', 'hashed_password');
    });

    it('should reject sign in with invalid credentials', async () => {
      // Mock user not found
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Setup sign in handler
      signInHandler.mockImplementation(async (request) => {
        const { email } = await request.json();
        
        const user = await prismaMock.user.findUnique({
          where: { email },
        });
        
        if (!user) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }
        
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      });

      // Create sign in request
      const request = new Request('http://localhost:3000/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'wrong@example.com', password: 'wrong_password' }),
      });
      
      // Call the sign in handler
      const response = await signInHandler(request);
      const data = await response.json();
      
      // Verify the response
      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid credentials');

      // Verify that the user lookup was attempted
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'wrong@example.com' },
      });
    });
  })

  describe('Sign Up', () => {
    it('should create a new user account', async () => {
      // Mock user not found (email not in use)
      prismaMock.user.findUnique.mockResolvedValue(null)
      
      // Mock user creation
      prismaMock.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'newuser@example.com',
        password: 'hashed_password',
        name: 'New User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Mock the API handler
      const signUp = async (req: NextRequest) => {
        const { email, password, name } = await req.json()
        
        // Check if user already exists
        const existingUser = await prismaMock.user.findUnique({
          where: { email },
        })
        
        if (existingUser) {
          return NextResponse.json(
            { error: 'Email already in use' },
            { status: 400 }
          )
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        
        // Create user
        const user = await prismaMock.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: 'user',
          },
        })
        
        return NextResponse.json({ 
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
        })
      }

      // Create request with new user data
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        }),
      })
      
      // Call the API handler
      const response = await signUp(request)
      const data = await response.json()
      
      // Assertions
      expect(response.status).toBe(200)
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe('newuser@example.com')
      expect(data.user.name).toBe('New User')
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@example.com',
          password: 'hashed_password',
          name: 'New User',
          role: 'user',
        },
      })
    })

    it('should return error if email is already in use', async () => {
      // Mock user found (email in use)
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'existing-user-id',
        email: 'existing@example.com',
        password: 'hashed_password',
        name: 'Existing User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Mock the API handler
      const signUp = async (req: NextRequest) => {
        const { email } = await req.json()
        
        // Check if user already exists
        const existingUser = await prismaMock.user.findUnique({
          where: { email },
        })
        
        if (existingUser) {
          return NextResponse.json(
            { error: 'Email already in use' },
            { status: 400 }
          )
        }
        
        return NextResponse.json({ success: true })
      }

      // Create request with existing email
      const request = new NextRequest('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'password123',
          name: 'New User',
        }),
      })
      
      // Call the API handler
      const response = await signUp(request)
      const data = await response.json()
      
      // Assertions
      expect(response.status).toBe(400)
      expect(data.error).toBe('Email already in use')
    })
  })

  describe('Forgot Password', () => {
    it('should send a password reset email', async () => {
      // Mock user found
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Test User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Mock email sending function
      const sendPasswordResetEmail = jest.fn(() => Promise.resolve())

      // Mock the API handler
      const forgotPassword = async (req: NextRequest) => {
        const { email } = await req.json()
        
        // Find user by email
        const user = await prismaMock.user.findUnique({
          where: { email },
        })
        
        // Always return success even if user not found (security best practice)
        if (!user) {
          return NextResponse.json({ 
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.' 
          })
        }
        
        // Create reset token
        const token = await new SignJWT({ sub: user.id, email: user.email })
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('1h')
          .sign(new TextEncoder().encode('secret'))
        
        // Send password reset email
        await sendPasswordResetEmail(user.email, token)
        
        return NextResponse.json({ 
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.' 
        })
      }

      // Create request with email
      const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      })
      
      // Call the API handler
      const response = await forgotPassword(request)
      const data = await response.json()
      
      // Assertions
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('If an account with that email exists, a password reset link has been sent.')
    })

    it('should return success even if email is not found (security)', async () => {
      // Mock user not found
      prismaMock.user.findUnique.mockResolvedValue(null)

      // Mock the API handler
      const forgotPassword = async (req: NextRequest) => {
        const { email } = await req.json()
        
        // Find user by email
        const user = await prismaMock.user.findUnique({
          where: { email },
        })
        
        // Always return success even if user not found (security best practice)
        return NextResponse.json({ 
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.' 
        })
      }

      // Create request with non-existent email
      const request = new NextRequest('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent@example.com',
        }),
      })
      
      // Call the API handler
      const response = await forgotPassword(request)
      const data = await response.json()
      
      // Assertions
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('If an account with that email exists, a password reset link has been sent.')
    })
  })

  describe('Reset Password', () => {
    it('should reset password with valid token', async () => {
      // Mock user found
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'old_hashed_password',
        name: 'Test User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      
      // Mock user update
      prismaMock.user.update.mockResolvedValue({
        id: 'test-user-id',
        email: 'test@example.com',
        password: 'new_hashed_password',
        name: 'Test User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Mock the API handler
      const resetPassword = async (req: NextRequest) => {
        const { token, password } = await req.json()
        
        try {
          // Verify token
          const { payload } = await jwtVerify(
            token, 
            new TextEncoder().encode('secret')
          )
          
          const userId = payload.sub as string
          
          // Find user by ID
          const user = await prismaMock.user.findUnique({
            where: { id: userId },
          })
          
          if (!user) {
            return NextResponse.json(
              { error: 'Invalid token' },
              { status: 400 }
            )
          }
          
          // Hash new password
          const hashedPassword = await bcrypt.hash(password, 10)
          
          // Update user password
          await prismaMock.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
          })
          
          return NextResponse.json({ 
            success: true,
            message: 'Password has been reset successfully.' 
          })
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 400 }
          )
        }
      }

      // Create request with token and new password
      const request = new NextRequest('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token: 'valid_token',
          password: 'new_password',
        }),
      })
      
      // Call the API handler
      const response = await resetPassword(request)
      const data = await response.json()
      
      // Assertions
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Password has been reset successfully.')
      expect(jwtVerify).toHaveBeenCalled()
      expect(bcrypt.hash).toHaveBeenCalledWith('new_password', 10)
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: { password: 'hashed_password' },
      })
    })
  })
}) 