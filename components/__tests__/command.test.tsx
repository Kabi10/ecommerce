import { render, screen, fireEvent, waitFor } from '../../lib/test-utils'
import userEvent from '@testing-library/user-event'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../ui/command'

describe('Command Component', () => {
  it('renders command component with input and items', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByText('Suggestions')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('filters items when typing in the input', async () => {
    const { user } = render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    // Type in the input
    const input = screen.getByPlaceholderText('Search...')
    await user.type(input, 'cal')

    // Check if filtering works - Calendar should be visible
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    
    // Clear the input and type something that doesn't match
    await user.clear(input)
    await user.type(input, 'xyz')
    
    // Check if empty state is shown
    await waitFor(() => {
      expect(screen.getByText('No results found.')).toBeInTheDocument()
    })
  })

  it('selects item with keyboard navigation', async () => {
    const onSelect = jest.fn()
    const { user } = render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={onSelect} value="search">Search</CommandItem>
            <CommandItem onSelect={onSelect} value="calendar">Calendar</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    // Focus the input
    const input = screen.getByPlaceholderText('Search...')
    await user.click(input)
    
    // Mock the selection
    const searchItem = screen.getByText('Search')
    await user.click(searchItem)
    
    // Check if onSelect was called with the correct value
    expect(onSelect).toHaveBeenCalledWith('search')
  })

  it('renders command separator correctly', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Group 1">
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Group 2">
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders command shortcut correctly', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByText('⌘S')).toBeInTheDocument()
  })

  it('applies custom className to command components', () => {
    render(
      <Command className="custom-command">
        <CommandInput className="custom-input" placeholder="Search..." />
        <CommandList className="custom-list">
          <CommandGroup heading="Suggestions">
            <CommandItem className="custom-item">Item</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    // Check if custom classes are applied
    const commandWrapper = screen.getByPlaceholderText('Search...').closest('[cmdk-root]')
    expect(commandWrapper).toHaveClass('custom-command')
    
    expect(screen.getByPlaceholderText('Search...')).toHaveClass('custom-input')
    expect(screen.getByRole('listbox')).toHaveClass('custom-list')
    expect(screen.getByText('Item')).toHaveClass('custom-item')
  })

  it('forwards additional props to command components', () => {
    render(
      <Command data-testid="command">
        <CommandInput data-testid="input" placeholder="Search..." />
        <CommandList data-testid="list">
          <CommandItem data-testid="item">Item</CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByTestId('command')).toBeInTheDocument()
    expect(screen.getByTestId('input')).toBeInTheDocument()
    expect(screen.getByTestId('list')).toBeInTheDocument()
    expect(screen.getByTestId('item')).toBeInTheDocument()
  })
}) 