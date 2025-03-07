import React, { ReactElement } from 'react'
import { render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'

// Mock ResizeObserver for components that use it (like Command)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Add ResizeObserver to the global object if it doesn't exist
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverMock
}

// Add scrollIntoView mock to Element.prototype
if (typeof window !== 'undefined') {
  window.ResizeObserver = window.ResizeObserver || ResizeObserverMock
  
  // Mock scrollIntoView if it doesn't exist
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = jest.fn()
  }
}

// Create a custom render function that includes providers
export function render(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...rtlRender(ui, {
      wrapper: ({ children }) => (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      ),
    }),
  }
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { render } 