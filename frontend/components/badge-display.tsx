import { Award, Star, Trophy, Medal } from 'lucide-react'

interface BadgeDisplayProps {
  name: string
  level: 'gold' | 'silver' | 'bronze'
  description?: string
}

export function BadgeDisplay({ name, level, description }: BadgeDisplayProps) {
  const colorConfig = {
    gold: {
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      shadow: 'shadow-yellow-500/50',
      glow: 'bg-yellow-400/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-100',
      icon: Trophy,
    },
    silver: {
      gradient: 'from-gray-300 via-gray-400 to-gray-500',
      shadow: 'shadow-gray-400/50',
      glow: 'bg-gray-400/20',
      border: 'border-gray-400/50',
      text: 'text-gray-100',
      icon: Medal,
    },
    bronze: {
      gradient: 'from-orange-400 via-orange-500 to-orange-600',
      shadow: 'shadow-orange-500/50',
      glow: 'bg-orange-400/20',
      border: 'border-orange-500/50',
      text: 'text-orange-100',
      icon: Award,
    },
  }

  const config = colorConfig[level]
  const Icon = config.icon

  return (
    <div className="relative group cursor-pointer">
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 ${config.glow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
      
      <div className={`relative p-6 rounded-2xl border-2 ${config.border} bg-[#1a1612]/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 ${config.shadow} shadow-lg`}>
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Medal/Trophy Icon */}
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-xl ${config.shadow} group-hover:rotate-12 transition-transform duration-300`}>
            <Icon className={`h-10 w-10 ${config.text}`} strokeWidth={2} />
          </div>
          
          {/* Badge Name */}
          <div>
            <p className="font-bold text-lg text-[#F4FCE7]">{name}</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#A8D5BA]/70 mt-1">
              {level} Badge
            </p>
          </div>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-[#A8D5BA]/80 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
