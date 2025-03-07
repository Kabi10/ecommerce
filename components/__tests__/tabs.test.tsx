import { render, screen } from '../../lib/test-utils'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

describe('Tabs Component', () => {
  it('renders tabs with default tab selected', async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>
    )

    // Check if the first tab is selected by default
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' })
    expect(tab1).toHaveAttribute('data-state', 'active')
    
    // Check if the first tab content is visible
    expect(screen.getByText('Tab 1 content')).toBeInTheDocument()
    
    // Check if the second tab content is not visible
    const tab2Content = screen.queryByText('Tab 2 content')
    expect(tab2Content).toBe(null)
  })

  it('switches tabs when clicking on a tab', async () => {
    const user = userEvent.setup()
    
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>
    )

    // Click on the second tab
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
    await user.click(tab2)

    // Check if the second tab is now selected
    expect(tab2).toHaveAttribute('data-state', 'active')
    
    // Check if the second tab content is now visible
    expect(screen.getByText('Tab 2 content')).toBeInTheDocument()
    
    // Check if the first tab content is not visible
    const tab1Content = screen.queryByText('Tab 1 content')
    expect(tab1Content).toBe(null)
  })

  it('applies custom className to tabs components', () => {
    render(
      <Tabs className="custom-tabs" defaultValue="tab1">
        <TabsList className="custom-list">
          <TabsTrigger className="custom-trigger" value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent className="custom-content" value="tab1">Tab 1 content</TabsContent>
      </Tabs>
    )

    // Check if custom classes are applied
    expect(screen.getByRole('tablist')).toHaveClass('custom-list')
    expect(screen.getByRole('tab')).toHaveClass('custom-trigger')
    
    // Find the tab content element and check its class
    const content = screen.getByText('Tab 1 content').closest('[data-state="active"]')
    expect(content).toHaveClass('custom-content')
  })

  it('disables a tab when disabled prop is true', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>
    )

    // Check if the second tab is disabled
    const disabledTab = screen.getByRole('tab', { name: 'Tab 2' })
    expect(disabledTab).toBeDisabled()
  })

  it('forwards additional props to tabs components', () => {
    render(
      <Tabs data-testid="tabs" defaultValue="tab1">
        <TabsList data-testid="tabs-list">
          <TabsTrigger data-testid="tabs-trigger" value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent data-testid="tabs-content" value="tab1">Tab 1 content</TabsContent>
      </Tabs>
    )

    expect(screen.getByTestId('tabs')).toBeInTheDocument()
    expect(screen.getByTestId('tabs-list')).toBeInTheDocument()
    expect(screen.getByTestId('tabs-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('tabs-content')).toBeInTheDocument()
  })
}) 