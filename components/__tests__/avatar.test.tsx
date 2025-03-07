import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'

describe('Avatar Component', () => {
  it('renders avatar root element', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="Test User" />
      </Avatar>
    )
    const avatar = container.querySelector('span')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveClass('relative', 'flex', 'h-10', 'w-10', 'shrink-0', 'overflow-hidden', 'rounded-full')
  })

  it('renders avatar with fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('applies custom className to avatar', () => {
    const { container } = render(
      <Avatar className="custom-avatar">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    const avatar = container.querySelector('span')
    expect(avatar).toHaveClass('custom-avatar')
  })

  it('applies custom className to avatar fallback', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback className="custom-fallback">JD</AvatarFallback>
      </Avatar>
    )
    const fallback = container.querySelector('.bg-muted')
    expect(fallback).toHaveClass('custom-fallback')
  })

  it('renders with both image and fallback', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="Test User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    const avatar = container.querySelector('span')
    expect(avatar).toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
}) 