'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AddProgressDialog } from '@/components/add-progress-dialog'
import { DesktopSidebar } from '@/components/desktop-sidebar'
import { ArrowLeft, Calendar, TrendingUp, Award, Plus, Loader2, Leaf, Target, Zap, CheckCircle2, Circle, Flag } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export default function CommitmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [commitment, setCommitment] = useState<any>(null)
  const [progressUpdates, setProgressUpdates] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCompletions, setTotalCompletions] = useState(0)
  const [expectedCompletions, setExpectedCompletions] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated' && params.id) {
      loadCommitmentData()
    }
  }, [status, params.id, router])

  const handleBackNavigation = () => {
    // Check if we're in org context
    const orgContext = localStorage.getItem('currentOrgContext')
    if (orgContext) {
      router.push(`/org/${orgContext}/dashboard`)
    } else {
      router.push('/dashboard')
    }
  }

  const loadCommitmentData = async () => {
    try {
      setLoading(true)
      const [commitmentData, progressData, milestonesData] = await Promise.all([
        apiClient.getCommitmentById(params.id as string),
        apiClient.getProgressUpdates(params.id as string),
        apiClient.getMilestones(params.id as string)
      ])
      
      const commitmentInfo = commitmentData.data?.commitment || commitmentData.data || commitmentData
      setCommitment(commitmentInfo)
      
      // Backend returns { status: 'success', data: { progressUpdates: [...] } }
      const updates = progressData.data?.progressUpdates || progressData.progressUpdates || progressData.data || []
      const updatesArray = Array.isArray(updates) ? updates : []
      setProgressUpdates(updatesArray)
      
      // Extract milestones
      const milestonesArray = milestonesData.data?.milestones || milestonesData.milestones || milestonesData.data || []
      setMilestones(Array.isArray(milestonesArray) ? milestonesArray : [])
      
      // Calculate total completions
      const total = updatesArray.reduce((sum: number, update: any) => {
        return sum + (parseInt(update.amount) || 1)
      }, 0)
      setTotalCompletions(total)
      
      // Calculate expected completions
      const expected = getExpectedCompletions(
        commitmentInfo.frequency,
        commitmentInfo.duration,
        commitmentInfo.createdAt
      )
      setExpectedCompletions(expected)
    } catch (error) {
      console.error('Failed to load commitment:', error)
      toast.error('Failed to load commitment details')
    } finally {
      setLoading(false)
    }
  }
  
  const getExpectedCompletions = (frequency: string, duration: string, createdAt: string) => {
    const durationMatch = duration?.match(/(\d+)\s*(day|week|month|year)/i)
    if (!durationMatch) {
      return frequency === 'daily' ? 30 : frequency === 'weekly' ? 12 : frequency === 'monthly' ? 3 : 1
    }
    
    const [, amount, unit] = durationMatch
    const durationNum = parseInt(amount)
    
    const frequencyMap: Record<string, number> = {
      'daily': unit === 'day' ? durationNum : unit === 'week' ? durationNum * 7 : unit === 'month' ? durationNum * 30 : durationNum * 365,
      'weekly': unit === 'week' ? durationNum : unit === 'month' ? durationNum * 4 : unit === 'year' ? durationNum * 52 : Math.ceil(durationNum / 7),
      'monthly': unit === 'month' ? durationNum : unit === 'year' ? durationNum * 12 : Math.ceil(durationNum / 30),
      'once': 1
    }
    
    return frequencyMap[frequency] || 30
  }



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2a2520]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#3A7D44] mx-auto mb-4" />
          <p className="text-white">Loading commitment...</p>
        </div>
      </div>
    )
  }

  if (!commitment) {
    const orgContext = localStorage.getItem('currentOrgContext')
    const backUrl = orgContext ? `/org/${orgContext}/dashboard` : '/dashboard'
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2a2520]">
        <div className="text-center">
          <p className="text-white mb-4">Commitment not found</p>
          <Button onClick={() => router.push(backUrl)} className="bg-[#3A7D44]">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const carbonSaved = commitment.actualCarbonSaved || 0
  const estimatedTotal = commitment.estimatedCarbonSavings?.total || 0
  const carbonPerPeriod = commitment.estimatedCarbonSavings?.perPeriod || 0
  const progressPercent = expectedCompletions > 0 
    ? Math.min((totalCompletions / expectedCompletions) * 100, 100)
    : 0

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
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
          <div className="space-y-4 sm:space-y-6">
            {/* Back Button */}
                        <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-white hover:text-[#2D9C8B] hover:bg-white/10"
              onClick={handleBackNavigation}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>

            {/* Commitment Header */}
            <Card className="bg-[#F4FCE7]/95 border-2 border-[#2D9C8B]/30 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-[#2D9C8B] text-[#F4FCE7]">
                        {commitment.status || 'active'}
                      </Badge>
                      <Badge variant="outline" className="text-[#2D9C8B] border-[#2D9C8B]/30">
                        {commitment.category || 'other'}
                      </Badge>
                      <Badge variant="outline" className="text-[#2a2520]/70 border-[#3A7D44]/20">
                        {commitment.frequency || 'daily'}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-[#2a2520]">
                      {commitment.text}
                    </h1>
                    {commitment.duration && (
                      <p className="text-sm text-[#2a2520]/60">
                        Duration: {commitment.duration}
                      </p>
                    )}
                  </div>
                  <AddProgressDialog
                    commitmentTitle={commitment.text}
                    trigger={
                      <Button size="lg" className="bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-[#F4FCE7] shrink-0">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Progress
                      </Button>
                    }
                    onSubmit={async (count, note) => {
                      try {
                        await apiClient.addProgressUpdate(params.id as string, {
                          amount: count.toString(),
                          note: note || 'Progress update',
                          deltaCarbonSaved: carbonPerPeriod * count
                        })
                        toast.success('Progress updated successfully!')
                        loadCommitmentData()
                      } catch (error) {
                        console.error('Failed to add progress:', error)
                        toast.error('Failed to update progress')
                      }
                    }}
                  />
                </div>
              </CardHeader>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#F4FCE7]/95 border-2 border-[#2D9C8B]/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-[#2D9C8B]/20">
                      <Leaf className="h-6 w-6 text-[#2D9C8B]" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Carbon Saved</p>
                      <p className="text-2xl font-bold text-[#2D9C8B]">
                        {carbonSaved.toFixed(1)} kg
                      </p>
                      <p className="text-xs text-white/60">
                        of {estimatedTotal.toFixed(1)} kg goal
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#F4FCE7]/95 border-2 border-[#2D9C8B]/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-[#2D9C8B]/20">
                      <Target className="h-6 w-6 text-[#2D9C8B]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#2a2520]/70">Completions</p>
                      <p className="text-2xl font-bold text-[#2D9C8B]">
                        {totalCompletions} / {expectedCompletions}
                      </p>
                      <p className="text-xs text-[#2a2520]/60">
                        {progressUpdates.length} updates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#F4FCE7]/95 border-2 border-[#2D9C8B]/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-[#2D9C8B]/20">
                      <Zap className="h-6 w-6 text-[#2D9C8B]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#2a2520]/70">Progress</p>
                      <p className="text-2xl font-bold text-[#2D9C8B]">{progressPercent.toFixed(0)}%</p>
                      <p className="text-xs text-[#2a2520]/60">
                        Started {new Date(commitment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Milestone Path */}
            {milestones.length > 0 && (
              <Card className="bg-linear-to-br from-[#2D9C8B]/10 to-[#6FCF97]/10 border-2 border-[#2D9C8B]/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-[#2a2520] flex items-center gap-2">
                    <Flag className="h-5 w-5 text-[#2D9C8B]" />
                    Your Journey Path
                  </CardTitle>
                  <p className="text-sm text-[#2a2520]/60">
                    AI-generated milestones to keep you on track
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2D9C8B]/20" />
                    
                    {/* Milestones */}
                    <div className="space-y-8">
                      {milestones.map((milestone: any, index: number) => {
                        const isCompleted = milestone.status === 'completed'
                        const isInProgress = milestone.status === 'in_progress'
                        const isPending = milestone.status === 'pending'
                        const progress = milestone.targetValue > 0 
                          ? Math.min((milestone.currentValue / milestone.targetValue) * 100, 100) 
                          : 0

                        return (
                          <div key={milestone._id || index} className="relative flex gap-4">
                            {/* Milestone Icon */}
                            <div className={`relative z-10 shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted 
                                ? 'bg-[#2D9C8B] shadow-lg shadow-[#2D9C8B]/50' 
                                : isInProgress
                                ? 'bg-[#6FCF97] border-2 border-[#2D9C8B] animate-pulse'
                                : 'bg-white border-2 border-[#2D9C8B]/30'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="h-6 w-6 text-white" />
                              ) : isInProgress ? (
                                <Circle className="h-6 w-6 text-[#2D9C8B] fill-[#2D9C8B]" />
                              ) : (
                                <Circle className="h-6 w-6 text-[#2D9C8B]/30" />
                              )}
                            </div>

                            {/* Milestone Content */}
                            <div className={`flex-1 pb-8 ${isCompleted ? 'opacity-75' : ''}`}>
                              <div className={`rounded-lg p-4 transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-[#2D9C8B]/10 border-2 border-[#2D9C8B]/30'
                                  : isInProgress
                                  ? 'bg-[#F4FCE7] border-2 border-[#2D9C8B] shadow-md'
                                  : 'bg-white/50 border-2 border-[#2D9C8B]/20'
                              }`}>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex-1">
                                    <h3 className={`font-semibold mb-1 ${
                                      isCompleted ? 'text-[#2D9C8B] line-through' : 'text-[#2a2520]'
                                    }`}>
                                      {milestone.title}
                                    </h3>
                                    <p className="text-sm text-[#2a2520]/70">
                                      {milestone.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    {isCompleted && milestone.completedAt && (
                                      <Badge className="bg-[#2D9C8B] text-white">
                                        Completed
                                      </Badge>
                                    )}
                                    {isInProgress && (
                                      <Badge className="bg-[#6FCF97] text-[#2a2520]">
                                        In Progress
                                      </Badge>
                                    )}
                                    {isPending && (
                                      <Badge variant="outline" className="border-[#2D9C8B]/30 text-[#2a2520]/60">
                                        Pending
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Progress Bar for milestone */}
                                {!isCompleted && (
                                  <div className="mt-3 space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-[#2a2520]/60">
                                        {milestone.currentValue} / {milestone.targetValue} completions
                                      </span>
                                      <span className="font-semibold text-[#2D9C8B]">
                                        {progress.toFixed(0)}%
                                      </span>
                                    </div>
                                    <Progress 
                                      value={progress} 
                                      className="h-2 bg-[#2D9C8B]/10"
                                    />
                                  </div>
                                )}

                                {/* Carbon Impact */}
                                {milestone.estimatedCarbonSavings > 0 && (
                                  <div className="mt-2 flex items-center gap-2 text-xs text-[#2D9C8B]">
                                    <Leaf className="h-3 w-3" />
                                    <span>
                                      {isCompleted ? 'Saved' : 'Will save'} ~{milestone.estimatedCarbonSavings.toFixed(1)} kg CO₂
                                    </span>
                                  </div>
                                )}

                                {isCompleted && milestone.completedAt && (
                                  <div className="mt-2 text-xs text-[#2a2520]/50">
                                    Completed on {new Date(milestone.completedAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Section */}
            <Card className="bg-[#F4FCE7]/95 border-2 border-[#2D9C8B]/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#2a2520] flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#2D9C8B]" />
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#2a2520]/70 font-medium">Overall Progress</span>
                    <span className="font-bold text-[#2D9C8B]">{progressPercent.toFixed(0)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-3 bg-[#6FCF97]/30" />
                  <p className="text-xs text-[#2a2520]/60">
                    {totalCompletions} of {expectedCompletions} completions • {carbonSaved.toFixed(1)} of {estimatedTotal.toFixed(1)} kg CO₂ saved
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="font-semibold text-[#2a2520]">Progress Updates</h3>
                  {progressUpdates.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#3A7D44]/30 rounded-lg">
                      <Award className="h-12 w-12 mx-auto mb-3 text-[#3A7D44]/50" />
                      <p className="text-[#2a2520]/60 font-medium">No progress updates yet</p>
                      <p className="text-sm text-[#2a2520]/50 mt-1">Add your first update to start tracking!</p>
                    </div>
                  ) : (
                    progressUpdates.map((update: any, index: number) => (
                      <div
                        key={update._id || index}
                        className="flex items-start gap-3 p-4 rounded-lg border-2 border-[#3A7D44]/20 bg-white/50"
                      >
                        <div className="w-2 h-2 rounded-full bg-[#3A7D44] mt-2 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                            <span className="font-medium text-[#2a2520]">
                              {new Date(update.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <div className="flex items-center gap-2">
                              {update.amount && (
                                <Badge className="bg-[#2D9C8B]/20 text-[#2D9C8B] border-[#2D9C8B]/30">
                                  {update.amount}x completed
                                </Badge>
                              )}
                              {update.deltaCarbonSaved > 0 && (
                                <Badge variant="outline" className="text-[#2D9C8B] border-[#2D9C8B]/30">
                                  +{update.deltaCarbonSaved.toFixed(1)} kg CO₂
                                </Badge>
                              )}
                            </div>
                          </div>
                          {update.note && (
                            <p className="text-sm text-[#2a2520]/70">{update.note}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
