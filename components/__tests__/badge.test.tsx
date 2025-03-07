import { render, screen } from '@testing-library/react'
import { Badge } from '../ui/badge'

describe('Badge Component', () => {
  it('renders badge with default variant', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-md',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring',
      'focus:ring-offset-2',
      'border-transparent',
      'bg-primary',
      'text-primary-foreground',
      'shadow',
      'hover:bg-primary/80'
    )
  })

  it('renders badge with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>)
    const badge = screen.getByText('Secondary Badge')
    expect(badge).toHaveClass(
      'border-transparent',
      'bg-secondary',
      'text-secondary-foreground',
      'hover:bg-secondary/80'
    )
  })

  it('renders badge with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)
    const badge = screen.getByText('Destructive Badge')
    expect(badge).toHaveClass(
      'border-transparent',
      'bg-destructive',
      'text-destructive-foreground',
      'shadow',
      'hover:bg-destructive/80'
    )
  })

  it('renders badge with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>)
    const badge = screen.getByText('Outline Badge')
    expect(badge).toHaveClass('text-foreground')
  })

  it('applies custom className to badge', () => {
    render(<Badge className="custom-badge">Custom Badge</Badge>)
    const badge = screen.getByText('Custom Badge')
    expect(badge).toHaveClass('custom-badge')
  })

  it('renders with custom children', () => {
    render(
      <Badge>
        <span data-testid="custom-child">Custom Child</span>
      </Badge>
    )
    expect(screen.getByTestId('custom-child')).toBeInTheDocument()
  })
}) 