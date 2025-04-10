import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Studio Platform',
  description: 'Your complete AI creative suite',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-16 pb-6 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-background rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-foreground">AI Studio</span>
        </div>
      </div>
      
      <main className="flex-1 flex items-start justify-center">
        {children}
      </main>
      
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} AI Studio Platform. All rights reserved.</p>
      </footer>
    </div>
  )
} 