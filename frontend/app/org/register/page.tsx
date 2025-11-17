'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LeafIcon } from '@/components/leaf-icon'
import { Building2, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import Link from 'next/link'

export default function RegisterOrganizationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'company' as 'company' | 'ngo' | 'school' | 'government' | 'other',
    description: '',
    website: '',
  })

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#2a2520] to-[#3d3530]">
        <Loader2 className="w-8 h-8 animate-spin text-[#A8D5BA]" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login?type=organization')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Creating organization with data:', formData)
      const response = await apiClient.createOrganization({
        name: formData.name,
        type: formData.type,
        description: formData.description,
        settings: {
          website: formData.website,
        },
      })

      console.log('Organization created successfully:', response)
      toast.success('Organization created successfully!')
      
      // Redirect to organization dashboard
      const orgId = response.data.organization._id
      console.log('Redirecting to org dashboard:', orgId)
      router.push(`/org/${orgId}/dashboard`)
    } catch (error: any) {
      console.error('Create organization error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create organization'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
      {/* Header */}
      <header className="border-b border-[#3A7D44]/30 bg-[#1a1612]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg">
              <LeafIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-linear-to-r from-[#F4FCE7] to-[#A8D5BA] bg-clip-text text-transparent">
              EcoPromise
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          {/* Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-[#3A7D44] via-[#A8D5BA] to-[#3A7D44] rounded-3xl blur-2xl opacity-30" />
            
            <div className="relative bg-[#F4FCE7] rounded-3xl shadow-2xl p-8 sm:p-12">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-center text-[#2a2520] mb-3">
                Register Your Organization
              </h1>
              <p className="text-center text-[#2a2520]/70 mb-8">
                Join EcoPromise and lead your organization toward sustainability
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#2a2520] font-semibold">
                    Organization Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Acme Corporation"
                    required
                    className="bg-white border-2 border-[#3A7D44]/20 focus:border-[#3A7D44] text-[#2a2520]"
                  />
                </div>

                {/* Organization Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-[#2a2520] font-semibold">
                    Organization Type *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-white border-2 border-[#3A7D44]/20 focus:border-[#3A7D44] text-[#2a2520]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="ngo">NGO / Non-Profit</SelectItem>
                      <SelectItem value="school">School / University</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#2a2520] font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about your organization and sustainability goals..."
                    rows={4}
                    className="bg-white border-2 border-[#3A7D44]/20 focus:border-[#3A7D44] text-[#2a2520]"
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-[#2a2520] font-semibold">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="bg-white border-2 border-[#3A7D44]/20 focus:border-[#3A7D44] text-[#2a2520]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !formData.name}
                  className="w-full bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white font-bold py-6 text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Organization...
                    </>
                  ) : (
                    'Create Organization'
                  )}
                </Button>
              </form>

              {/* Footer Text */}
              <p className="text-center text-sm text-[#2a2520]/60 mt-6">
                You will be set as the organization admin. You can invite team members later.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
