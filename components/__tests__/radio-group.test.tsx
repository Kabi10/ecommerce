import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

describe('Radio Group Component', () => {
  const renderRadioGroup = () => {
    return render(
      <RadioGroup defaultValue="option1">
        <div>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </div>
        <div>
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </div>
      </RadioGroup>
    )
  }

  it('renders radio group with items', () => {
    renderRadioGroup()
    const radioButtons = screen.getAllByRole('radio')
    expect(radioButtons).toHaveLength(2)
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
  })

  it('applies default styles to radio group', () => {
    renderRadioGroup()
    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toHaveClass('grid', 'gap-2')
  })

  it('applies default styles to radio items', () => {
    renderRadioGroup()
    const radioButton = screen.getByLabelText('Option 1')
    expect(radioButton).toHaveClass(
      'aspect-square',
      'h-4',
      'w-4',
      'rounded-full',
      'border',
      'border-primary',
      'text-primary',
      'shadow'
    )
  })

  it('handles selection state', async () => {
    const user = userEvent.setup()
    renderRadioGroup()
    
    const option1 = screen.getByLabelText('Option 1')
    const option2 = screen.getByLabelText('Option 2')
    
    // Option 1 should be selected by default
    expect(option1).toBeChecked()
    expect(option2).not.toBeChecked()
    
    // Select option 2
    await user.click(option2)
    expect(option1).not.toBeChecked()
    expect(option2).toBeChecked()
  })

  it('applies custom className to radio group', () => {
    render(
      <RadioGroup className="custom-group">
        <RadioGroupItem value="test" />
      </RadioGroup>
    )
    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toHaveClass('custom-group')
  })

  it('applies custom className to radio item', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="test" className="custom-radio" />
      </RadioGroup>
    )
    const radioButton = screen.getByRole('radio')
    expect(radioButton).toHaveClass('custom-radio')
  })

  it('handles disabled state', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="test" disabled />
      </RadioGroup>
    )
    const radioButton = screen.getByRole('radio')
    expect(radioButton).toBeDisabled()
    expect(radioButton).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('handles focus styles', async () => {
    const user = userEvent.setup()
    renderRadioGroup()
    const radioButton = screen.getByLabelText('Option 1')
    
    await user.tab()
    expect(radioButton).toHaveFocus()
    expect(radioButton).toHaveClass('focus-visible:ring-1', 'focus-visible:ring-ring')
  })
}) 