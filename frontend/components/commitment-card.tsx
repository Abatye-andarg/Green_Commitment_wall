import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AddProgressDialog } from '@/components/add-progress-dialog'
import { Plus, Leaf, TrendingUp } from 'lucide-react'

interface CommitmentCardProps {
  title: string
  category: string
  frequency: string
  progress: number
  carbonSaved: number
  status: 'active' | 'completed'
  onViewDetails?: () => void
  onAddProgress?: () => void
}

export function CommitmentCard({
  title,
  category,
  frequency,
  progress,
  carbonSaved,
  status,
  onViewDetails,
  onAddProgress,
}: CommitmentCardProps) {
  return (
    <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-[#F4FCE7]/95 border-2 border-[#3A7D44]/30 backdrop-blur-sm group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight flex-1 text-[#2a2520] group-hover:text-[#3A7D44] transition-colors">{title}</h3>
          <Badge 
            variant={status === 'active' ? 'default' : 'secondary'} 
            className={status === 'active' 
              ? 'shrink-0 bg-[#3A7D44] text-[#F4FCE7]' 
              : 'shrink-0 bg-[#A8D5BA] text-[#2a2520]'
            }
          >
            {status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="outline" className="text-xs bg-[#3A7D44]/10 text-[#3A7D44] border-[#3A7D44]/30">
            {category}
          </Badge>
          <span className="text-xs text-[#2a2520]/60 font-medium">{frequency}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-[#3A7D44]" />
              <span className="text-[#2a2520]/70 font-medium">Progress</span>
            </div>
            <span className="font-bold text-[#3A7D44]">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2.5 bg-[#A8D5BA]/30" />
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[#3A7D44]/10 border border-[#3A7D44]/20">
          <div className="p-2 rounded-full bg-[#3A7D44]/20">
            <Leaf className="h-4 w-4 text-[#3A7D44]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#2a2520]/60 font-medium">Impact</p>
            <p className="font-bold text-[#3A7D44] text-lg">{carbonSaved} kg CO₂</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 border-[#3A7D44]/30 text-[#3A7D44] hover:bg-[#3A7D44]/10" 
          onClick={onViewDetails}
        >
          View Details
        </Button>
        <AddProgressDialog
          commitmentTitle={title}
          trigger={
            <Button size="icon" className="bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-[#F4FCE7]">
              <Plus className="h-4 w-4" />
            </Button>
          }
          onSubmit={(count, note) => {
            console.log('Progress submitted:', count, note)
            onAddProgress?.()
          }}
        />
      </CardFooter>
    </Card>
  )
}
