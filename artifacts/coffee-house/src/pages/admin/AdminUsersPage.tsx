import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Edit2, RefreshCw, Users, Search } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  email: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<string>('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, role, created_at')
        .order('created_at', { ascending: false })
      if (error) toast.error('Gagal memuat pengguna: ' + error.message)
      else if (data) { setUsers(data); setFilteredUsers(data) }
    } catch {
      toast.error('Gagal memuat pengguna')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    let filtered = users
    if (filterRole !== 'all') filtered = filtered.filter((u) => u.role === filterRole)
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredUsers(filtered)
  }, [filterRole, searchTerm, users])

  const handleRoleUpdate = async (id: string, newRole: string) => {
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', id)
    if (error) {
      toast.error('Gagal memperbarui peran: ' + error.message)
    } else {
      setUsers(users.map((u) => u.id === id ? { ...u, role: newRole } : u))
      toast.success('Peran berhasil diperbarui')
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengguna ini?')) return
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) {
      toast.error('Gagal menghapus: ' + error.message)
    } else {
      setUsers(users.filter((u) => u.id !== id))
      toast.success('Pengguna dihapus')
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mt-0.5">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>Pengguna</h1>
            <p className="text-sm text-muted-foreground">Kelola akun pengguna terdaftar</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={fetchUsers} className="border-primary/15 flex-shrink-0 rounded-xl gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-xs">Segarkan</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 flex-1 border-primary/20 text-sm rounded-xl h-9"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="sm:w-40 border-primary/20 bg-background text-sm rounded-xl h-9">
            <SelectValue placeholder="Semua Peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Peran</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="customer">Pelanggan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-primary/5 animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-primary/20 rounded-2xl">
          <Users className="h-10 w-10 mx-auto text-primary/30 mb-3" />
          <p className="text-muted-foreground text-sm">Tidak ada pengguna ditemukan</p>
        </div>
      ) : (
        <Card className="border-primary/10 rounded-2xl overflow-hidden">
          <CardContent className="pt-4 px-4 pb-4">
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-primary/10 rounded-xl hover:bg-primary/4 transition-colors gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {editingId === user.id ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Select value={editingRole} onValueChange={setEditingRole}>
                              <SelectTrigger className="h-7 w-28 text-xs border-primary/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="customer">Pelanggan</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 px-2" onClick={() => handleRoleUpdate(user.id, editingRole)}>
                              Simpan
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => setEditingId(null)}>
                              Batal
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span className={`text-xs px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-primary/10 text-primary font-semibold' : 'bg-muted text-muted-foreground'}`}>
                              {user.role === 'admin' ? 'Admin' : 'Pelanggan'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString('id-ID')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditingId(user.id); setEditingRole(user.role) }}
                        className="border-primary/20 h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
