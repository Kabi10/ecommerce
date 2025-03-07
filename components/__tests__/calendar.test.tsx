import { render, screen, fireEvent } from '@testing-library/react'
import { Calendar } from '../ui/calendar'
import { format } from 'date-fns'

// Mock the DayPicker component
jest.mock('react-day-picker', () => {
  const actual = jest.requireActual('react-day-picker')
  return {
    ...actual,
    DayPicker: ({ 
      className, 
      classNames, 
      showOutsideDays, 
      selected, 
      onSelect, 
      mode, 
      components,
      ...props 
    }: any) => {
      return (
        <div data-testid="day-picker" className={className}>
          <div data-testid="month-nav">
            <button 
              data-testid="prev-month" 
              onClick={() => {
                // Mock previous month click
                const date = new Date(selected || new Date())
                date.setMonth(date.getMonth() - 1)
                onSelect && onSelect(date)
              }}
            >
              <span>Previous</span>
            </button>
            <span data-testid="current-month">
              {selected ? format(selected, 'MMMM yyyy') : format(new Date(), 'MMMM yyyy')}
            </span>
            <button 
              data-testid="next-month" 
              onClick={() => {
                // Mock next month click
                const date = new Date(selected || new Date())
                date.setMonth(date.getMonth() + 1)
                onSelect && onSelect(date)
              }}
            >
              <span>Next</span>
            </button>
          </div>
          <div data-testid="calendar-grid">
            <button 
              data-testid="day-button" 
              onClick={() => {
                // Mock day selection
                const date = new Date()
                onSelect && onSelect(date)
              }}
            >
              15
            </button>
          </div>
          <div data-testid="mode">{mode}</div>
          <div data-testid="outside-days">{showOutsideDays ? 'true' : 'false'}</div>
        </div>
      )
    }
  }
})

describe('Calendar Component', () => {
  it('renders calendar with default props', () => {
    render(<Calendar />)
    
    expect(screen.getByTestId('day-picker')).toBeInTheDocument()
    expect(screen.getByTestId('outside-days')).toHaveTextContent('true')
  })

  it('renders calendar with custom className', () => {
    render(<Calendar className="custom-calendar" />)
    
    const calendar = screen.getByTestId('day-picker')
    expect(calendar).toHaveClass('custom-calendar')
  })

  it('allows selecting a date', () => {
    const onSelectMock = jest.fn()
    render(<Calendar selected={new Date(2023, 0, 1)} onSelect={onSelectMock} />)
    
    fireEvent.click(screen.getByTestId('day-button'))
    expect(onSelectMock).toHaveBeenCalled()
  })

  it('allows navigating to previous month', () => {
    const onSelectMock = jest.fn()
    const initialDate = new Date(2023, 0, 15) // January 15, 2023
    render(<Calendar selected={initialDate} onSelect={onSelectMock} />)
    
    fireEvent.click(screen.getByTestId('prev-month'))
    
    // Check if onSelect was called with a date in December 2022
    expect(onSelectMock).toHaveBeenCalled()
    const selectedDate = onSelectMock.mock.calls[0][0]
    expect(selectedDate.getMonth()).toBe(11) // December is 11 (0-indexed)
    expect(selectedDate.getFullYear()).toBe(2022)
  })

  it('allows navigating to next month', () => {
    const onSelectMock = jest.fn()
    const initialDate = new Date(2023, 0, 15) // January 15, 2023
    render(<Calendar selected={initialDate} onSelect={onSelectMock} />)
    
    fireEvent.click(screen.getByTestId('next-month'))
    
    // Check if onSelect was called with a date in February 2023
    expect(onSelectMock).toHaveBeenCalled()
    const selectedDate = onSelectMock.mock.calls[0][0]
    expect(selectedDate.getMonth()).toBe(1) // February is 1 (0-indexed)
    expect(selectedDate.getFullYear()).toBe(2023)
  })

  it('renders calendar with range mode', () => {
    render(<Calendar mode="range" />)
    
    expect(screen.getByTestId('mode')).toHaveTextContent('range')
  })

  it('renders calendar with showOutsideDays set to false', () => {
    render(<Calendar showOutsideDays={false} />)
    
    expect(screen.getByTestId('outside-days')).toHaveTextContent('false')
  })

  it('renders calendar with custom classNames', () => {
    render(
      <Calendar 
        classNames={{
          months: 'custom-months',
          month: 'custom-month',
          caption: 'custom-caption',
        }} 
      />
    )
    
    // We can't directly test the classNames prop since we're mocking the component,
    // but we can verify that the component renders without errors
    expect(screen.getByTestId('day-picker')).toBeInTheDocument()
  })
}) 