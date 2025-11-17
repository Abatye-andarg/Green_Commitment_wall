'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MobileNav } from '@/components/mobile-nav'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { LeafIcon } from '@/components/leaf-icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Leaf, TrendingUp, Trophy, Zap, Crown, Star, Building2, ArrowRight } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userStats, setUserStats] = useState<any>(null)
  const [commitments, setCommitments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      loadProfileData()
    }
  }, [status, router])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const [dashboardData, commitmentsData] = await Promise.all([
        apiClient.getUserDashboard(),
        apiClient.getUserCommitments()
      ])
      
      setUserStats(dashboardData.data?.user || dashboardData.user)
      setCommitments(commitmentsData.data?.commitments || commitmentsData.commitments || [])
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
        <div className="text-center">
          <Leaf className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const activeCommitments = commitments.filter(c => c.status === 'active').length
  const totalBadges = userStats?.badges?.length || 0
  const daysActive = userStats?.daysActive || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520] relative">
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Moss pattern overlay */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%233A7D44' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Green glow ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3A7D44]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#A8D5BA]/30 rounded-full blur-3xl" />
      </div>

      <DesktopSidebar />

      <div className="md:ml-20 lg:ml-72 relative z-10 transition-all duration-300">
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-[#1a1612]/80 to-[#2a2520]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#3A7D44]/30 shadow-2xl">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-32 h-32 ring-4 ring-[#A8D5BA] shadow-2xl">
                  {session.user?.image && <AvatarImage src={session.user.image} alt={session.user.name || 'User'} />}
                  <AvatarFallback className="text-5xl font-black bg-gradient-to-br from-[#A8D5BA] to-[#3A7D44] text-white">
                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-4xl font-black text-[#F4FCE7]">{session.user?.name || 'User'}</h1>
                  <p className="text-sm text-[#A8D5BA]/70 mt-1">{session.user?.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <p className="text-[#A8D5BA] font-bold">Level {userStats?.level || 1} - {userStats?.title || 'Eco Starter'}</p>
                  </div>
                </div>
                <Badge className="text-base px-6 py-2 bg-gradient-to-r from-[#3A7D44] to-[#A8D5BA] text-white border-0 shadow-lg">
                  <Leaf className="h-4 w-4 mr-2" />
                  {userStats?.totalCarbonSaved || 0} kg CO₂ saved
                </Badge>
              </div>
            </div>

            {/* Organization Mode Switcher */}
            {(session.user as any)?.organizationId && (
              <div className="bg-gradient-to-br from-[#1a1612]/80 to-[#2a2520]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#3A7D44]/30 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-xl">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#F4FCE7]">Organization Mode</h3>
                      <p className="text-sm text-[#A8D5BA]/70">Manage your organization's environmental commitments</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(`/org/${(session.user as any).organizationId}/dashboard`)}
                    className="bg-gradient-to-r from-[#3A7D44] to-[#A8D5BA] hover:scale-105 transition-transform text-white font-bold shadow-lg"
                  >
                    Switch to Organization
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-600/90 to-emerald-800/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-xl border border-emerald-400/30 hover:scale-105 transition-transform">
                <TrendingUp className="h-10 w-10 mx-auto mb-3 text-white" />
                <p className="text-3xl font-black text-white">{activeCommitments}</p>
                <p className="text-sm text-emerald-100 font-semibold">Active Commitments</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/90 to-purple-800/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-xl border border-purple-400/30 hover:scale-105 transition-transform">
                <Trophy className="h-10 w-10 mx-auto mb-3 text-white" />
                <p className="text-3xl font-black text-white">{totalBadges}</p>
                <p className="text-sm text-purple-100 font-semibold">Badges Earned</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/90 to-amber-700/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-xl border border-amber-400/30 hover:scale-105 transition-transform">
                <Zap className="h-10 w-10 mx-auto mb-3 text-white" />
                <p className="text-3xl font-black text-white">{daysActive}</p>
                <p className="text-sm text-amber-100 font-semibold">Days Active</p>
              </div>
            </div>

            {/* All Badges */}
            {userStats?.badges && userStats.badges.length > 0 && (
              <div className="bg-gradient-to-br from-[#1a1612]/80 to-[#2a2520]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#3A7D44]/30 shadow-2xl">
                <h2 className="text-2xl font-bold text-[#F4FCE7] mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  Badge Collection
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {userStats.badges.map((badgeName: string, index: number) => {
                    const badgeColors = [
                      { color: 'from-amber-400 to-amber-600', ring: 'ring-amber-300/30' },
                      { color: 'from-slate-300 to-slate-500', ring: 'ring-slate-300/30' },
                      { color: 'from-orange-400 to-orange-600', ring: 'ring-orange-300/30' },
                    ];
                    const badge = badgeColors[index % badgeColors.length];
                    
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#3A7D44]/10 to-transparent hover:scale-110 transition-transform cursor-pointer group"
                      >
                        <div className={`p-4 rounded-full bg-gradient-to-br ${badge.color} shadow-2xl ring-4 ${badge.ring} group-hover:animate-pulse`}>
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-sm font-bold text-center text-[#F4FCE7]">{badgeName}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
