import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
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
    const { data, error } = await supabase
      .from('orders')
      .select('*, users(username, email)')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal memuat pesanan: ' + error.message)
    } else if (data) {
      setOrders(data as Order[])
      setFilteredOrders(data as Order[])
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
      toast.error('Gagal memperbarui status pesanan: ' + error.message)
    } else {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)))
      toast.success('Status pesanan #' + orderId.slice(0, 8).toUpperCase() + ' berhasil diperbarui!')
      setIsModalOpen(false)
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi'
      case 'confirmed': return 'Pembayaran Diterima'
      case 'rejected': return 'Pembayaran Ditolak'
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
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pesanan Masuk</h1>
          <p className="text-muted-foreground">Kelola dan pantau seluruh pesanan masuk dari pelanggan</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15">
          <RefreshCw className="h-4 w-4 mr-2" />
          Segarkan
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Cari berdasarkan ID Pesanan atau nama pembeli..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-primary/20"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-56 border-primary/20 bg-background">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu Konfirmasi / Antrean</SelectItem>
            <SelectItem value="confirmed">Pembayaran Diterima</SelectItem>
            <SelectItem value="rejected">Pembayaran Ditolak</SelectItem>
            <SelectItem value="preparing">Sedang Dibuat</SelectItem>
            <SelectItem value="ready">Siap Diambil</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">Memuat daftar pesanan pelanggan...</p>
      ) : (
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Tidak ada pesanan yang ditemukan</p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-primary/10 rounded-lg p-4 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-primary text-sm">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {order.users?.username || 'Pelanggan'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${statusColors[order.payment_status] || 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                            {getPaymentStatusText(order.payment_status)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${statusColors[order.order_status] || 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                            {getOrderStatusText(order.order_status)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} •{' '}
                          {order.payment_method} •{' '}
                          <span className="font-semibold text-primary">{formatRupiah(order.total_amount)}</span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true) }}
                        className="border-primary/20 hover:bg-primary/5 text-primary shrink-0"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
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
