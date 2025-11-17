'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LeafIcon } from '@/components/leaf-icon'
import { 
  Building2, 
  Search,
  UserPlus,
  UserMinus,
  Shield,
  ShieldOff,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface Member {
  _id: string
  name: string
  email: string
  image?: string
  totalCarbonSaved: number
  totalCommitments: number
  level: number
  isAdmin: boolean
}

export default function OrganizationMembersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string

  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [joinRequests, setJoinRequests] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 })
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('carbonSaved')
  const [organization, setOrganization] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Dialog states
  const [removeDialog, setRemoveDialog] = useState<{ open: boolean; member: Member | null }>({
    open: false,
    member: null,
  })
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      loadOrganization()
      loadMembers()
      if (isAdmin) {
        loadJoinRequests()
      }
    }
  }, [status, orgId, pagination.page, sortBy, isAdmin])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (status === 'authenticated') {
        loadMembers()
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const loadOrganization = async () => {
    try {
      const response = await apiClient.getOrganization(orgId)
      setOrganization(response.data.organization)
      
      // Check if current user is admin
      const currentUserId = (session?.user as any)?.id
      const isOrgAdmin = response.data.organization.adminUserIds.some(
        (admin: any) => admin._id === currentUserId || admin === currentUserId
      )
      setIsAdmin(isOrgAdmin)
    } catch (error: any) {
      console.error('Load organization error:', error)
      toast.error('Failed to load organization')
    }
  }

  const loadMembers = async () => {
    try {
      const response = await apiClient.getOrgMembers(orgId, {
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
        sortBy,
      })
      setMembers(response.data.members)
      setPagination(response.data.pagination)
    } catch (error: any) {
      console.error('Load members error:', error)
      toast.error('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const loadJoinRequests = async () => {
    try {
      const response = await apiClient.getOrgJoinRequests(orgId, 'pending')
      setJoinRequests(response.data?.joinRequests || [])
    } catch (error) {
      console.error('Failed to load join requests:', error)
    }
  }

  const handleReviewRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(true)
      await apiClient.reviewJoinRequest(orgId, requestId, action)
      toast.success(`Request ${action}d successfully`)
      loadJoinRequests()
      loadMembers()
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} request`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleAdmin = async (member: Member) => {
    setActionLoading(true)
    try {
      await apiClient.toggleOrgAdmin(orgId, member._id)
      toast.success(member.isAdmin ? 'Admin removed successfully' : 'Admin added successfully')
      loadMembers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update admin status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!removeDialog.member) return
    
    setActionLoading(true)
    try {
      await apiClient.removeOrgMember(orgId, removeDialog.member._id)
      toast.success('Member removed successfully')
      setRemoveDialog({ open: false, member: null })
      loadMembers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove member')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#2a2520] to-[#3d3530]">
        <Loader2 className="w-8 h-8 animate-spin text-[#A8D5BA]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
      {/* Header */}
      <header className="border-b border-[#3A7D44]/30 bg-[#1a1612]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/org/${orgId}/dashboard`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-linear-to-r from-[#F4FCE7] to-[#A8D5BA] bg-clip-text text-transparent">
                {organization?.name}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href={`/org/${orgId}/dashboard`}>
                <Button variant="ghost" className="text-[#F4FCE7] hover:bg-[#3A7D44]/20">
                  Dashboard
                </Button>
              </Link>
              <Link href={`/org/${orgId}/reports`}>
                <Button variant="ghost" className="text-[#F4FCE7] hover:bg-[#3A7D44]/20">
                  Reports
                </Button>
              </Link>
              <Link href={`/org/${orgId}/settings`}>
                <Button variant="ghost" className="text-[#F4FCE7] hover:bg-[#3A7D44]/20">
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-[#F4FCE7] mb-2">Team Members</h1>
          <p className="text-[#A8D5BA]">Manage your organization's members and permissions</p>
        </div>

        {/* Filters */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2a2520]/40" />
              <Input
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-2 border-[#3A7D44]/20 focus:border-[#3A7D44]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'carbonSaved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('carbonSaved')}
                className={sortBy === 'carbonSaved' ? 'bg-[#3A7D44]' : 'border-[#3A7D44] text-[#3A7D44]'}
              >
                By Impact
              </Button>
              <Button
                variant={sortBy === 'level' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('level')}
                className={sortBy === 'level' ? 'bg-[#3A7D44]' : 'border-[#3A7D44] text-[#3A7D44]'}
              >
                By Level
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('name')}
                className={sortBy === 'name' ? 'bg-[#3A7D44]' : 'border-[#3A7D44] text-[#3A7D44]'}
              >
                By Name
              </Button>
            </div>
          </div>
        </Card>

        {/* Pending Join Requests */}
        {isAdmin && joinRequests.length > 0 && (
          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6">
            <h2 className="text-xl font-bold text-[#2a2520] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#3A7D44]" />
              Pending Join Requests ({joinRequests.length})
            </h2>
            <div className="space-y-3">
              {joinRequests.map((request: any) => (
                <div key={request._id} className="bg-white border-2 border-[#3A7D44]/20 rounded-lg p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="w-10 h-10 border-2 border-[#3A7D44]">
                        <AvatarImage src={request.userId?.profileImage} />
                        <AvatarFallback className="bg-[#3A7D44] text-white">
                          {request.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[#2a2520]">{request.userId?.name}</p>
                        <p className="text-sm text-[#2a2520]/60">{request.userId?.email}</p>
                      </div>
                    </div>
                    {request.message && (
                      <p className="text-sm text-[#2a2520]/80 bg-[#F4FCE7] p-3 rounded border border-[#3A7D44]/10">
                        "{request.message}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReviewRequest(request._id, 'approve')}
                      disabled={actionLoading}
                      className="bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReviewRequest(request._id, 'reject')}
                      disabled={actionLoading}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Members Table */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[#3A7D44]/20 bg-[#3A7D44]/5">
                <TableHead className="text-[#2a2520] font-bold">Member</TableHead>
                <TableHead className="text-[#2a2520] font-bold">Level</TableHead>
                <TableHead className="text-[#2a2520] font-bold">Impact</TableHead>
                <TableHead className="text-[#2a2520] font-bold">Commitments</TableHead>
                <TableHead className="text-[#2a2520] font-bold">Role</TableHead>
                {isAdmin && <TableHead className="text-[#2a2520] font-bold text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member._id} className="border-[#3A7D44]/10">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-[#3A7D44]/20">
                        <AvatarImage src={member.image} />
                        <AvatarFallback className="bg-[#A8D5BA] text-white font-bold">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[#2a2520]">{member.name}</p>
                        <p className="text-sm text-[#2a2520]/60">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#A8D5BA] text-[#2a2520]">Level {member.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-[#3A7D44]">{member.totalCarbonSaved.toFixed(1)} kg</p>
                      <p className="text-xs text-[#2a2520]/60">CO₂ saved</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-[#2a2520]">{member.totalCommitments}</p>
                  </TableCell>
                  <TableCell>
                    {member.isAdmin ? (
                      <Badge className="bg-[#3A7D44] text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-[#3A7D44]/30 text-[#2a2520]/70">
                        Member
                      </Badge>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleAdmin(member)}
                          disabled={actionLoading}
                          className="text-[#3A7D44] hover:bg-[#3A7D44]/10"
                        >
                          {member.isAdmin ? (
                            <>
                              <ShieldOff className="w-4 h-4 mr-1" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-1" />
                              Make Admin
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRemoveDialog({ open: true, member })}
                          disabled={actionLoading}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <UserMinus className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-[#3A7D44]/20">
              <p className="text-sm text-[#2a2520]/60">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} members
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="border-[#3A7D44] text-[#3A7D44]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="border-[#3A7D44] text-[#3A7D44]"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>

      {/* Remove Member Dialog */}
      <Dialog open={removeDialog.open} onOpenChange={(open) => setRemoveDialog({ ...removeDialog, open })}>
        <DialogContent className="bg-[#F4FCE7]">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{removeDialog.member?.name}</strong> from the organization?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveDialog({ open: false, member: null })}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveMember}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
