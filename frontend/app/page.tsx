'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LeafIcon } from '@/components/leaf-icon'
import { Sparkles, Users, TrendingUp, Heart, Building2, User, ChevronDown, Award, Zap, Target, ArrowRight, CheckCircle2, Globe } from 'lucide-react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showLoginOptions, setShowLoginOptions] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [status, router])

  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520] relative overflow-hidden">
      {/* Background decorations from main app */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%233A7D44' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Green glow ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3A7D44]/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#A8D5BA]/30 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      {/* Revamped Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#2a2520]/95 backdrop-blur-xl border-b border-[#3A7D44]/30 shadow-lg shadow-[#3A7D44]/10' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#3A7D44]/30 rounded-2xl blur-md group-hover:blur-lg transition-all" />
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <LeafIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black bg-linear-to-r from-[#F4FCE7] to-[#A8D5BA] bg-clip-text text-transparent">
                  EcoPromise
                </span>
                <div className="flex items-center gap-1.5 -mt-1">
                  <div className="w-1 h-1 rounded-full bg-[#3A7D44] animate-pulse" />
                  <span className="text-[10px] sm:text-xs text-[#A8D5BA] font-semibold uppercase tracking-wider">Impact Platform</span>
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-3 sm:gap-4">
              {/* Login Dropdown */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-[#F4FCE7] hover:bg-[#3A7D44]/20 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl transition-all duration-300 group border border-[#3A7D44]/20 hover:border-[#3A7D44]/40"
                  onClick={() => setShowLoginOptions(!showLoginOptions)}
                >
                  <span>Log in</span>
                  <ChevronDown className={`w-4 h-4 ml-1.5 transition-transform duration-300 ${showLoginOptions ? 'rotate-180' : ''}`} />
                </Button>
                
                {showLoginOptions && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-[#F4FCE7] rounded-2xl shadow-2xl border-2 border-[#3A7D44]/30 overflow-hidden animate-slide-down">
                    <div className="p-2">
                      <Link href="/auth/login?type=user">
                        <button className="w-full px-4 py-4 flex items-center gap-4 hover:bg-[#3A7D44]/10 transition-all duration-300 group rounded-xl">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#A8D5BA] to-[#3A7D44] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-[#2a2520] text-base">Individual User</p>
                            <p className="text-sm text-[#2a2520]/60">Track personal commitments</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-[#3A7D44] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </Link>
                      
                      <div className="h-px bg-[#3A7D44]/20 my-2" />
                      
                      <Link href="/auth/login?type=organization">
                        <button className="w-full px-4 py-4 flex items-center gap-4 hover:bg-[#3A7D44]/10 transition-all duration-300 group rounded-xl">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#3A7D44] to-[#2a2520] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-[#2a2520] text-base">Organization</p>
                            <p className="text-sm text-[#2a2520]/60">Corporate CSR portal</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-[#3A7D44] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Up Button */}
              <Link href="/auth/register">
                <Button 
                  size="sm" 
                  className="bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white font-bold shadow-lg shadow-[#3A7D44]/30 text-sm sm:text-base px-5 sm:px-8 py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#3A7D44]/40 hover:scale-105 border-2 border-[#A8D5BA]/30"
                >
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
          {/* Main Headline */}
          <div className="text-center mb-16 sm:mb-20 lg:mb-24 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#3A7D44]/20 border-2 border-[#3A7D44]/40 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 animate-bounce-slow shadow-lg shadow-[#3A7D44]/20">
              <Sparkles className="w-5 h-5 text-[#A8D5BA] animate-pulse" />
              <span className="text-sm font-bold text-[#F4FCE7] tracking-wide">AI-POWERED IMPACT TRACKING</span>
              <div className="w-2 h-2 rounded-full bg-[#A8D5BA] animate-pulse" />
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight px-4">
              <span className="block bg-linear-to-r from-[#F4FCE7] via-[#A8D5BA] to-[#F4FCE7] bg-clip-text text-transparent drop-shadow-2xl animate-fade-in-up">
                Make Green
              </span>
              <span className="block bg-linear-to-r from-[#A8D5BA] via-[#3A7D44] to-[#A8D5BA] bg-clip-text text-transparent drop-shadow-2xl animate-fade-in-up delay-100">
                Commitments
              </span>
              <span className="block bg-linear-to-r from-[#3A7D44] to-[#A8D5BA] bg-clip-text text-transparent drop-shadow-2xl animate-fade-in-up delay-200">
                That Matter
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl md:text-3xl text-[#F4FCE7]/90 max-w-4xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-300 px-4 font-medium">
              Track sustainability goals, earn milestones, and inspire a global community with every eco-friendly action
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up delay-400 px-4">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white font-bold shadow-2xl shadow-[#3A7D44]/50 px-10 py-7 text-lg rounded-2xl transition-all duration-300 hover:shadow-3xl hover:shadow-[#3A7D44]/60 hover:scale-110 border-2 border-[#A8D5BA]/30">
                  <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-[#F4FCE7]/10 backdrop-blur-sm border-2 border-[#F4FCE7]/30 text-[#F4FCE7] hover:bg-[#F4FCE7]/20 hover:border-[#F4FCE7]/50 font-bold px-10 py-7 text-lg rounded-2xl transition-all duration-300 hover:scale-105">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-12 animate-fade-in-up delay-500">
              <div className="flex items-center gap-2 text-[#A8D5BA]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">Free Forever</span>
              </div>
              <div className="w-px h-6 bg-[#3A7D44]/30" />
              <div className="flex items-center gap-2 text-[#A8D5BA]">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-semibold">Global Community</span>
              </div>
              <div className="w-px h-6 bg-[#3A7D44]/30" />
              <div className="flex items-center gap-2 text-[#A8D5BA]">
                <Award className="w-5 h-5" />
                <span className="text-sm font-semibold">AI-Powered Insights</span>
              </div>
            </div>
          </div>

          {/* Featured Example Card */}
          <div className="max-w-2xl mx-auto animate-fade-in-up delay-600 px-4">
            <div className="relative group">
              {/* Card glow effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-[#3A7D44] via-[#A8D5BA] to-[#3A7D44] rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500" />
              
              <div className="relative bg-[#F4FCE7] border-4 border-[#3A7D44]/30 rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl">
                {/* Example badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-[#3A7D44] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-[#A8D5BA]">
                    ✨ Example Commitment
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-start gap-5 mb-6 mt-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#3A7D44]/30 rounded-full blur-md animate-pulse" />
                    <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-[#A8D5BA] to-[#3A7D44] flex items-center justify-center text-white font-bold text-2xl shadow-lg border-3 border-white">
                      SJ
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-[#2a2520] flex items-center gap-2">
                      Sarah Johnson
                      <Award className="w-5 h-5 text-[#3A7D44]" />
                    </h3>
                    <p className="text-[#2a2520]/60 font-medium">Environmental Advocate</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Target className="w-4 h-4 text-[#3A7D44]" />
                      <span className="text-sm font-semibold text-[#3A7D44]">45 days active</span>
                    </div>
                  </div>
                </div>

                {/* Commitment Content */}
                <div className="space-y-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#3A7D44]/20 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-[#3A7D44] animate-pulse" />
                      <span className="text-xs font-bold text-[#3A7D44] uppercase tracking-wider">My Commitment</span>
                    </div>
                    <p className="text-lg font-bold text-[#2a2520] mb-3 leading-relaxed">
                      Zero Plastic Challenge - 90 Days
                    </p>
                    <p className="text-[#2a2520]/80 leading-relaxed">
                      Eliminating single-use plastics from my daily life. Switched to reusable bags, bottles, and containers. 
                      Bringing my own containers to restaurants and markets. Small changes, big impact! 🌍
                    </p>
                  </div>

                  {/* Stats Bar */}
                  <div className="flex items-center gap-3 sm:gap-6 justify-between bg-linear-to-r from-[#3A7D44]/10 to-[#A8D5BA]/10 rounded-2xl p-4 border-2 border-[#3A7D44]/20">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#3A7D44] fill-current" />
                      <span className="font-bold text-[#2a2520] text-sm sm:text-base">287</span>
                    </div>
                    <div className="w-px h-6 bg-[#3A7D44]/20" />
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#3A7D44]" />
                      <span className="font-bold text-[#2a2520] text-sm sm:text-base">43 comments</span>
                    </div>
                    <div className="w-px h-6 bg-[#3A7D44]/20" />
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#3A7D44]" />
                      <span className="font-bold text-[#3A7D44] text-sm sm:text-base">78% complete</span>
                    </div>
                  </div>

                  {/* Milestones Preview */}
                  <div className="bg-linear-to-br from-[#3A7D44]/5 to-[#A8D5BA]/5 rounded-2xl p-5 border-2 border-[#3A7D44]/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-[#2a2520] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#3A7D44]" />
                        AI Milestones
                      </span>
                      <span className="text-xs bg-[#3A7D44] text-white px-3 py-1 rounded-full font-bold">2/3 Complete</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#3A7D44] flex items-center justify-center flex-shrink-0 shadow-md">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-[#2a2520] font-medium line-through opacity-60">First Week Challenge</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#3A7D44] flex items-center justify-center flex-shrink-0 shadow-md animate-pulse">
                          <div className="w-3 h-3 rounded-full bg-white" />
                        </div>
                        <span className="text-sm text-[#2a2520] font-bold">One Month Milestone</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#2a2520]/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-3 h-3 rounded-full bg-[#2a2520]/40" />
                        </div>
                        <span className="text-sm text-[#2a2520]/50 font-medium">Champion Achievement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-base sm:text-lg text-[#F4FCE7]/80 mt-8 font-medium">
              Join thousands making real environmental impact
            </p>
          </div>
        </div>

        {/* Features Section - Main App Theme Blend */}
        <div className="bg-[#F4FCE7]/5 backdrop-blur-md py-20 sm:py-24 lg:py-28 border-y-2 border-[#3A7D44]/20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233A7D44' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16 sm:mb-20 animate-fade-in-up">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black bg-linear-to-r from-[#F4FCE7] to-[#A8D5BA] bg-clip-text text-transparent mb-6">
                Powered by Intelligence
              </h2>
              <p className="text-lg sm:text-xl text-[#F4FCE7]/80 max-w-2xl mx-auto font-medium">
                Smart features that help you achieve real environmental impact
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: <Sparkles className="w-8 h-8" />,
                  title: "AI Milestone Generator",
                  description: "Our AI creates personalized milestones to guide your journey and keep you motivated",
                  color: "from-[#3A7D44] to-[#A8D5BA]",
                  delay: "delay-100"
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Smart Progress Tracking",
                  description: "Visual progress indicators and real-time updates celebrate every achievement",
                  color: "from-[#A8D5BA] to-[#3A7D44]",
                  delay: "delay-200"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Community Support",
                  description: "Share commitments, inspire others, and build accountability through social features",
                  color: "from-[#3A7D44] to-[#2a2520]",
                  delay: "delay-300"
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Impact Analytics",
                  description: "See the measurable difference you're making with carbon savings calculations",
                  color: "from-[#2a2520] to-[#3A7D44]",
                  delay: "delay-400"
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Achievement System",
                  description: "Unlock badges and rewards as you complete milestones and reach new levels",
                  color: "from-[#A8D5BA] to-[#3A7D44]",
                  delay: "delay-500"
                },
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Social Engagement",
                  description: "Like, comment, and connect with a global community of eco-champions",
                  color: "from-[#3A7D44] to-[#A8D5BA]",
                  delay: "delay-600"
                }
              ].map((feature, index) => (
                <div key={index} className={`group animate-fade-in-up ${feature.delay}`}>
                  <div className="relative h-full">
                    {/* Card glow */}
                    <div className={`absolute -inset-0.5 bg-linear-to-r ${feature.color} rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500`} />
                    
                    <div className="relative h-full bg-[#2a2520]/90 backdrop-blur-xl border-2 border-[#3A7D44]/30 rounded-2xl p-8 transform transition-all duration-500 group-hover:scale-105 group-hover:border-[#A8D5BA]/50 shadow-xl">
                      <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F4FCE7] mb-4 group-hover:text-[#A8D5BA] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-[#F4FCE7]/70 leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#3A7D44]/30 py-12 sm:py-16 bg-linear-to-b from-[#2a2520] to-[#1a1510] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#3A7D44]/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-6 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#3A7D44]/40 rounded-2xl blur-lg group-hover:blur-xl transition-all" />
              <div className="relative w-12 h-12 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <LeafIcon className="w-7 h-7 text-white" />
              </div>
            </div>
            <span className="text-2xl font-black bg-linear-to-r from-[#A8D5BA] to-[#F4FCE7] bg-clip-text text-transparent">EcoPromise</span>
          </Link>
          
          <div className="space-y-4 mb-8">
            <p className="text-[#F4FCE7]/90 font-semibold text-lg">Small actions, shared together, create lasting change.</p>
            <div className="flex items-center justify-center gap-3 text-[#A8D5BA]/80 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3A7D44] animate-pulse" />
                AI-Powered
              </span>
              <div className="w-px h-4 bg-[#3A7D44]/30" />
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3A7D44] animate-pulse" />
                Community-Driven
              </span>
              <div className="w-px h-4 bg-[#3A7D44]/30" />
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3A7D44] animate-pulse" />
                Impact-Focused
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-[#3A7D44]/20">
            <p className="text-sm text-[#F4FCE7]/50 font-medium">© 2025 EcoPromise. All rights reserved. Building a sustainable future together.</p>
          </div>
        </div>
      </footer>

      {/* Click outside to close dropdown */}
      {showLoginOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLoginOptions(false)}
        />
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  )
}
