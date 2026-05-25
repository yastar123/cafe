import { Link, useLocation } from 'wouter'
import {
  BarChart3,
  ShoppingCart,
  Coffee,
  Users,
  LogOut,
  CreditCard,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function AdminSidebar() {
  const [pathname] = useLocation()
  const [, setLocation] = useLocation()
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (!userData) {
      setLocation('/auth/login')
    } else {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'admin') {
        setLocation('/menu')
      } else {
        setUser(parsedUser)
      }
    }
  }, [setLocation])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    setLocation('/auth/login')
  }

  const menuItems = [
    { href: '/admin', label: 'Dasbor', icon: BarChart3 },
    { href: '/admin/orders', label: 'Pesanan Pelanggan', icon: ShoppingCart },
    { href: '/admin/menu', label: 'Daftar Menu', icon: Coffee },
    { href: '/admin/payments', label: 'Metode Pembayaran', icon: CreditCard },
    { href: '/admin/users', label: 'Pengguna', icon: Users },
  ]

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-primary/10">
        <h1 className="text-xl font-bold text-primary">Panel Admin</h1>
        {user && <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.username}</p>}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-primary/10'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-primary/10">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground text-sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-primary/10 flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-primary">Panel Admin</h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 z-40 bg-background border-r border-primary/10 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-56 border-r border-primary/10 bg-background flex-col flex-shrink-0 h-full">
        <SidebarContent />
      </div>
    </>
  )
}
