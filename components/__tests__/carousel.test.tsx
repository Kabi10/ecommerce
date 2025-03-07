import { render, screen, fireEvent } from '@testing-library/react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../ui/carousel'

// Mock embla-carousel-react
jest.mock('embla-carousel-react', () => {
  return jest.fn(() => {
    const api = {
      canScrollPrev: jest.fn(() => true),
      canScrollNext: jest.fn(() => true),
      scrollPrev: jest.fn(),
      scrollNext: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    }
    return [jest.fn(), api]
  })
})

describe('Carousel Component', () => {
  it('renders carousel with content and navigation', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    expect(screen.getByText('Slide 1')).toBeInTheDocument()
    expect(screen.getByText('Slide 2')).toBeInTheDocument()
    expect(screen.getByText('Slide 3')).toBeInTheDocument()
    expect(screen.getByText('Previous slide')).toBeInTheDocument()
    expect(screen.getByText('Next slide')).toBeInTheDocument()
  })

  it('renders carousel with custom className', () => {
    render(
      <Carousel className="custom-carousel">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    )

    const carousel = screen.getByRole('region')
    expect(carousel).toHaveClass('custom-carousel')
  })

  it('renders carousel content with custom className', () => {
    render(
      <Carousel>
        <CarouselContent className="custom-content">
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    )

    const content = screen.getByText('Slide 1').closest('div')?.parentElement
    expect(content).toHaveClass('custom-content')
  })

  it('renders carousel item with custom className', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem className="custom-item">Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    )

    const item = screen.getByText('Slide 1').closest('div')
    expect(item).toHaveClass('custom-item')
  })

  it('renders carousel with vertical orientation', () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const content = screen.getByText('Slide 1').closest('div')?.parentElement
    expect(content).toHaveClass('flex-col')
  })

  it('handles keyboard navigation', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const carousel = screen.getByRole('region')
    
    // Test left arrow key
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
    // Test right arrow key
    fireEvent.keyDown(carousel, { key: 'ArrowRight' })
  })

  it('renders navigation buttons with custom className', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="custom-prev" />
        <CarouselNext className="custom-next" />
      </Carousel>
    )

    const prevButton = screen.getByText('Previous slide').closest('button')
    const nextButton = screen.getByText('Next slide').closest('button')
    
    expect(prevButton).toHaveClass('custom-prev')
    expect(nextButton).toHaveClass('custom-next')
  })

  it('handles navigation button clicks', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const prevButton = screen.getByText('Previous slide').closest('button')
    const nextButton = screen.getByText('Next slide').closest('button')

    fireEvent.click(prevButton!)
    fireEvent.click(nextButton!)
  })

  it('sets up carousel with custom options', () => {
    const opts = { loop: true }
    render(
      <Carousel opts={opts}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    )

    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('handles API setup through setApi prop', () => {
    const setApi = jest.fn()
    render(
      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
      </Carousel>
    )

    expect(setApi).toHaveBeenCalled()
  })
}) 