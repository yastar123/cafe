import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, order_status')

      if (orders) {
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
        const pendingOrders = orders.filter((o) => o.order_status === 'pending').length
        const completedOrders = orders.filter((o) => o.order_status === 'completed').length

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          completedOrders,
        })
      }
      setIsLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: 'Total Pesanan', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { title: 'Total Pendapatan', value: formatRupiah(stats.totalRevenue), icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { title: 'Pesanan Mengantre', value: stats.pendingOrders, icon: AlertCircle, color: 'bg-yellow-50 text-yellow-600' },
    { title: 'Pesanan Selesai', value: stats.completedOrders, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dasbor Utama</h1>
        <p className="text-muted-foreground">Selamat datang di Panel Administrasi Pemesanan Cafe Coffee House</p>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">Memuat dasbor statistik...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border-primary/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
