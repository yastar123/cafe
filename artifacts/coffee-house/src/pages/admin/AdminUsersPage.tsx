import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Edit2, RefreshCw } from 'lucide-react'
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
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal memuat pengguna: ' + error.message)
    } else if (data) {
      setUsers(data)
      setFilteredUsers(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    let filtered = users
    if (filterRole !== 'all') {
      filtered = filtered.filter((u) => u.role === filterRole)
    }
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
      toast.error('Gagal memperbarui peran pengguna: ' + error.message)
    } else {
      setUsers(users.map((u) => u.id === id ? { ...u, role: newRole } : u))
      toast.success('Peran pengguna berhasil diperbarui')
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) {
      toast.error('Gagal menghapus pengguna: ' + error.message)
    } else {
      setUsers(users.filter((u) => u.id !== id))
      toast.success('Pengguna berhasil dihapus')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengguna</h1>
          <p className="text-muted-foreground">Kelola akun pengguna terdaftar</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchUsers} className="border-primary/15">
          <RefreshCw className="h-4 w-4 mr-2" />
          Segarkan
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Cari nama atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-primary/20"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40 border-primary/20 bg-background">
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
        <p className="text-center text-muted-foreground py-12">Memuat pengguna...</p>
      ) : (
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Tidak ada pengguna yang ditemukan</p>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.username}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {editingId === user.id ? (
                          <div className="flex items-center gap-2">
                            <Select value={editingRole} onValueChange={setEditingRole}>
                              <SelectTrigger className="h-7 w-32 text-xs border-primary/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="customer">Pelanggan</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90" onClick={() => handleRoleUpdate(user.id, editingRole)}>
                              Simpan
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingId(null)}>
                              Batal
                            </Button>
                          </div>
                        ) : (
                          <span className={`text-xs px-2 py-0.5 rounded ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                            {user.role === 'admin' ? 'Admin' : 'Pelanggan'}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setEditingId(user.id); setEditingRole(user.role) }}
                        className="border-primary/20"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
