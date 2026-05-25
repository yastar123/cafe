import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import OrderModal from '@/components/OrderModal'
import { Eye, RefreshCw } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface Order {
  id: string
  user_id: string
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  payment_proof_url?: string
  notes?: string
  created_at: string
  users?: { username: string; email: string }
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

const paymentStatusText: Record<string, string> = {
  pending: 'Menunggu',
  confirmed: 'Diterima',
  rejected: 'Ditolak',
}

const orderStatusText: Record<string, string> = {
  pending: 'Antrean',
  preparing: 'Dibuat',
  ready: 'Siap',
  completed: 'Selesai',
  cancelled: 'Batal',
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
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(username, email)')
        .order('created_at', { ascending: false })
      if (error) toast.error('Gagal memuat pesanan: ' + error.message)
      else if (data) { setOrders(data as Order[]); setFilteredOrders(data as Order[]) }
    } catch {
      toast.error('Gagal memuat pesanan')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    let filtered = orders
    if (filterStatus !== 'all') {
      filtered = filtered.filter(
        (o) => o.order_status === filterStatus || o.payment_status === filterStatus
      )
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.users?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredOrders(filtered)
  }, [filterStatus, searchTerm, orders])

  const handleOrderUpdate = async (orderId: string, updates: Partial<Order>) => {
    const { error } = await supabase.from('orders').update(updates).eq('id', orderId)
    if (error) {
      toast.error('Gagal memperbarui: ' + error.message)
    } else {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)))
      toast.success('Status pesanan diperbarui!')
      setIsModalOpen(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pesanan Masuk</h1>
          <p className="text-sm text-muted-foreground">Kelola pesanan dari pelanggan</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15 flex-shrink-0">
          <RefreshCw className="h-4 w-4 mr-1.5" />
          <span className="hidden sm:inline">Segarkan</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Cari ID pesanan atau nama pembeli..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-primary/20 text-sm"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-52 border-primary/20 bg-background text-sm">
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-primary/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <Card className="border-primary/10">
          <CardContent className="pt-5">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Tidak ada pesanan yang ditemukan</p>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-primary/10 rounded-lg p-3 md:p-4 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                          <p className="font-bold text-primary text-sm">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <span className="text-xs text-muted-foreground truncate">
                            {order.users?.username || 'Pelanggan'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold ${statusColors[order.payment_status] || ''}`}>
                            {paymentStatusText[order.payment_status] || order.payment_status}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold ${statusColors[order.order_status] || ''}`}>
                            {orderStatusText[order.order_status] || order.order_status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' '}•{' '}{order.payment_method}
                          {' '}•{' '}<span className="font-semibold text-primary">{formatRupiah(order.total_amount)}</span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true) }}
                        className="border-primary/20 hover:bg-primary/5 text-primary flex-shrink-0 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden sm:inline">Detail</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => { setSelectedOrder(null); setIsModalOpen(false) }}
          onUpdate={handleOrderUpdate}
          isAdminView={true}
        />
      )}
    </div>
  )
}
