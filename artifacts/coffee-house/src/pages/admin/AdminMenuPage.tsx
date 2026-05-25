import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
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
import { Trash2, Edit2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { formatRupiah } from '@/lib/utils'

interface MenuItem {
  id: string
  name: string
  description?: string
  category: string
  price: number
  available: boolean
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Kopi',
    price: '',
    available: true,
  })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    const { data, error } = await supabase.from('menu_items').select('*').order('category')
    if (error) {
      toast.error('Gagal mengambil daftar menu: ' + error.message)
    } else if (data) {
      setItems(data)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedPrice = parseFloat(formData.price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Harga harus berupa angka positif')
      return
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update({ name: formData.name, description: formData.description, category: formData.category, price: parsedPrice, available: formData.available })
          .eq('id', editingItem.id)

        if (error) { toast.error('Gagal memperbarui menu: ' + error.message); return }
        setItems(items.map((item) => item.id === editingItem.id ? { ...item, ...formData, price: parsedPrice } : item))
        toast.success('Menu berhasil diperbarui')
      } else {
        const { data, error } = await supabase
          .from('menu_items')
          .insert([{ name: formData.name, description: formData.description, category: formData.category, price: parsedPrice, available: formData.available }])
          .select()

        if (error) { toast.error('Gagal menambahkan menu: ' + error.message); return }
        if (data) setItems([...items, data[0]])
        toast.success('Menu baru berhasil ditambahkan')
      }
      handleDialogClose()
    } catch {
      toast.error('Terjadi kesalahan saat memproses data')
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({ name: item.name, description: item.description || '', category: item.category, price: item.price.toString(), available: item.available })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) return
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) {
      toast.error('Gagal menghapus menu: ' + error.message)
    } else {
      setItems(items.filter((item) => item.id !== id))
      toast.success('Menu berhasil dihapus')
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ name: '', description: '', category: 'Kopi', price: '', available: true })
  }

  const categories = Array.from(new Set(items.map((i) => i.category)))

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daftar Menu</h1>
          <p className="text-muted-foreground">Tambah, ubah, atau hapus menu makanan &amp; minuman</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose() }}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingItem(null)
                setFormData({ name: '', description: '', category: 'Kopi', price: '', available: true })
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Ubah Menu' : 'Tambah Menu Baru'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Perbarui detail item menu' : 'Tambahkan menu baru ke daftar menu'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Menu</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="border-primary/20" />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="border-primary/20" />
                </div>
                <div>
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="border-primary/20" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="rounded border-primary/20"
                />
                <Label htmlFor="available">Tersedia / Stok Ada</Label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingItem ? 'Perbarui Menu' : 'Tambah Menu'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">Memuat menu...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-primary/10 rounded-lg">
          <p className="text-muted-foreground">Belum ada menu yang terdaftar. Klik "Tambah Menu" untuk membuat menu baru.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category} className="border-primary/10">
              <CardHeader>
                <CardTitle className="capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.filter((i) => i.category === category).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-primary/10 rounded">{formatRupiah(item.price)}</span>
                          {!item.available && (
                            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded">Habis</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="border-primary/20">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
