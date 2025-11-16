'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Globe, User, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LeafIcon } from '@/components/leaf-icon'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Green Wall',
    href: '/wall',
    icon: Globe,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    gradient: 'from-teal-500 to-cyan-500',
  },
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside 
      className={cn(
        "hidden md:flex fixed left-0 top-0 bottom-0 border-r border-[#3A7D44]/20 flex-col z-50 transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-[#1a1612] via-[#2a2520] to-[#1a1612]",
        "shadow-2xl shadow-black/50",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44]/10 via-transparent to-[#A8D5BA]/5 pointer-events-none" />
      
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#3A7D44]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-[#A8D5BA]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#3A7D44]/20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg shadow-[#3A7D44]/30 group-hover:shadow-[#3A7D44]/50 transition-all group-hover:scale-110 duration-300">
              <LeafIcon className="w-7 h-7 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-[#F4FCE7] to-[#A8D5BA] bg-clip-text text-transparent">
                  EcoPromise
                </span>
                <span className="text-xs text-[#A8D5BA]/70 font-medium">Green Commitment Wall</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-[#3A7D44] to-[#2d6335] text-[#F4FCE7] shadow-lg shadow-[#3A7D44]/30'
                    : 'text-[#A8D5BA]/80 hover:text-[#F4FCE7] hover:bg-[#3A7D44]/20'
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#A8D5BA]/20 to-transparent animate-pulse" />
                )}
                <Icon className={cn(
                  "h-5 w-5 relative z-10 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                {!isCollapsed && (
                  <span className="font-semibold relative z-10">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <Sparkles className="h-4 w-4 ml-auto text-[#F4FCE7] animate-pulse" />
                )}
              </Link>
            )
          })}

          {/* Quick Stats - Only show when expanded */}
          {!isCollapsed && (
            <div className="mt-8 space-y-3 pt-6 border-t border-[#3A7D44]/20">
              <p className="text-xs font-bold text-[#A8D5BA]/60 uppercase tracking-wider px-4">
                Quick Stats
              </p>
              <div className="space-y-2">
                <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#3A7D44]/10 to-transparent border border-[#3A7D44]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#A8D5BA]/70">Total Impact</p>
                      <p className="text-sm font-bold text-[#F4FCE7]">127.5 kg CO₂</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#A8D5BA]/10 to-transparent border border-[#A8D5BA]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#A8D5BA]/70">Level</p>
                      <p className="text-sm font-bold text-[#F4FCE7]">Eco Warrior</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-[#3A7D44]/20">
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-center hover:bg-[#3A7D44]/20 text-[#A8D5BA] hover:text-[#F4FCE7] transition-all duration-300",
              isCollapsed ? "px-2" : "px-4"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
