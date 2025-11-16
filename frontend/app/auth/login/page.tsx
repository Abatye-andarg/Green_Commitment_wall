'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LeafIcon } from '@/components/leaf-icon'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'authenticated') {
    return null
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-accent/30 to-secondary/20">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-6 p-8">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <LeafIcon className="w-16 h-16 text-primary-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold text-primary">Welcome Back</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-md">
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
        <Card className="w-full shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center md:hidden mb-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <LeafIcon className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Sign in with your Google account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                By signing in, you agree to our terms of service and privacy policy
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              type="button"
              className="w-full"
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
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
