import { useEffect, useState, useCallback, useRef } from 'react'
import { api, getUser, clearUser } from '@/lib/api'
import { useCart } from '@/lib/store/cart'
import MenuGrid from '@/components/MenuGrid'
import CartSidebar from '@/components/CartSidebar'
import OrderModal from '@/components/OrderModal'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  LogOut, ShoppingBag, Clock, CheckCircle, AlertCircle,
  Eye, RefreshCw, ShoppingCart, Coffee, UtensilsCrossed, ClipboardList, Search, X,
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import { useLocation } from 'wouter'

interface MenuItem {
  id: string
  name: string
  description?: string
  category: string
  price: number | string
  imageUrl?: string
  image_url?: string
  available: boolean
}

interface Order {
  id: string
  totalAmount?: number | string
  total_amount?: number | string
  paymentMethod?: string
  payment_method?: string
  paymentStatus?: string
  payment_status?: string
  orderStatus?: string
  order_status?: string
  paymentProofUrl?: string
  payment_proof_url?: string
  notes?: string
  createdAt?: string
  created_at?: string
}

function getField(o: Order, snake: keyof Order, camel: keyof Order): any {
  return o[snake] ?? o[camel]
}

const paymentStatusConfig: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Menunggu Konfirmasi', cls: 'bg-amber-50 border-amber-200 text-amber-800' },
  confirmed: { label: 'Lunas',               cls: 'bg-green-50 border-green-200 text-green-800' },
  rejected:  { label: 'Ditolak',             cls: 'bg-red-50 border-red-200 text-red-800' },
}

