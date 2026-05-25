import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  preparingOrders: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    preparingOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('total_amount, order_status, payment_status')

        if (error) { toast.error('Gagal memuat statistik'); return }

        if (orders) {
          setStats({
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, o) => sum + Number(o.total_amount), 0),
            pendingOrders: orders.filter((o) => o.order_status === 'pending').length,
            completedOrders: orders.filter((o) => o.order_status === 'completed').length,
            preparingOrders: orders.filter((o) => o.order_status === 'preparing').length,
          })
        }
      } catch {
        toast.error('Gagal memuat data dasbor')
      }
      setIsLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: 'Total Pesanan', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { title: 'Total Pendapatan', value: formatRupiah(stats.totalRevenue), icon: TrendingUp, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { title: 'Pesanan Antrean', value: stats.pendingOrders, icon: AlertCircle, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    { title: 'Sedang Dibuat', value: stats.preparingOrders, icon: Clock, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { title: 'Pesanan Selesai', value: stats.completedOrders, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dasbor Utama</h1>
        <p className="text-sm text-muted-foreground mt-1">Selamat datang di Panel Administrasi Coffee House</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-primary/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className={`border ${stat.border}`}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-1.5 rounded-lg flex-shrink-0 ${stat.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-xl md:text-2xl font-bold text-foreground truncate">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
