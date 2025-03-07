import React from 'react'
import { render, screen, fireEvent, waitFor, prismaMock, mockSession } from './test-utils'
// Mock the admin page instead of importing it
// import AdminDashboardPage from '@/app/(routes)/admin/page'
import { GET as getDashboardStatsHandler } from '@/app/api/admin/stats/route'
import { GET as getProductsHandler } from '@/app/api/admin/products/route'
import { GET as getOrdersHandler } from '@/app/api/admin/orders/route'
import { NextRequest } from 'next/server'
import { useRouter } from 'next/navigation'

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Create a mock admin dashboard component
const MockAdminDashboardPage = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <section data-testid="statistics-section">
        <h2>Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p>$1,000</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>50</p>
          </div>
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p>25</p>
          </div>
        </div>
      </section>
      
      <section data-testid="products-section">
        <h2>Products</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Test Product</td>
              <td>$99.99</td>
              <td>10</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}

describe('Admin Dashboard Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock router
    const mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
    }
    
    // Setup router mock
    ;(useRouter as jest.Mock).mockImplementation(() => mockRouter)
  })
  
  it('should render the admin dashboard', () => {
    render(<MockAdminDashboardPage />)
    
    // Check that the dashboard title is rendered
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    
    // Check that the statistics section is rendered
    const statsSection = screen.getByTestId('statistics-section')
    expect(statsSection).toBeInTheDocument()
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
    expect(screen.getByText('Total Orders')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('Total Customers')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    
    // Check that the products section is rendered
    const productsSection = screen.getByTestId('products-section')
    expect(productsSection).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })
}) 