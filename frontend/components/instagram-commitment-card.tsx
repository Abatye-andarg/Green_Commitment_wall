import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heart, MessageCircle, Send, Bookmark, Leaf, Flame, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InstagramCommitmentCardProps {
  userName: string
  userInitials: string
  commitment: string
  category: string
  carbonSaved: number
  likes: number
  comments: number
  timeAgo: string
}

export function InstagramCommitmentCard({
  userName,
  userInitials,
  commitment,
  category,
  carbonSaved,
  likes,
  comments,
  timeAgo,
}: InstagramCommitmentCardProps) {
  return (
    <article className="border-b border-[#3A7D44]/30 bg-[#F4FCE7] mx-4 my-6 rounded-lg shadow-2xl relative transform hover:scale-[1.02] transition-all duration-300">
      {/* Pin effect at top */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg border-2 border-gray-500 z-10" />
      
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-lg"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 relative">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-[#3A7D44]/30 shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-[#A8D5BA] to-[#3A7D44] text-white font-bold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-[#2a2520]">{userName}</p>
            <p className="text-xs text-[#3A7D44]/70">{timeAgo}</p>
          </div>
        </div>
        <Badge className="text-xs bg-[#3A7D44] text-white border-0 shadow-md">
          {category}
        </Badge>
      </div>

      <div className="px-4 pb-3">
        <div className="bg-gradient-to-br from-[#3A7D44] via-[#2d6336] to-[#3A7D44] rounded-2xl p-6 relative overflow-hidden shadow-xl">
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite]" />
          
          {/* Particle decorations */}
          <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[#A8D5BA] animate-pulse" />
          <div className="absolute bottom-4 left-6 w-1 h-1 rounded-full bg-[#F4FCE7] animate-pulse delay-100" />
          <div className="absolute top-1/2 right-8 w-1.5 h-1.5 rounded-full bg-[#A8D5BA]/50 animate-pulse delay-200" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A8D5BA] to-white flex items-center justify-center shadow-2xl ring-4 ring-white/20 animate-pulse">
                <Leaf className="w-7 h-7 text-[#3A7D44]" />
              </div>
              <div>
                <p className="text-xs text-[#A8D5BA] font-bold mb-1 uppercase tracking-wider">Impact Score</p>
                <p className="text-4xl font-black text-white drop-shadow-lg">{carbonSaved}</p>
                <p className="text-xs text-[#F4FCE7]/90 font-semibold">kg CO₂ saved</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl transform rotate-12">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-[#F4FCE7]">+{Math.floor(carbonSaved * 10)} XP</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 relative">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#A8D5BA] to-[#F4FCE7] rounded-full shadow-lg"
                style={{ width: `${Math.min((carbonSaved / 200) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#F4FCE7]/70">Level Progress</span>
              <span className="text-[10px] text-[#F4FCE7]/70 font-bold">{Math.floor((carbonSaved / 200) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 pb-2 relative">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-[#3A7D44]/10 group">
            <Heart className="w-6 h-6 text-[#2a2520] transition-all group-hover:scale-125 group-hover:fill-red-500 group-hover:text-red-500" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#3A7D44]/10 group">
            <MessageCircle className="w-6 h-6 text-[#2a2520] transition-all group-hover:scale-125 group-hover:text-[#3A7D44]" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#3A7D44]/10 group">
            <Send className="w-6 h-6 text-[#2a2520] transition-all group-hover:scale-125 group-hover:text-[#3A7D44]" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="hover:bg-[#3A7D44]/10 group">
          <Bookmark className="w-6 h-6 text-[#2a2520] transition-all group-hover:scale-125 group-hover:text-[#3A7D44]" />
        </Button>
      </div>

      {/* Likes Count with animation */}
      <div className="px-4 pb-2 relative">
        <p className="font-bold text-sm text-[#2a2520] flex items-center gap-2">
          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          {likes.toLocaleString()} likes
        </p>
      </div>

      {/* Caption */}
      <div className="px-4 pb-2">
        <p className="text-sm">
          <span className="font-semibold mr-2">{userName}</span>
          {commitment}
        </p>
      </div>

      {/* Comments Preview */}
      {comments > 0 && (
        <div className="px-4 pb-3">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all {comments} comments
          </button>
        </div>
      )}
    </article>
  )
}
