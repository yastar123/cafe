import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Edit2, Plus, Coffee, ToggleLeft, ToggleRight } from 'lucide-react'
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
    name: '', description: '', category: 'Kopi', price: '', available: true,
  })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('*').order('category')
      if (error) toast.error('Gagal mengambil daftar menu: ' + error.message)
      else if (data) setItems(data)
    } catch { toast.error('Gagal memuat menu') }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedPrice = parseFloat(formData.price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) { toast.error('Harga harus angka positif'); return }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update({ name: formData.name, description: formData.description, category: formData.category, price: parsedPrice, available: formData.available })
          .eq('id', editingItem.id)
        if (error) { toast.error('Gagal memperbarui: ' + error.message); return }
        setItems(items.map((item) => item.id === editingItem.id ? { ...item, ...formData, price: parsedPrice } : item))
        toast.success('Menu berhasil diperbarui')
      } else {
        const { data, error } = await supabase
          .from('menu_items')
          .insert([{ name: formData.name, description: formData.description, category: formData.category, price: parsedPrice, available: formData.available }])
          .select()
        if (error) { toast.error('Gagal menambahkan: ' + error.message); return }
        if (data) setItems([...items, data[0]])
        toast.success('Menu berhasil ditambahkan')
      }
      handleDialogClose()
    } catch { toast.error('Terjadi kesalahan') }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({ name: item.name, description: item.description || '', category: item.category, price: item.price.toString(), available: item.available })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus menu ini?')) return
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) toast.error('Gagal menghapus: ' + error.message)
    else { setItems(items.filter((item) => item.id !== id)); toast.success('Menu dihapus') }
  }

  const handleToggleAvailable = async (item: MenuItem) => {
    const { error } = await supabase.from('menu_items').update({ available: !item.available }).eq('id', item.id)
    if (error) toast.error('Gagal mengubah ketersediaan')
    else {
      setItems(items.map((i) => i.id === item.id ? { ...i, available: !i.available } : i))
      toast.success(item.available ? 'Menu dinonaktifkan' : 'Menu diaktifkan')
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({ name: '', description: '', category: 'Kopi', price: '', available: true })
  }

  const categories = Array.from(new Set(items.map((i) => i.category)))

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
            <Coffee className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Daftar Menu</h1>
            <p className="text-sm text-muted-foreground">Tambah, ubah, atau hapus menu</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose() }}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 flex-shrink-0"
              size="sm"
              onClick={() => { setEditingItem(null); setFormData({ name: '', description: '', category: 'Kopi', price: '', available: true }); setIsDialogOpen(true) }}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Ubah Menu' : 'Tambah Menu Baru'}</DialogTitle>
              <DialogDescription>{editingItem ? 'Perbarui detail item menu' : 'Tambahkan menu baru'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Menu</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="border-primary/20" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Deskripsi</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="category">Kategori</Label>
                  <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="border-primary/20" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input id="price" type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="border-primary/20" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="available" checked={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} className="rounded border-primary/20" />
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
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-primary/5 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-primary/15 rounded-2xl">
          <Coffee className="h-10 w-10 mx-auto text-primary/30 mb-3" />
          <p className="text-muted-foreground text-sm">Belum ada menu. Klik "Tambah Menu" untuk membuat menu baru.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {categories.map((category) => (
            <Card key={category} className="border-primary/10 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 pt-4 px-4 bg-gradient-to-r from-primary/6 to-accent/4 border-b border-primary/8">
                <CardTitle className="capitalize text-sm font-bold text-primary uppercase tracking-wide">{category}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-3">
                <div className="space-y-2">
                  {items.filter((i) => i.category === category).map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 border border-primary/10 rounded-xl hover:bg-primary/4 transition-colors ${!item.available ? 'opacity-60' : ''}`}
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                        {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          <span className="text-xs px-2 py-0.5 bg-primary/10 rounded font-medium">{formatRupiah(item.price)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${item.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                            {item.available ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => handleToggleAvailable(item)} className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                          {item.available ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="border-primary/20 h-8 w-8 p-0">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0">
                          <Trash2 className="h-3.5 w-3.5" />
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
