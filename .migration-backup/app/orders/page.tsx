'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { formatRupiah } from '@/lib/utils'
import OrderModal from '@/components/order-modal'

interface Order {
  id: string
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
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

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setOrders(data)
      }
      setIsLoading(false)
    }

    fetchOrders()
  }, [user])

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
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur p-4 md:p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/menu" className="flex items-center gap-2 text-primary hover:underline font-semibold text-sm">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Menu
          </Link>
          <h1 className="text-2xl font-bold text-primary">Pesanan Saya</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            Keluar
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">
            Memuat daftar pesanan Anda...
          </p>
        ) : orders.length === 0 ? (
          <Card className="border-primary/10">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-muted-foreground mb-4">
                Anda belum pernah memesan apa pun sebelumnya.
              </p>
              <Link href="/menu">
                <Button className="bg-primary hover:bg-primary/90 font-medium">
                  Mulai Pesan Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-primary/10 hover:shadow-lg transition-shadow">
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
                          ] || 'bg-gray-50 border-gray-200 text-gray-850'
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
                          statusColors[order.order_status as keyof typeof statusColors] || 'bg-gray-50 border-gray-250 text-gray-850'
                        }`}
                      >
                        {order.order_status === 'pending' && <Clock className="h-3 w-3" />}
                        {order.order_status === 'ready' && <CheckCircle className="h-3 w-3" />}
                        {(order.order_status === 'cancelled' ||
                          order.order_status === 'rejected') && (
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
