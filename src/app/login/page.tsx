'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
// If you're using NextAuth.js, uncomment the following line:
// import { signIn } from 'next-auth/react'

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()  // Change this line

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (response.ok) {
        toast({  // Change this
          title: "Login successful",
          description: "You have been logged in successfully.",
          variant: "success"
        })
        router.push('/dashboard')
      } else {
        toast({  // Change this
          title: "Login failed",
          description: data.error || 'An error occurred during login',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error during login:', error)
      toast({  // Change this
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // If you're using NextAuth.js, uncomment the following line:
      // await signIn('google', { callbackUrl: '/notes' })
      
      // If you're not using NextAuth.js, you'll need to implement your own Google sign-in logic here
      // For example:
      // const result = await yourGoogleSignInFunction()
      // if (result.success) {
      //   router.push('/notes')
      // } else {
      //   toast({
      //     title: "Login failed",
      //     description: "Failed to sign in with Google",
      //     variant: "destructive"
      //   })
      // }
    } catch (error) {
      console.error('Error during Google sign-in:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during Google sign-in. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to EnhancedNotes</h2>
        <div className="space-y-4">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full"
            variant="outline"
            disabled={isLoading}
          >
            Login with Google
          </Button>
        </div>
        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}