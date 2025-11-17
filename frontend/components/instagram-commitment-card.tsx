'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heart, MessageCircle, Send, Bookmark, Leaf, Flame, Award, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'

interface InstagramCommitmentCardProps {
  commitmentId: string
  userName: string
  userInitials: string
  commitment: string
  category: string
  carbonSaved: number
  estimatedCarbonTotal?: number
  likes: number
  comments: number
  timeAgo: string
  isLiked?: boolean
  onLikeChange?: (liked: boolean, newCount: number) => void
}

export function InstagramCommitmentCard({
  commitmentId,
  userName,
  userInitials,
  commitment,
  category,
  carbonSaved,
  estimatedCarbonTotal,
  likes: initialLikes,
  comments: initialComments,
  timeAgo,
  isLiked: initialIsLiked = false,
  onLikeChange,
}: InstagramCommitmentCardProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLiking, setIsLiking] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentsList, setCommentsList] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setLikes(initialLikes)
    setIsLiked(initialIsLiked)
  }, [initialLikes, initialIsLiked])

  const handleLike = async () => {
    if (isLiking) return
    
    try {
      setIsLiking(true)
      const optimisticLiked = !isLiked
      const optimisticCount = optimisticLiked ? likes + 1 : likes - 1
      
      setIsLiked(optimisticLiked)
      setLikes(optimisticCount)
      
      const response = await apiClient.likeCommitment(commitmentId)
      const actualLiked = response.data?.liked ?? optimisticLiked
      const actualCount = response.data?.likeCount ?? optimisticCount
      
      setIsLiked(actualLiked)
      setLikes(actualCount)
      onLikeChange?.(actualLiked, actualCount)
    } catch (error) {
      console.error('Failed to like:', error)
      setIsLiked(!isLiked)
      setLikes(isLiked ? likes + 1 : likes - 1)
      toast.error('Failed to update like')
    } finally {
      setIsLiking(false)
    }
  }

  const loadComments = async () => {
    try {
      setLoadingComments(true)
      const response = await apiClient.getComments(commitmentId)
      const commentsData = response.data?.comments || response.comments || []
      setCommentsList(Array.isArray(commentsData) ? commentsData : [])
    } catch (error) {
      console.error('Failed to load comments:', error)
      toast.error('Failed to load comments')
    } finally {
      setLoadingComments(false)
    }
  }

  const handleOpenComments = async () => {
    setShowComments(true)
    await loadComments()
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      await apiClient.createComment(commitmentId, newComment.trim())
      setNewComment('')
      await loadComments()
      toast.success('Comment added!')
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <Badge className="text-xs bg-[#2D9C8B] text-white border-0 shadow-md">
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
                style={{ 
                  width: `${
                    estimatedCarbonTotal && estimatedCarbonTotal > 0
                      ? Math.min((carbonSaved / estimatedCarbonTotal) * 100, 100)
                      : Math.min((carbonSaved / 100) * 100, 100)
                  }%` 
                }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#F4FCE7]/70">Progress</span>
              <span className="text-[10px] text-[#F4FCE7]/70 font-bold">
                {estimatedCarbonTotal && estimatedCarbonTotal > 0
                  ? Math.floor((carbonSaved / estimatedCarbonTotal) * 100)
                  : Math.floor((carbonSaved / 100) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 pb-2 relative">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-[#3A7D44]/10 group"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`w-6 h-6 transition-all group-hover:scale-125 ${
              isLiked 
                ? 'fill-red-500 text-red-500' 
                : 'text-[#2a2520] group-hover:fill-red-500 group-hover:text-red-500'
            }`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-[#3A7D44]/10 group"
            onClick={handleOpenComments}
          >
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
          <Heart className={`w-4 h-4 ${
            isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-[#2a2520]'
          }`} />
          {likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}
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
      {initialComments > 0 && (
        <div className="px-4 pb-3">
          <button 
            className="text-sm text-[#2a2520]/60 hover:text-[#2a2520] transition-colors"
            onClick={handleOpenComments}
          >
            View all {initialComments} comments
          </button>
        </div>
      )}

      {/* Comments Dialog */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0 bg-[#F4FCE7]">
          <DialogHeader className="px-6 py-4 border-b border-[#3A7D44]/20">
            <DialogTitle className="text-[#2a2520] flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#3A7D44]" />
              Comments
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col h-[60vh]">
            <ScrollArea className="flex-1 px-6">
              {loadingComments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#3A7D44]" />
                </div>
              ) : commentsList.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-[#3A7D44]/30" />
                  <p className="text-[#2a2520]/60">No comments yet</p>
                  <p className="text-sm text-[#2a2520]/40 mt-1">Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {commentsList.map((comment: any) => (
                    <div key={comment._id} className="flex gap-3">
                      <Avatar className="h-8 w-8 ring-2 ring-[#3A7D44]/20">
                        <AvatarFallback className="bg-linear-to-br from-[#A8D5BA] to-[#3A7D44] text-white text-xs">
                          {comment.userId?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'AN'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-[#3A7D44]/5 rounded-2xl px-4 py-2">
                          <p className="font-semibold text-sm text-[#2a2520]">
                            {comment.userId?.name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-[#2a2520]/80 mt-1">{comment.text}</p>
                        </div>
                        <p className="text-xs text-[#2a2520]/40 mt-1 ml-4">
                          {new Date(comment.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Comment Input */}
            <form onSubmit={handleSubmitComment} className="border-t border-[#3A7D44]/20 p-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-[#3A7D44]/5 border-[#3A7D44]/20 focus:border-[#3A7D44]"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Post'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
