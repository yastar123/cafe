import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Edit2, Plus, CreditCard, ToggleLeft, ToggleRight, Building2 } from 'lucide-react'
import { toast } from 'sonner'

interface PaymentChannel {
  id: string
  name: string
  account_number?: string
  account_name?: string
  instructions?: string
  active: boolean
}

export default function AdminPaymentsPage() {
  const [channels, setChannels] = useState<PaymentChannel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<PaymentChannel | null>(null)
  const [formData, setFormData] = useState({
    name: '', account_number: '', account_name: '', instructions: '', active: true,
  })

  useEffect(() => { fetchChannels() }, [])

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase.from('payment_channels').select('*').order('created_at')
      if (error) toast.error('Gagal mengambil metode pembayaran: ' + error.message)
      else if (data) setChannels(data)
    } catch { toast.error('Gagal memuat data') }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingChannel) {
        const { error } = await supabase
          .from('payment_channels')
          .update({ name: formData.name, account_number: formData.account_number, account_name: formData.account_name, instructions: formData.instructions, active: formData.active })
          .eq('id', editingChannel.id)
        if (error) { toast.error('Gagal memperbarui: ' + error.message); return }
        setChannels(channels.map((c) => c.id === editingChannel.id ? { ...c, ...formData } : c))
        toast.success('Metode pembayaran diperbarui')
      } else {
        const { data, error } = await supabase
          .from('payment_channels')
          .insert([{ name: formData.name, account_number: formData.account_number, account_name: formData.account_name, instructions: formData.instructions, active: formData.active }])
          .select()
        if (error) { toast.error('Gagal menambahkan: ' + error.message); return }
        if (data) setChannels([...channels, data[0]])
        toast.success('Metode pembayaran ditambahkan')
      }
      handleDialogClose()
    } catch { toast.error('Terjadi kesalahan') }
  }

  const handleEdit = (channel: PaymentChannel) => {
    setEditingChannel(channel)
    setFormData({ name: channel.name, account_number: channel.account_number || '', account_name: channel.account_name || '', instructions: channel.instructions || '', active: channel.active })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus metode pembayaran ini?')) return
    const { error } = await supabase.from('payment_channels').delete().eq('id', id)
    if (error) toast.error('Gagal menghapus: ' + error.message)
    else { setChannels(channels.filter((c) => c.id !== id)); toast.success('Dihapus') }
  }

  const handleToggleActive = async (channel: PaymentChannel) => {
    const { error } = await supabase.from('payment_channels').update({ active: !channel.active }).eq('id', channel.id)
    if (error) toast.error('Gagal mengubah status')
    else {
      setChannels(channels.map((c) => c.id === channel.id ? { ...c, active: !c.active } : c))
      toast.success(channel.active ? 'Dinonaktifkan' : 'Diaktifkan')
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingChannel(null)
    setFormData({ name: '', account_number: '', account_name: '', instructions: '', active: true })
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Metode Pembayaran</h1>
            <p className="text-sm text-muted-foreground">Kelola transfer bank dan e-wallet</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose() }}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 flex-shrink-0"
              size="sm"
              onClick={() => { setEditingChannel(null); setFormData({ name: '', account_number: '', account_name: '', instructions: '', active: true }); setIsDialogOpen(true) }}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingChannel ? 'Ubah Metode Pembayaran' : 'Tambah Metode Pembayaran'}</DialogTitle>
              <DialogDescription>{editingChannel ? 'Perbarui detail metode pembayaran' : 'Tambahkan metode pembayaran baru'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama (contoh: BCA, GoPay)</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="border-primary/20" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="account_number">Nomor Rekening / Telepon</Label>
                <Input id="account_number" value={formData.account_number} onChange={(e) => setFormData({ ...formData, account_number: e.target.value })} className="border-primary/20" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="account_name">Nama Pemilik (A/N)</Label>
                <Input id="account_name" value={formData.account_name} onChange={(e) => setFormData({ ...formData, account_name: e.target.value })} className="border-primary/20" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="instructions">Instruksi (Opsional)</Label>
                <textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full p-2 border border-primary/20 rounded-md text-sm resize-none bg-background"
                  rows={3}
                  placeholder="Instruksi tambahan..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="rounded border-primary/20" />
                <Label htmlFor="active">Aktif (tampil ke pelanggan)</Label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingChannel ? 'Perbarui' : 'Tambah Metode'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-primary/5 animate-pulse" />
          ))}
        </div>
      ) : channels.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-primary/15 rounded-xl">
          <CreditCard className="h-10 w-10 mx-auto text-primary/30 mb-3" />
          <p className="text-muted-foreground text-sm">Belum ada metode pembayaran. Klik "Tambah" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <Card key={channel.id} className={`border-primary/10 transition-opacity ${!channel.active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CreditCard className="h-4 w-4 text-primary flex-shrink-0" />
                    <CardTitle className="text-base truncate">{channel.name}</CardTitle>
                    <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${channel.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {channel.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => handleToggleActive(channel)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                      {channel.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(channel)} className="border-primary/20 h-8 w-8 p-0">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(channel.id)} className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1">
                {channel.account_number && (
                  <div>
                    <p className="text-xs text-muted-foreground">No. Rekening</p>
                    <p className="font-bold text-sm">{channel.account_number}</p>
                  </div>
                )}
                {channel.account_name && (
                  <div>
                    <p className="text-xs text-muted-foreground">A/N</p>
                    <p className="font-semibold text-sm">{channel.account_name}</p>
                  </div>
                )}
                {channel.instructions && (
                  <CardDescription className="text-xs whitespace-pre-line pt-1">
                    {channel.instructions}
                  </CardDescription>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
