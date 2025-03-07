import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '../ui/switch'

describe('Switch Component', () => {
  it('renders switch in unchecked state', () => {
    const { container } = render(<Switch />)
    const switchRoot = container.querySelector('button[role="switch"]')
    expect(switchRoot).toBeInTheDocument()
    expect(switchRoot).toHaveAttribute('data-state', 'unchecked')
  })

  it('renders switch in checked state', () => {
    const { container } = render(<Switch checked />)
    const switchRoot = container.querySelector('button[role="switch"]')
    expect(switchRoot).toHaveAttribute('data-state', 'checked')
  })

  it('applies custom className to switch', () => {
    const { container } = render(<Switch className="custom-switch" />)
    const switchRoot = container.querySelector('button[role="switch"]')
    expect(switchRoot).toHaveClass('custom-switch')
  })

  it('handles disabled state', () => {
    const { container } = render(<Switch disabled />)
    const switchRoot = container.querySelector('button[role="switch"]')
    expect(switchRoot).toBeDisabled()
    expect(switchRoot).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('handles click events', () => {
    const onCheckedChange = jest.fn()
    const { container } = render(<Switch onCheckedChange={onCheckedChange} />)
    const switchRoot = container.querySelector('button[role="switch"]')!
    
    fireEvent.click(switchRoot)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    
    fireEvent.click(switchRoot)
    expect(onCheckedChange).toHaveBeenCalledWith(false)
  })

  it('renders thumb element with correct styles', () => {
    const { container } = render(<Switch />)
    const thumb = container.querySelector('span[class*="pointer-events-none"]')
    expect(thumb).toBeInTheDocument()
    expect(thumb).toHaveClass(
      'pointer-events-none',
      'block',
      'h-4',
      'w-4',
      'rounded-full',
      'bg-background',
      'shadow-lg',
      'ring-0',
      'transition-transform'
    )
  })
}) 