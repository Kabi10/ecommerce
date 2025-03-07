import React from 'react'
import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'
import { ReactElement } from 'react'

// Mock PrismaClient
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})

// Mock next-auth
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ sub: 'user-id', role: 'user' })),
}))

jest.mock('next-auth', () => ({
  auth: jest.fn(() => Promise.resolve({ 
    user: { id: 'user-id', name: 'Test User', email: 'test@example.com', role: 'user' } 
  })),
}))

// Helper to mock authenticated session
export const mockSession = (session: any) => {
  require('next-auth').auth.mockImplementation(() => Promise.resolve(session))
}

// Custom render function
export function render(ui: ReactElement, options = {}) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem
        >
          {children}
        </ThemeProvider>
      ),
      ...options,
    }),
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react' 