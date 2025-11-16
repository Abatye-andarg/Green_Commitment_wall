import { Card, CardContent } from '@/components/ui/card'
import { Type as type, type LucideIcon } from 'lucide-react'

interface KPICardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  variant?: 'default' | 'primary' | 'secondary'
}

export function KPICard({ icon: Icon, label, value, subtext, variant = 'default' }: KPICardProps) {
  const colorClasses = {
    default: 'bg-[#1a1612]/60 border-[#3A7D44]/30 backdrop-blur-sm',
    primary: 'bg-gradient-to-br from-[#3A7D44]/30 to-[#3A7D44]/10 border-[#3A7D44]/50 backdrop-blur-sm',
    secondary: 'bg-gradient-to-br from-[#A8D5BA]/20 to-[#A8D5BA]/5 border-[#A8D5BA]/40 backdrop-blur-sm',
  }

  const iconColorClasses = {
    default: 'text-[#A8D5BA]',
    primary: 'text-[#A8D5BA]',
    secondary: 'text-[#3A7D44]',
  }

  const iconBgClasses = {
    default: 'bg-[#3A7D44]/20',
    primary: 'bg-[#F4FCE7]/20',
    secondary: 'bg-[#3A7D44]/20',
  }

  return (
    <Card className={`${colorClasses[variant]} transition-all hover:scale-105 hover:shadow-2xl shadow-lg group cursor-pointer`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-[#A8D5BA]/70 font-semibold uppercase tracking-wide">{label}</p>
            <p className="text-4xl font-bold text-[#F4FCE7] group-hover:scale-110 transition-transform">{value}</p>
            {subtext && <p className="text-xs text-[#A8D5BA]/60 font-medium">{subtext}</p>}
          </div>
          <div className={`p-4 rounded-xl ${iconBgClasses[variant]} ${iconColorClasses[variant]} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all`}>
            <Icon className="h-8 w-8" strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
