'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Leaf, Loader2, Sparkles } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface CreateCommitmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateCommitmentDialog({ open, onOpenChange, onSuccess }: CreateCommitmentDialogProps) {
  const [text, setText] = useState('')
  const [duration, setDuration] = useState('1 month')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      toast.error('Please describe your commitment')
      return
    }

    setLoading(true)
    try {
      // Call backend API which uses Gemini AI to interpret the commitment
      const response = await apiClient.createCommitment({
        text: text.trim(),
        duration,
        visibility,
        mediaType: 'text',
      })

      console.log('Create commitment response:', response)
      
      // Backend returns { status: 'success', data: { commitment, interpretation, carbonEstimate, milestones } }
      const commitmentData = response.data?.data || response.data
      
      setAiResponse(commitmentData)
      
      toast.success('🌱 Commitment created successfully!', {
        description: `Category: ${commitmentData.interpretation?.category || 'General'} • Estimated impact: ${commitmentData.carbonEstimate?.total || 0} kg CO₂`
      })

      // Reset form
      setText('')
      setDuration('1 month')
      setVisibility('public')
      setAiResponse(null)
      
      // Close dialog and refresh
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Failed to create commitment:', error)
      
      let errorMessage = 'Please try again';
      if (error.message.includes('token') || error.message.includes('401') || error.message.includes('authenticate')) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Check your connection.';
      } else if (error.message.includes('10')) {
        errorMessage = 'Commitment must be at least 10 characters long.';
      } else {
        errorMessage = error.message || 'An unknown error occurred';
      }
      
      toast.error('Failed to create commitment', {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setText('')
      setAiResponse(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create Your Commitment
          </DialogTitle>
          <DialogDescription>
            Tell us what you want to commit to. Our AI will help categorize and estimate your environmental impact.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="commitment-text">Your Commitment</Label>
            <Textarea
              id="commitment-text"
              placeholder="E.g., I'll use public transport instead of driving to work every day..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={loading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Be specific about what you'll do and how often
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration} disabled={loading}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 week">1 Week</SelectItem>
                  <SelectItem value="2 weeks">2 Weeks</SelectItem>
                  <SelectItem value="1 month">1 Month</SelectItem>
                  <SelectItem value="3 months">3 Months</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="1 year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibility} onValueChange={(v: any) => setVisibility(v)} disabled={loading}>
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">AI-Powered Analysis</p>
                <p className="text-xs text-muted-foreground">
                  We'll automatically categorize and estimate your impact
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !text.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Commitment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
