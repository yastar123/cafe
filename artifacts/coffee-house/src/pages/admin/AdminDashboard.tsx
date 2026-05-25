import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShoppingCart, TrendingUp, AlertCircle, CheckCircle, Clock, Coffee } from 'lucide-react'
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
    totalOrders: 0, totalRevenue: 0, pendingOrders: 0,
    completedOrders: 0, preparingOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [today] = useState(new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }))

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
    {
      title: 'Total Pesanan',
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Pendapatan',
      value: formatRupiah(stats.totalRevenue),
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Menunggu Proses',
      value: stats.pendingOrders,
      icon: AlertCircle,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      textColor: 'text-amber-700',
    },
    {
      title: 'Sedang Dibuat',
      value: stats.preparingOrders,
      icon: Clock,
      gradient: 'from-purple-500 to-violet-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      textColor: 'text-purple-700',
    },
    {
      title: 'Pesanan Selesai',
      value: stats.completedOrders,
      icon: CheckCircle,
      gradient: 'from-teal-500 to-cyan-600',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
      textColor: 'text-teal-700',
    },
  ]

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      {/* Page header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Coffee className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
            Dasbor Utama
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-11">{today}</p>
      </div>

      {/* Stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-primary/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} className={`${stat.bg} ${stat.border} border rounded-2xl p-4 hover:shadow-md transition-all duration-200`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground leading-tight pr-1">{stat.title}</p>
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <p className={`text-xl md:text-2xl font-bold ${stat.textColor} leading-none`}>{stat.value}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick tips */}
      {!isLoading && stats.pendingOrders > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800">
              {stats.pendingOrders} pesanan menunggu konfirmasi
            </p>
            <p className="text-xs text-amber-700/70 mt-0.5">
              Segera proses pesanan yang masuk di halaman Pesanan Masuk.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
