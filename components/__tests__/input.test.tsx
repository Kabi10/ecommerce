import { render, screen, fireEvent } from '@/lib/test-utils'
import { Input } from '../ui/input'

describe('Input Component', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders input with default value', () => {
    render(<Input defaultValue="Default text" />)
    expect(screen.getByDisplayValue('Default text')).toBeInTheDocument()
  })

  it('handles user input correctly', () => {
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here')
    
    // Use fireEvent instead of userEvent to avoid timeout issues
    fireEvent.change(input, { target: { value: 'Hello World' } })
    
    expect(input).toHaveValue('Hello World')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('forwards additional props to input element', () => {
    render(<Input data-testid="test-input" aria-label="Test Input" />)
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('aria-label', 'Test Input')
  })

  it('renders disabled input', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('renders readonly input', () => {
    render(<Input readOnly defaultValue="Read only text" />)
    const input = screen.getByDisplayValue('Read only text')
    expect(input).toHaveAttribute('readonly')
  })

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="password" placeholder="Password" />)
    let input = screen.getByPlaceholderText('Password')
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="email" placeholder="Email" />)
    input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="number" placeholder="Number" />)
    input = screen.getByPlaceholderText('Number')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('handles required state', () => {
    render(<Input required placeholder="Required input" />)
    const input = screen.getByPlaceholderText('Required input')
    expect(input).toBeRequired()
  })

  it('handles invalid state with aria-invalid', () => {
    render(<Input aria-invalid placeholder="Invalid input" />)
    const input = screen.getByPlaceholderText('Invalid input')
    expect(input).toHaveAttribute('aria-invalid')
    expect(input).toHaveClass('aria-invalid:border-destructive')
  })

  it('handles file input type', () => {
    render(<Input type="file" data-testid="file-input" />)
    const input = screen.getByTestId('file-input')
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveClass('file:inline-flex', 'file:border-0')
  })

  it('handles focus and blur events', async () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()

    render(
      <Input
        placeholder="Focus test"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )
    const input = screen.getByPlaceholderText('Focus test')

    await input.focus()
    expect(onFocus).toHaveBeenCalled()

    await input.blur()
    expect(onBlur).toHaveBeenCalled()
  })
}) 