import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useCart } from '@/lib/store/cart'
import MenuGrid from '@/components/MenuGrid'
import CartSidebar from '@/components/CartSidebar'
import OrderModal from '@/components/OrderModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { LogOut, ShoppingBag, Clock, CheckCircle, AlertCircle, Eye, RefreshCw, ShoppingCart } from 'lucide-react'
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

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 border-amber-200 text-amber-900',
  confirmed: 'bg-green-50 border-green-200 text-green-900',
  rejected: 'bg-red-50 border-red-200 text-red-900',
  preparing: 'bg-blue-50 border-blue-200 text-blue-900',
  ready: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  completed: 'bg-slate-50 border-slate-200 text-slate-900',
  cancelled: 'bg-rose-50 border-rose-200 text-rose-900',
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
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('available', true)
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
      if (error && isSupabaseConfigured) toast.error('Gagal mengambil riwayat pesanan: ' + error.message)
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
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    setLocation('/auth/login')
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi'
      case 'confirmed': return 'Lunas'
      case 'rejected': return 'Ditolak'
      default: return status
    }
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Antrean'
      case 'preparing': return 'Sedang Dibuat'
      case 'ready': return 'Siap Diambil'
      case 'completed': return 'Selesai'
      case 'cancelled': return 'Dibatalkan'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-primary flex-shrink-0">Coffee House</h1>

          <div className="flex items-center gap-2 ml-auto">
            {user && (
              <span className="hidden sm:block text-xs font-medium text-muted-foreground bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 truncate max-w-[160px]">
                {user.username}
              </span>
            )}

            {/* Mobile cart button */}
            {activeTab === 'menu' && (
              <Sheet open={cartSheetOpen} onOpenChange={setCartSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="lg:hidden relative border-primary/20"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {cart.items.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {cart.items.reduce((s, i) => s + i.quantity, 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b border-primary/10 flex-shrink-0">
                    <SheetTitle>Keranjang Belanja</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <CartSidebar
                      cartItems={cart.items}
                      onNavigate={() => setCartSheetOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-primary/10 bg-background px-4 md:px-6">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {(['menu', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'menu' ? 'Daftar Menu' : 'Pesanan Saya'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {activeTab === 'menu' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Menu content */}
            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h2 className="text-base font-semibold mb-3 text-foreground">Kategori</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === null
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-primary/10 text-foreground hover:bg-primary/20'
                    }`}
                  >
                    Semua
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-primary/10 text-foreground hover:bg-primary/20'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingMenu ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 rounded-lg bg-primary/5 animate-pulse" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-primary/20 rounded-lg">
                  <ShoppingBag className="h-10 w-10 mx-auto text-primary/30 mb-3" />
                  <p className="text-muted-foreground">Tidak ada menu yang tersedia saat ini.</p>
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
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Riwayat Pesanan</h2>
                <p className="text-sm text-muted-foreground">Pantau status pesanan aktif Anda</p>
              </div>
              <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15">
                <RefreshCw className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">Segarkan</span>
              </Button>
            </div>

            {isLoadingOrders ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-28 rounded-lg bg-primary/5 animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <Card className="border-primary/10">
                <CardContent className="pt-10 pb-10 text-center space-y-4">
                  <ShoppingBag className="h-12 w-12 mx-auto text-primary/30" />
                  <p className="text-muted-foreground">Anda belum memiliki pesanan.</p>
                  <Button onClick={() => setActiveTab('menu')} className="bg-primary hover:bg-primary/90">
                    Pesan Sekarang
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="border-primary/10 hover:shadow-md transition-all">
                    <CardHeader className="pb-2 pt-4 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-sm font-bold text-primary">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                        <p className="text-base font-bold text-primary">{formatRupiah(order.total_amount)}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 pb-4 px-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-0.5">Pembayaran</p>
                            <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${statusColors[order.payment_status] || 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                              {getPaymentStatusText(order.payment_status)}
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-0.5">Status</p>
                            <span className={`text-xs px-2 py-0.5 rounded border font-semibold inline-flex items-center gap-1 ${statusColors[order.order_status] || 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                              {order.order_status === 'pending' && <Clock className="h-3 w-3" />}
                              {order.order_status === 'ready' && <CheckCircle className="h-3 w-3" />}
                              {['cancelled', 'rejected'].includes(order.order_status) && <AlertCircle className="h-3 w-3" />}
                              {getOrderStatusText(order.order_status)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true) }}
                          className="border-primary/20 hover:bg-primary/5 text-primary text-xs flex-shrink-0"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
