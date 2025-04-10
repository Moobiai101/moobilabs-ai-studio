import { createServerSupabaseClient } from '@/lib/supabase/server'
import { UserNav } from '@/components/dashboard/user-nav'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Studio Platform',
  description: 'Your complete AI creative suite',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border flex items-center px-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-background rounded-full"></div>
          </div>
          <h1 className="text-lg font-bold text-foreground">AI Studio</h1>
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/tools/image-generation" className="text-foreground hover:text-primary transition-colors">
              Image
            </Link>
            <Link href="/tools/video-generation" className="text-foreground hover:text-primary transition-colors">
              Video
            </Link>
            <Link href="/tools/audio" className="text-foreground hover:text-primary transition-colors">
              Audio
            </Link>
            <Link href="/tools/realtime" className="text-foreground hover:text-primary transition-colors">
              Realtime
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/pricing" 
            className="hidden md:block text-foreground/80 hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          {user && <UserNav user={user} />}
        </div>
      </header>
      
      <main className="pt-6 px-6 md:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
} 