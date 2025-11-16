'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Leaf, Sparkles } from 'lucide-react'

interface AddProgressDialogProps {
  commitmentTitle: string
  trigger?: React.ReactNode
  onSubmit?: (count: number, note: string) => void
}

export function AddProgressDialog({ 
  commitmentTitle, 
  trigger,
  onSubmit 
}: AddProgressDialogProps) {
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(1)
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    onSubmit?.(count, note)
    setOpen(false)
    setCount(1)
    setNote('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Progress Update</DialogTitle>
          <DialogDescription>
            Track your achievement for: <strong>{commitmentTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="count">
              How many times did you achieve this since your last update?
            </Label>
            <Input
              id="count"
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any notes about your progress..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Great job staying committed!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You're making a real difference for the environment
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Sparkles className="h-4 w-4 mr-2" />
            Submit Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
