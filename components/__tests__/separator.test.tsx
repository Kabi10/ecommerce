import { render } from '@testing-library/react'
import { Separator } from '../ui/separator'

describe('Separator Component', () => {
  it('renders horizontal separator by default', () => {
    const { container } = render(<Separator />)
    const separator = container.querySelector('[data-slot="separator-root"]')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).toHaveClass(
      'bg-border',
      'shrink-0',
      'data-[orientation=horizontal]:h-px',
      'data-[orientation=horizontal]:w-full',
      'data-[orientation=vertical]:h-full',
      'data-[orientation=vertical]:w-px'
    )
  })

  it('renders vertical separator', () => {
    const { container } = render(<Separator orientation="vertical" />)
    const separator = container.querySelector('[data-slot="separator-root"]')
    expect(separator).toHaveAttribute('data-orientation', 'vertical')
  })

  it('applies custom className to separator', () => {
    const { container } = render(<Separator className="custom-separator" />)
    const separator = container.querySelector('[data-slot="separator-root"]')
    expect(separator).toHaveClass('custom-separator')
  })

  it('renders as decorative element by default', () => {
    const { container } = render(<Separator />)
    const separator = container.querySelector('[data-slot="separator-root"]')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).toHaveAttribute('data-slot', 'separator-root')
  })

  it('renders as non-decorative element', () => {
    const { container } = render(<Separator decorative={false} />)
    const separator = container.querySelector('[data-slot="separator-root"]')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expect(separator).not.toHaveAttribute('role', 'none')
  })
}) 