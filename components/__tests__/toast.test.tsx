import { render, screen, fireEvent } from '@testing-library/react'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../ui/toast'

// Mock the portal to render inline
jest.mock('@radix-ui/react-toast', () => {
  const actual = jest.requireActual('@radix-ui/react-toast')
  return {
    ...actual,
    Provider: ({ children }: { children: React.ReactNode }) => <div data-testid="toast-provider">{children}</div>,
    Viewport: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="toast-viewport" className={className}>{children}</div>
    ),
    Root: ({ children, className, ...props }: any) => (
      <div data-testid="toast-root" className={className} {...props}>{children}</div>
    ),
  }
})

describe('Toast Component', () => {
  it('renders toast with default variant', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>This is a toast message.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByText('Notification')).toBeInTheDocument()
    expect(screen.getByText('This is a toast message.')).toBeInTheDocument()
    expect(screen.getByTestId('toast-root')).toHaveClass('border', 'bg-background')
  })

  it('renders toast with destructive variant', () => {
    render(
      <ToastProvider>
        <Toast variant="destructive">
          <ToastTitle>Error</ToastTitle>
          <ToastDescription>An error occurred.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    const toastRoot = screen.getByTestId('toast-root')
    expect(toastRoot).toHaveClass('destructive')
    expect(toastRoot).toHaveClass('border-destructive')
    expect(toastRoot).toHaveClass('bg-destructive')
  })

  it('renders toast with custom className', () => {
    render(
      <ToastProvider>
        <Toast className="custom-toast">
          <ToastTitle>Custom Toast</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByTestId('toast-root')).toHaveClass('custom-toast')
  })

  it('renders toast with action button', () => {
    const onAction = jest.fn()
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Action Required</ToastTitle>
          <ToastAction altText="Try again" onClick={onAction}>
            Try Again
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    const actionButton = screen.getByText('Try Again')
    fireEvent.click(actionButton)
    expect(onAction).toHaveBeenCalled()
  })

  it('renders toast with close button', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle>Closeable Toast</ToastTitle>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders toast viewport with custom className', () => {
    render(
      <ToastProvider>
        <ToastViewport className="custom-viewport" />
      </ToastProvider>
    )

    expect(screen.getByTestId('toast-viewport')).toHaveClass('custom-viewport')
  })

  it('renders toast title with custom className', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastTitle className="custom-title">Custom Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByText('Custom Title')).toHaveClass('custom-title')
  })

  it('renders toast description with custom className', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastDescription className="custom-description">
            Custom description
          </ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByText('Custom description')).toHaveClass('custom-description')
  })

  it('renders toast action with custom className', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastAction className="custom-action" altText="Custom action">
            Action
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByText('Action')).toHaveClass('custom-action')
  })

  it('renders toast close button with custom className', () => {
    render(
      <ToastProvider>
        <Toast>
          <ToastClose className="custom-close" />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByRole('button')).toHaveClass('custom-close')
  })
}) 