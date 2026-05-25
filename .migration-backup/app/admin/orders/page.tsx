'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import OrderModal from '@/components/order-modal'
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
  users?: {
    username: string
    email: string
  }
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    const supabase = createClient()
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
        (o) =>
          o.order_status === filterStatus ||
          o.payment_status === filterStatus
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

  const handleOrderUpdate = async (
    orderId: string,
    updates: Partial<Order>
  ) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)

    if (error) {
      toast.error('Gagal memperbarui status pesanan: ' + error.message)
    } else {
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
      )
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
          <p className="text-muted-foreground">
            Kelola dan pantau seluruh pesanan masuk dari pelanggan
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchOrders} className="border-primary/15">
          <RefreshCw className="h-4 w-4 mr-2" />
          Segarkan
        </Button>
      </div>

      {/* Filters */}
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
        <p className="text-center text-muted-foreground py-12">
          Memuat daftar pesanan pelanggan...
        </p>
      ) : (
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Tidak ada pesanan yang ditemukan
              </p>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-primary/5 transition-all gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2 sm:gap-4">
                        <span className="font-mono font-bold text-sm text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {order.users?.username || 'Pelanggan Cafe'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('id-ID')} pukul {new Date(order.created_at).toLocaleTimeString('id-ID')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <div
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                            statusColors[
                              order.payment_status as keyof typeof statusColors
                            ] || 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          Pembayaran: {getPaymentStatusText(order.payment_status)}
                        </div>
                        <div
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                            statusColors[
                              order.order_status as keyof typeof statusColors
                            ] || 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          Pesanan: {getOrderStatusText(order.order_status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-primary/10">
                      <div className="md:text-right">
                        <p className="font-bold text-primary text-lg">
                          {formatRupiah(order.total_amount)}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {order.payment_method}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsModalOpen(true)
                        }}
                        className="border-primary/20 text-primary hover:bg-primary/5 text-xs font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
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

      {/* Order Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleOrderUpdate}
          isAdminView={true}
        />
      )}
    </div>
  )
}
