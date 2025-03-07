import { render, screen } from '@testing-library/react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

// Mock the Radix UI Scroll Area components
jest.mock('@radix-ui/react-scroll-area', () => ({
  Root: ({ children, className }: any) => (
    <div data-testid="scroll-area-root" className={className}>
      {children}
    </div>
  ),
  Viewport: ({ children, className }: any) => (
    <div data-testid="scroll-area-viewport" className={className}>
      {children}
    </div>
  ),
  ScrollAreaScrollbar: ({ children, className, orientation }: any) => (
    <div
      data-testid="scroll-area-scrollbar"
      data-orientation={orientation}
      className={className}
    >
      {children}
    </div>
  ),
  ScrollAreaThumb: ({ className }: any) => (
    <div data-testid="scroll-area-thumb" className={className} />
  ),
  Corner: () => <div data-testid="scroll-area-corner" />,
}))

describe('ScrollArea Component', () => {
  it('renders scroll area with content', () => {
    render(
      <ScrollArea>
        <div>Scroll content</div>
      </ScrollArea>
    )

    expect(screen.getByText('Scroll content')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-area-viewport')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-area-scrollbar')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-area-thumb')).toBeInTheDocument()
    expect(screen.getByTestId('scroll-area-corner')).toBeInTheDocument()
  })

  it('renders scroll area with custom className', () => {
    render(
      <ScrollArea className="custom-scroll-area">
        <div>Content</div>
      </ScrollArea>
    )

    expect(screen.getByTestId('scroll-area-root')).toHaveClass('custom-scroll-area')
  })

  it('renders vertical scroll bar by default', () => {
    render(
      <ScrollBar>
        <div>Scrollbar</div>
      </ScrollBar>
    )

    const scrollbar = screen.getByTestId('scroll-area-scrollbar')
    expect(scrollbar).toHaveAttribute('data-orientation', 'vertical')
    expect(scrollbar).toHaveClass('w-2.5')
    expect(scrollbar).toHaveClass('border-l-transparent')
  })

  it('renders horizontal scroll bar', () => {
    render(
      <ScrollBar orientation="horizontal">
        <div>Scrollbar</div>
      </ScrollBar>
    )

    const scrollbar = screen.getByTestId('scroll-area-scrollbar')
    expect(scrollbar).toHaveAttribute('data-orientation', 'horizontal')
    expect(scrollbar).toHaveClass('h-2.5')
    expect(scrollbar).toHaveClass('border-t-transparent')
  })

  it('renders scroll bar with custom className', () => {
    render(
      <ScrollBar className="custom-scrollbar">
        <div>Scrollbar</div>
      </ScrollBar>
    )

    expect(screen.getByTestId('scroll-area-scrollbar')).toHaveClass('custom-scrollbar')
  })

  it('renders scroll thumb with default styles', () => {
    render(
      <ScrollBar>
        <div>Scrollbar</div>
      </ScrollBar>
    )

    const thumb = screen.getByTestId('scroll-area-thumb')
    expect(thumb).toHaveClass('bg-border')
    expect(thumb).toHaveClass('rounded-full')
  })

  it('renders scroll area with nested content', () => {
    render(
      <ScrollArea>
        <div>
          <h1>Title</h1>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      </ScrollArea>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
  })

  it('renders scroll area viewport with focus styles', () => {
    render(
      <ScrollArea>
        <div>Content</div>
      </ScrollArea>
    )

    const viewport = screen.getByTestId('scroll-area-viewport')
    expect(viewport).toHaveClass('focus-visible:ring-4')
    expect(viewport).toHaveClass('focus-visible:outline-1')
  })

  it('renders scroll area with multiple scroll bars', () => {
    render(
      <ScrollArea>
        <div>Content</div>
        <ScrollBar />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )

    const scrollbars = screen.getAllByTestId('scroll-area-scrollbar')
    expect(scrollbars).toHaveLength(3) // 2 explicit + 1 from ScrollArea
    expect(scrollbars[1]).toHaveAttribute('data-orientation', 'vertical')
    expect(scrollbars[2]).toHaveAttribute('data-orientation', 'horizontal')
  })
}) 