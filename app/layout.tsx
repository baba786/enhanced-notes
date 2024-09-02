import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EnhancedNotes',
  description: 'Your smart note-taking companion',
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <ToastProvider>
          <main className="p-4">
            {children}
          </main>
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  )
}