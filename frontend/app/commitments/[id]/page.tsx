import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LeafIcon } from '@/components/leaf-icon'
import { ArrowLeft, Calendar, TrendingUp, Award, Plus } from 'lucide-react'

// Mock data
const mockCommitment = {
  id: 1,
  title: 'Use public transport instead of driving',
  description: 'I commit to taking the bus or train to work instead of driving my car, reducing my carbon footprint and supporting sustainable transportation.',
  category: 'Transport',
  frequency: 'Daily',
  duration: 8,
  startDate: '2024-01-01',
  status: 'active',
  progress: 75,
  carbonSaved: 45.2,
  estimatedTotal: 60.0,
  isPublic: true,
}

const mockProgressUpdates = [
  { date: '2024-01-15', count: 5, note: 'Great week!' },
  { date: '2024-01-08', count: 7, note: 'Stayed consistent' },
  { date: '2024-01-01', count: 4, note: 'First week done' },
]

const mockAchievements = [
  { name: 'Week Warrior', description: 'Maintained commitment for 1 week' },
  { name: 'Consistency King', description: 'Updated progress 3 times' },
]

export default function CommitmentDetailPage() {
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

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Back Button */}
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Commitment Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="default">{mockCommitment.status}</Badge>
                    <Badge variant="outline">{mockCommitment.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {mockCommitment.frequency}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-balance">
                    {mockCommitment.title}
                  </h1>
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    {mockCommitment.description}
                  </p>
                </div>
                <Button size="lg" className="shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Progress
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carbon Saved</p>
                    <p className="text-2xl font-bold text-primary">
                      {mockCommitment.carbonSaved} kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      of {mockCommitment.estimatedTotal} kg goal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-secondary/30">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-2xl font-bold">{mockCommitment.duration} weeks</p>
                    <p className="text-xs text-muted-foreground">
                      Started {mockCommitment.startDate}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-accent">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold">{mockCommitment.progress}%</p>
                    <p className="text-xs text-muted-foreground">
                      {mockProgressUpdates.length} updates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{mockCommitment.progress}%</span>
                </div>
                <Progress value={mockCommitment.progress} className="h-3" />
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="font-semibold">Progress Updates</h3>
                {mockProgressUpdates.map((update, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{update.date}</span>
                        <Badge variant="secondary">{update.count}x completed</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements for this Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
