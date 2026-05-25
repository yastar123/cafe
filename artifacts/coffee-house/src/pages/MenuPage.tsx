import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useCart } from '@/lib/store/cart'
import MenuGrid from '@/components/MenuGrid'
import CartSidebar from '@/components/CartSidebar'
import OrderModal from '@/components/OrderModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  LogOut, ShoppingBag, Clock, CheckCircle, AlertCircle,
  Eye, RefreshCw, ShoppingCart, Coffee,
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
  confirmed: { label: 'Lunas',              cls: 'bg-green-50 border-green-200 text-green-800' },
  rejected:  { label: 'Ditolak',            cls: 'bg-red-50 border-red-200 text-red-800' },
}

const orderStatusConfig: Record<string, { label: string; cls: string; icon?: React.ElementType }> = {
  pending:   { label: 'Antrean',       cls: 'bg-amber-50 border-amber-200 text-amber-800',   icon: Clock },
  preparing: { label: 'Sedang Dibuat', cls: 'bg-blue-50 border-blue-200 text-blue-800' },
  ready:     { label: 'Siap Diambil',  cls: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: CheckCircle },
  completed: { label: 'Selesai',       cls: 'bg-slate-50 border-slate-200 text-slate-700' },
  cancelled: { label: 'Dibatalkan',    cls: 'bg-rose-50 border-rose-200 text-rose-800',      icon: AlertCircle },
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

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    setLocation('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg md:text-xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
              Coffee House
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {user && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-primary/6 px-3 py-1.5 rounded-lg border border-primary/12 truncate max-w-[140px]">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                {user.username}
              </span>
            )}

            {activeTab === 'menu' && (
              <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="outline" className="lg:hidden relative border-primary/20 h-8 w-8 p-0 rounded-lg">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b border-primary/10 flex-shrink-0">
                    <SheetTitle>Keranjang Belanja</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <CartSidebar cartItems={cart.items} onNavigate={() => setCartSheetOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors h-8 px-2.5 rounded-lg text-xs font-medium gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-primary/10 bg-background px-4 md:px-6">
        <div className="flex gap-1 max-w-7xl mx-auto">
          {(['menu', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 text-sm font-semibold border-b-2 transition-all mr-4 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'menu' ? 'Daftar Menu' : 'Pesanan Saya'}
              {tab === 'orders' && orders.length > 0 && activeTab !== 'orders' && (
                <span className="ml-1.5 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-bold">
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {activeTab === 'menu' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              {/* Category filter */}
              <div className="mb-5">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                      selectedCategory === null
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-card text-foreground border-primary/15 hover:border-primary/30 hover:bg-primary/5'
                    }`}
                  >
                    Semua
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                        selectedCategory === category
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-card text-foreground border-primary/15 hover:border-primary/30 hover:bg-primary/5'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingMenu ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-56 rounded-2xl bg-primary/5 animate-pulse" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-primary/20 rounded-2xl">
                  <ShoppingBag className="h-10 w-10 mx-auto text-primary/30 mb-3" />
                  <p className="text-muted-foreground">Tidak ada menu yang tersedia saat ini.</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-primary/20 rounded-2xl">
                  <Coffee className="h-10 w-10 mx-auto text-primary/30 mb-3" />
                  <p className="text-muted-foreground">Tidak ada menu di kategori ini.</p>
                  <button onClick={() => setSelectedCategory(null)} className="text-sm text-primary hover:underline mt-2">
                    Lihat semua menu
                  </button>
                </div>
              ) : (
                <MenuGrid items={filteredItems} />
              )}
            </div>

            {/* Desktop cart */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <CartSidebar cartItems={cart.items} />
            </div>
          </div>
        ) : (
          /* Orders tab */
          <div className="space-y-5 max-w-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Riwayat Pesanan
                </h2>
                <p className="text-sm text-muted-foreground">Pantau status pesanan aktif Anda</p>
              </div>
              <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15 gap-1.5 h-8 text-xs">
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
                <Button onClick={() => setActiveTab('menu')} className="bg-primary hover:bg-primary/90 shadow-sm">
                  Pesan Sekarang
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const pCfg = paymentStatusConfig[order.payment_status] ?? { label: order.payment_status, cls: 'bg-gray-50 border-gray-200 text-gray-700' }
                  const oCfg = orderStatusConfig[order.order_status] ?? { label: order.order_status, cls: 'bg-gray-50 border-gray-200 text-gray-700' }
                  const OIcon = oCfg.icon
                  return (
                    <div key={order.id} className="bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-gradient-to-r from-primary/6 to-accent/5 px-4 py-3 flex items-center justify-between border-b border-primary/8">
                        <div>
                          <p className="text-xs font-bold text-primary">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </p>
                        </div>
                        <p className="text-base font-bold text-primary">{formatRupiah(order.total_amount)}</p>
                      </div>
                      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">Pembayaran</p>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${pCfg.cls}`}>
                              {pCfg.label}
                            </span>
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
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true) }}
                          className="border-primary/20 hover:bg-primary/5 text-primary text-xs h-7 gap-1 rounded-lg"
                        >
                          <Eye className="h-3 w-3" />
                          Detail
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
