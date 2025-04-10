'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export function UserNav({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClientSupabaseClient()
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Get user initials for avatar
  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Get user's name or email
  const displayName = user.user_metadata?.full_name || user.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 rounded-full p-0 text-foreground hover:bg-secondary focus:ring-0" 
          aria-label="User menu"
        >
          <div className="flex h-full w-full items-center justify-center rounded-full border border-border text-sm font-medium">
            {getInitials(user.user_metadata?.full_name)}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-secondary border border-border">
        <DropdownMenuLabel className="text-foreground font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem 
          onSelect={() => router.push('/account')}
          className="text-foreground hover:bg-secondary-800 focus:bg-secondary-800 cursor-pointer"
        >
          Account
        </DropdownMenuItem>
        <DropdownMenuItem 
          onSelect={() => router.push('/settings')}
          className="text-foreground hover:bg-secondary-800 focus:bg-secondary-800 cursor-pointer"
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem 
          onSelect={handleSignOut}
          className="text-foreground hover:bg-secondary-800 focus:bg-secondary-800 cursor-pointer"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 