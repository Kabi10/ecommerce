import { ReactNode } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings 
} from 'lucide-react'
import { SidebarNav } from '@/components/dashboard/sidebar-nav'

const sidebarNavItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { name: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pl-8 pr-6 lg:py-8">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 