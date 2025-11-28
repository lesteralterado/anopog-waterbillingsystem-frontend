'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Label } from '@/app/components/ui/Label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/Dialog'
import Select from '@/app/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/Table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/Card'
import { Badge } from '@/app/components/ui/Badge'
import { UserPlus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';
import api, { usersAPI } from '@/lib/api'
import Pagination from '@/app/components/shared/Pagination'

// Toast message constants for better maintainability
const TOAST_MESSAGES = {
  USER_ADDED: 'User added successfully!',
  USER_DELETED: 'User deleted successfully!',
  USER_ADD_ERROR: 'Failed to add user. Please try again.',
  USER_DELETE_ERROR: 'Failed to delete user. Please try again.',
} as const;

type UserRole = 'Admin' | 'Meter-Reader' | 'Client'

interface User {
  id: string
  fullName: string
  username: string
  role: UserRole
  email?: string
  phoneNumber?: string
  address?: string
  meterNumber?: string
  createdAt: string
  status: 'Active' | 'Inactive'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    role: '' as UserRole | '',
    email: '',
    phoneNumber: '',
    address: '',
    meterNumber: '',
  })

  // Transform API user data to match User interface
  const transformUser = (apiUser: any): User => {
    const roleMap: Record<string, UserRole> = {
      '1': 'Admin',
      '2': 'Meter-Reader',
      '3': 'Client'
    };

    return {
      id: String(apiUser.id),
      fullName: apiUser.full_name || apiUser.username,
      username: apiUser.username,
      role: roleMap[String(apiUser.role_id)] || 'Client',
      email: apiUser.email || undefined,
      phoneNumber: apiUser.phone || undefined,
      address: apiUser.purok ? `Purok ${apiUser.purok}` : apiUser.address || undefined,
      meterNumber: apiUser.meter_number || undefined,
      createdAt: new Date().toISOString().split('T')[0], // Not in API, use current date
      status: 'Active'
    };
  };

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await usersAPI.getAll();
        const transformedUsers = res.data.map(transformUser);
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Input validation
    if (!formData.fullName.trim()) {
      toast.error('Full name is required')
      return
    }
    if (!formData.username.trim()) {
      toast.error('Username is required')
      return
    }
    if (!formData.role) {
      toast.error('Role is required')
      return
    }
    if (!editingUser && !formData.password.trim()) {
      toast.error('Password is required for new users')
      return
    }

    try {
      if (editingUser) {
        setUsers(users.map(user =>
          user.id === editingUser.id
            ? {
                ...user,
                fullName: formData.fullName.trim(),
                username: formData.username.trim(),
                role: formData.role as UserRole,
                email: formData.email.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                address: formData.address.trim(),
                meterNumber: formData.meterNumber.trim(),
              }
            : user
        ))
        toast.success('User updated successfully!')
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          fullName: formData.fullName.trim(),
          username: formData.username.trim(),
          role: formData.role as UserRole,
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address.trim(),
          meterNumber: formData.meterNumber.trim(),
          createdAt: new Date().toISOString().split('T')[0],
          status: 'Active',
        }
        setUsers([...users, newUser]);
        toast.success(TOAST_MESSAGES.USER_ADDED)
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error adding/updating user:', error)
      toast.error(TOAST_MESSAGES.USER_ADD_ERROR)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      username: '',
      password: '',
      role: '',
      email: '',
      phoneNumber: '',
      address: '',
      meterNumber: '',
    })
    setEditingUser(null)
    setShowPassword(false)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      username: user.username,
      password: '',
      role: user.role,
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      meterNumber: user.meterNumber || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const userToDelete = users.find(user => user.id === id)
    if (!userToDelete) {
      toast.error('User not found')
      return
    }

    if (confirm(`Are you sure you want to delete ${userToDelete.fullName}?`)) {
      try {
        setUsers(users.filter(user => user.id !== id))
        toast.success(TOAST_MESSAGES.USER_DELETED)
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error(TOAST_MESSAGES.USER_DELETE_ERROR)
      }
    }
  }

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Calculate paginated users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Memoize filtered users for performance optimization
  const memoizedFilteredUsers = useMemo(() => filteredUsers, [users, searchQuery])

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      case 'Meter-Reader':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'Client':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      default:
        return ''
    }
  }

  const roleStats = useMemo(() => ({
    Admin: users.filter(u => u.role === 'Admin').length,
    'Meter-Reader': users.filter(u => u.role === 'Meter-Reader').length,
    Client: users.filter(u => u.role === 'Client').length,
  }), [users])

  return (
    <div className="container mx-auto py-8 px-4 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage users for the Water Billing System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.Admin}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Meter Readers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats['Meter-Reader']}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Clients/Consumers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.Client}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>A list of all users in the system</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open)
                if (!open) resetForm()
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto" size="sm" variant="default">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-lg">
                  <DialogHeader>
                    <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
                    <DialogDescription>
                      {editingUser ? 'Update user information' : 'Add a new user to the system'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 p-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Juan Dela Cruz"
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select
                          value={formData.role}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value as UserRole })}
                          options={[
                            { value: '', label: 'Select role' },
                            { value: 'Admin', label: 'Admin' },
                            { value: 'Meter-Reader', label: 'Meter Reader' },
                            { value: 'Client', label: 'Client/Consumer' },
                          ]}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="username">Username *</Label>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="username"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password {!editingUser && '*'}</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                              required={!editingUser}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          placeholder="+63 912 345 6789"
                        />
                      </div>

                      {formData.role === 'Client' && (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="purok">Purok *</Label>
                            <Select
                              value={formData.address}
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, address: e.target.value })}
                              options={[
                                { value: '', label: 'Select Purok' },
                                { value: 'Purok 1', label: 'Purok 1' },
                                { value: 'Purok 2', label: 'Purok 2' },
                                { value: 'Purok 3', label: 'Purok 3' },
                                { value: 'Purok 4', label: 'Purok 4' },
                                { value: 'Purok 5', label: 'Purok 5' },
                                { value: 'Purok 6', label: 'Purok 6' },
                                { value: 'Purok 7', label: 'Purok 7' },
                                { value: 'Purok 8', label: 'Purok 8' },
                              ]}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="meterNumber">Meter Number</Label>
                            <Input
                              id="meterNumber"
                              value={formData.meterNumber}
                              onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value })}
                              placeholder="WM-2024-001"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        setIsDialogOpen(false)
                        resetForm()
                      }}>
                        Cancel
                      </Button>
                        <Button
                        type="button"
                        onClick={async () => {
                          // Basic client-side validation (same as handleSubmit)
                          if (!formData.fullName.trim()) {
                          toast.error('Full name is required')
                          return
                          }
                          if (!formData.username.trim()) {
                          toast.error('Username is required')
                          return
                          }
                          if (!formData.role) {
                          toast.error('Role is required')
                          return
                          }
                          if (!editingUser && !formData.password.trim()) {
                          toast.error('Password is required for new users')
                          return
                          }

                          try {
                          // Map role string to role_id expected by backend/prisma
                          const roleMap: Record<UserRole, number> = {
                            Admin: 1,
                            'Meter-Reader': 2,
                            Client: 3,
                          }
                          // Extract purok number from address if Client
                          let purok: number | null = null;
                          if (formData.role === 'Client' && formData.address.trim()) {
                            const match = formData.address.trim().match(/Purok (\d+)/);
                            purok = match ? parseInt(match[1]) : null;
                          }
                          const payload: any = {
                            username: formData.username.trim(),
                            password: formData.password.trim() || undefined,
                            role_id: roleMap[formData.role as UserRole],
                            purok: purok,
                          }

                          // If editingUser, call update endpoint; otherwise create
                          // Use the shared axios instance so requests go to NEXT_PUBLIC_API_URL (eg. http://localhost:5000)
                          let result: any = null
                          if (editingUser) {
                            const res = await api.put(`/api/users/${editingUser.id}`, payload)
                            result = res.data
                          } else {
                            const res = await api.post('/api/users', payload)
                            result = res.data
                          }

                          if (editingUser) {
                            // Update local state from result (merge fields we keep locally)
                            setUsers(users.map(u =>
                            u.id === editingUser.id
                              ? {
                                ...u,
                                fullName: formData.fullName.trim(),
                                username: result.username ?? formData.username.trim(),
                                role: formData.role as UserRole,
                                email: formData.email.trim(),
                                phoneNumber: formData.phoneNumber.trim(),
                                address: formData.address.trim(),
                                meterNumber: formData.meterNumber.trim(),
                              }
                              : u
                            ))
                            toast.success('User updated successfully!')
                          } else {
                            // Backend returns created user { id, username, role_id, purok }
                            const newUser: User = {
                            id: String(result.id),
                            fullName: formData.fullName.trim() || result.username,
                            username: result.username,
                            role: formData.role as UserRole,
                            email: formData.email.trim(),
                            phoneNumber: formData.phoneNumber.trim(),
                            address: result.purok ?? formData.address.trim(),
                            meterNumber: formData.meterNumber.trim(),
                            createdAt: new Date().toISOString().split('T')[0],
                            status: 'Active',
                            }
                            setUsers([...users, newUser])
                            toast.success(TOAST_MESSAGES.USER_ADDED)
                          }

                          resetForm()
                          setIsDialogOpen(false)
                          } catch (error) {
                          console.error('Error saving user:', error)
                          toast.error(TOAST_MESSAGES.USER_ADD_ERROR)
                          }
                        }}
                        >
                        {editingUser ? 'Update User' : 'Create User'}
                        </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {/* Toasts show at page level so they are visible regardless of dialog state */}
              <ToastContainer />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.email && <div>{user.email}</div>}
                          {user.phoneNumber && <div className="text-gray-500">{user.phoneNumber}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}