import { render, screen, fireEvent } from '@testing-library/react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../ui/sheet'

// Mock the portal to render inline
jest.mock('@radix-ui/react-dialog', () => {
  const actual = jest.requireActual('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }
})

describe('Sheet Component', () => {
  it('renders sheet when trigger is clicked', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent aria-describedby="sheet-description">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription id="sheet-description">This is a sheet description.</SheetDescription>
          </SheetHeader>
          <div>Sheet Content</div>
          <SheetFooter>
            <SheetClose>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )

    // Sheet should not be visible initially
    expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument()

    // Click the trigger button
    fireEvent.click(screen.getByText('Open Sheet'))

    // Sheet should now be visible
    expect(screen.getByText('Sheet Title')).toBeInTheDocument()
    expect(screen.getByText('This is a sheet description.')).toBeInTheDocument()
    expect(screen.getByText('Sheet Content')).toBeInTheDocument()
  })

  it('closes sheet when close button is clicked', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent aria-describedby="sheet-description">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription id="sheet-description">This is a sheet description.</SheetDescription>
          </SheetHeader>
          <div>Sheet Content</div>
          <SheetFooter>
            <SheetClose data-testid="close-button">Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )

    // Open the sheet
    fireEvent.click(screen.getByText('Open Sheet'))
    expect(screen.getByText('Sheet Title')).toBeInTheDocument()

    // Close the sheet
    fireEvent.click(screen.getByTestId('close-button'))
    
    // Sheet should no longer be visible
    expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument()
  })

  it('renders sheet with different sides', () => {
    const { rerender } = render(
      <Sheet defaultOpen>
        <SheetContent side="right" aria-describedby="sheet-description-1">
          <SheetTitle>Right Sheet</SheetTitle>
          <SheetDescription id="sheet-description-1">Right side sheet</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    
    expect(screen.getByText('Right Sheet')).toBeInTheDocument()
    
    // Test left side
    rerender(
      <Sheet defaultOpen>
        <SheetContent side="left" aria-describedby="sheet-description-2">
          <SheetTitle>Left Sheet</SheetTitle>
          <SheetDescription id="sheet-description-2">Left side sheet</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    
    expect(screen.getByText('Left Sheet')).toBeInTheDocument()
    
    // Test top side
    rerender(
      <Sheet defaultOpen>
        <SheetContent side="top" aria-describedby="sheet-description-3">
          <SheetTitle>Top Sheet</SheetTitle>
          <SheetDescription id="sheet-description-3">Top side sheet</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    
    expect(screen.getByText('Top Sheet')).toBeInTheDocument()
    
    // Test bottom side
    rerender(
      <Sheet defaultOpen>
        <SheetContent side="bottom" aria-describedby="sheet-description-4">
          <SheetTitle>Bottom Sheet</SheetTitle>
          <SheetDescription id="sheet-description-4">Bottom side sheet</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    
    expect(screen.getByText('Bottom Sheet')).toBeInTheDocument()
  })

  it('renders sheet trigger with custom className', () => {
    render(
      <Sheet>
        <SheetTrigger className="custom-trigger">Custom Trigger</SheetTrigger>
        <SheetContent aria-describedby="sheet-description-5">
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription id="sheet-description-5">Sheet description</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    
    const trigger = screen.getByText('Custom Trigger')
    expect(trigger).toHaveClass('custom-trigger')
  })

  it('renders sheet header with custom className', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent aria-describedby="sheet-description-6">
          <SheetHeader className="custom-header">
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription id="sheet-description-6">Sheet description</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
    
    const header = screen.getByText('Sheet Title').closest('div')
    expect(header).toHaveClass('custom-header')
  })

  it('renders sheet footer with custom className', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent aria-describedby="sheet-description-7">
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription id="sheet-description-7">Sheet description</SheetDescription>
          <SheetFooter className="custom-footer">
            <button>Action</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
    
    const footer = screen.getByRole('button', { name: 'Action' }).closest('div')
    expect(footer).toHaveClass('custom-footer')
  })

  it('renders sheet title with custom className', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent aria-describedby="sheet-description-8">
          <SheetTitle className="custom-title">Custom Title</SheetTitle>
          <SheetDescription id="sheet-description-8">Sheet description</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    
    const title = screen.getByText('Custom Title')
    expect(title).toHaveClass('custom-title')
  })

  it('renders sheet description with custom className', () => {
    render(
      <Sheet defaultOpen>
        <SheetContent aria-describedby="sheet-description-9">
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription id="sheet-description-9" className="custom-description">Custom Description</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    
    const description = screen.getByText('Custom Description')
    expect(description).toHaveClass('custom-description')
  })
}) 