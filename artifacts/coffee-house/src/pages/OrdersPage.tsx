import { useEffect, useState } from 'react'
import { api, getUser, clearUser } from '@/lib/api'
import { useCart } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Link, useLocation } from 'wouter'
import {
  ArrowLeft, Clock, CheckCircle, AlertCircle, Eye,
  RefreshCw, ShoppingBag, Coffee, LogOut,
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import OrderModal from '@/components/OrderModal'
import { toast } from 'sonner'

interface Order {
  id: string
  total_amount?: number | string
  totalAmount?: number | string
  payment_method?: string
  paymentMethod?: string
  payment_status?: string
  paymentStatus?: string
  order_status?: string
  orderStatus?: string
  payment_proof_url?: string
  paymentProofUrl?: string
  notes?: string
  created_at?: string
  createdAt?: string
}

function getOrderField(order: Order, snake: keyof Order, camel: keyof Order) {
  return order[snake] ?? order[camel]
}

const paymentStatusCfg: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Menunggu Konfirmasi', cls: 'bg-amber-50 border-amber-200 text-amber-800' },
  confirmed: { label: 'Lunas / Diterima',   cls: 'bg-green-50 border-green-200 text-green-800' },
  rejected:  { label: 'Ditolak',            cls: 'bg-red-50 border-red-200 text-red-800' },
}

const orderStatusCfg: Record<string, { label: string; cls: string; icon?: React.ElementType }> = {
  pending:   { label: 'Antrean',       cls: 'bg-amber-50 border-amber-200 text-amber-800',     icon: Clock },
  preparing: { label: 'Sedang Dibuat', cls: 'bg-blue-50 border-blue-200 text-blue-800' },
  ready:     { label: 'Siap Diambil',  cls: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: CheckCircle },
  completed: { label: 'Selesai',       cls: 'bg-slate-50 border-slate-200 text-slate-700' },
  cancelled: { label: 'Dibatalkan',    cls: 'bg-rose-50 border-rose-200 text-rose-800',        icon: AlertCircle },
}

export default function OrdersPage() {
  const [, setLocation] = useLocation()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const clearCart = useCart((state) => state.clearCart)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      setLocation('/auth/login')
      return
    }
    fetchOrders()
  }, [setLocation])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const data = await api.orders.getMyOrders()
      setOrders(data as Order[])
    } catch (err) {
      toast.error('Gagal memuat pesanan')
    }
    setIsLoading(false)
  }

  const handleLogout = async () => {
    try { await api.auth.logout() } catch {}
    clearCart()
    clearUser()
    setLocation('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link href="/menu" className="p-1.5 rounded-lg hover:bg-primary/8 transition-colors text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Coffee className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-primary text-base" style={{ fontFamily: 'Playfair Display, serif' }}>
                Pesanan Saya
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15 gap-1.5 h-8 text-xs rounded-xl">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Segarkan</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-red-500 hover:bg-red-50 h-8 px-2.5 rounded-xl text-xs gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Riwayat Pesanan</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Pantau status semua pesanan Anda</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-primary/5 animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-primary/10 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto">
              <ShoppingBag className="h-7 w-7 text-primary/30" />
            </div>
            <div>
              <p className="font-semibold text-foreground/80">Belum ada pesanan</p>
              <p className="text-sm text-muted-foreground mt-1">Yuk, mulai pesan kopi favoritmu!</p>
            </div>
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90 shadow-sm rounded-xl">Pesan Sekarang</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const paymentStatus = String(getOrderField(order, 'payment_status', 'paymentStatus') ?? '')
              const orderStatus = String(getOrderField(order, 'order_status', 'orderStatus') ?? '')
              const totalAmount = getOrderField(order, 'total_amount', 'totalAmount')
              const paymentMethod = getOrderField(order, 'payment_method', 'paymentMethod')
              const createdAt = getOrderField(order, 'created_at', 'createdAt')
              const pCfg = paymentStatusCfg[paymentStatus] ?? { label: paymentStatus, cls: 'bg-gray-50 border-gray-200 text-gray-700' }
              const oCfg = orderStatusCfg[orderStatus] ?? { label: orderStatus, cls: 'bg-gray-50 border-gray-200 text-gray-700' }
              const OIcon = oCfg.icon
              return (
                <div key={order.id} className="bg-card border border-primary/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="bg-gradient-to-r from-primary/6 to-accent/5 px-4 py-3 flex items-center justify-between border-b border-primary/8">
                    <div>
                      <p className="text-xs font-bold text-primary">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {createdAt ? new Date(String(createdAt)).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                        {createdAt ? ' pukul ' + new Date(String(createdAt)).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                    <p className="text-base font-bold text-primary">{formatRupiah(Number(totalAmount))}</p>
                  </div>
                  <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-1">Pembayaran</p>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${pCfg.cls}`}>{pCfg.label}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-1">Status</p>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold inline-flex items-center gap-1 ${oCfg.cls}`}>
                          {OIcon && <OIcon className="h-3 w-3" />}
                          {oCfg.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-1">Metode</p>
                        <p className="text-xs font-semibold text-foreground">{String(paymentMethod ?? '')}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setIsModalOpen(true) }}
                      className="border-primary/20 hover:bg-primary/5 text-primary text-xs h-8 gap-1.5 rounded-xl flex-shrink-0">
                      <Eye className="h-3.5 w-3.5" />
                      Detail
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder as any}
          isOpen={isModalOpen}
          onClose={() => { setSelectedOrder(null); setIsModalOpen(false) }}
          onUpdate={() => {}}
          isAdminView={false}
        />
      )}
    </div>
  )
}
