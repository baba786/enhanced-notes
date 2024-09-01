'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import EnhancedNotes from '@/components/EnhancedNotes'

export default function NotesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  return <EnhancedNotes />
}