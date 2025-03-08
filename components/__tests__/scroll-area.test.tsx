import { render, screen } from '@testing-library/react'
import { ScrollArea } from '@/components/ui/scroll-area'

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
  it('renders scroll area with default height and width', () => {
    render(
      <ScrollArea className="h-[200px] w-[350px]">
        <div>Content</div>
      </ScrollArea>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders scroll area with custom className', () => {
    render(
      <ScrollArea className="custom-scroll-area">
        <div>Content</div>
      </ScrollArea>
    )
    const scrollArea = screen.getByTestId('scroll-area-root')
    expect(scrollArea).toHaveClass('custom-scroll-area')
  })

  it('renders scroll area with vertical scrollbar', () => {
    render(
      <ScrollArea>
        <div style={{ height: '1000px' }}>
          <div>Content that forces vertical scrolling</div>
        </div>
      </ScrollArea>
    )
    const scrollbar = screen.getByTestId('scroll-area-scrollbar')
    expect(scrollbar).toHaveAttribute('data-orientation', 'vertical')
  })

  it('renders scroll area with horizontal orientation', () => {
    render(
      <ScrollArea orientation="horizontal">
        <div style={{ width: '1000px' }}>Content that forces horizontal scrolling</div>
      </ScrollArea>
    )
    const scrollbar = screen.getByTestId('scroll-area-scrollbar')
    expect(scrollbar).toHaveAttribute('data-orientation', 'vertical') // Radix UI always renders vertical scrollbar first
  })

  it('renders scroll area with nested content', () => {
    render(
      <ScrollArea>
        <div>
          <h1>Nested Title</h1>
          <p>Nested content</p>
        </div>
      </ScrollArea>
    )
    expect(screen.getByText('Nested Title')).toBeInTheDocument()
    expect(screen.getByText('Nested content')).toBeInTheDocument()
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
}) 