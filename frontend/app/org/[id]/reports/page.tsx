'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { LeafIcon } from '@/components/leaf-icon'
import { 
  Calendar,
  Download,
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface ReportData {
  organization: any
  stats: {
    totalCarbonSaved: number
    totalCommitments: number
    activeCommitments: number
    completedCommitments: number
    memberCount: number
    activeMembers: number
    participationRate: number
  }
  categoryBreakdown: Array<{
    _id: string
    count: number
    carbonSaved: number
  }>
  comparison?: {
    previousPeriod: {
      totalCarbonSaved: number
      totalCommitments: number
    }
    changes: {
      carbonSavedChange: number
      commitmentsChange: number
    }
  }
}

export default function OrganizationReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string

  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      // Set default date range (last 30 days)
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 30)
      setEndDate(end.toISOString().split('T')[0])
      setStartDate(start.toISOString().split('T')[0])
      
      loadReport(start.toISOString().split('T')[0], end.toISOString().split('T')[0])
    }
  }, [status, orgId])

  const loadReport = async (start?: string, end?: string) => {
    setLoading(true)
    try {
      const params: any = {}
      if (start) params.startDate = start
      if (end) params.endDate = end

      const response = await apiClient.getOrgCSRReport(orgId, params)
      setReportData(response.data)
    } catch (error: any) {
      console.error('Load report error:', error)
      toast.error('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates')
      return
    }
    loadReport(startDate, endDate)
  }

  const handleExportCSV = () => {
    if (!reportData) return

    const { stats, categoryBreakdown } = reportData

    const csvData = [
      ['EcoPromise CSR Report', reportData.organization.name],
      ['Period', `${startDate} to ${endDate}`],
      [''],
      ['Overview Statistics'],
      ['Total Carbon Saved (kg)', stats.totalCarbonSaved.toFixed(2)],
      ['Total Commitments', stats.totalCommitments],
      ['Active Commitments', stats.activeCommitments],
      ['Completed Commitments', stats.completedCommitments],
      ['Team Members', stats.memberCount],
      ['Active Members', stats.activeMembers],
      ['Participation Rate (%)', stats.participationRate.toFixed(1)],
      [''],
      ['Category Breakdown'],
      ['Category', 'Commitments', 'Carbon Saved (kg)'],
      ...categoryBreakdown.map(cat => [cat._id, cat.count, cat.carbonSaved.toFixed(2)]),
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportData.organization.name}-CSR-Report-${startDate}-to-${endDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Report exported successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#2a2520] to-[#3d3530]">
        <Loader2 className="w-8 h-8 animate-spin text-[#A8D5BA]" />
      </div>
    )
  }

  if (!reportData) return null

  const { organization, stats, categoryBreakdown, comparison } = reportData

  return (
    <div className="min-h-screen bg-linear-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
      {/* Header */}
      <header className="border-b border-[#3A7D44]/30 bg-[#2a2520]/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/org/${orgId}/dashboard`} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-linear-to-r from-[#F4FCE7] to-[#A8D5BA] bg-clip-text text-transparent">
                {organization.name}
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href={`/org/${orgId}/dashboard`}>
                <Button variant="ghost" className="text-[#F4FCE7] hover:bg-[#3A7D44]/20">
                  Dashboard
                </Button>
              </Link>
              <Link href={`/org/${orgId}/members`}>
                <Button variant="ghost" className="text-[#F4FCE7] hover:bg-[#3A7D44]/20">
                  Members
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
          <h1 className="text-3xl font-black text-[#F4FCE7] mb-2">CSR Reports</h1>
          <p className="text-[#A8D5BA]">Generate detailed sustainability reports for stakeholders</p>
        </div>

        {/* Date Range Selector */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="startDate" className="text-[#2a2520] font-semibold mb-2">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-2 border-[#3A7D44]/20 focus:border-[#3A7D44]"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate" className="text-[#2a2520] font-semibold mb-2">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-2 border-[#3A7D44]/20 focus:border-[#3A7D44]"
              />
            </div>
            <Button
              onClick={handleGenerateReport}
              className="bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-2 border-[#3A7D44] text-[#3A7D44] hover:bg-[#3A7D44] hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Report Period */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-[#2a2520]/60 mb-2">Report Period</p>
            <h2 className="text-2xl font-black text-[#2a2520]">
              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </h2>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] border-0 p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <LeafIcon className="w-8 h-8 text-white/80" />
              {comparison && (
                <Badge className={`${comparison.changes.carbonSavedChange >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {comparison.changes.carbonSavedChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(comparison.changes.carbonSavedChange).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium mb-1">Carbon Saved</p>
            <p className="text-3xl font-black">{stats.totalCarbonSaved.toFixed(1)}</p>
            <p className="text-xs mt-1 opacity-80">kg CO₂</p>
          </Card>

          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-[#3A7D44]" />
              {comparison && (
                <Badge className={`${comparison.changes.commitmentsChange >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {comparison.changes.commitmentsChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(comparison.changes.commitmentsChange).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-sm text-[#2a2520]/70 font-medium mb-1">Total Commitments</p>
            <p className="text-3xl font-black text-[#2a2520]">{stats.totalCommitments}</p>
            <p className="text-xs text-[#3A7D44] mt-1">{stats.completedCommitments} completed</p>
          </Card>

          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-[#3A7D44]" />
            </div>
            <p className="text-sm text-[#2a2520]/70 font-medium mb-1">Team Participation</p>
            <p className="text-3xl font-black text-[#2a2520]">{stats.participationRate.toFixed(1)}%</p>
            <p className="text-xs text-[#3A7D44] mt-1">{stats.activeMembers} of {stats.memberCount} members</p>
          </Card>

          <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-[#3A7D44]" />
            </div>
            <p className="text-sm text-[#2a2520]/70 font-medium mb-1">Active Commitments</p>
            <p className="text-3xl font-black text-[#2a2520]">{stats.activeCommitments}</p>
            <p className="text-xs text-[#3A7D44] mt-1">In progress</p>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 mb-6">
          <h3 className="text-xl font-bold text-[#2a2520] mb-6">Impact by Category</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((category) => (
              <div key={category._id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#3A7D44]" />
                    <span className="font-semibold text-[#2a2520] capitalize">{category._id}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#3A7D44]">{category.carbonSaved.toFixed(1)} kg CO₂</p>
                    <p className="text-xs text-[#2a2520]/60">{category.count} commitments</p>
                  </div>
                </div>
                <div className="w-full bg-[#3A7D44]/10 rounded-full h-3">
                  <div
                    className="bg-linear-to-r from-[#3A7D44] to-[#A8D5BA] h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((category.carbonSaved / stats.totalCarbonSaved) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6">
          <h3 className="text-xl font-bold text-[#2a2520] mb-4">Executive Summary</h3>
          <div className="space-y-4 text-[#2a2520]/80 leading-relaxed">
            <p>
              During the period from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}, 
              {' '}<strong className="text-[#2a2520]">{organization.name}</strong> achieved significant environmental impact 
              through employee participation in sustainability initiatives.
            </p>
            <p>
              Our team of <strong className="text-[#2a2520]">{stats.memberCount} members</strong> completed{' '}
              <strong className="text-[#2a2520]">{stats.completedCommitments} commitments</strong>, resulting in{' '}
              <strong className="text-[#3A7D44]">{stats.totalCarbonSaved.toFixed(1)} kg of CO₂</strong> savings.
            </p>
            <p>
              With a participation rate of <strong className="text-[#2a2520]">{stats.participationRate.toFixed(1)}%</strong>,
              {' '}{stats.activeMembers} employees actively contributed to our sustainability goals through the EcoPromise platform.
            </p>
            {comparison && comparison.changes.carbonSavedChange >= 0 && (
              <p>
                This represents a <strong className="text-green-600">{comparison.changes.carbonSavedChange.toFixed(1)}% increase</strong>{' '}
                in carbon savings compared to the previous period, demonstrating our continued commitment to environmental responsibility.
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
