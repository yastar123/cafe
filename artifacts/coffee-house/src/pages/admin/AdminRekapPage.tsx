import { useEffect, useState, useCallback } from 'react'
import * as XLSX from 'xlsx'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { api } from '@/lib/api'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'
import {
  TrendingUp, ShoppingCart, CheckCircle, Clock,
  Download, BarChart2, RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// ─── Types ─────────────────────────────────────────────────────────────────

interface RekapSummary {
  totalRevenue: number
  totalOrders: number
  confirmedOrders: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  avgOrderValue: number
}

interface DailyRevenue {
  date: string
  revenue: number
  orders: number
  confirmedOrders: number
}

interface PaymentMethodStat {
  method: string
  count: number
  total: number
}

interface StatusStat {
  status: string
  count: number
}

interface OrderRow {
  id: string
  tanggal: string
  pelanggan: string
  email: string
  totalAmount: number
  metodePembayaran: string
  statusPembayaran: string
  statusPesanan: string
  catatan: string
}

interface RekapData {
  summary: RekapSummary
  dailyRevenue: DailyRevenue[]
  byPaymentMethod: PaymentMethodStat[]
  byStatus: StatusStat[]
  orders: OrderRow[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  completed: '#10b981',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  pending: '#f59e0b',
  cancelled: '#ef4444',
}

const PIE_PALETTE = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#06b6d4']

function statusLabel(s: string) {
  const map: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    preparing: 'Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }
  return map[s] ?? s
}

function paymentStatusLabel(s: string) {
  const map: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    rejected: 'Ditolak',
  }
  return map[s] ?? s
}

// ─── Preset Date Ranges ─────────────────────────────────────────────────────

const PRESETS = [
  { label: 'Hari ini',    getDates: () => { const d = today(); return { from: d, to: d } } },
  { label: 'Minggu ini',  getDates: () => { const d = new Date(); const mon = new Date(d); mon.setDate(d.getDate() - d.getDay() + 1); return { from: fmt(mon), to: fmt(d) } } },
  { label: 'Bulan ini',   getDates: () => { const d = new Date(); return { from: fmt(new Date(d.getFullYear(), d.getMonth(), 1)), to: fmt(d) } } },
  { label: 'Bulan lalu',  getDates: () => { const d = new Date(); const first = new Date(d.getFullYear(), d.getMonth() - 1, 1); const last = new Date(d.getFullYear(), d.getMonth(), 0); return { from: fmt(first), to: fmt(last) } } },
  { label: 'Tahun ini',   getDates: () => { const d = new Date(); return { from: fmt(new Date(d.getFullYear(), 0, 1)), to: fmt(d) } } },
]

function today() { return fmt(new Date()) }
function fmt(d: Date) { return d.toISOString().split('T')[0] }

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.name === 'Pendapatan' ? formatRupiah(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminRekapPage() {
  const [data, setData] = useState<RekapData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [from, setFrom] = useState(() => fmt(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))
  const [to, setTo] = useState(() => today())
  const [activePreset, setActivePreset] = useState(2) // "Bulan ini"

  const fetchRekap = useCallback(async (f: string, t: string) => {
    setIsLoading(true)
    try {
      const result = await api.rekap.get(f, t)
      setData(result)
    } catch {
      toast.error('Gagal memuat data rekap')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => { fetchRekap(from, to) }, [])

  const applyPreset = (idx: number) => {
    setActivePreset(idx)
    const { from: f, to: t } = PRESETS[idx].getDates()
    setFrom(f); setTo(t)
    fetchRekap(f, t)
  }

  const applyCustom = () => {
    setActivePreset(-1)
    fetchRekap(from, to)
  }

  // ── Export Excel ────────────────────────────────────────────────────────

  const exportExcel = () => {
    if (!data) return
    const wb = XLSX.utils.book_new()

    // Sheet 1: Ringkasan
    const summaryRows = [
      ['REKAP KEUANGAN — COFFEE HOUSE'],
      [`Periode: ${from} s/d ${to}`],
      [],
      ['Metrik', 'Nilai'],
      ['Total Pendapatan (Confirmed)', formatRupiah(data.summary.totalRevenue)],
      ['Total Pesanan', data.summary.totalOrders],
      ['Pesanan Dikonfirmasi', data.summary.confirmedOrders],
      ['Pesanan Selesai', data.summary.completedOrders],
      ['Pesanan Menunggu', data.summary.pendingOrders],
      ['Pesanan Dibatalkan', data.summary.cancelledOrders],
      ['Rata-rata Nilai Pesanan', formatRupiah(data.summary.avgOrderValue)],
    ]
    const ws1 = XLSX.utils.aoa_to_sheet(summaryRows)
    ws1['!cols'] = [{ wch: 35 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan')

    // Sheet 2: Harian
    const dailyRows = [
      ['Tanggal', 'Pesanan Masuk', 'Pesanan Confirmed', 'Pendapatan (Rp)'],
      ...data.dailyRevenue.map((d) => [d.date, d.orders, d.confirmedOrders, d.revenue]),
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(dailyRows)
    ws2['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 20 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, ws2, 'Harian')

    // Sheet 3: Detail Pesanan
    const detailRows = [
      ['Tanggal', 'Pelanggan', 'Email', 'Total (Rp)', 'Metode Bayar', 'Status Bayar', 'Status Pesanan', 'Catatan'],
      ...data.orders.map((o) => [
        o.tanggal, o.pelanggan, o.email, o.totalAmount,
        o.metodePembayaran, paymentStatusLabel(o.statusPembayaran),
        statusLabel(o.statusPesanan), o.catatan,
      ]),
    ]
    const ws3 = XLSX.utils.aoa_to_sheet(detailRows)
    ws3['!cols'] = [{ wch: 12 }, { wch: 16 }, { wch: 24 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 24 }]
    XLSX.utils.book_append_sheet(wb, ws3, 'Detail Pesanan')

    // Sheet 4: Metode Pembayaran
    const methodRows = [
      ['Metode Pembayaran', 'Jumlah Pesanan', 'Total Pendapatan (Rp)'],
      ...data.byPaymentMethod.map((m) => [m.method, m.count, m.total]),
    ]
    const ws4 = XLSX.utils.aoa_to_sheet(methodRows)
    ws4['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 22 }]
    XLSX.utils.book_append_sheet(wb, ws4, 'Metode Pembayaran')

    XLSX.writeFile(wb, `rekap-keuangan-${from}-${to}.xlsx`)
    toast.success('File Excel berhasil diunduh!')
  }

  // ── Render ──────────────────────────────────────────────────────────────

  const s = data?.summary

  const statCards = s ? [
    { title: 'Total Pendapatan', value: formatRupiah(s.totalRevenue), icon: TrendingUp, gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
    { title: 'Total Pesanan', value: s.totalOrders, icon: ShoppingCart, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
    { title: 'Pesanan Selesai', value: s.completedOrders, icon: CheckCircle, gradient: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700' },
    { title: 'Rata-rata Pesanan', value: formatRupiah(s.avgOrderValue), icon: BarChart2, gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700' },
    { title: 'Menunggu Proses', value: s.pendingOrders, icon: Clock, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
  ] : []

  return (
    <div className="p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
            <BarChart2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Rekap Keuangan
            </h1>
            <p className="text-sm text-muted-foreground">Visualisasi pendapatan & unduh laporan Excel</p>
          </div>
        </div>
        <Button
          onClick={exportExcel}
          disabled={!data || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 flex-shrink-0"
        >
          <Download className="h-4 w-4" />
          Unduh Excel
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-end">
        {/* Presets */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => applyPreset(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreset === i
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-primary/8 text-primary hover:bg-primary/15'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom date range */}
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="date"
            value={from}
            onChange={(e) => { setFrom(e.target.value); setActivePreset(-1) }}
            className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background text-foreground"
          />
          <span className="text-xs text-muted-foreground">s/d</span>
          <input
            type="date"
            value={to}
            onChange={(e) => { setTo(e.target.value); setActivePreset(-1) }}
            className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background text-foreground"
          />
          <Button size="sm" variant="outline" onClick={applyCustom} className="h-7 px-3 text-xs gap-1.5 border-primary/20">
            <RefreshCw className="h-3.5 w-3.5" />
            Terapkan
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-primary/5 animate-pulse" />)}
          </div>
          <div className="h-72 rounded-2xl bg-primary/5 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-64 rounded-2xl bg-primary/5 animate-pulse" />
            <div className="h-64 rounded-2xl bg-primary/5 animate-pulse" />
          </div>
        </div>
      ) : !data ? null : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {statCards.map((card) => {
              const Icon = card.icon
              return (
                <div key={card.title} className={`${card.bg} ${card.border} border rounded-2xl p-4 hover:shadow-md transition-all`}>
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs font-semibold text-muted-foreground leading-tight pr-1">{card.title}</p>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className={`text-lg md:text-xl font-bold ${card.text} leading-none`}>{card.value}</p>
                </div>
              )
            })}
          </div>

          {/* Bar Chart: Daily Revenue */}
          <Card className="border-primary/10 rounded-2xl mb-5 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5 border-b border-primary/8 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">
                📊 Pendapatan Harian (Rp)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-2">
              {data.dailyRevenue.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-12">Tidak ada data di periode ini</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.dailyRevenue} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={46} />
                    <Tooltip content={<RevenueTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar dataKey="revenue" name="Pendapatan" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Line Chart: Orders trend */}
          <Card className="border-primary/10 rounded-2xl mb-5 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-5 border-b border-primary/8 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">
                📈 Tren Pesanan Harian
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-2">
              {data.dailyRevenue.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-12">Tidak ada data di periode ini</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.dailyRevenue} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={32} />
                    <Tooltip content={<RevenueTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Line type="monotone" dataKey="orders" name="Total Pesanan" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="confirmedOrders" name="Dikonfirmasi" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pie Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            {/* Status Distribution */}
            <Card className="border-primary/10 rounded-2xl shadow-sm">
              <CardHeader className="pb-2 pt-4 px-5 border-b border-primary/8 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">
                  🥧 Distribusi Status Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {data.byStatus.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Tidak ada data</p>
                ) : (
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={data.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={72} label={({ name, percent }) => `${statusLabel(name)} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                          {data.byStatus.map((entry, i) => (
                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? PIE_PALETTE[i % PIE_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: any, name: any) => [val, statusLabel(name)]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      {data.byStatus.map((s, i) => (
                        <span key={s.status} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[s.status] ?? PIE_PALETTE[i % PIE_PALETTE.length] }} />
                          {statusLabel(s.status)}: <b>{s.count}</b>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method Distribution */}
            <Card className="border-primary/10 rounded-2xl shadow-sm">
              <CardHeader className="pb-2 pt-4 px-5 border-b border-primary/8 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">
                  💳 Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {data.byPaymentMethod.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Tidak ada data</p>
                ) : (
                  <div className="space-y-2.5 pt-2">
                    {data.byPaymentMethod.map((m, i) => (
                      <div key={m.method} className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_PALETTE[i % PIE_PALETTE.length] }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium truncate">{m.method}</span>
                            <span className="text-muted-foreground ml-2">{m.count}x · {formatRupiah(m.total)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-primary/8 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.max(4, (m.count / Math.max(...data.byPaymentMethod.map(x => x.count))) * 100)}%`,
                                background: PIE_PALETTE[i % PIE_PALETTE.length],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detail Table */}
          <Card className="border-primary/10 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-5 border-b border-primary/8 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">
                  🧾 Detail Semua Pesanan ({data.orders.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-primary/5 border-b border-primary/8">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tanggal</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Pelanggan</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Total</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Metode</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status Bayar</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status Pesanan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {data.orders.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Tidak ada pesanan di periode ini</td></tr>
                    ) : data.orders.map((o) => (
                      <tr key={o.id} className="hover:bg-primary/3 transition-colors">
                        <td className="px-4 py-2.5 text-muted-foreground">{o.tanggal}</td>
                        <td className="px-4 py-2.5 font-medium max-w-[120px] truncate">{o.pelanggan}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">{formatRupiah(o.totalAmount)}</td>
                        <td className="px-4 py-2.5 text-muted-foreground max-w-[100px] truncate">{o.metodePembayaran}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            o.statusPembayaran === 'confirmed' ? 'bg-emerald-50 text-emerald-700'
                            : o.statusPembayaran === 'rejected' ? 'bg-red-50 text-red-700'
                            : 'bg-amber-50 text-amber-700'
                          }`}>
                            {paymentStatusLabel(o.statusPembayaran)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold`} style={{
                            background: `${STATUS_COLORS[o.statusPesanan] ?? '#6b7280'}22`,
                            color: STATUS_COLORS[o.statusPesanan] ?? '#6b7280',
                          }}>
                            {statusLabel(o.statusPesanan)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
