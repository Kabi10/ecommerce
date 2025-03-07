import { render, screen, fireEvent } from '@testing-library/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../ui/dialog'

// Mock the portal to render inline
jest.mock('@radix-ui/react-dialog', () => {
  const actual = jest.requireActual('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }
})

describe('Dialog Component', () => {
  it('renders dialog when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription id="dialog-description">This is a dialog description.</DialogDescription>
          </DialogHeader>
          <div>Dialog Content</div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    // Dialog should not be visible initially
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()

    // Click the trigger button
    fireEvent.click(screen.getByText('Open Dialog'))

    // Dialog should now be visible
    expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    expect(screen.getByText('This is a dialog description.')).toBeInTheDocument()
    expect(screen.getByText('Dialog Content')).toBeInTheDocument()
  })

  it('closes dialog when close button is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription id="dialog-description">This is a dialog description.</DialogDescription>
          </DialogHeader>
          <div>Dialog Content</div>
          <DialogFooter>
            <DialogClose data-testid="close-button">Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    // Open the dialog
    fireEvent.click(screen.getByText('Open Dialog'))
    expect(screen.getByText('Dialog Title')).toBeInTheDocument()

    // Close the dialog
    fireEvent.click(screen.getByTestId('close-button'))
    
    // Dialog should no longer be visible
    // Note: We need to use queryByText because getByText would throw an error if the element is not found
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
  })

  it('renders dialog trigger button', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent aria-describedby="dialog-description">
          <DialogTitle>Title</DialogTitle>
          <DialogDescription id="dialog-description">Dialog description</DialogDescription>
          <div>Dialog content</div>
        </DialogContent>
      </Dialog>
    )
    const button = screen.getByText('Open Dialog')
    expect(button).toBeInTheDocument()
  })

  it('renders dialog with custom trigger className', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger className="custom-trigger">Custom Trigger</DialogTrigger>
        <DialogContent aria-describedby="dialog-description-2">
          <DialogTitle>Title</DialogTitle>
          <DialogDescription id="dialog-description-2">Dialog description</DialogDescription>
          <div>Dialog content</div>
        </DialogContent>
      </Dialog>
    )
    const button = screen.getByText('Custom Trigger')
    expect(button).toHaveClass('custom-trigger')
  })

  it('renders dialog header with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent aria-describedby="dialog-description-3">
          <DialogHeader className="custom-header">
            <DialogTitle>Title</DialogTitle>
            <DialogDescription id="dialog-description-3">Dialog description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    const header = screen.getByText('Title').closest('div')
    expect(header).toHaveClass('custom-header')
  })

  it('renders dialog footer with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent aria-describedby="dialog-description-4">
          <DialogTitle>Title</DialogTitle>
          <DialogDescription id="dialog-description-4">Dialog description</DialogDescription>
          <DialogFooter className="custom-footer">
            <button>Action</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    const footer = screen.getByRole('button', { name: 'Action' }).closest('div')
    expect(footer).toHaveClass('custom-footer')
  })

  it('renders dialog title with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent aria-describedby="dialog-description-5">
          <DialogTitle className="custom-title">Title</DialogTitle>
          <DialogDescription id="dialog-description-5">Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    const title = screen.getByText('Title')
    expect(title).toHaveClass('custom-title')
  })

  it('renders dialog description with custom className', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent aria-describedby="dialog-description-6">
          <DialogTitle>Title</DialogTitle>
          <DialogDescription id="dialog-description-6" className="custom-description">Custom Description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    const description = screen.getByText('Custom Description')
    expect(description).toHaveClass('custom-description')
  })
}) 