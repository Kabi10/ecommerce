import { render, screen } from '@testing-library/react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '../ui/select'

const renderSelect = () => {
  return render(
    <Select defaultValue="apple">
      <SelectTrigger aria-label="Fruit selection">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

describe('Select Component', () => {
  it('renders select trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Fruit selection">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByLabelText('Fruit selection')).toBeInTheDocument()
  })

  it('renders with default value', () => {
    renderSelect()
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })

  it('applies custom className to trigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom-class" aria-label="Fruit selection">
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByLabelText('Fruit selection')).toHaveClass('custom-class')
  })

  it('handles disabled state', () => {
    render(
      <Select disabled>
        <SelectTrigger aria-label="Fruit selection">
          <SelectValue />
        </SelectTrigger>
      </Select>
    )
    const trigger = screen.getByLabelText('Fruit selection')
    expect(trigger).toBeDisabled()
    expect(trigger).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })
}) 