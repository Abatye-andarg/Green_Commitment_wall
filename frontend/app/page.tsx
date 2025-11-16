'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LeafIcon } from '@/components/leaf-icon'
import { Sparkles, Users, TrendingUp, Heart } from 'lucide-react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Don't show loading state to avoid hydration mismatch
  // Just let the redirect happen if authenticated
  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-[#F4FCE7]/30 to-white">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 flex items-center justify-between max-w-5xl">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-md">
              <LeafIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#3A7D44] to-[#2a2520] bg-clip-text text-transparent">
              EcoPromise
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-[#3A7D44] hover:bg-[#3A7D44]/5 font-semibold text-xs sm:text-sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white font-semibold shadow-md text-xs sm:text-sm">
                Sign up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
              <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left side - Preview feed mockup */}
            <div className="order-2 md:order-1 space-y-4">
              <div className="bg-white border border-border rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A8D5BA] to-[#3A7D44] flex items-center justify-center text-white font-bold text-sm">
                    SJ
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    Just completed my 30th day of cycling to work instead of driving! 🚴‍♀️
                  </p>
                  <div className="bg-gradient-to-br from-[#3A7D44]/10 to-[#A8D5BA]/10 border border-[#3A7D44]/20 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Carbon Impact</div>
                    <div className="text-2xl font-bold text-[#3A7D44]">85.3 kg CO₂ saved</div>
                  </div>
                  <div className="flex items-center gap-4 pt-2 text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-[#3A7D44] transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">124</span>
                    </button>
                    <span className="text-sm">Transport</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 border border-border/60 rounded-xl p-4 blur-[2px] shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A8D5BA] to-[#3A7D44]"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-2 bg-muted/50 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Value prop */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#3A7D44]/10 border border-[#3A7D44]/20 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-[#3A7D44]" />
                <span className="text-sm font-semibold text-[#3A7D44]">Social Impact Platform</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Make Green Commitments That Matter
              </h1>
              
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Track sustainability commitments, celebrate milestones, and inspire others with every eco-friendly action you take.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/auth/register" className="flex-1 sm:flex-none">
                  <Button size="lg" className="w-full bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white font-semibold shadow-lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/auth/login" className="flex-1 sm:flex-none">
                  <Button size="lg" variant="outline" className="w-full border-2 border-[#3A7D44] text-[#3A7D44] hover:bg-[#3A7D44]/5 font-semibold">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 pt-6">
                <div>
                  <div className="text-3xl font-bold text-[#3A7D44]">5k+</div>
                  <div className="text-sm text-muted-foreground">Active users</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div>
                  <div className="text-3xl font-bold text-[#3A7D44]">10k+</div>
                  <div className="text-sm text-muted-foreground">Commitments</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div>
                  <div className="text-3xl font-bold text-[#3A7D44]">500t</div>
                  <div className="text-sm text-muted-foreground">CO₂ saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-b from-[#F4FCE7]/30 to-white py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Create Commitments</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Set personal eco-goals like cycling to work, reducing waste, or eating plant-based
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center mx-auto shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Log your achievements and see your real carbon impact grow over time
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center mx-auto shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Share & Inspire</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Post updates to the feed and motivate a community to take climate action
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-white">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <p className="text-muted-foreground">Small actions, shared together, create lasting change.</p>
          <p className="text-sm text-muted-foreground/70 mt-2">© 2025 EcoPromise</p>
        </div>
      </footer>
    </div>
  )
}
