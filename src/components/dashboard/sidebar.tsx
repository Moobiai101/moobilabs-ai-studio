'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  VideoIcon, 
  ImageIcon, 
  ScissorsIcon, 
  PenToolIcon, 
  SparklesIcon, 
  MicIcon, 
  UsersIcon, 
  FolderIcon 
} from 'lucide-react'

type NavItem = {
  title: string
  href: string
  icon: React.ReactNode
}

export function Sidebar() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      title: 'Video Generation',
      href: '/tools/video-generation',
      icon: <VideoIcon className="h-5 w-5" />,
    },
    {
      title: 'Image Generation',
      href: '/tools/image-generation',
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      title: 'Video Editing',
      href: '/tools/video-editing',
      icon: <ScissorsIcon className="h-5 w-5" />,
    },
    {
      title: 'Image Editing',
      href: '/tools/image-editing',
      icon: <PenToolIcon className="h-5 w-5" />,
    },
    {
      title: 'VFX',
      href: '/tools/vfx',
      icon: <SparklesIcon className="h-5 w-5" />,
    },
    {
      title: 'Voice & Dubbing',
      href: '/tools/voice-dubbing',
      icon: <MicIcon className="h-5 w-5" />,
    },
    {
      title: 'Team',
      href: '/team',
      icon: <UsersIcon className="h-5 w-5" />,
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: <FolderIcon className="h-5 w-5" />,
    },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background-800 border-r border-border h-[calc(100vh-64px)]">
      <div className="p-6">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-background-700'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
} 