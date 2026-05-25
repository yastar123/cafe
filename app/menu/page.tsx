'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/lib/store/cart'
import MenuGrid from '@/components/menu-grid'
import CartSidebar from '@/components/cart-sidebar'
import OrderModal from '@/components/order-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, ShoppingBag, Clock, CheckCircle, AlertCircle, Eye, RefreshCw } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

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

const statusColors = {
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
  
  // Orders states
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  const cart = useCart()

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    const fetchMenuItems = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)

      if (error) {
        toast.error('Gagal memuat menu: ' + error.message)
      } else if (data) {
        setItems(data)
      }
      setIsLoadingMenu(false)
    }

    fetchMenuItems()
  }, [])

  const fetchOrders = async () => {
    if (!user) return
    setIsLoadingOrders(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal mengambil riwayat pesanan: ' + error.message)
    } else if (data) {
      setOrders(data)
    }
    setIsLoadingOrders(false)
  }

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders()
    }
  }, [activeTab, user])

  const categories = Array.from(
    new Set(items.map((item) => item.category))
  ).sort()

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items

  const handleLogout = async () => {
    sessionStorage.removeItem('user')
    await logout()
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi'
      case 'confirmed': return 'Lunas / Diterima'
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
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">Coffee House</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm font-medium text-muted-foreground bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                {user.username} (Pelanggan)
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs Menu / Orders */}
      <div className="border-b border-primary/10 bg-background px-4 md:px-6">
        <div className="flex gap-6 max-w-6xl mx-auto">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'menu'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Daftar Menu
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Pesanan Saya
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {activeTab === 'menu' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              {/* Category Filter */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-foreground">
                  Kategori Menu
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
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
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
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

              {/* Menu Items Grid */}
              {isLoadingMenu ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Memuat daftar menu...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-primary/10 rounded-lg">
                  <p className="text-muted-foreground">Tidak ada menu yang tersedia saat ini.</p>
                </div>
              ) : (
                <MenuGrid items={filteredItems} />
              )}
            </div>

            {/* Cart Sidebar */}
            <CartSidebar cartItems={cart.items} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Riwayat Pesanan</h2>
                <p className="text-sm text-muted-foreground">Pantau status pesanan aktif & transaksi selesai</p>
              </div>
              <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15">
                <RefreshCw className="h-4 w-4 mr-2" />
                Segarkan
              </Button>
            </div>

            {isLoadingOrders ? (
              <p className="text-center text-muted-foreground py-12">
                Memuat riwayat pesanan Anda...
              </p>
            ) : orders.length === 0 ? (
              <Card className="border-primary/10">
                <CardContent className="pt-8 pb-8 text-center space-y-4">
                  <ShoppingBag className="h-12 w-12 mx-auto text-primary/30" />
                  <p className="text-muted-foreground">
                    Anda belum memesan apapun hari ini.
                  </p>
                  <Button onClick={() => setActiveTab('menu')} className="bg-primary hover:bg-primary/90">
                    Pesan Sekarang
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="border-primary/10 hover:shadow-md transition-all">
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-base font-bold text-primary">
                            Pesanan #{order.id.slice(0, 8).toUpperCase()}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })} pukul {new Date(order.created_at).toLocaleTimeString('id-ID')}
                          </CardDescription>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-lg font-bold text-primary">
                            {formatRupiah(order.total_amount)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1">
                            Metode Pembayaran
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {order.payment_method}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1">
                            Status Pembayaran
                          </p>
                          <div
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                              statusColors[
                                order.payment_status as keyof typeof statusColors
                              ] || 'bg-gray-50 border-gray-200 text-gray-800'
                            }`}
                          >
                            {getPaymentStatusText(order.payment_status)}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1">
                            Status Pesanan
                          </p>
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${
                              statusColors[order.order_status as keyof typeof statusColors] || 'bg-gray-50 border-gray-200 text-gray-800'
                            }`}
                          >
                            {order.order_status === 'pending' && <Clock className="h-3 w-3" />}
                            {order.order_status === 'ready' && <CheckCircle className="h-3 w-3" />}
                            {(order.order_status === 'cancelled' || order.order_status === 'rejected') && (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {getOrderStatusText(order.order_status)}
                          </div>
                        </div>
                        <div className="md:text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsOrderModalOpen(true)
                            }}
                            className="border-primary/20 hover:bg-primary/5 text-primary text-xs"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Detail Pesanan
                          </Button>
                        </div>
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
          onClose={() => {
            setSelectedOrder(null)
            setIsOrderModalOpen(false)
          }}
          onUpdate={() => {}}
          isAdminView={false} // Users view: cannot edit status
        />
      )}
    </div>
  )
}
