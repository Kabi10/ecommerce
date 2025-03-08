import { render, screen } from '@testing-library/react'
import { Form, FormItem, FormLabel, FormDescription, FormMessage, FormField } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'

const TestForm = () => {
  const form = useForm({
    defaultValues: {
      username: ''
    }
  })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <Input placeholder="Enter username" {...field} />
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

describe('Form Component', () => {
  it('renders form with all components', () => {
    render(<TestForm />)
    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    expect(screen.getByText('This is your public display name.')).toBeInTheDocument()
  })

  it('renders form item with custom className', () => {
    const TestFormWithCustomClass = () => {
      const form = useForm()
      return (
        <Form {...form}>
          <form>
            <FormItem className="custom-form-item">
              <FormLabel>Test Label</FormLabel>
              <Input />
            </FormItem>
          </form>
        </Form>
      )
    }
    render(<TestFormWithCustomClass />)
    const formItem = screen.getByText('Test Label').closest('div')
    expect(formItem).toHaveClass('custom-form-item')
  })

  it('renders form label with custom className', () => {
    const TestFormWithCustomLabel = () => {
      const form = useForm()
      return (
        <Form {...form}>
          <form>
            <FormItem>
              <FormLabel className="custom-label">Test Label</FormLabel>
              <Input />
            </FormItem>
          </form>
        </Form>
      )
    }
    render(<TestFormWithCustomLabel />)
    expect(screen.getByText('Test Label')).toHaveClass('custom-label')
  })

  it('renders form description with custom className', () => {
    const TestFormWithCustomDesc = () => {
      const form = useForm()
      return (
        <Form {...form}>
          <form>
            <FormItem>
              <FormDescription className="custom-description">
                Test Description
              </FormDescription>
            </FormItem>
          </form>
        </Form>
      )
    }
    render(<TestFormWithCustomDesc />)
    expect(screen.getByText('Test Description')).toHaveClass('custom-description')
  })

  it('renders form message with custom className', () => {
    const TestFormWithCustomMessage = () => {
      const form = useForm()
      return (
        <Form {...form}>
          <form>
            <FormItem>
              <FormMessage className="custom-message">Test Message</FormMessage>
            </FormItem>
          </form>
        </Form>
      )
    }
    render(<TestFormWithCustomMessage />)
    expect(screen.getByText('Test Message')).toHaveClass('custom-message')
  })

  it('renders form with multiple fields', () => {
    const TestFormMultipleFields = () => {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: ''
        }
      })
      return (
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="firstName">First Name</FormLabel>
                  <Input id="firstName" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lastName">Last Name</FormLabel>
                  <Input id="lastName" {...field} />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )
    }

    render(<TestFormMultipleFields />)
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
  })
}) 