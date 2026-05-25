'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
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

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      toast.error('Gagal memperbarui peran pengguna: ' + error.message)
    } else {
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      toast.success('Peran pengguna berhasil diperbarui!')
      setEditingId(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun pengguna ini?')) {
      return
    }

    const supabase = createClient()
    const { error } = await supabase.from('users').delete().eq('id', userId)

    if (error) {
      toast.error('Gagal menghapus pengguna: ' + error.message)
    } else {
      setUsers(users.filter((u) => u.id !== userId))
      toast.success('Pengguna berhasil dihapus')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola akun pengguna dan peran (role) mereka
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchUsers} className="border-primary/15">
          <RefreshCw className="h-4 w-4 mr-2" />
          Segarkan
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Cari berdasarkan nama pengguna atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-primary/20"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-56 border-primary/20 bg-background">
            <SelectValue placeholder="Pilih Peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Pengguna</SelectItem>
            <SelectItem value="customer">Pelanggan (Customer)</SelectItem>
            <SelectItem value="admin">Administrator (Admin)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">
          Memuat daftar pengguna...
        </p>
      ) : (
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Tidak ada pengguna yang ditemukan
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary/10">
                      <th className="text-left p-3 font-semibold">Nama Pengguna</th>
                      <th className="text-left p-3 font-semibold">Email</th>
                      <th className="text-left p-3 font-semibold">Peran (Role)</th>
                      <th className="text-left p-3 font-semibold">Tanggal Bergabung</th>
                      <th className="text-left p-3 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                      >
                        <td className="p-3">
                          <span className="font-semibold text-foreground">{user.username}</span>
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          {editingId === user.id ? (
                            <Select
                              value={editingRole}
                              onValueChange={setEditingRole}
                            >
                              <SelectTrigger className="w-36 border-primary/20 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="customer">Pelanggan</SelectItem>
                                <SelectItem value="admin">Administrator</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${
                                user.role === 'admin'
                                  ? 'bg-purple-50 border-purple-200 text-purple-900'
                                  : 'bg-blue-50 border-blue-200 text-blue-900'
                              }`}
                            >
                              {user.role === 'admin' ? 'Administrator' : 'Pelanggan'}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="p-3">
                          {editingId === user.id ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="h-8 px-3 bg-primary text-white text-xs font-semibold"
                                onClick={() =>
                                  handleUpdateRole(user.id, editingRole)
                                }
                              >
                                Simpan
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 border-primary/20 text-xs"
                                onClick={() => setEditingId(null)}
                              >
                                Batal
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(user.id)
                                  setEditingRole(user.role)
                                }}
                                className="border-primary/20 h-8 px-2"
                              >
                                <Edit2 className="h-3 w-3 text-primary" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteUser(user.id)}
                                className="border-red-200 text-red-650 hover:bg-red-50 h-8 px-2"
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
