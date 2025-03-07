import { render, screen } from '@testing-library/react'
import { Checkbox } from '../ui/checkbox'

describe('Checkbox Component', () => {
  it('renders checkbox with default state', () => {
    render(<Checkbox aria-label="Test checkbox" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('renders checkbox with checked state', () => {
    render(<Checkbox aria-label="Test checkbox" checked />)
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' })
    expect(checkbox).toBeChecked()
  })

  it('applies custom className', () => {
    render(<Checkbox aria-label="Test checkbox" className="custom-class" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' })
    expect(checkbox).toHaveClass('custom-class')
  })

  it('handles disabled state', () => {
    render(<Checkbox aria-label="Test checkbox" disabled />)
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' })
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('handles invalid state', () => {
    render(<Checkbox aria-label="Test checkbox" aria-invalid />)
    const checkbox = screen.getByRole('checkbox', { name: 'Test checkbox' })
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(checkbox).toHaveClass('aria-invalid:ring-destructive/20', 'aria-invalid:border-destructive')
  })
}) 