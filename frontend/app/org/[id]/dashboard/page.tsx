'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LeafIcon } from '@/components/leaf-icon'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Award, 
  Target,
  Loader2,
  ArrowRight,
  Calendar,
  Activity,
  Sparkles
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface OrgData {
  organization: any
  stats: {
    totalCarbonSaved: number
    totalCommitments: number
    activeCommitments: number
    completedCommitments: number
    memberCount: number
    activeMembers: number
    participationRate: number
    activeChallenges: number
  }
  categoryBreakdown: Array<{
    _id: string
    count: number
    carbonSaved: number
  }>
  carbonTrend: Array<{
    _id: string
    carbonSaved: number
  }>
  topContributors: Array<any>
}

export default function OrganizationDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string

  const [loading, setLoading] = useState(true)
  const [orgData, setOrgData] = useState<OrgData | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      loadDashboard()
    }
  }, [status, orgId])

  const loadDashboard = async () => {
    try {
      const response = await apiClient.getOrgDashboard(orgId)
      setOrgData(response.data)
    } catch (error: any) {
      console.error('Load dashboard error:', error)
      toast.error(error.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#2a2520] to-[#3d3530]">
        <Loader2 className="w-8 h-8 animate-spin text-[#A8D5BA]" />
      </div>
    )
  }

  if (!orgData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#2a2520] to-[#3d3530]">
        <div className="text-center">
          <p className="text-[#F4FCE7] text-lg">Organization not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const { organization, stats, categoryBreakdown, topContributors } = orgData

  return (
    <div className="min-h-screen bg-linear-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
      {/* Header */}
      <header className="border-b border-[#3A7D44]/30 bg-[#2a2520]/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-linear-to-r from-[#F4FCE7] to-[#A8D5BA] bg-clip-text text-transparent">
                EcoPromise
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href={`/org/${orgId}/members`}>
                <Button variant="ghost" className="text-[#F4FCE7] hover:bg-[#3A7D44]/20">
                  Members
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
        {/* Organization Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#F4FCE7] mb-1">
                  {organization.name}
                </h1>
                <p className="text-[#A8D5BA] capitalize">{organization.type}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Carbon Saved */}
          <Card className="relative overflow-hidden bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] border-0 p-6 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <LeafIcon className="w-8 h-8 text-white/80" />
                <TrendingUp className="w-5 h-5 text-white/60" />
              </div>
              <p className="text-white/90 text-sm font-medium mb-1">Total Carbon Saved</p>
              <p className="text-white text-3xl font-black">{stats.totalCarbonSaved.toFixed(1)}</p>
              <p className="text-white/70 text-xs mt-1">kg CO₂</p>
            </div>
          </Card>

          {/* Members */}
          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-[#3A7D44]" />
              <Badge className="bg-[#3A7D44] text-white">{stats.activeMembers} active</Badge>
            </div>
            <p className="text-[#2a2520]/70 text-sm font-medium mb-1">Team Members</p>
            <p className="text-[#2a2520] text-3xl font-black">{stats.memberCount}</p>
            <p className="text-[#3A7D44] text-xs mt-1 font-semibold">
              {stats.participationRate}% participation
            </p>
          </Card>

          {/* Commitments */}
          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-[#3A7D44]" />
              <Badge className="bg-[#A8D5BA] text-[#2a2520]">{stats.activeCommitments} active</Badge>
            </div>
            <p className="text-[#2a2520]/70 text-sm font-medium mb-1">Total Commitments</p>
            <p className="text-[#2a2520] text-3xl font-black">{stats.totalCommitments}</p>
            <p className="text-[#3A7D44] text-xs mt-1 font-semibold">
              {stats.completedCommitments} completed
            </p>
          </Card>

          {/* Challenges */}
          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-[#3A7D44]" />
              <Activity className="w-5 h-5 text-[#3A7D44]/60" />
            </div>
            <p className="text-[#2a2520]/70 text-sm font-medium mb-1">Active Challenges</p>
            <p className="text-[#2a2520] text-3xl font-black">{stats.activeChallenges}</p>
            <Link href={`/org/${orgId}/challenges`} className="text-[#3A7D44] text-xs mt-1 font-semibold hover:underline inline-block">
              View all →
            </Link>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Category Breakdown */}
          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-[#2a2520] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#3A7D44]" />
              Impact by Category
            </h3>
            <div className="space-y-3">
              {categoryBreakdown.slice(0, 5).map((category) => (
                <div key={category._id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[#2a2520] capitalize">
                        {category._id}
                      </span>
                      <span className="text-sm font-bold text-[#3A7D44]">
                        {category.carbonSaved.toFixed(1)} kg
                      </span>
                    </div>
                    <div className="w-full bg-[#3A7D44]/10 rounded-full h-2">
                      <div
                        className="bg-linear-to-r from-[#3A7D44] to-[#A8D5BA] h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((category.carbonSaved / stats.totalCarbonSaved) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Contributors */}
          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-[#2a2520] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#3A7D44]" />
              Top Contributors
            </h3>
            <div className="space-y-3">
              {topContributors.slice(0, 5).map((contributor, index) => (
                <div key={contributor._id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <Avatar className="w-10 h-10 border-2 border-[#3A7D44]/20">
                    <AvatarImage src={contributor.image} />
                    <AvatarFallback className="bg-[#A8D5BA] text-white font-bold">
                      {contributor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-[#2a2520] text-sm">{contributor.name}</p>
                    <p className="text-xs text-[#2a2520]/60">Level {contributor.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#3A7D44] text-sm">
                      {contributor.totalCarbonSaved.toFixed(1)}
                    </p>
                    <p className="text-xs text-[#2a2520]/60">kg CO₂</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/org/${orgId}/members`}>
              <Button className="w-full mt-4 bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white">
                View All Members
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-[#2a2520] mb-4">Quick Actions</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href={`/org/${orgId}/members`}>
              <Button variant="outline" className="w-full border-2 border-[#3A7D44] text-[#3A7D44] hover:bg-[#3A7D44] hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                Manage Members
              </Button>
            </Link>
            <Link href={`/org/${orgId}/reports`}>
              <Button variant="outline" className="w-full border-2 border-[#3A7D44] text-[#3A7D44] hover:bg-[#3A7D44] hover:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </Link>
            <Link href="/commitments/new">
              <Button className="w-full bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white">
                <Target className="w-4 h-4 mr-2" />
                Create Commitment
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  )
}
