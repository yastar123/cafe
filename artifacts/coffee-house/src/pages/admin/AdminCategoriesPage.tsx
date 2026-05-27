import { useEffect, useState } from 'react'
import { api, type CategoryRecord } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Edit2, Plus, Tag } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await api.categories.getAll()
      setCategories(data)
    } catch {
      toast.error('Gagal memuat kategori')
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Nama kategori tidak boleh kosong')
      return
    }

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      }

      if (editingCategory) {
        const updated = await api.categories.update(editingCategory.id, payload)
        setCategories(categories.map((c) => (c.id === editingCategory.id ? updated : c)))
        toast.success('Kategori berhasil diperbarui')
      } else {
        const created = await api.categories.create(payload)
        setCategories([...categories, created])
        toast.success('Kategori berhasil ditambahkan')
      }
      handleDialogClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  const handleEdit = (category: CategoryRecord) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini? Item menu dengan kategori ini tidak akan otomatis terhapus, tetapi kategori tidak akan muncul lagi di daftar.')) return
    try {
      await api.categories.delete(id)
      setCategories(categories.filter((c) => c.id !== id))
      toast.success('Kategori berhasil dihapus')
    } catch {
      toast.error('Gagal menghapus kategori')
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
  }

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
    setIsDialogOpen(true)
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Kategori Menu</h1>
            <p className="text-sm text-muted-foreground">Kelola kategori untuk memfilter menu makanan dan minuman</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose() }}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 flex-shrink-0"
              size="sm"
              onClick={handleOpenAdd}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Ubah Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Perbarui detail nama dan deskripsi kategori' : 'Tambahkan kategori baru ke dalam menu'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Kopi, Makanan Berat, Dessert"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Deskripsi <span className="text-muted-foreground font-normal">(Opsional)</span></Label>
                <Input
                  id="description"
                  placeholder="Keterangan singkat tentang kategori ini"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-primary/20"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {editingCategory ? 'Perbarui Kategori' : 'Tambah Kategori'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-primary/5 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-primary/15 rounded-2xl">
          <Tag className="h-10 w-10 mx-auto text-primary/30 mb-3" />
          <p className="text-muted-foreground text-sm">Belum ada kategori. Klik "Tambah Kategori" untuk membuat kategori baru.</p>
        </div>
      ) : (
        <Card className="border-primary/10 rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="pb-2 pt-4 px-4 bg-gradient-to-r from-primary/6 to-accent/4 border-b border-primary/8">
            <CardTitle className="text-sm font-bold text-primary uppercase tracking-wide">Daftar Kategori Terdaftar</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-3">
            <div className="divide-y divide-primary/5 space-y-1">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between py-3.5 hover:bg-primary/3 transition-colors rounded-xl px-2.5 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{category.name}</p>
                    {category.description ? (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{category.description}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground/50 mt-0.5 italic">Tidak ada deskripsi</p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(category)}
                      className="border-primary/20 h-8 px-2.5 text-xs flex items-center gap-1 hover:bg-primary/5"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Ubah
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(category.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 h-8 px-2.5 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
