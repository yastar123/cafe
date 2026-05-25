import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useCart } from '@/lib/store/cart'
import MenuGrid from '@/components/MenuGrid'
import CartSidebar from '@/components/CartSidebar'
import OrderModal from '@/components/OrderModal'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  LogOut, ShoppingBag, Clock, CheckCircle, AlertCircle,
  Eye, RefreshCw, ShoppingCart, Coffee, UtensilsCrossed, ClipboardList,
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import { useLocation } from 'wouter'

interface MenuItem {
  id: string
  name: string
  description?: string
  category: string
  price: number
  image_url?: string
  available: boolean
}

interface Order {
  id: string
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  payment_proof_url?: string
  notes?: string
  created_at: string
}

const paymentStatusConfig: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Menunggu Konfirmasi', cls: 'bg-amber-50 border-amber-200 text-amber-800' },
  confirmed: { label: 'Lunas',               cls: 'bg-green-50 border-green-200 text-green-800' },
  rejected:  { label: 'Ditolak',             cls: 'bg-red-50 border-red-200 text-red-800' },
}

const orderStatusConfig: Record<string, { label: string; cls: string; icon?: React.ElementType }> = {
  pending:   { label: 'Antrean',       cls: 'bg-amber-50 border-amber-200 text-amber-800',     icon: Clock },
  preparing: { label: 'Sedang Dibuat', cls: 'bg-blue-50 border-blue-200 text-blue-800' },
  ready:     { label: 'Siap Diambil',  cls: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: CheckCircle },
  completed: { label: 'Selesai',       cls: 'bg-slate-50 border-slate-200 text-slate-700' },
  cancelled: { label: 'Dibatalkan',    cls: 'bg-rose-50 border-rose-200 text-rose-800',         icon: AlertCircle },
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [cartSheetOpen, setCartSheetOpen] = useState(false)
  const [, setLocation] = useLocation()
  const cart = useCart()

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase.from('menu_items').select('*').eq('available', true)
        if (error && isSupabaseConfigured) toast.error('Gagal memuat menu: ' + error.message)
        else if (data) setItems(data)
      } catch {
        if (isSupabaseConfigured) toast.error('Gagal memuat menu')
      }
      setIsLoadingMenu(false)
    }
    fetchMenuItems()
  }, [])

  const fetchOrders = async () => {
    if (!user) return
    setIsLoadingOrders(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error && isSupabaseConfigured) toast.error('Gagal mengambil riwayat pesanan')
      else if (data) setOrders(data)
    } catch {
      if (isSupabaseConfigured) toast.error('Gagal memuat pesanan')
    }
    setIsLoadingOrders(false)
  }

  useEffect(() => {
    if (activeTab === 'orders' && user) fetchOrders()
  }, [activeTab, user])

  const categories = Array.from(new Set(items.map((item) => item.category))).sort()
  const filteredItems = selectedCategory ? items.filter((item) => item.category === selectedCategory) : items
  const cartCount = cart.items.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.getTotal()

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    setLocation('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center px-4 md:px-6 py-3 gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-primary truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </span>
          </div>

          {/* Desktop: username + logout */}
          {user && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-primary/6 px-3 py-1.5 rounded-lg border border-primary/12 truncate max-w-[140px]">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
              {user.username}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-red-500 hover:bg-red-50 h-8 px-2 rounded-lg text-xs gap-1.5 flex-shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      {/* Desktop tab bar */}
      <div className="hidden lg:block border-b border-primary/10 bg-background sticky top-[57px] z-30">
        <div className="flex max-w-7xl mx-auto px-6">
          {(['menu', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-primary/20'
              }`}
            >
              {tab === 'menu'
                ? <><UtensilsCrossed className="h-3.5 w-3.5" />Daftar Menu</>
                : <><ClipboardList className="h-3.5 w-3.5" />Pesanan Saya</>
              }
            </button>
          ))}
        </div>
      </div>

      {/* Mobile page title bar */}
      <div
        className="lg:hidden px-4 py-3 border-b border-primary/10"
        style={{ background: 'linear-gradient(90deg, hsl(25 50% 28% / 0.06) 0%, hsl(35 80% 95%) 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeTab === 'menu' ? 'bg-primary' : 'bg-blue-500'}`}>
              {activeTab === 'menu'
                ? <UtensilsCrossed className="h-3.5 w-3.5 text-white" />
                : <ClipboardList className="h-3.5 w-3.5 text-white" />
              }
            </div>
            <h2 className="text-sm font-bold text-foreground">
              {activeTab === 'menu' ? 'Daftar Menu' : 'Pesanan Saya'}
            </h2>
          </div>
          {user && (
            <div className="flex items-center gap-1.5 bg-white/60 border border-primary/10 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-xs font-medium text-foreground/70">{user.username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 pb-24 lg:pb-6">
        {activeTab === 'menu' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              {/* Category filter */}
              <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      selectedCategory === null
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-card text-foreground border-primary/15 hover:border-primary/30 hover:bg-primary/5'
                    }`}
                  >
                    Semua
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        selectedCategory === cat
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-card text-foreground border-primary/15 hover:border-primary/30 hover:bg-primary/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingMenu ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-56 rounded-2xl bg-primary/5 animate-pulse" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div
                  className="rounded-3xl mt-2 overflow-hidden border border-primary/10 shadow-sm"
                  style={{ background: 'linear-gradient(160deg, hsl(35 80% 97%) 0%, hsl(25 50% 96%) 100%)' }}
                >
                  <div className="px-6 py-12 text-center space-y-3">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-primary/8 animate-pulse" />
                      <div className="relative flex items-center justify-center h-full">
                        <Coffee className="h-9 w-9 text-primary/30" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground/70 text-base">Menu belum tersedia</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        Kami sedang mempersiapkan menu terbaik untuk Anda.
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1.5">Silakan coba lagi nanti ☕</p>
                    </div>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-primary/20 rounded-2xl bg-card/50 mt-2">
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-3">
                    <Coffee className="h-6 w-6 text-primary/30" />
                  </div>
                  <p className="font-medium text-foreground/60 text-sm">Tidak ada menu di kategori ini.</p>
                  <button onClick={() => setSelectedCategory(null)} className="text-xs text-primary hover:underline mt-2 inline-block">
                    Lihat semua menu →
                  </button>
                </div>
              ) : (
                <MenuGrid items={filteredItems} />
              )}
            </div>

            {/* Desktop cart sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <CartSidebar cartItems={cart.items} />
            </div>
          </div>
        ) : (
          /* Orders tab — desktop */
          <div className="space-y-4 max-w-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Riwayat Pesanan
                </h2>
                <p className="text-sm text-muted-foreground">Pantau status pesanan aktif Anda</p>
              </div>
              <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15 gap-1.5 h-9 text-xs rounded-xl">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Segarkan</span>
              </Button>
            </div>

            {isLoadingOrders ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-primary/5 animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-card border border-primary/10 rounded-2xl p-10 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-7 w-7 text-primary/30" />
                </div>
                <div>
                  <p className="font-medium text-foreground/70">Belum ada pesanan</p>
                  <p className="text-sm text-muted-foreground mt-1">Yuk, mulai pesan kopi favoritmu!</p>
                </div>
                <Button onClick={() => setActiveTab('menu')} className="bg-primary hover:bg-primary/90 shadow-sm rounded-xl">
                  Pesan Sekarang
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const pCfg = paymentStatusConfig[order.payment_status] ?? { label: order.payment_status, cls: 'bg-gray-50 border-gray-200 text-gray-700' }
                  const oCfg = orderStatusConfig[order.order_status]   ?? { label: order.order_status,   cls: 'bg-gray-50 border-gray-200 text-gray-700' }
                  const OIcon = oCfg.icon
                  return (
                    <div key={order.id} className="bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="bg-gradient-to-r from-primary/6 to-accent/5 px-4 py-3 flex items-center justify-between border-b border-primary/8">
                        <div>
                          <p className="text-xs font-bold text-primary">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <p className="text-base font-bold text-primary">{formatRupiah(order.total_amount)}</p>
                      </div>
                      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-3">
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">Pembayaran</p>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${pCfg.cls}`}>{pCfg.label}</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">Status</p>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold inline-flex items-center gap-1 ${oCfg.cls}`}>
                              {OIcon && <OIcon className="h-3 w-3" />}
                              {oCfg.label}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm" variant="outline"
                          onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true) }}
                          className="border-primary/20 hover:bg-primary/5 text-primary text-xs h-8 gap-1.5 rounded-xl"
                        >
                          <Eye className="h-3.5 w-3.5" />Detail
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
      <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-primary/12 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-stretch h-16">
            {/* Menu tab */}
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                activeTab === 'menu' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === 'menu' && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
              )}
              <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'menu' ? 'bg-primary/10' : ''}`}>
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold leading-none">Menu</span>
            </button>

            {/* Cart tab — opens sheet */}
            <SheetTrigger asChild>
              <button className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors relative">
                <div className="relative p-1.5">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold px-0.5 leading-none">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold leading-none">
                  {cartCount > 0 ? formatRupiah(cart.getTotal()).replace('Rp', '') : 'Keranjang'}
                </span>
              </button>
            </SheetTrigger>

            {/* Orders tab */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
                activeTab === 'orders' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === 'orders' && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
              )}
              <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-primary/10' : ''} relative`}>
                <ClipboardList className="h-5 w-5" />
                {orders.length > 0 && activeTab !== 'orders' && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-bold px-0.5 leading-none">
                    {orders.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold leading-none">Pesanan</span>
            </button>
          </div>
        </div>

        {/* Cart sheet content */}
        <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
          <SheetHeader className="px-5 py-4 border-b border-primary/10 flex-shrink-0">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Keranjang Belanja
              {cartCount > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <CartSidebar cartItems={cart.items} onNavigate={() => setCartSheetOpen(false)} inSheet />
          </div>
        </SheetContent>
      </Sheet>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          isOpen={isOrderModalOpen}
          onClose={() => { setSelectedOrder(null); setIsOrderModalOpen(false) }}
          onUpdate={() => {}}
          isAdminView={false}
        />
      )}
    </div>
  )
}
