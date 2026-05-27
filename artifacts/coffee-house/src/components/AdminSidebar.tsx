import { Link, useLocation } from 'wouter'
import {
  BarChart3, ShoppingCart, Coffee, Users, LogOut,
  CreditCard, Menu, X, LayoutDashboard, Tag, BarChart2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/store/cart'

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

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const clearCart = useCart((state) => state.clearCart)

  const handleLogout = () => {
    clearCart()
    sessionStorage.removeItem('user')
    setLocation('/auth/login')
  }

  const menuItems = [
    { href: '/admin',           label: 'Dasbor',            icon: LayoutDashboard },
    { href: '/admin/orders',    label: 'Pesanan Masuk',      icon: ShoppingCart },
    { href: '/admin/menu',      label: 'Daftar Menu',        icon: Coffee },
    { href: '/admin/categories',label: 'Kategori Menu',      icon: Tag },
    { href: '/admin/payments',  label: 'Metode Pembayaran',  icon: CreditCard },
    { href: '/admin/users',     label: 'Pengguna',           icon: Users },
    { href: '/admin/rekap',     label: 'Rekap Keuangan',     icon: BarChart2 },
  ]

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'AD'

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, hsl(25 55% 18%) 0%, hsl(20 50% 14%) 100%)' }}>
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
            <Coffee className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </p>
            <p className="text-white/50 text-[10px] mt-0.5 font-medium uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User */}
      {user && (
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-white/8 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user.username}</p>
            <p className="text-white/50 text-[10px] truncate">{user.email}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-white/18 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/50'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all text-sm font-medium"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Keluar
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{ background: 'hsl(25 55% 18%)' }}
      >
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-white" />
          <span className="text-white font-bold text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>
            Panel Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-56 flex-col flex-shrink-0 h-full">
        <SidebarContent />
      </div>
    </>
  )
}
