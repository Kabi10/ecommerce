import { render, screen, waitFor } from '@/lib/test-utils'
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from '../ui/popover'
import userEvent from '@testing-library/user-event'

describe('Popover Component', () => {
  it('renders popover trigger correctly', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    )

    // Check if trigger is rendered
    expect(screen.getByText('Open Popover')).toBeInTheDocument()
    
    // Content should not be visible initially
    expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
  })

  it('opens popover when trigger is clicked', async () => {
    const { user } = render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    )

    // Click the trigger
    await user.click(screen.getByText('Open Popover'))
    
    // Content should be visible after clicking
    await waitFor(() => {
      expect(screen.getByText('Popover content')).toBeInTheDocument()
    })
  })

  it('closes popover when clicked outside', async () => {
    const { user } = render(
      <>
        <div data-testid="outside-element">Outside Element</div>
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      </>
    )

    // Open the popover
    await user.click(screen.getByText('Open Popover'))
    
    // Verify it's open
    await waitFor(() => {
      expect(screen.getByText('Popover content')).toBeInTheDocument()
    })
    
    // Click outside
    await user.click(screen.getByTestId('outside-element'))
    
    // Verify it's closed
    await waitFor(() => {
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument()
    })
  })

  it('applies custom className to popover content', async () => {
    const { user } = render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent className="custom-content">Popover content</PopoverContent>
      </Popover>
    )

    // Open the popover
    await user.click(screen.getByText('Open Popover'))
    
    // Check if custom class is applied
    await waitFor(() => {
      const content = screen.getByText('Popover content')
      expect(content).toHaveClass('custom-content')
    })
  })

  it('supports custom alignment and offset', async () => {
    const { user } = render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent align="start" sideOffset={10}>
          Popover content
        </PopoverContent>
      </Popover>
    )

    // Open the popover
    await user.click(screen.getByText('Open Popover'))
    
    // Check if alignment and offset are applied
    await waitFor(() => {
      const content = screen.getByText('Popover content')
      expect(content).toHaveAttribute('data-align', 'start')
      // We can't easily test the sideOffset as it's applied internally by Radix
    })
  })

  it('works with PopoverAnchor for custom positioning', async () => {
    const { user } = render(
      <Popover>
        <div style={{ position: 'relative', height: '100px' }}>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverAnchor />
        </div>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    )

    // Open the popover
    await user.click(screen.getByText('Open Popover'))
    
    // Check if content is rendered
    await waitFor(() => {
      expect(screen.getByText('Popover content')).toBeInTheDocument()
    })
  })

  it('forwards additional props to popover components', async () => {
    const { user } = render(
      <Popover>
        <PopoverTrigger data-testid="popover-trigger">Open Popover</PopoverTrigger>
        <PopoverContent data-testid="popover-content">Popover content</PopoverContent>
      </Popover>
    )

    // Check if additional props are forwarded to trigger
    expect(screen.getByTestId('popover-trigger')).toBeInTheDocument()
    
    // Open the popover
    await user.click(screen.getByText('Open Popover'))
    
    // Check if additional props are forwarded to content
    await waitFor(() => {
      expect(screen.getByTestId('popover-content')).toBeInTheDocument()
    })
  })
}) 