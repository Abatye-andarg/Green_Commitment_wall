'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { MobileNav } from '@/components/mobile-nav'
import { LeafIcon } from '@/components/leaf-icon'
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Calendar, 
  Target,
  Zap,
  Flame,
  Droplets,
  Wind,
  Recycle,
  ShoppingBag,
  Loader2,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export default function StatsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [commitments, setCommitments] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      loadStats()
    }
  }, [status, router])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [dashboardData, commitmentsData] = await Promise.all([
        apiClient.getUserDashboard(),
        apiClient.getUserCommitments('me')
      ])
      
      setStats(dashboardData.data || dashboardData)
      // Backend returns { status: 'success', data: { commitments: [...] } }
      const commitmentsArray = commitmentsData.data?.commitments || commitmentsData.commitments || commitmentsData.data || []
      setCommitments(Array.isArray(commitmentsArray) ? commitmentsArray : [])
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  // Calculate category breakdown
  const categoryStats = commitments.reduce((acc: any, c: any) => {
    const category = c.category || 'other'
    if (!acc[category]) {
      acc[category] = { count: 0, carbon: 0 }
    }
    acc[category].count++
    acc[category].carbon += c.actualCarbonSaved || 0
    return acc
  }, {})

  const categoryIcons: any = {
    transport: Wind,
    energy: Zap,
    food: Flame,
    waste: Recycle,
    water: Droplets,
    consumption: ShoppingBag,
    other: Target
  }

  // Calculate real-time stats from commitments
  const totalCarbon = commitments.reduce((sum: number, c: any) => sum + (c.actualCarbonSaved || 0), 0)
  const totalCommitments = commitments.length
  const activeCommitments = commitments.filter((c: any) => c.status === 'active').length
  const completedCommitments = commitments.filter((c: any) => c.status === 'completed').length

  // Calculate trends (mock for now - would need historical data)
  const carbonTrend = 15.3
  const commitmentTrend = 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520] relative">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-30 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3A7D44]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#A8D5BA]/30 rounded-full blur-3xl" />
      </div>

      <DesktopSidebar />

      <div className="md:ml-20 lg:ml-72 relative z-10 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#1a1612]/95 via-[#2a2520]/95 to-[#1a1612]/95 border-b border-[#3A7D44]/30 shadow-lg">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
            <div className="flex items-center gap-4">
              <BarChart3 className="w-6 h-6 text-[#3A7D44]" />
              <div>
                <h1 className="text-xl font-bold text-[#F4FCE7]">Statistics</h1>
                <p className="text-xs text-[#A8D5BA]/70">Your environmental impact</p>
              </div>
            </div>
            <Link href="/profile">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform">
                {session?.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </div>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl pb-24 md:pb-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#A8D5BA]/80 font-medium mb-1">Total CO₂ Saved</p>
                    <p className="text-3xl font-bold text-[#F4FCE7]">{totalCarbon.toFixed(1)}</p>
                    <p className="text-xs text-[#A8D5BA]/60 mt-1">kg carbon dioxide</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-0">
                    +{carbonTrend}%
                  </Badge>
                  <span className="text-xs text-[#A8D5BA]/70">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#A8D5BA]/80 font-medium mb-1">Total Commitments</p>
                    <p className="text-3xl font-bold text-[#F4FCE7]">{totalCommitments}</p>
                    <p className="text-xs text-[#A8D5BA]/60 mt-1">pledges made</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-0">
                    +{commitmentTrend}
                  </Badge>
                  <span className="text-xs text-[#A8D5BA]/70">this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#A8D5BA]/80 font-medium mb-1">Active</p>
                    <p className="text-3xl font-bold text-[#F4FCE7]">{activeCommitments}</p>
                    <p className="text-xs text-[#A8D5BA]/60 mt-1">in progress</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={(activeCommitments / totalCommitments) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#A8D5BA]/80 font-medium mb-1">Completed</p>
                    <p className="text-3xl font-bold text-[#F4FCE7]">{completedCommitments}</p>
                    <p className="text-xs text-[#A8D5BA]/60 mt-1">finished goals</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={(completedCommitments / totalCommitments) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-[#1a1612]/80 backdrop-blur border-[#3A7D44]/30">
              <CardHeader>
                <CardTitle className="text-[#F4FCE7] flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#3A7D44]" />
                  Category Breakdown
                </CardTitle>
                <CardDescription className="text-[#A8D5BA]/70">
                  Commitments by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryStats).map(([category, data]: [string, any]) => {
                    const Icon = categoryIcons[category] || Target
                    const percentage = (data.count / totalCommitments) * 100
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#F4FCE7] capitalize">{category}</p>
                              <p className="text-xs text-[#A8D5BA]/70">{data.count} commitments</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-[#3A7D44]">{data.carbon.toFixed(1)} kg</p>
                            <p className="text-xs text-[#A8D5BA]/70">{percentage.toFixed(0)}%</p>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Environmental Equivalents */}
            <Card className="bg-[#1a1612]/80 backdrop-blur border-[#3A7D44]/30">
              <CardHeader>
                <CardTitle className="text-[#F4FCE7] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#3A7D44]" />
                  Impact Equivalents
                </CardTitle>
                <CardDescription className="text-[#A8D5BA]/70">
                  What your CO₂ savings mean
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#3A7D44]/10 to-transparent border border-[#3A7D44]/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Wind className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F4FCE7]">Miles Not Driven</p>
                        <p className="text-2xl font-bold text-[#3A7D44]">{(totalCarbon * 2.31).toFixed(0)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#A8D5BA]/70">Equivalent to driving distance saved</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#3A7D44]/10 to-transparent border border-[#3A7D44]/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                        <LeafIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F4FCE7]">Trees Planted</p>
                        <p className="text-2xl font-bold text-[#3A7D44]">{(totalCarbon / 21).toFixed(1)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#A8D5BA]/70">Tree-years needed to offset this carbon</p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#3A7D44]/10 to-transparent border border-[#3A7D44]/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#F4FCE7]">Gallons of Gas</p>
                        <p className="text-2xl font-bold text-[#3A7D44]">{(totalCarbon / 8.89).toFixed(1)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#A8D5BA]/70">Gasoline consumption avoided</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-[#1a1612]/80 backdrop-blur border-[#3A7D44]/30">
            <CardHeader>
              <CardTitle className="text-[#F4FCE7] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#3A7D44]" />
                Recent Commitments
              </CardTitle>
              <CardDescription className="text-[#A8D5BA]/70">
                Your latest environmental pledges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commitments.slice(0, 5).map((commitment: any) => {
                  const Icon = categoryIcons[commitment.category] || Target
                  return (
                    <div
                      key={commitment._id}
                      className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-[#3A7D44]/10 to-transparent border border-[#3A7D44]/20 hover:border-[#3A7D44]/40 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#F4FCE7] truncate">{commitment.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {commitment.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {commitment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#3A7D44]">
                          {(commitment.actualCarbonSaved || commitment.estimatedCarbonSavings?.total || 0).toFixed(1)} kg
                        </p>
                        <p className="text-xs text-[#A8D5BA]/70">CO₂</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
