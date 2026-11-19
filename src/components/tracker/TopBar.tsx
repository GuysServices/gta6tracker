'use client'

import { User } from '@supabase/supabase-js'
import { LogOut, Share2 } from 'lucide-react'
import Image from 'next/image'

interface Props {
  user: User
  completedCount: number
  totalMissions: number
  onLogout: () => void
}

export default function TopBar({ user, completedCount, totalMissions, onLogout }: Props) {
  // GitHub uses user_metadata.user_name, Google uses full_name
  const username = user.user_metadata?.user_name
    ?? user.user_metadata?.full_name
    ?? user.user_metadata?.name
    ?? 'Player'
  const avatar = user.user_metadata?.avatar_url
  const pct = Math.round((completedCount / totalMissions) * 100)

  const handleShare = () => {
    const slug = username.toLowerCase().replace(/\s+/g, '-')
    const url = `${window.location.origin}/profile/${slug}`
    navigator.clipboard.writeText(url).catch(() => {})
    // could toast here
  }

  return (
    <header className="sticky top-0 z-50 border-b border-vc-border bg-vc-black/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="font-display font-bold text-xl tracking-tight">
          <span className="text-vc-cyan">GTA VI</span>
          <span className="text-vc-muted/60 ml-2 text-sm font-normal">TRACKER</span>
        </div>

        {/* Progress pill */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="w-32 h-1.5 bg-vc-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-vc-cyan to-vc-pink transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-vc-muted text-xs font-display">{pct}%</span>
        </div>

        {/* User controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="text-vc-muted hover:text-vc-cyan transition-colors"
            title="Copy profile link"
          >
            <Share2 size={16} />
          </button>
          {avatar && (
            <Image
              src={avatar}
              alt={username}
              width={28}
              height={28}
              className="rounded-full border border-vc-border"
            />
          )}
          <span className="text-vc-text text-sm hidden sm:block">{username}</span>
          <button
            onClick={onLogout}
            className="text-vc-muted hover:text-vc-pink transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
