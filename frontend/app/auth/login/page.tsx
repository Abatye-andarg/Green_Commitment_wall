'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafIcon } from '@/components/leaf-icon'
import { Building2, User, ArrowLeft, Loader2 } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [accountType, setAccountType] = useState<'user' | 'organization' | null>(null)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'user' || type === 'organization') {
      setAccountType(type)
    }
  }, [searchParams])

  useEffect(() => {
    if (status === 'authenticated') {
      const user = session?.user as any
      // If user is org_admin, redirect to org dashboard
      if (user?.role === 'org_admin' && user?.organizationId) {
        router.push(`/org/${user.organizationId}/dashboard`)
      } else {
        router.push('/dashboard')
      }
    }
  }, [status, router, session])

  if (status === 'authenticated') {
    return null
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const handleOrgRedirect = () => {
    router.push('/org/register')
  }

  // Show account type selection if not specified
  if (!accountType) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-[#3A7D44]/30 bg-[#F4FCE7]">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-xl">
                <LeafIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-[#2a2520]">Sign In</CardTitle>
            <CardDescription className="text-lg text-[#2a2520]/70">
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <button
              onClick={() => setAccountType('user')}
              className="w-full px-6 py-6 flex items-center gap-5 bg-white hover:bg-[#3A7D44]/10 transition-all duration-300 group rounded-2xl border-2 border-[#3A7D44]/20 hover:border-[#3A7D44]/50 shadow-md hover:shadow-lg"
            >
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-[#A8D5BA] to-[#3A7D44] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-[#2a2520] text-xl mb-1">Individual User</p>
                <p className="text-sm text-[#2a2520]/60">Track your personal sustainability commitments</p>
              </div>
            </button>

            <button
              onClick={() => setAccountType('organization')}
              className="w-full px-6 py-6 flex items-center gap-5 bg-white hover:bg-[#3A7D44]/10 transition-all duration-300 group rounded-2xl border-2 border-[#3A7D44]/20 hover:border-[#3A7D44]/50 shadow-md hover:shadow-lg"
            >
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-[#3A7D44] to-[#2a2520] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-[#2a2520] text-xl mb-1">Organization</p>
                <p className="text-sm text-[#2a2520]/60">Manage corporate sustainability programs</p>
              </div>
            </button>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <Link href="/" className="text-sm text-[#2a2520]/60 hover:text-[#3A7D44] transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Organization sign-in flow
  if (accountType === 'organization') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
        <Card className="w-full max-w-lg shadow-2xl border-2 border-[#3A7D44]/30 bg-[#F4FCE7]">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#2a2520] flex items-center justify-center shadow-xl">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-[#2a2520]">Organization Sign In</CardTitle>
            <CardDescription className="text-base text-[#2a2520]/70">
              Sign in to your organization's sustainability portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="bg-[#3A7D44]/10 border-2 border-[#3A7D44]/30 rounded-xl p-5 space-y-3">
              <p className="text-sm font-semibold text-[#2a2520]">
                📋 Organization Members:
              </p>
              <p className="text-sm text-[#2a2520]/70 leading-relaxed">
                If you're a member of an existing organization, please sign in as an <strong>Individual User</strong> using your personal Google account.
              </p>
            </div>

            <div className="bg-[#A8D5BA]/20 border-2 border-[#3A7D44]/30 rounded-xl p-5 space-y-3">
              <p className="text-sm font-semibold text-[#2a2520]">
                🏢 New Organization?
              </p>
              <p className="text-sm text-[#2a2520]/70 leading-relaxed">
                To register a new organization, click below to create your organization profile.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-6">
            <Button
              onClick={handleOrgRedirect}
              className="w-full bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white font-bold py-6 text-base rounded-xl shadow-lg"
              size="lg"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Register New Organization
            </Button>
            <Button
              variant="outline"
              onClick={() => setAccountType(null)}
              className="w-full border-2 border-[#3A7D44]/30 text-[#2a2520] hover:bg-[#3A7D44]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account Selection
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // User sign-in flow
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-6 p-8">
          <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center shadow-lg">
            <LeafIcon className="w-16 h-16 text-white" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-[#F4FCE7]">Welcome Back</h2>
            <p className="text-xl text-[#A8D5BA] text-balance max-w-md">
              Continue your sustainability journey
            </p>
          </div>
          <div className="w-full max-w-md">
            <img 
              src="/sustainable-earth-green-planet-eco-friendly.jpg" 
              alt="Eco illustration" 
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>

        {/* Right side - Sign In */}
        <Card className="w-full shadow-2xl border-2 border-[#3A7D44]/30 bg-[#F4FCE7]">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center md:hidden mb-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#3A7D44] to-[#A8D5BA] flex items-center justify-center">
                <LeafIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-[#2a2520]">Sign In</CardTitle>
            <CardDescription className="text-center text-[#2a2520]/70">
              Sign in with your Google account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <svg className="w-16 h-16 text-[#3A7D44]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <p className="text-sm text-[#2a2520]/60 text-center max-w-sm">
                By signing in, you agree to our terms of service and privacy policy
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="button"
              className="w-full bg-[#3A7D44] hover:bg-[#3A7D44]/90 text-white"
              onClick={handleGoogleSignIn}
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => setAccountType(null)}
              className="w-full border-2 border-[#3A7D44]/30 text-[#2a2520] hover:bg-[#3A7D44]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account Selection
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#2a2520] via-[#3d3530] to-[#2a2520]">
          <Loader2 className="w-8 h-8 animate-spin text-[#A8D5BA]" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
