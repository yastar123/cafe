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

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('payment_channels')
      .select('*')
      .order('created_at')

    if (error) {
      toast.error('Gagal mengambil daftar metode pembayaran: ' + error.message)
    } else if (data) {
      setChannels(data)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    try {
      if (editingChannel) {
        const { error } = await supabase
          .from('payment_channels')
          .update({
            name: formData.name,
            account_number: formData.account_number,
            account_name: formData.account_name,
            instructions: formData.instructions,
            active: formData.active,
          })
          .eq('id', editingChannel.id)

        if (error) {
          toast.error('Gagal memperbarui metode pembayaran: ' + error.message)
          return
        }

        setChannels(
          channels.map((channel) =>
            channel.id === editingChannel.id
              ? {
                  ...channel,
                  name: formData.name,
                  account_number: formData.account_number,
                  account_name: formData.account_name,
                  instructions: formData.instructions,
                  active: formData.active,
                }
              : channel
          )
        )
        toast.success('Metode pembayaran berhasil diperbarui')
      } else {
        const { data, error } = await supabase
          .from('payment_channels')
          .insert([
            {
              name: formData.name,
              account_number: formData.account_number,
              account_name: formData.account_name,
              instructions: formData.instructions,
              active: formData.active,
            },
          ])
          .select()

        if (error) {
          toast.error('Gagal menambahkan metode pembayaran: ' + error.message)
          return
        }

        if (data) {
          setChannels([...channels, data[0]])
        }
        toast.success('Metode pembayaran baru berhasil ditambahkan')
      }

      handleDialogClose()
    } catch (err) {
      toast.error('Terjadi kesalahan saat memproses data')
      console.error('Error submitting form:', err)
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
    if (!confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from('payment_channels').delete().eq('id', id)

    if (error) {
      toast.error('Gagal menghapus metode pembayaran: ' + error.message)
    } else {
      setChannels(channels.filter((channel) => channel.id !== id))
      toast.success('Metode pembayaran berhasil dihapus')
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingChannel(null)
    setFormData({
      name: '',
      account_number: '',
      account_name: '',
      instructions: '',
      active: true,
    })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metode Pembayaran</h1>
          <p className="text-muted-foreground">
            Kelola akun transfer bank / e-wallet untuk pembayaran pelanggan
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose(); }}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingChannel(null)
                setFormData({
                  name: '',
                  account_number: '',
                  account_name: '',
                  instructions: '',
                  active: true,
                })
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Metode
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingChannel ? 'Ubah Metode Pembayaran' : 'Tambah Metode Pembayaran'}
              </DialogTitle>
              <DialogDescription>
                {editingChannel
                  ? 'Perbarui rincian akun transfer pembayaran'
                  : 'Tambahkan rekening bank atau e-wallet baru'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Pembayaran (contoh: Transfer Bank BCA, GoPay)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="BCA, Mandiri, OVO, dll."
                  className="border-primary/20"
                />
              </div>
              <div>
                <Label htmlFor="account_number">Nomor Rekening / Nomor Telepon</Label>
                <Input
                  id="account_number"
                  value={formData.account_number}
                  onChange={(e) =>
                    setFormData({ ...formData, account_number: e.target.value })
                  }
                  placeholder="contoh: 8410928371 atau 0812..."
                  className="border-primary/20"
                />
              </div>
              <div>
                <Label htmlFor="account_name">Atas Nama (A/N)</Label>
                <Input
                  id="account_name"
                  value={formData.account_name}
                  onChange={(e) =>
                    setFormData({ ...formData, account_name: e.target.value })
                  }
                  placeholder="contoh: Coffee House Cafe"
                  className="border-primary/20"
                />
              </div>
              <div>
                <Label htmlFor="instructions">Instruksi Transfer</Label>
                <textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  placeholder="Tuliskan petunjuk transfer untuk pelanggan..."
                  className="w-full p-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="rounded border-primary/20"
                />
                <Label htmlFor="active">Aktif (Tampilkan saat Checkout)</Label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingChannel ? 'Simpan Perubahan' : 'Tambahkan Metode'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">
          Memuat metode pembayaran...
        </p>
      ) : channels.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-primary/10 rounded-lg">
          <CreditCard className="h-12 w-12 mx-auto text-primary/30 mb-4" />
          <p className="text-muted-foreground">Belum ada metode pembayaran yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Card key={channel.id} className="border-primary/10 hover:shadow-md transition-all">
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <CreditCard className="h-5 w-5 flex-shrink-0" />
                    {channel.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Status: <span className={channel.active ? 'text-green-600 font-semibold' : 'text-red-500'}>
                      {channel.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(channel)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(channel.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {channel.account_number && (
                  <div>
                    <span className="text-muted-foreground text-xs block">Nomor Rekening / Telepon</span>
                    <span className="font-semibold">{channel.account_number}</span>
                  </div>
                )}
                {channel.account_name && (
                  <div>
                    <span className="text-muted-foreground text-xs block">Atas Nama (A/N)</span>
                    <span className="font-medium">{channel.account_name}</span>
                  </div>
                )}
                {channel.instructions && (
                  <div>
                    <span className="text-muted-foreground text-xs block">Instruksi</span>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 whitespace-pre-line bg-muted p-2 rounded">
                      {channel.instructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
