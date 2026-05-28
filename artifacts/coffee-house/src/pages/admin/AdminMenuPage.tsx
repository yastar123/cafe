import { useEffect, useRef, useState } from 'react'
import { api, type CategoryRecord } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Edit2, Plus, Coffee, ToggleLeft, ToggleRight, Upload, X, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { formatRupiah } from '@/lib/utils'

const MENU_CATEGORIES = [
  { value: 'Kopi', label: 'Kopi' },
  { value: 'Non-Kopi', label: 'Non-Kopi' },
  { value: 'Makanan', label: 'Makanan' },
  { value: 'Minuman', label: 'Minuman' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Snack', label: 'Snack' },
]

interface MenuItem {
  id: string
  name: string
  description?: string
  category: string
  price: number | string
  available: boolean
  imageUrl?: string
  image_url?: string
}

function getPrice(item: MenuItem): number {
  return Number(item.price)
}

function getImageUrl(item: MenuItem): string {
  return item.imageUrl ?? item.image_url ?? ''
}

async function uploadMenuImage(file: File, token: string): Promise<string> {
  const apiOrigin = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") || "https://cafe-api-server.vercel.app";
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${apiOrigin}/api/upload/menu-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Upload gagal' }))
    throw new Error(body.error ?? 'Upload gagal')
  }
  const data = await res.json()
  return data.url as string
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [dbCategories, setDbCategories] = useState<CategoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'Kopi', price: '', available: true, imageUrl: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const [menuData, catsData] = await Promise.all([
        api.menu.getAll(),
        api.categories.getAll(),
      ])
      setItems(menuData as MenuItem[])
      setDbCategories(catsData)

      if (catsData.length > 0) {
        setFormData((prev) => ({ ...prev, category: catsData[0].name }))
      }
    } catch { toast.error('Gagal memuat menu') }
    setIsLoading(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 5 MB')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    // Clear the URL field when a file is selected
    setFormData((prev) => ({ ...prev, imageUrl: '' }))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData((prev) => ({ ...prev, imageUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsedPrice = parseFloat(formData.price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) { toast.error('Harga harus angka positif'); return }

    try {
      let finalImageUrl = formData.imageUrl

      // Upload file if a new file was selected
      if (imageFile) {
        setIsUploading(true)
        const token = sessionStorage.getItem('authToken') ?? ''
        toast.info('Mengunggah gambar...')
        finalImageUrl = await uploadMenuImage(imageFile, token)
        setIsUploading(false)
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parsedPrice,
        available: formData.available,
        imageUrl: finalImageUrl || undefined,
      }

      if (editingItem) {
        const updated = await api.menu.update(editingItem.id, payload)
        setItems(items.map((item) => item.id === editingItem.id ? (updated as MenuItem) : item))
        toast.success('Menu berhasil diperbarui')
      } else {
        const created = await api.menu.create(payload)
        setItems([...items, created as MenuItem])
        toast.success('Menu berhasil ditambahkan')
      }
      handleDialogClose()
    } catch (err) {
      setIsUploading(false)
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    const imgUrl = getImageUrl(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      price: String(getPrice(item)),
      available: item.available,
      imageUrl: imgUrl,
    })
    setImageFile(null)
    setImagePreview(imgUrl)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus menu ini?')) return
    try {
      await api.menu.delete(id)
      setItems(items.filter((item) => item.id !== id))
      toast.success('Menu dihapus')
    } catch { toast.error('Gagal menghapus menu') }
  }

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      const updated = await api.menu.update(item.id, { available: !item.available })
      setItems(items.map((i) => i.id === item.id ? (updated as MenuItem) : i))
      toast.success(item.available ? 'Menu dinonaktifkan' : 'Menu diaktifkan')
    } catch { toast.error('Gagal mengubah ketersediaan') }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    const defaultCat = dbCategories[0]?.name ?? (MENU_CATEGORIES[0]?.value || 'Kopi')
    setFormData({ name: '', description: '', category: defaultCat, price: '', available: true, imageUrl: '' })
    setImageFile(null)
    setImagePreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleOpenAdd = () => {
    setEditingItem(null)
    const defaultCat = dbCategories[0]?.name ?? (MENU_CATEGORIES[0]?.value || 'Kopi')
    setFormData({ name: '', description: '', category: defaultCat, price: '', available: true, imageUrl: '' })
    setImageFile(null)
    setImagePreview('')
    setIsDialogOpen(true)
  }

  const categories = Array.from(new Set(items.map((i) => i.category)))
  const dropdownCategories = dbCategories.length > 0
    ? dbCategories.map(c => ({ value: c.name, label: c.name }))
    : MENU_CATEGORIES;

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
              onClick={handleOpenAdd}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Ubah Menu' : 'Tambah Menu Baru'}</DialogTitle>
              <DialogDescription>{editingItem ? 'Perbarui detail item menu' : 'Tambahkan menu baru'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Gambar Menu <span className="text-muted-foreground font-normal">(Opsional)</span></Label>
                
                {/* Preview area */}
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-primary/5">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2.5 text-xs bg-white/90 hover:bg-white text-foreground shadow-sm flex items-center gap-1 font-medium"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-3 w-3" />
                        Pilih File Baru
                      </Button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3.5 border-2 border-dashed border-primary/20 rounded-xl p-6 bg-primary/2">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-2.5">
                        <ImageIcon className="h-6 w-6 text-primary/40" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Unggah Gambar Menu</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Format JPG, PNG, WebP (Maks. 5 MB)</p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/5 text-sm font-medium w-full flex items-center justify-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 text-primary" />
                      Pilih File dari Laptop / Komputer
                    </Button>

                    <div className="flex items-center gap-2 w-full px-4">
                      <div className="h-px flex-1 bg-primary/10" />
                      <span className="text-xs text-muted-foreground">atau gunakan URL</span>
                      <div className="h-px flex-1 bg-primary/10" />
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  id="menu-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* URL fallback input */}
                {!imageFile && (
                  <div className="space-y-1">
                    {imagePreview && <Label className="text-xs text-muted-foreground">URL Gambar Saat Ini</Label>}
                    <Input
                      type="url"
                      placeholder="Masukkan URL gambar (misal: https://example.com/gambar.jpg)"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value })
                        setImagePreview(e.target.value)
                      }}
                      className="border-primary/20 text-sm"
                    />
                  </div>
                )}

                {imageFile && (
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
                    <div className="flex items-center gap-2 truncate">
                      <Upload className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span className="truncate font-medium">{imageFile.name}</span>
                    </div>
                    <span className="flex-shrink-0 text-primary font-semibold">({(imageFile.size / 1024).toFixed(0)} KB)</span>
                  </div>
                )}
              </div>

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
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger id="category" className="border-primary/20"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {dropdownCategories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isUploading}>
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengunggah gambar...
                  </span>
                ) : editingItem ? 'Perbarui Menu' : 'Tambah Menu'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-lg bg-primary/5 animate-pulse" />)}
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
                  {items.filter((i) => i.category === category).map((item) => {
                    const imgUrl = getImageUrl(item)
                    return (
                      <div key={item.id} className={`flex items-center justify-between p-3 border border-primary/10 rounded-xl hover:bg-primary/4 transition-colors gap-3 ${!item.available ? 'opacity-60' : ''}`}>
                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-primary/8 border border-primary/10">
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Coffee className="h-5 w-5 text-primary/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{item.name}</p>
                          {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-primary/10 rounded font-medium">{formatRupiah(getPrice(item))}</span>
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
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
