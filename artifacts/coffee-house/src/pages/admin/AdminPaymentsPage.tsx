import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2, Edit2, Plus, CreditCard } from 'lucide-react'
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
    name: '',
    account_number: '',
    account_name: '',
    instructions: '',
    active: true,
  })

  useEffect(() => { fetchChannels() }, [])

  const fetchChannels = async () => {
    const { data, error } = await supabase.from('payment_channels').select('*').order('created_at')
    if (error) {
      toast.error('Gagal mengambil daftar metode pembayaran: ' + error.message)
    } else if (data) {
      setChannels(data)
    }
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

        if (error) { toast.error('Gagal memperbarui metode pembayaran: ' + error.message); return }
        setChannels(channels.map((c) => c.id === editingChannel.id ? { ...c, ...formData } : c))
        toast.success('Metode pembayaran berhasil diperbarui')
      } else {
        const { data, error } = await supabase
          .from('payment_channels')
          .insert([{ name: formData.name, account_number: formData.account_number, account_name: formData.account_name, instructions: formData.instructions, active: formData.active }])
          .select()

        if (error) { toast.error('Gagal menambahkan metode pembayaran: ' + error.message); return }
        if (data) setChannels([...channels, data[0]])
        toast.success('Metode pembayaran berhasil ditambahkan')
      }
      handleDialogClose()
    } catch {
      toast.error('Terjadi kesalahan saat memproses data')
    }
  }

  const handleEdit = (channel: PaymentChannel) => {
    setEditingChannel(channel)
    setFormData({
      name: channel.name,
      account_number: channel.account_number || '',
      account_name: channel.account_name || '',
      instructions: channel.instructions || '',
      active: channel.active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus metode pembayaran ini?')) return
    const { error } = await supabase.from('payment_channels').delete().eq('id', id)
    if (error) {
      toast.error('Gagal menghapus: ' + error.message)
    } else {
      setChannels(channels.filter((c) => c.id !== id))
      toast.success('Metode pembayaran berhasil dihapus')
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingChannel(null)
    setFormData({ name: '', account_number: '', account_name: '', instructions: '', active: true })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metode Pembayaran</h1>
          <p className="text-muted-foreground">Kelola metode pembayaran transfer bank dan e-wallet</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose() }}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingChannel(null)
                setFormData({ name: '', account_number: '', account_name: '', instructions: '', active: true })
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Metode
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingChannel ? 'Ubah Metode Pembayaran' : 'Tambah Metode Pembayaran'}</DialogTitle>
              <DialogDescription>
                {editingChannel ? 'Perbarui detail metode pembayaran' : 'Tambahkan metode pembayaran baru'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Metode (e.g. BCA, GoPay, OVO)</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="border-primary/20" />
              </div>
              <div>
                <Label htmlFor="account_number">Nomor Rekening / Telepon</Label>
                <Input id="account_number" value={formData.account_number} onChange={(e) => setFormData({ ...formData, account_number: e.target.value })} className="border-primary/20" />
              </div>
              <div>
                <Label htmlFor="account_name">Nama Pemilik Rekening (A/N)</Label>
                <Input id="account_name" value={formData.account_name} onChange={(e) => setFormData({ ...formData, account_name: e.target.value })} className="border-primary/20" />
              </div>
              <div>
                <Label htmlFor="instructions">Instruksi Pembayaran (Opsional)</Label>
                <textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full p-2 border border-primary/20 rounded-md text-sm resize-none"
                  rows={3}
                  placeholder="Instruksi tambahan untuk pembeli..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-primary/20"
                />
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
        <p className="text-center text-muted-foreground py-12">Memuat daftar metode pembayaran...</p>
      ) : channels.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-primary/10 rounded-lg">
          <p className="text-muted-foreground">Belum ada metode pembayaran. Klik "Tambah Metode" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <Card key={channel.id} className={`border-primary/10 ${!channel.active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                    {!channel.active && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">Nonaktif</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(channel)} className="border-primary/20">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(channel.id)} className="border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {channel.account_number && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground">Nomor Rekening</p>
                    <p className="font-bold">{channel.account_number}</p>
                  </div>
                )}
                {channel.account_name && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground">Atas Nama</p>
                    <p className="font-semibold">{channel.account_name}</p>
                  </div>
                )}
                {channel.instructions && (
                  <CardDescription className="text-xs whitespace-pre-line">
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
