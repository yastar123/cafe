import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import OrderModal from '@/components/OrderModal'
import { Eye, RefreshCw, ShoppingCart, Search } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface Order {
  id: string
  userId?: string
  user_id?: string
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
  username?: string
  email?: string
  users?: { username: string; email: string }
}

const paymentBadge: Record<string, string> = {
  pending:   'bg-amber-50 border-amber-200 text-amber-800',
  confirmed: 'bg-green-50 border-green-200 text-green-800',
  rejected:  'bg-red-50 border-red-200 text-red-800',
}
const orderBadge: Record<string, string> = {
  pending:   'bg-amber-50 border-amber-200 text-amber-800',
  preparing: 'bg-blue-50 border-blue-200 text-blue-800',
  ready:     'bg-emerald-50 border-emerald-200 text-emerald-800',
  completed: 'bg-slate-50 border-slate-200 text-slate-700',
  cancelled: 'bg-rose-50 border-rose-200 text-rose-800',
}
const paymentLabel: Record<string, string> = { pending: 'Menunggu', confirmed: 'Diterima', rejected: 'Ditolak' }
const orderLabel: Record<string, string> = { pending: 'Antrean', preparing: 'Dibuat', ready: 'Siap', completed: 'Selesai', cancelled: 'Batal' }

function getField(order: Order, snake: keyof Order, camel: keyof Order): any {
  return order[snake] ?? order[camel]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const data = await api.orders.getAdminOrders()
      const normalized = data.map((o) => ({
        ...o,
        users: o.users ?? (o.username ? { username: o.username, email: o.email ?? '' } : undefined),
      }))
      setOrders(normalized as Order[])
      setFilteredOrders(normalized as Order[])
    } catch {
      toast.error('Gagal memuat pesanan')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    let filtered = orders
    if (filterStatus !== 'all') {
      filtered = filtered.filter((o) =>
        getField(o, 'order_status', 'orderStatus') === filterStatus ||
        getField(o, 'payment_status', 'paymentStatus') === filterStatus
      )
    }
    if (searchTerm) {
      filtered = filtered.filter((o) =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.users?.username ?? o.username ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredOrders(filtered)
  }, [filterStatus, searchTerm, orders])

  const handleOrderUpdate = async (orderId: string, updates: Partial<Order>) => {
    try {
      await api.orders.adminUpdate(orderId, {
        paymentStatus: updates.payment_status ?? updates.paymentStatus,
        orderStatus: updates.order_status ?? updates.orderStatus,
      })
      setOrders(orders.map((o) => o.id === orderId ? { ...o, ...updates } : o))
      toast.success('Status pesanan diperbarui!')
      setIsModalOpen(false)
    } catch (err) {
      toast.error('Gagal memperbarui pesanan')
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
            <ShoppingCart className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Pesanan Masuk</h1>
            <p className="text-sm text-muted-foreground">Kelola & perbarui status pesanan pelanggan</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15 gap-1.5 flex-shrink-0 rounded-xl">
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Segarkan</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari ID pesanan atau nama pembeli..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-primary/20 text-sm rounded-xl h-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-52 border-primary/20 bg-background text-sm rounded-xl h-9">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu / Antrean</SelectItem>
            <SelectItem value="confirmed">Pembayaran Diterima</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
            <SelectItem value="preparing">Sedang Dibuat</SelectItem>
            <SelectItem value="ready">Siap Diambil</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-primary/5 animate-pulse" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-primary/20 rounded-2xl">
          <ShoppingCart className="h-10 w-10 mx-auto text-primary/30 mb-3" />
          <p className="text-muted-foreground text-sm">Tidak ada pesanan yang ditemukan</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredOrders.map((order) => {
            const paymentStatus = String(getField(order, 'payment_status', 'paymentStatus') ?? '')
            const orderStatus = String(getField(order, 'order_status', 'orderStatus') ?? '')
            const totalAmount = getField(order, 'total_amount', 'totalAmount')
            const paymentMethod = getField(order, 'payment_method', 'paymentMethod')
            const createdAt = getField(order, 'created_at', 'createdAt')
            const username = order.users?.username ?? order.username ?? 'Pelanggan'
            return (
              <div key={order.id} className="bg-card border border-primary/10 rounded-2xl p-3.5 md:p-4 hover:shadow-sm hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2">
                      <p className="font-bold text-primary text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground font-medium">{username}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${paymentBadge[paymentStatus] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        {paymentLabel[paymentStatus] || paymentStatus}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${orderBadge[orderStatus] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        {orderLabel[orderStatus] || orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {createdAt ? new Date(String(createdAt)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      {' · '}{String(paymentMethod ?? '')}
                      {' · '}<span className="font-semibold text-primary">{formatRupiah(Number(totalAmount))}</span>
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { setSelectedOrder(order); setIsModalOpen(true) }}
                    className="border-primary/20 hover:bg-primary/5 text-primary flex-shrink-0 text-xs h-8 gap-1 rounded-lg">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Detail</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder as any}
          isOpen={isModalOpen}
          onClose={() => { setSelectedOrder(null); setIsModalOpen(false) }}
          onUpdate={handleOrderUpdate as any}
          isAdminView={true}
        />
      )}
    </div>
  )
}
