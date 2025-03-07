import { render, screen } from '@/lib/test-utils'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card'

describe('Card Component', () => {
  it('renders card with default styles', () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    )
    const card = screen.getByText('Card Content').parentElement
    expect(card).toHaveAttribute('data-slot', 'card')
    expect(card).toHaveClass('bg-card', 'rounded-xl', 'border')
  })

  it('applies custom className to card', () => {
    render(
      <Card className="custom-class">
        <div>Card Content</div>
      </Card>
    )
    const card = screen.getByText('Card Content').parentElement
    expect(card).toHaveClass('custom-class')
  })

  it('renders card header with default styles', () => {
    render(
      <CardHeader>
        <div>Header Content</div>
      </CardHeader>
    )
    const header = screen.getByText('Header Content').parentElement
    expect(header).toHaveAttribute('data-slot', 'card-header')
    expect(header).toHaveClass('flex', 'flex-col')
  })

  it('renders card title with default styles', () => {
    render(
      <CardTitle>
        Card Title
      </CardTitle>
    )
    const title = screen.getByText('Card Title')
    expect(title).toHaveAttribute('data-slot', 'card-title')
    expect(title).toHaveClass('font-semibold')
  })

  it('renders card description with default styles', () => {
    render(
      <CardDescription>
        Card Description
      </CardDescription>
    )
    const description = screen.getByText('Card Description')
    expect(description).toHaveAttribute('data-slot', 'card-description')
    expect(description).toHaveClass('text-muted-foreground', 'text-sm')
  })

  it('renders card content with default styles', () => {
    render(
      <CardContent>
        <div>Content</div>
      </CardContent>
    )
    const content = screen.getByText('Content').parentElement
    expect(content).toHaveAttribute('data-slot', 'card-content')
    expect(content).toHaveClass('px-6')
  })

  it('renders card footer with default styles', () => {
    render(
      <CardFooter>
        <div>Footer Content</div>
      </CardFooter>
    )
    const footer = screen.getByText('Footer Content').parentElement
    expect(footer).toHaveAttribute('data-slot', 'card-footer')
    expect(footer).toHaveClass('flex', 'items-center')
  })

  it('renders a complete card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Complete Card')).toBeInTheDocument()
    expect(screen.getByText('This is a complete card example')).toBeInTheDocument()
    expect(screen.getByText('Main content goes here')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()

    const card = screen.getByText('Complete Card').closest('[data-slot="card"]')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('bg-card', 'rounded-xl', 'border')
  })

  it('forwards additional props to all components', () => {
    render(
      <Card data-testid="card" aria-label="Test Card">
        <CardHeader data-testid="header" aria-label="Test Header">
          <CardTitle data-testid="title" aria-label="Test Title">Title</CardTitle>
          <CardDescription data-testid="description" aria-label="Test Description">Description</CardDescription>
        </CardHeader>
        <CardContent data-testid="content" aria-label="Test Content">Content</CardContent>
        <CardFooter data-testid="footer" aria-label="Test Footer">Footer</CardFooter>
      </Card>
    )

    expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'Test Card')
    expect(screen.getByTestId('header')).toHaveAttribute('aria-label', 'Test Header')
    expect(screen.getByTestId('title')).toHaveAttribute('aria-label', 'Test Title')
    expect(screen.getByTestId('description')).toHaveAttribute('aria-label', 'Test Description')
    expect(screen.getByTestId('content')).toHaveAttribute('aria-label', 'Test Content')
    expect(screen.getByTestId('footer')).toHaveAttribute('aria-label', 'Test Footer')
  })
}) 