import { render } from '@testing-library/react'
import { Skeleton } from '../ui/skeleton'

describe('Skeleton Component', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('bg-primary/10', 'animate-pulse', 'rounded-md')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />)
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveClass('custom-class')
  })

  it('forwards additional props to div element', () => {
    const { container } = render(
      <Skeleton data-testid="test-skeleton" aria-label="Loading" />
    )
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveAttribute('data-testid', 'test-skeleton')
    expect(skeleton).toHaveAttribute('aria-label', 'Loading')
  })

  it('renders with custom dimensions', () => {
    const { container } = render(
      <Skeleton style={{ width: '100px', height: '20px' }} />
    )
    const skeleton = container.querySelector('[data-slot="skeleton"]')
    expect(skeleton).toHaveStyle({
      width: '100px',
      height: '20px'
    })
  })
}) 