'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { LeafIcon } from '@/components/leaf-icon'
import { ArrowLeft, Leaf } from 'lucide-react'

const categories = ['Transport', 'Energy', 'Food', 'Waste', 'Water', 'Shopping']
const frequencies = ['Daily', 'Weekly', 'Monthly']

export default function NewCommitmentPage() {
  const [isPublic, setIsPublic] = useState(true)
  const [estimatedImpact, setEstimatedImpact] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <LeafIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EcoPromise</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">
                N
              </div>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Back Button */}
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Commitment</CardTitle>
              <CardDescription>
                A greener future starts with small promises
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="commitment">Your Commitment</Label>
                <Textarea
                  id="commitment"
                  placeholder="Describe what you commit to doing for the environment..."
                  className="min-h-[100px] resize-none"
                  onChange={(e) => {
                    // Simulate impact calculation based on text length
                    const impact = Math.min(Math.floor(e.target.value.length / 5), 100)
                    setEstimatedImpact(impact)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Be specific about what you'll do and how often
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="How often?" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq.toLowerCase()}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="How many weeks will you commit?"
                  min="1"
                  defaultValue="4"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="visibility" className="text-base">
                    Public Visibility
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Share your commitment on the Green Wall
                  </p>
                </div>
                <Switch
                  id="visibility"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>

              {/* Impact Estimate */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Estimated Carbon Impact
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {estimatedImpact} kg CO₂
                      </p>
                      <p className="text-xs text-muted-foreground">Per commitment period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg">
                Create My Promise
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
