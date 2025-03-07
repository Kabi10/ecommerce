import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../ui/table'

describe('Table Component', () => {
  it('renders a basic table with header, body, and footer', () => {
    render(
      <Table>
        <TableCaption>A list of users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total: 2 users</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    // Check if all elements are rendered
    expect(screen.getByText('A list of users')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Total: 2 users')).toBeInTheDocument()
  })

  it('renders table with custom className', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const table = screen.getByRole('table')
    expect(table).toHaveClass('custom-table')
  })

  it('renders table header with custom className', () => {
    render(
      <Table>
        <TableHeader className="custom-header">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
    
    const header = screen.getByText('Header').closest('thead')
    expect(header).toHaveClass('custom-header')
  })

  it('renders table body with custom className', () => {
    render(
      <Table>
        <TableBody className="custom-body">
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const body = screen.getByText('Content').closest('tbody')
    expect(body).toHaveClass('custom-body')
  })

  it('renders table footer with custom className', () => {
    render(
      <Table>
        <TableFooter className="custom-footer">
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
    
    const footer = screen.getByText('Footer').closest('tfoot')
    expect(footer).toHaveClass('custom-footer')
  })

  it('renders table row with custom className', () => {
    render(
      <Table>
        <TableBody>
          <TableRow className="custom-row">
            <TableCell>Row Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const row = screen.getByText('Row Content').closest('tr')
    expect(row).toHaveClass('custom-row')
  })

  it('renders table head with custom className', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="custom-head">Head Content</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
    
    const head = screen.getByText('Head Content')
    expect(head).toHaveClass('custom-head')
  })

  it('renders table cell with custom className', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="custom-cell">Cell Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const cell = screen.getByText('Cell Content')
    expect(cell).toHaveClass('custom-cell')
  })

  it('renders table caption with custom className', () => {
    render(
      <Table>
        <TableCaption className="custom-caption">Caption Content</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const caption = screen.getByText('Caption Content')
    expect(caption).toHaveClass('custom-caption')
  })
}) 