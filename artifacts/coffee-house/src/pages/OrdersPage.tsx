import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link, useLocation } from 'wouter'
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Eye, RefreshCw, ShoppingBag } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import OrderModal from '@/components/OrderModal'
import { toast } from 'sonner'

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

export default function OrdersPage() {
  const [, setLocation] = useLocation()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (!userData) {
      setLocation('/auth/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [setLocation])

  const fetchOrders = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error && isSupabaseConfigured) toast.error('Gagal memuat pesanan: ' + error.message)
      else if (data) setOrders(data)
    } catch {
      if (isSupabaseConfigured) toast.error('Gagal memuat pesanan')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    setLocation('/auth/login')
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
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between max-w-4xl mx-auto px-4 md:px-6 py-3 gap-3">
          <Link
            href="/menu"
            className="flex items-center gap-2 text-primary hover:underline font-semibold text-sm flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali ke Menu</span>
            <span className="sm:hidden">Menu</span>
          </Link>
          <h1 className="text-lg md:text-2xl font-bold text-primary">Pesanan Saya</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-red-500 hover:bg-red-50 flex-shrink-0"
          >
            Keluar
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Riwayat Pesanan</h2>
            <p className="text-sm text-muted-foreground">Pantau status pesanan aktif Anda</p>
          </div>
          <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Segarkan</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-lg bg-primary/5 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-primary/10">
            <CardContent className="pt-10 pb-10 text-center space-y-4">
              <ShoppingBag className="h-12 w-12 mx-auto text-primary/30" />
              <p className="text-muted-foreground">Anda belum pernah memesan apa pun.</p>
              <Link href="/menu">
                <Button className="bg-primary hover:bg-primary/90">
                  Mulai Pesan Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="border-primary/10 hover:shadow-md transition-all"
              >
                <CardHeader className="pb-3 pt-4 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold text-primary">
                        Pesanan #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}{' '}
                        pukul {new Date(order.created_at).toLocaleTimeString('id-ID')}
                      </CardDescription>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {formatRupiah(order.total_amount)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-4 px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Metode Pembayaran
                      </p>
                      <p className="text-sm font-semibold">{order.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Status Pembayaran
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                          statusColors[order.payment_status] || 'bg-gray-50 border-gray-200 text-gray-800'
                        }`}
                      >
                        {getPaymentStatusText(order.payment_status)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Status Pesanan
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${
                          statusColors[order.order_status] || 'bg-gray-50 border-gray-200 text-gray-800'
                        }`}
                      >
                        {order.order_status === 'pending' && <Clock className="h-3 w-3" />}
                        {order.order_status === 'ready' && <CheckCircle className="h-3 w-3" />}
                        {['cancelled', 'rejected'].includes(order.order_status) && (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {getOrderStatusText(order.order_status)}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsModalOpen(true)
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

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setSelectedOrder(null)
            setIsModalOpen(false)
          }}
          onUpdate={() => {}}
          isAdminView={false}
        />
      )}
    </div>
  )
}
