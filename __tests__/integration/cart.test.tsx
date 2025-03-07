import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Define the CartItem type
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Mock the useCart hook
const useCart = jest.fn();

// Mock the module
jest.mock('@/hooks/use-cart', () => ({
  __esModule: true,
  default: () => useCart()
}));

// Create a simple cart component for testing
const CartComponent = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  
  return (
    <div>
      <h1>Shopping Cart</h1>
      <p data-testid="total-items">Total Items: {totalItems}</p>
      <p data-testid="total-price">Total Price: ${totalPrice.toFixed(2)}</p>
      
      <ul>
        {items.map(item => (
          <li key={item.id} data-testid={`cart-item-${item.id}`}>
            {item.name} - ${item.price.toFixed(2)} x {item.quantity}
          </li>
        ))}
      </ul>
      
      <button 
        onClick={() => addItem({ 
          id: '1', 
          name: 'Test Product', 
          price: 19.99, 
          quantity: 1 
        })}
        data-testid="add-item-btn"
      >
        Add Item
      </button>
      
      <button 
        onClick={() => removeItem('1')}
        data-testid="remove-item-btn"
      >
        Remove Item
      </button>
      
      <button 
        onClick={() => updateQuantity('1', 2)}
        data-testid="update-quantity-btn"
      >
        Update Quantity
      </button>
      
      <button 
        onClick={() => clearCart()}
        data-testid="clear-cart-btn"
      >
        Clear Cart
      </button>
    </div>
  );
};

// Test cases
describe('Cart Component', () => {
  beforeEach(() => {
    useCart.mockImplementation(() => ({
      items: [],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      totalItems: 0,
      totalPrice: 0
    }));
  });
  
  it('renders the cart component', () => {
    render(<CartComponent />);
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });
  
  it('displays the correct total items and price', () => {
    useCart.mockImplementation(() => ({
      items: [
        { id: '1', name: 'Test Product', price: 19.99, quantity: 2 }
      ],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      totalItems: 2,
      totalPrice: 39.98
    }));
    
    render(<CartComponent />);
    expect(screen.getByTestId('total-items')).toHaveTextContent('Total Items: 2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('Total Price: $39.98');
  });
  
  it('calls addItem when add button is clicked', () => {
    const addItem = jest.fn();
    useCart.mockImplementation(() => ({
      items: [],
      addItem,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      totalItems: 0,
      totalPrice: 0
    }));
    
    render(<CartComponent />);
    fireEvent.click(screen.getByTestId('add-item-btn'));
    expect(addItem).toHaveBeenCalledWith({ 
      id: '1', 
      name: 'Test Product', 
      price: 19.99, 
      quantity: 1 
    });
  });
  
  it('calls removeItem when remove button is clicked', () => {
    const removeItem = jest.fn();
    useCart.mockImplementation(() => ({
      items: [{ id: '1', name: 'Test Product', price: 19.99, quantity: 1 }],
      addItem: jest.fn(),
      removeItem,
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      totalItems: 1,
      totalPrice: 19.99
    }));
    
    render(<CartComponent />);
    fireEvent.click(screen.getByTestId('remove-item-btn'));
    expect(removeItem).toHaveBeenCalledWith('1');
  });
  
  it('calls updateQuantity when update button is clicked', () => {
    const updateQuantity = jest.fn();
    useCart.mockImplementation(() => ({
      items: [{ id: '1', name: 'Test Product', price: 19.99, quantity: 1 }],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity,
      clearCart: jest.fn(),
      totalItems: 1,
      totalPrice: 19.99
    }));
    
    render(<CartComponent />);
    fireEvent.click(screen.getByTestId('update-quantity-btn'));
    expect(updateQuantity).toHaveBeenCalledWith('1', 2);
  });
  
  it('calls clearCart when clear button is clicked', () => {
    const clearCart = jest.fn();
    useCart.mockImplementation(() => ({
      items: [{ id: '1', name: 'Test Product', price: 19.99, quantity: 1 }],
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart,
      totalItems: 1,
      totalPrice: 19.99
    }));
    
    render(<CartComponent />);
    fireEvent.click(screen.getByTestId('clear-cart-btn'));
    expect(clearCart).toHaveBeenCalled();
  });
}); 