import { Link, useLocation } from 'wouter'
import {
  BarChart3,
  ShoppingCart,
  Coffee,
  Users,
  LogOut,
  CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminSidebar() {
  const [pathname] = useLocation()
  const [, setLocation] = useLocation()
  const [user, setUser] = useState<any>(null)

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

  const handleLogout = async () => {
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

  return (
    <div className="w-64 border-r border-primary/10 bg-background flex flex-col">
      <div className="p-6 border-b border-primary/10">
        <h1 className="text-2xl font-bold text-primary">Panel Admin</h1>
        <p className="text-xs text-muted-foreground mt-1">{user?.username}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-primary/10'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-primary/10">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
