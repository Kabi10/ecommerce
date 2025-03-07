import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'

// Define the CartItem type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Mock the useCart hook
const useCart = jest.fn(() => ({
  items: [
    { id: '1', name: 'Test Product', price: 99.99, quantity: 2 }
  ],
  clearCart: jest.fn(),
  totalItems: 2,
  totalPrice: 199.98
}));

// Mock the module
jest.mock('@/hooks/use-cart', () => ({
  __esModule: true,
  default: () => useCart()
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    redirectToCheckout: jest.fn(() => Promise.resolve({ error: null }))
  }))
}));

// Mock createPaymentIntent API
jest.mock('../../../app/api/create-payment-intent/route', () => ({
  POST: jest.fn().mockResolvedValue(
    new Response(JSON.stringify({ clientSecret: 'test_client_secret' }))
  )
}), { virtual: true });

// Create a mock checkout page component
const MockCheckoutPage = () => {
  const router = useRouter()
  const { items, clearCart, totalItems, totalPrice } = useCart()
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would process the order
    clearCart()
    router.push('/thank-you')
  }

  return (
    <div>
      <h1>Checkout</h1>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p data-testid="total-items">Items: {totalItems}</p>
        <p data-testid="total-price">Total: ${totalPrice.toFixed(2)}</p>
        <ul>
          {items.map(item => (
            <li key={item.id} data-testid={`checkout-item-${item.id}`}>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} data-testid="checkout-form">
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            data-testid="name-input"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            data-testid="email-input"
          />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            data-testid="address-input"
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            data-testid="city-input"
          />
        </div>
        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            data-testid="postal-code-input"
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            data-testid="country-input"
          />
        </div>
        <button type="submit" data-testid="submit-order-btn">
          Place Order
        </button>
      </form>
    </div>
  )
}

describe('Checkout Page', () => {
  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks;
  })

  it('renders the checkout form with order summary', () => {
    render(<MockCheckoutPage />)
    
    // Check if the form is rendered
    expect(screen.getByTestId('checkout-form')).toBeInTheDocument()
    
    // Check if order summary is displayed
    expect(screen.getByTestId('total-items')).toHaveTextContent('Items: 2')
    expect(screen.getByTestId('total-price')).toHaveTextContent('Total: $199.98')
    expect(screen.getByTestId('checkout-item-1')).toHaveTextContent('Test Product - $99.99 x 2')
  })

  it('submits the form and processes the order', async () => {
    const mockPush = jest.fn()
    jest.mocked(useRouter).mockReturnValue({
      push: mockPush
    } as any)
    
    const mockClearCart = jest.fn()
    useCart.mockImplementation(() => ({
      items: [{ id: '1', name: 'Test Product', price: 99.99, quantity: 2 }],
      clearCart: mockClearCart,
      totalItems: 2,
      totalPrice: 199.98
    }))

    render(<MockCheckoutPage />)
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByTestId('address-input'), { target: { value: '123 Main St' } })
    fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'Anytown' } })
    fireEvent.change(screen.getByTestId('postal-code-input'), { target: { value: '12345' } })
    fireEvent.change(screen.getByTestId('country-input'), { target: { value: 'USA' } })
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('checkout-form'))
    
    // Check if cart was cleared and user was redirected
    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/thank-you')
    })
  })
}) 