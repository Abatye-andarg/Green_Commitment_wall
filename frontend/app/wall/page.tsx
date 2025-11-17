'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InstagramCommitmentCard } from '@/components/instagram-commitment-card'
import { CreateCommitmentDialog } from '@/components/create-commitment-dialog'
import { MobileNav } from '@/components/mobile-nav'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { LeafIcon } from '@/components/leaf-icon'
import { Search, Plus, TrendingUp, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

// Mock data - Instagram style
const mockPublicCommitments = [
  {
    id: 1,
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    commitment: 'Just completed my 30th day of cycling to work instead of driving! The morning commute has become my favorite part of the day. 🚴‍♀️🌱',
    category: 'Transport',
    carbonSaved: 85.3,
    likes: 124,
    comments: 8,
    timeAgo: '2 hours ago',
  },
  {
    id: 2,
    userName: 'Alex Chen',
    userInitials: 'AC',
    commitment: 'Switched to a completely plant-based diet this month! Feeling healthier and lighter knowing I\'m reducing my carbon footprint with every meal. 🌱🥗',
    category: 'Food',
    carbonSaved: 34.7,
    likes: 89,
    comments: 12,
    timeAgo: '5 hours ago',
  },
  {
    id: 3,
    userName: 'Maria Garcia',
    userInitials: 'MG',
    commitment: 'Installed solar panels on my roof today! Excited to generate my own clean energy and reduce my electricity bills. The future is renewable! ☀️⚡',
    category: 'Energy',
    carbonSaved: 145.8,
    likes: 203,
    comments: 24,
    timeAgo: '1 day ago',
  },
  {
    id: 4,
    userName: 'James Wilson',
    userInitials: 'JW',
    commitment: 'Started a composting system in my backyard. No more food waste going to landfills! My garden is going to love this nutrient-rich soil. 🌿♻️',
    category: 'Waste',
    carbonSaved: 15.6,
    likes: 67,
    comments: 5,
    timeAgo: '1 day ago',
  },
  {
    id: 5,
    userName: 'Emma Brown',
    userInitials: 'EB',
    commitment: 'Bought my first set of reusable bags, bottles, and containers. Saying goodbye to single-use plastics feels amazing! 🛍️💚',
    category: 'Shopping',
    carbonSaved: 22.4,
    likes: 156,
    comments: 15,
    timeAgo: '2 days ago',
  },
  {
    id: 6,
    userName: 'David Lee',
    userInitials: 'DL',
    commitment: 'Joined a carpool group with my colleagues! Fewer cars on the road means cleaner air for everyone. Plus, we have great conversations! 🚗💨',
    category: 'Transport',
    carbonSaved: 42.1,
    likes: 98,
    comments: 7,
    timeAgo: '3 days ago',
  },
]

export default function WallPage() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [commitments, setCommitments] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const router = useRouter()

  const handleLikeChange = (commitmentId: string, liked: boolean, newCount: number) => {
    setCommitments(prevCommitments =>
      prevCommitments.map(c =>
        c._id === commitmentId
          ? { ...c, likeCount: newCount, isLiked: liked, likes: c.likes?.includes(session?.user?.id) ? c.likes : (liked ? [...(c.likes || []), session?.user?.id] : c.likes?.filter((id: string) => id !== session?.user?.id)) }
          : c
      )
    )
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      loadWallData()
    }
  }, [status, router])

  const loadWallData = async () => {
    try {
      setLoading(true)
      const [feedData, statsData] = await Promise.all([
        apiClient.getWallFeed(),
        apiClient.getWallStats()
      ])
      // Backend returns { status: "success", data: { commitments: [...], pagination: {...} } }
      const commitmentsArray = feedData.data?.commitments || feedData.data || []
      setCommitments(commitmentsArray)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load wall:', error)
      // Fallback to mock data if API fails
      setCommitments(mockPublicCommitments)
    } finally {
      setLoading(false)
    }
  }

  const filteredCommitments = commitments.filter(
    (c: any) =>
      c.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white">Loading feed...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520] relative">
      {/* Rocky stone texture */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Moss and vine overlay for organic feel */}
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

      {/* Main Content */}
      <div className="md:ml-20 lg:ml-72 relative z-10 transition-all duration-300">
        {/* Header - Desktop */}
        <header className="sticky top-0 z-50 hidden md:block backdrop-blur-xl bg-gradient-to-r from-[#1a1612]/95 via-[#2a2520]/95 to-[#1a1612]/95 border-b border-[#3A7D44]/30 shadow-lg">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3A7D44] animate-pulse" />
                <span className="text-sm font-semibold text-[#F4FCE7]">Live Feed</span>
              </div>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8D5BA]/70 group-focus-within:text-[#3A7D44] transition-colors" />
                <Input
                  placeholder="Search commitments, users..."
                  className="pl-11 pr-4 py-2.5 bg-[#2a2520]/50 border-[#3A7D44]/30 text-[#F4FCE7] placeholder:text-[#A8D5BA]/50 focus:border-[#3A7D44] focus:bg-[#2a2520]/80 rounded-xl transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="hover:bg-[#3A7D44]/20 text-[#A8D5BA] hover:text-[#F4FCE7] rounded-xl transition-all">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#3A7D44]/30">
                    {session?.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </div>
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Header - Mobile */}
        <header className="sticky top-0 z-50 md:hidden backdrop-blur-xl bg-gradient-to-r from-[#1a1612]/95 via-[#2a2520]/95 to-[#1a1612]/95 border-b border-[#3A7D44]/30 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg shadow-[#3A7D44]/30">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#F4FCE7]">EcoPromise</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3A7D44] animate-pulse" />
                  <span className="text-xs text-[#A8D5BA]/80 font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-0 py-0 pb-20 md:pb-8 max-w-2xl">
          <div className="px-3 sm:px-4 py-4 sm:py-6 mb-3 sm:mb-4 bg-gradient-to-r from-[#3A7D44]/20 via-[#A8D5BA]/20 to-[#3A7D44]/20 backdrop-blur-sm border-y border-[#3A7D44]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center animate-pulse">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#F4FCE7] text-sm">Trending Now</p>
                <p className="text-xs text-[#A8D5BA]">2,847 people saved 15.2 tons of CO₂ today</p>
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <div className="px-4 py-4 md:hidden bg-[#2a2520]/80 backdrop-blur-sm sticky top-[57px] z-40 border-b border-[#3A7D44]/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search commitments..."
                className="pl-10 bg-muted/50 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-0">
            {filteredCommitments.map((commitment: any) => {
              // Extract carbon savings from nested structure
              const carbonSaved = commitment.actualCarbonSaved || 
                                 commitment.estimatedCarbonSavings?.total ||
                                 commitment.estimatedCarbonSavings?.perPeriod ||
                                 commitment.carbonSaved || 
                                 0;
              
              // Check if current user liked this commitment
              const isLiked = commitment.likes?.includes(session?.user?.id) || false
              
              return (
                <InstagramCommitmentCard
                  key={commitment._id || commitment.id}
                  commitmentId={commitment._id || commitment.id}
                  userName={commitment.userId?.name || commitment.userName || 'Anonymous'}
                  userInitials={commitment.userId?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || commitment.userInitials || 'AN'}
                  commitment={commitment.text || commitment.title || commitment.commitment || 'No description'}
                  category={commitment.category || 'other'}
                  carbonSaved={carbonSaved}
                  likes={commitment.likeCount || commitment.likesCount || commitment.likes?.length || 0}
                  comments={commitment.commentCount || commitment.commentsCount || commitment.comments || 0}
                  timeAgo={commitment.timeAgo || new Date(commitment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Recently'}
                  isLiked={isLiked}
                  onLikeChange={(liked, newCount) => handleLikeChange(commitment._id, liked, newCount)}
                />
              );
            })}
          </div>

          {filteredCommitments.length === 0 && (
            <div className="text-center py-12 px-4">
              <p className="text-[#A8D5BA]">No commitments found</p>
            </div>
          )}
        </main>
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
        onSuccess={loadWallData}
      />

      <MobileNav />
    </div>
  )
}
