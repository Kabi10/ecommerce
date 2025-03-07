import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

// Create a test schema
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

// Test component that uses the form
const TestForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      username: "",
    },
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
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    getFieldState: () => ({
      error: undefined,
      isDirty: false,
      isTouched: false,
    }),
  }),
}))

describe('Form Component', () => {
  it('renders form with all components', () => {
    render(<TestForm />)

    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    expect(screen.getByText('This is your public display name.')).toBeInTheDocument()
  })

  it('renders form item with custom className', () => {
    render(
      <Form {...useForm()}>
        <form>
          <FormItem className="custom-form-item">
            <FormLabel>Test Label</FormLabel>
          </FormItem>
        </form>
      </Form>
    )

    const formItem = screen.getByText('Test Label').closest('div')
    expect(formItem).toHaveClass('custom-form-item')
  })

  it('renders form label with custom className', () => {
    render(
      <Form {...useForm()}>
        <form>
          <FormItem>
            <FormLabel className="custom-label">Test Label</FormLabel>
          </FormItem>
        </form>
      </Form>
    )

    expect(screen.getByText('Test Label')).toHaveClass('custom-label')
  })

  it('renders form description with custom className', () => {
    render(
      <Form {...useForm()}>
        <form>
          <FormItem>
            <FormDescription className="custom-description">
              Test Description
            </FormDescription>
          </FormItem>
        </form>
      </Form>
    )

    expect(screen.getByText('Test Description')).toHaveClass('custom-description')
  })

  it('renders form message with custom className', () => {
    render(
      <Form {...useForm()}>
        <form>
          <FormItem>
            <FormMessage className="custom-message">Test Message</FormMessage>
          </FormItem>
        </form>
      </Form>
    )

    expect(screen.getByText('Test Message')).toHaveClass('custom-message')
  })

  it('renders form control with proper aria attributes', () => {
    render(
      <Form {...useForm()}>
        <form>
          <FormField
            control={useForm().control}
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input aria-label="test-input" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    )

    const input = screen.getByLabelText('test-input')
    expect(input).toHaveAttribute('aria-invalid', 'false')
  })

  it('renders form with error state', () => {
    // Mock useFormContext to return an error
    const mockUseFormContext = jest.spyOn(require('react-hook-form'), 'useFormContext')
    mockUseFormContext.mockImplementation(() => ({
      getFieldState: () => ({
        error: { message: 'Test error message' },
        isDirty: true,
        isTouched: true,
      }),
    }))

    render(
      <Form {...useForm()}>
        <form>
          <FormField
            control={useForm().control}
            name="test"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )

    expect(screen.getByText('Test error message')).toBeInTheDocument()

    // Clean up mock
    mockUseFormContext.mockRestore()
  })

  it('renders form with multiple fields', () => {
    render(
      <Form {...useForm()}>
        <form>
          <FormField
            control={useForm().control}
            name="field1"
            render={() => (
              <FormItem>
                <FormLabel>Field 1</FormLabel>
                <FormControl>
                  <Input placeholder="Enter field 1" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={useForm().control}
            name="field2"
            render={() => (
              <FormItem>
                <FormLabel>Field 2</FormLabel>
                <FormControl>
                  <Input placeholder="Enter field 2" />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    )

    expect(screen.getByText('Field 1')).toBeInTheDocument()
    expect(screen.getByText('Field 2')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter field 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter field 2')).toBeInTheDocument()
  })
}) 