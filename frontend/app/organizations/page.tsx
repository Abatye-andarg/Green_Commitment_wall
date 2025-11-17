'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MobileNav } from '@/components/mobile-nav'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { Building2, Search, Users, Leaf, Loader2, Send, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function OrganizationsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [organizations, setOrganizations] = useState<any[]>([])
  const [myRequests, setMyRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedOrg, setSelectedOrg] = useState<any>(null)
  const [joinMessage, setJoinMessage] = useState('')
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      loadData()
    }
  }, [status, router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [orgsData, requestsData] = await Promise.all([
        apiClient.listOrganizations({ limit: 100 }),
        apiClient.getMyJoinRequests()
      ])
      
      setOrganizations(orgsData.data?.organizations || [])
      setMyRequests(requestsData.data?.joinRequests || [])
    } catch (error) {
      console.error('Failed to load organizations:', error)
      toast.error('Failed to load organizations')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRequest = async () => {
    if (!selectedOrg) return

    try {
      setSubmitting(true)
      await apiClient.createJoinRequest(selectedOrg._id, joinMessage)
      toast.success('Join request sent successfully!')
      setShowJoinDialog(false)
      setJoinMessage('')
      setSelectedOrg(null)
      loadData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to send join request')
    } finally {
      setSubmitting(false)
    }
  }

  const getRequestStatus = (orgId: string) => {
    return myRequests.find(req => req.organizationId?._id === orgId)
  }

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         org.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || org.type === typeFilter
    return matchesSearch && matchesType
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white">Loading organizations...</p>
        </div>
      </div>
    )
  }

  const userHasOrg = (session?.user as any)?.organizationId

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520] relative">
      {/* Background textures */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%23000000' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%233A7D44' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3A7D44]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#A8D5BA]/30 rounded-full blur-3xl" />
      </div>

      <DesktopSidebar />

      <div className="md:ml-20 lg:ml-72 relative z-10 transition-all duration-300">
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-[#F4FCE7] mb-2">Discover Organizations</h1>
            <p className="text-[#A8D5BA]/70">Join an organization to collaborate on environmental commitments</p>
          </div>

          {/* User Already in Org Notice */}
          {userHasOrg && (
            <Card className="mb-6 bg-[#3A7D44]/10 border-[#3A7D44]/30">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#3A7D44] mt-0.5" />
                <div>
                  <p className="text-[#F4FCE7] font-semibold">You're already part of an organization</p>
                  <p className="text-[#A8D5BA]/70 text-sm">You can only belong to one organization at a time</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8D5BA]/70" />
              <Input
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#2a2520]/50 border-[#3A7D44]/30 text-[#F4FCE7]"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-[#2a2520]/50 border-[#3A7D44]/30 text-[#F4FCE7]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="ngo">NGO</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredOrgs.map((org) => {
              const request = getRequestStatus(org._id)
              const canJoin = !userHasOrg && !request

              return (
                <Card key={org._id} className="bg-[#F4FCE7]/95 border-2 border-[#3A7D44]/30 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-[#3A7D44]/20 text-[#3A7D44] capitalize">
                        {org.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-[#2a2520]">{org.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {org.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-[#2a2520]/70">
                        <Users className="w-4 h-4" />
                        <span>{org.memberCount || 0} members</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#3A7D44]">
                        <Leaf className="w-4 h-4" />
                        <span>{org.totalOrgCarbonSaved?.toFixed(1) || 0} kg CO₂</span>
                      </div>
                    </div>

                    {request && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-[#3A7D44]/10">
                        {request.status === 'pending' && (
                          <>
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-medium text-amber-700">Request Pending</span>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#3A7D44]" />
                            <span className="text-xs font-medium text-[#3A7D44]">Request Approved</span>
                          </>
                        )}
                        {request.status === 'rejected' && (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-medium text-red-700">Request Rejected</span>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#3A7D44] text-[#3A7D44] hover:bg-[#3A7D44]/10"
                      onClick={() => router.push(`/org/${org._id}/dashboard`)}
                    >
                      View
                    </Button>
                    {canJoin && (
                      <Button
                        className="flex-1 bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white"
                        onClick={() => {
                          setSelectedOrg(org)
                          setShowJoinDialog(true)
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {filteredOrgs.length === 0 && (
            <Card className="p-12 text-center bg-[#1a1612]/80 backdrop-blur-xl border-[#3A7D44]/30">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-[#A8D5BA]/50" />
              <p className="text-lg text-[#F4FCE7] mb-2">No organizations found</p>
              <p className="text-[#A8D5BA]/70 text-sm">Try adjusting your search or filters</p>
            </Card>
          )}
        </main>
      </div>

      {/* Join Request Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request to Join {selectedOrg?.name}</DialogTitle>
            <DialogDescription>
              Send a message to the organization admins with your join request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell the admins why you'd like to join..."
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">{joinMessage.length}/500 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleJoinRequest} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  )
}
