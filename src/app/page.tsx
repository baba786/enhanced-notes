import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-200">Welcome to EnhancedNotes</h1>
      <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">Your smart note-taking companion</p>
      <div className="space-x-4">
        <Link href="/login">
          <Button>Login</Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline">Sign Up</Button>
        </Link>
      </div>
    </div>
  )
}