const orderStatusConfig: Record<string, { label: string; cls: string; icon?: React.ElementType }> = {
  pending:   { label: 'Antrean',       cls: 'bg-amber-50 border-amber-200 text-amber-800',       icon: Clock },
  preparing: { label: 'Sedang Dibuat', cls: 'bg-blue-50 border-blue-200 text-blue-800' },
  ready:     { label: 'Siap Diambil',  cls: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: CheckCircle },
  completed: { label: 'Selesai',       cls: 'bg-slate-50 border-slate-200 text-slate-700' },
  cancelled: { label: 'Dibatalkan',    cls: 'bg-rose-50 border-rose-200 text-rose-800',           icon: AlertCircle },
}

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [cartSheetOpen, setCartSheetOpen] = useState(false)
  const [prevCartCount, setPrevCartCount] = useState(0)
  const [cartBadgeKey, setCartBadgeKey] = useState(0)
  const [, setLocation] = useLocation()
  const cart = useCart()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userData = getUser()
    if (userData) setUser(userData)
  }, [])

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await api.menu.getAll()
        setItems(data as MenuItem[])
      } catch {
        toast.error('Gagal memuat menu')
      }
      setIsLoadingMenu(false)
    }
    fetchMenuItems()
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!user) return
    setIsLoadingOrders(true)
    try {
      const data = await api.orders.getMyOrders()
      setOrders(data as Order[])
    } catch {
      toast.error('Gagal memuat pesanan')
    }
    setIsLoadingOrders(false)
  }, [user])

  useEffect(() => {
    if (activeTab === 'orders' && user) fetchOrders()
  }, [activeTab, user, fetchOrders])

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery) }, 220)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const cartCount = cart.items.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.getTotal()

  useEffect(() => {
    if (cartCount > prevCartCount) setCartBadgeKey((k) => k + 1)
    setPrevCartCount(cartCount)
  }, [cartCount])

  const categories = Array.from(new Set(items.map((item) => item.category))).sort()
  const filteredItems = items.filter((item) => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    const q = debouncedSearch.toLowerCase()
    const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  const handleLogout = async () => {
    try { await api.auth.logout() } catch {}
    cart.clearCart()
    clearUser()
    setLocation('/auth/login')
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    searchRef.current?.focus()
  }

  const greeting = getTimeGreeting()
  const userInitial = user?.username?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/96 backdrop-blur-md shadow-sm">
        <div className="flex items-center px-4 md:px-6 py-3 gap-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Coffee className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-primary truncate" style={{ fontFamily: 'Playfair Display, serif' }}>Coffee House</span>
          </div>

          {user && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-primary/6 px-3 py-1.5 rounded-xl border border-primary/12 max-w-[180px]">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-black text-primary-foreground">{userInitial}</span>
              </div>
              <span className="truncate">{greeting}, <span className="font-bold text-primary">{user.username}</span></span>
            </div>
          )}

          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}
              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 h-8 px-2 rounded-lg text-xs gap-1.5 flex-shrink-0 transition-colors duration-200">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setLocation('/auth/login')}
              className="text-primary hover:text-primary/80 hover:bg-primary/8 h-8 px-3 rounded-lg text-xs gap-1.5 flex-shrink-0 font-semibold">
              <LogOut className="h-3.5 w-3.5 rotate-180" />
              <span className="hidden sm:inline">Masuk</span>
            </Button>
          )}
        </div>
      </header>

      <div className="hidden lg:block border-b border-primary/10 bg-background sticky top-[57px] z-30">
        <div className="flex max-w-7xl mx-auto px-6">
          {(['menu', 'orders'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-3.5 px-5 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-primary/20'
              }`}>
              {tab === 'menu'
                ? <><UtensilsCrossed className="h-3.5 w-3.5" />Daftar Menu</>
                : <><ClipboardList className="h-3.5 w-3.5" />Pesanan Saya
                  {orders.length > 0 && <span className="ml-1 bg-primary text-primary-foreground text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{orders.length}</span>}
                </>}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:hidden border-b border-primary/8" style={{ background: 'linear-gradient(100deg, hsl(35 88% 95%) 0%, hsl(30 58% 97%) 60%, hsl(25 38% 98%) 100%)' }}>
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-sm font-black text-primary-foreground">{userInitial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-muted-foreground font-medium">{greeting}! 👋</p>
            <p className="text-sm font-bold text-primary truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
              {user ? user.username : 'Pelanggan'}
              <span className="font-normal text-muted-foreground">{activeTab === 'menu' ? ' — mau pesan apa?' : ' — pesananmu'}</span>
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeTab === 'menu' ? 'bg-primary text-white shadow-sm scale-105' : 'bg-black/6 text-foreground/60 hover:bg-black/10'}`}>
              <UtensilsCrossed className="h-3 w-3" />Menu
            </button>
            <button onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all relative ${activeTab === 'orders' ? 'bg-primary text-white shadow-sm scale-105' : 'bg-black/6 text-foreground/60 hover:bg-black/10'}`}>
              <ClipboardList className="h-3 w-3" />Pesanan
              {orders.length > 0 && activeTab !== 'orders' && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">{orders.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 pb-24 lg:pb-8">
        {activeTab === 'menu' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input ref={searchRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari menu favoritmu..."
                  className="w-full bg-card border border-primary/15 rounded-xl py-2.5 pl-9 pr-9 text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/60 shadow-sm" />
                {searchQuery && (
                  <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-primary/8">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
                  <button onClick={() => setSelectedCategory(null)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedCategory === null ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-105' : 'bg-card text-foreground/70 border-primary/15 hover:border-primary/30 hover:bg-primary/5'}`}>
                    Semua
                  </button>
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all border capitalize ${selectedCategory === cat ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-105' : 'bg-card text-foreground/70 border-primary/15 hover:border-primary/30 hover:bg-primary/5'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {debouncedSearch && !isLoadingMenu && (
                <div className="flex items-center gap-2 mb-3 animate-fade-in">
                  <span className="text-xs text-muted-foreground">
                    {filteredItems.length > 0
                      ? <><span className="font-bold text-primary">{filteredItems.length}</span> menu ditemukan untuk "<span className="font-medium">{debouncedSearch}</span>"</>
                      : <>Tidak ada menu untuk "<span className="font-medium">{debouncedSearch}</span>"</>}
                  </span>
                </div>
              )}

              {isLoadingMenu ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl skeleton-shimmer" style={{ aspectRatio: '3/4', animationDelay: `${i * 80}ms` }} />)}
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-3xl mt-2 overflow-hidden border border-primary/10 shadow-sm animate-fade-in" style={{ background: 'linear-gradient(160deg, hsl(35 80% 97%) 0%, hsl(25 50% 96%) 100%)' }}>
                  <div className="px-6 py-16 text-center space-y-4">
                    <div className="relative w-20 h-20 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-primary/8 animate-pulse" />
                      <div className="relative flex items-center justify-center h-full"><Coffee className="h-9 w-9 text-primary/30" /></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground/70 text-base">Menu belum tersedia</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Kami sedang mempersiapkan menu terbaik untuk Anda.</p>
                      <p className="text-xs text-muted-foreground/60 mt-1.5">Silakan coba lagi nanti ☕</p>
                    </div>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-primary/15 rounded-2xl bg-card/60 mt-2 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-primary/30" />
                  </div>
                  <p className="font-semibold text-foreground/60 text-sm">
                    {debouncedSearch ? `Tidak ada menu "${debouncedSearch}"` : 'Tidak ada menu di kategori ini.'}
                  </p>
                  <button onClick={() => { setSearchQuery(''); setDebouncedSearch(''); setSelectedCategory(null) }}
                    className="text-xs text-primary hover:underline mt-2 inline-block font-medium">
                    Reset pencarian →
                  </button>
                </div>
              ) : (
                <MenuGrid items={filteredItems as any} />
              )}
            </div>
            <div className="hidden lg:block w-[280px] xl:w-[300px] flex-shrink-0">
              <CartSidebar cartItems={cart.items} />
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Riwayat Pesanan</h2>
                <p className="text-sm text-muted-foreground">Pantau status pesanan aktif Anda</p>
              </div>
              <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15 gap-1.5 h-9 text-xs rounded-xl hover:bg-primary/5">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Segarkan</span>
              </Button>
            </div>

            {!user ? (
              <div className="rounded-3xl overflow-hidden border border-primary/10 shadow-sm" style={{ background: 'linear-gradient(160deg, hsl(35 80% 97%) 0%, hsl(25 50% 96%) 100%)' }}>
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto"><LogOut className="h-7 w-7 text-primary/30 rotate-180" /></div>
                  <div>
                    <p className="font-bold text-foreground/70">Masuk untuk melihat pesanan</p>
                    <p className="text-sm text-muted-foreground mt-1">Buat akun atau masuk untuk melacak pesananmu.</p>
                  </div>
                  <Button onClick={() => setLocation('/auth/login')} className="bg-primary hover:bg-primary/90 shadow-sm rounded-xl gap-2">Masuk Sekarang</Button>
                </div>
              </div>
            ) : isLoadingOrders ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-2xl skeleton-shimmer" style={{ animationDelay: `${i * 100}ms` }} />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-3xl overflow-hidden border border-primary/10 shadow-sm" style={{ background: 'linear-gradient(160deg, hsl(35 80% 97%) 0%, hsl(25 50% 96%) 100%)' }}>
                <div className="p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto"><ShoppingBag className="h-7 w-7 text-primary/30" /></div>
                  <div>
                    <p className="font-bold text-foreground/70">Belum ada pesanan</p>
                    <p className="text-sm text-muted-foreground mt-1">Yuk, mulai pesan kopi favoritmu!</p>
                  </div>
                  <Button onClick={() => setActiveTab('menu')} className="bg-primary hover:bg-primary/90 shadow-sm rounded-xl gap-2">
                    <UtensilsCrossed className="h-4 w-4" />Lihat Menu
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, idx) => {
                  const paymentStatus = String(getField(order, 'payment_status', 'paymentStatus') ?? '')
                  const orderStatus = String(getField(order, 'order_status', 'orderStatus') ?? '')
                  const totalAmount = getField(order, 'total_amount', 'totalAmount')
                  const createdAt = getField(order, 'created_at', 'createdAt')
                  const pCfg = paymentStatusConfig[paymentStatus] ?? { label: paymentStatus, cls: 'bg-gray-50 border-gray-200 text-gray-700' }
                  const oCfg = orderStatusConfig[orderStatus] ?? { label: orderStatus, cls: 'bg-gray-50 border-gray-200 text-gray-700' }
                  const OIcon = oCfg.icon
                  return (
                    <div key={order.id} className="bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                      <div className="bg-gradient-to-r from-primary/6 to-accent/4 px-4 py-3 flex items-center justify-between border-b border-primary/8">
                        <div>
                          <p className="text-xs font-bold text-primary">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {createdAt ? new Date(String(createdAt)).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                          </p>
                        </div>
                        <p className="text-base font-bold text-primary">{formatRupiah(Number(totalAmount))}</p>
                      </div>
                      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-3">
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Pembayaran</p>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${pCfg.cls}`}>{pCfg.label}</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Status</p>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold inline-flex items-center gap-1 ${oCfg.cls}`}>
                              {OIcon && <OIcon className="h-3 w-3" />}{oCfg.label}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true) }}
                          className="border-primary/20 hover:bg-primary/5 text-primary text-xs h-8 gap-1.5 rounded-xl">
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

      <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/97 backdrop-blur-lg border-t border-primary/12 shadow-[0_-4px_24px_rgba(0,0,0,0.09)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex items-stretch h-16">
            <button onClick={() => setActiveTab('menu')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200 ${activeTab === 'menu' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {activeTab === 'menu' && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />}
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${activeTab === 'menu' ? 'bg-primary/10 scale-110' : ''}`}>
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <span className={`text-[10px] font-bold leading-none transition-all ${activeTab === 'menu' ? 'text-primary' : ''}`}>Menu</span>
            </button>

            <SheetTrigger asChild>
              <button className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors relative">
                <div className="relative p-1.5">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span key={cartBadgeKey} className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-black px-0.5 leading-none shadow-sm animate-cart-badge-pop">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold leading-none">
                  {cartCount > 0 ? formatRupiah(cartTotal).replace('Rp\u00a0', '') : 'Keranjang'}
                </span>
              </button>
            </SheetTrigger>

            <button onClick={() => setActiveTab('orders')}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200 ${activeTab === 'orders' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {activeTab === 'orders' && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />}
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${activeTab === 'orders' ? 'bg-primary/10 scale-110' : ''} relative`}>
                <ClipboardList className="h-5 w-5" />
                {orders.length > 0 && activeTab !== 'orders' && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">{orders.length}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold leading-none transition-all ${activeTab === 'orders' ? 'text-primary' : ''}`}>Pesanan</span>
            </button>
          </div>
        </div>

        <SheetContent side="bottom" className="rounded-t-3xl px-0 pt-0 max-h-[85vh] overflow-hidden flex flex-col">
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-primary/20" />
          </div>
          <SheetHeader className="px-5 pb-3 flex-shrink-0 border-b border-primary/10">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4 text-primary" />Keranjang
              {cartCount > 0 && <span className="ml-auto bg-primary text-primary-foreground text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <CartSidebar cartItems={cart.items} onNavigate={() => setCartSheetOpen(false)} inSheet />
          </div>
        </SheetContent>
      </Sheet>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder as any}
          isOpen={isOrderModalOpen}
          onClose={() => { setIsOrderModalOpen(false); setSelectedOrder(null) }}
          onUpdate={() => {}}
          isAdminView={false}
        />
      )}
    </div>
  )
}
