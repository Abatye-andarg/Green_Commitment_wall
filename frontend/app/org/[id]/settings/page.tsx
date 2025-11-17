'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Loader2,
  Save,
  Trash2,
  AlertTriangle,
  Building2,
  Globe,
  FileText
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

export default function OrganizationSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    website: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    if (status === 'authenticated') {
      loadOrganization()
    }
  }, [status, orgId])

  const loadOrganization = async () => {
    setLoading(true)
    try {
      const response = await apiClient.getOrganization(orgId)
      const org = response.data

      setFormData({
        name: org.name,
        type: org.type,
        description: org.description || '',
        website: org.website || '',
      })

      // Check if current user is admin
      const userId = (session?.user as any)?._id
      setIsAdmin(org.adminUserIds.some((admin: any) => admin._id === userId))
    } catch (error: any) {
      console.error('Load organization error:', error)
      toast.error('Failed to load organization')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('Only administrators can update organization settings')
      return
    }

    if (!formData.name.trim()) {
      toast.error('Organization name is required')
      return
    }

    setSaving(true)
    try {
      await apiClient.updateOrganization(orgId, formData)
      toast.success('Organization settings updated successfully')
    } catch (error: any) {
      console.error('Update organization error:', error)
      toast.error(error.response?.data?.message || 'Failed to update organization')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error('Only administrators can delete the organization')
      return
    }

    setDeleting(true)
    try {
      await apiClient.deleteOrganization(orgId)
      toast.success('Organization deleted successfully')
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Delete organization error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete organization')
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
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
                {formData.name}
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
              <Link href={`/org/${orgId}/reports`}>
                <Button variant="ghost" className="text-[#F4FCE7] hover:bg-[#3A7D44]/20">
                  Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-[#F4FCE7] mb-2">Organization Settings</h1>
          <p className="text-[#A8D5BA]">Manage your organization's profile and preferences</p>
        </div>

        {!isAdmin && (
          <Card className="bg-yellow-50 border-2 border-yellow-400 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800 mb-1">View Only</p>
                <p className="text-sm text-yellow-700">
                  You don't have permission to edit organization settings. Only administrators can make changes.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Organization Profile */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-[#3A7D44]" />
            <h2 className="text-xl font-bold text-[#2a2520]">Organization Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#2a2520] font-semibold mb-2">
                Organization Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter organization name"
                className="border-2 border-[#3A7D44]/20 focus:border-[#3A7D44]"
                disabled={!isAdmin}
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-[#2a2520] font-semibold mb-2">
                Organization Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
                disabled={!isAdmin}
              >
                <SelectTrigger className="border-2 border-[#3A7D44]/20 focus:border-[#3A7D44]">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="text-[#2a2520] font-semibold mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Tell us about your organization's sustainability goals"
                className="border-2 border-[#3A7D44]/20 focus:border-[#3A7D44] min-h-[120px]"
                disabled={!isAdmin}
              />
              <p className="text-xs text-[#2a2520]/60 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="website" className="text-[#2a2520] font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://example.com"
                className="border-2 border-[#3A7D44]/20 focus:border-[#3A7D44]"
                disabled={!isAdmin}
              />
            </div>
          </div>

          {isAdmin && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Logo Upload (Future Enhancement) */}
        <Card className="bg-[#F4FCE7] border-2 border-[#3A7D44]/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-[#3A7D44]" />
            <h2 className="text-xl font-bold text-[#2a2520]">Organization Logo</h2>
          </div>

          <div className="text-center py-8 border-2 border-dashed border-[#3A7D44]/30 rounded-lg bg-[#3A7D44]/5">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center">
              <LeafIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-[#2a2520] font-semibold mb-1">Logo upload coming soon</p>
            <p className="text-sm text-[#2a2520]/60">
              This feature will allow you to upload a custom logo for your organization
            </p>
          </div>
        </Card>

        {/* Danger Zone */}
        {isAdmin && (
          <Card className="bg-red-50 border-2 border-red-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
            </div>

            <p className="text-sm text-red-700 mb-4">
              Deleting your organization will permanently remove all data, including members, commitments, 
              and reports. This action cannot be undone.
            </p>

            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Organization
            </Button>
          </Card>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Organization
            </DialogTitle>
            <DialogDescription className="text-[#2a2520]/70 pt-4">
              Are you absolutely sure you want to delete <strong>{formData.name}</strong>?
              <br /><br />
              This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All organization data and settings</li>
                <li>Member associations (members will not be deleted)</li>
                <li>Organization-specific commitments</li>
                <li>All reports and analytics</li>
              </ul>
              <br />
              <strong className="text-red-600">This action cannot be undone.</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
