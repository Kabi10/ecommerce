import { render, screen } from '@testing-library/react'
import { Label } from '../ui/label'

describe('Label Component', () => {
  it('renders label with text content', () => {
    render(<Label>Test Label</Label>)
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-sm',
      'leading-none',
      'font-medium',
      'select-none'
    )
  })

  it('applies custom className to label', () => {
    render(<Label className="custom-label">Test Label</Label>)
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('custom-label')
  })

  it('renders with custom children', () => {
    render(
      <Label>
        <span data-testid="custom-child">Custom Child</span>
      </Label>
    )
    expect(screen.getByTestId('custom-child')).toBeInTheDocument()
  })

  it('associates with form control using htmlFor', () => {
    render(
      <>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" type="text" />
      </>
    )
    const label = screen.getByText('Test Label')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('handles disabled state through group data attribute', () => {
    render(
      <div data-disabled="true">
        <Label>Disabled Label</Label>
      </div>
    )
    const label = screen.getByText('Disabled Label')
    expect(label).toHaveClass(
      'group-data-[disabled=true]:pointer-events-none',
      'group-data-[disabled=true]:opacity-50'
    )
  })
}) 