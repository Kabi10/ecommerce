import { render, screen, waitFor } from '@/lib/test-utils'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut
} from '../ui/dropdown-menu'
import userEvent from '@testing-library/user-event'

describe('DropdownMenu Component', () => {
  it('renders dropdown trigger correctly', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Check if trigger is rendered
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
    
    // Content should not be visible initially
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
  })

  it('opens dropdown when trigger is clicked', async () => {
    const { user } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Click the trigger
    await user.click(screen.getByText('Open Menu'))
    
    // Content should be visible after clicking
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })
  })

  it('closes dropdown when item is clicked', async () => {
    const { user } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Open the dropdown
    await user.click(screen.getByText('Open Menu'))
    
    // Verify it's open
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })
    
    // Click the item
    await user.click(screen.getByText('Item 1'))
    
    // Verify it's closed
    await waitFor(() => {
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    })
  })

  it('renders checkbox items correctly', async () => {
    const { user } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={true}>
            Checked Item
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={false}>
            Unchecked Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Open the dropdown
    await user.click(screen.getByText('Open Menu'))
    
    // Verify checkbox items are rendered with correct state
    await waitFor(() => {
      const checkedItem = screen.getByText('Checked Item')
      const uncheckedItem = screen.getByText('Unchecked Item')
      
      expect(checkedItem).toBeInTheDocument()
      expect(uncheckedItem).toBeInTheDocument()
      expect(checkedItem.closest('[data-state="checked"]')).toBeInTheDocument()
      expect(uncheckedItem.closest('[data-state="unchecked"]')).toBeInTheDocument()
    })
  })

  it('renders radio group items correctly', async () => {
    const { user } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Open the dropdown
    await user.click(screen.getByText('Open Menu'))
    
    // Verify radio items are rendered with correct state
    await waitFor(() => {
      const option1 = screen.getByText('Option 1')
      const option2 = screen.getByText('Option 2')
      
      expect(option1).toBeInTheDocument()
      expect(option2).toBeInTheDocument()
      expect(option1.closest('[data-state="checked"]')).toBeInTheDocument()
      expect(option2.closest('[data-state="unchecked"]')).toBeInTheDocument()
    })
  })

  it('renders sub-menu correctly', async () => {
    const { user } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Sub Menu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Open the main dropdown
    await user.click(screen.getByText('Open Menu'))
    
    // Verify sub-menu trigger is rendered
    await waitFor(() => {
      expect(screen.getByText('Sub Menu')).toBeInTheDocument()
    })
    
    // Open the sub-menu
    await user.hover(screen.getByText('Sub Menu'))
    
    // Verify sub-menu content is rendered
    await waitFor(() => {
      expect(screen.getByText('Sub Item')).toBeInTheDocument()
    })
  })

  it('renders label, separator, and shortcut correctly', async () => {
    const { user } = render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Item with Shortcut
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Open the dropdown
    await user.click(screen.getByText('Open Menu'))
    
    // Verify label, separator, and shortcut are rendered
    await waitFor(() => {
      expect(screen.getByText('Menu Label')).toBeInTheDocument()
      expect(screen.getByText('⌘K')).toBeInTheDocument()
      // Separator is harder to test directly as it's just a visual element
    })
  })

  it('applies custom className to dropdown components', async () => {
    const { user } = render(
      <DropdownMenu>
        <DropdownMenuTrigger className="custom-trigger">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem className="custom-item">Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Check if custom class is applied to trigger
    expect(screen.getByText('Open Menu')).toHaveClass('custom-trigger')
    
    // Open the dropdown
    await user.click(screen.getByText('Open Menu'))
    
    // Check if custom classes are applied to content and item
    await waitFor(() => {
      expect(screen.getByRole('menu')).toHaveClass('custom-content')
      expect(screen.getByText('Item 1')).toHaveClass('custom-item')
    })
  })

  it('supports disabled items', async () => {
    const { user } = render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
          <DropdownMenuItem>Enabled Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await waitFor(() => {
      const disabledItem = screen.getByText('Disabled Item')
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true')
      expect(disabledItem).toHaveClass('data-[disabled]:pointer-events-none')
    })
  })

  it('forwards additional props to dropdown components', async () => {
    const { user } = render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="dropdown-trigger">Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent data-testid="dropdown-content">
          <DropdownMenuItem data-testid="dropdown-item">Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    // Check if additional props are forwarded to trigger
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
    
    // Open the dropdown
    await user.click(screen.getByText('Open Menu'))
    
    // Check if additional props are forwarded to content and item
    await waitFor(() => {
      expect(screen.getByTestId('dropdown-content')).toBeInTheDocument()
      expect(screen.getByTestId('dropdown-item')).toBeInTheDocument()
    })
  })
}) 