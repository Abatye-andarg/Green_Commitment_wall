'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CommitmentCard } from '@/components/commitment-card'
import { KPICard } from '@/components/kpi-card'
import { BadgeDisplay } from '@/components/badge-display'
import { MobileNav } from '@/components/mobile-nav'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { LeafIcon } from '@/components/leaf-icon'
import { CreateCommitmentDialog } from '@/components/create-commitment-dialog'
import { Leaf, TrendingUp, Award, Plus, Sparkles, Zap, Target, Trophy, Star, Crown } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [commitments, setCommitments] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      loadDashboardData()
    }
  }, [status, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [dashboardData, commitmentsData] = await Promise.all([
        apiClient.getUserDashboard(),
        apiClient.getUserCommitments()
      ])
      
      setUserStats(dashboardData.data?.user || dashboardData.user)
      setCommitments(commitmentsData.data?.commitments || commitmentsData.commitments || [])
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520] relative">
      {/* Rocky texture */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
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

      {/* Dashboard content */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 bg-[#2a2520]">
          <DesktopSidebar />
        </div>
        {/* Main content */}
        <div className="flex-1 md:ml-20 lg:ml-72 transition-all duration-300">
          <div className="p-4">
            <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <KPICard
                icon={Leaf}
                label="Total CO₂ Saved"
                value={`${userStats?.totalCarbonSaved || 0} kg`}
                variant="primary"
              />
              <KPICard
                icon={Target}
                label="Active Commitments"
                value={commitments.length}
                variant="secondary"
              />
              <KPICard
                icon={Award}
                label="Level"
                value={userStats?.level || 1}
                subtext={`${userStats?.badges?.length || 0} badges earned`}
                variant="default"
              />
            </div>

            {/* Commitment Cards */}
            <h2 className="text-2xl font-bold text-white mb-4">Your Commitments</h2>
            {commitments.length === 0 ? (
              <Card className="p-8 text-center bg-gradient-to-br from-[#1a1612]/80 to-[#2a2520]/80 backdrop-blur-xl border-[#3A7D44]/30">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-[#A8D5BA]" />
                <p className="text-lg mb-4 text-[#F4FCE7]">No commitments yet</p>
                <Button onClick={() => setShowCreateDialog(true)} size="lg" className="bg-gradient-to-r from-[#3A7D44] to-[#A8D5BA]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Commitment
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commitments.map((commitment: any) => (
                  <CommitmentCard
                    key={commitment._id}
                    title={commitment.title}
                    category={commitment.category}
                    frequency={commitment.frequency}
                    progress={commitment.progress || 0}
                    carbonSaved={commitment.carbonSaved || 0}
                    status={commitment.status}
                  />
                ))}
              </div>
            )}

            {/* Badges Section */}
            {userStats?.badges && userStats.badges.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Your Badges</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userStats.badges.map((badge: string, index: number) => (
                    <BadgeDisplay
                      key={badge}
                      name={badge}
                      level={index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowCreateDialog(true)}
        size="lg"
        className="fixed bottom-20 md:bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-[#3A7D44] to-[#A8D5BA] hover:scale-110 transition-transform z-50"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Create Commitment Dialog */}
      <CreateCommitmentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadDashboardData}
      />

      <MobileNav />
    </div>
  )
}
