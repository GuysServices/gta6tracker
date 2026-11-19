'use client'

import { User } from '@supabase/supabase-js'
import { LogOut, Share2, MapPinned } from 'lucide-react'
import Image from 'next/image'

interface Props {
  user: User
  completedCount: number
  totalMissions: number
  onLogout: () => void
}

export default function TopBar({ user, completedCount, totalMissions, onLogout }: Props) {
  const username = user.user_metadata?.user_name
    ?? user.user_metadata?.full_name
    ?? user.user_metadata?.name
    ?? 'Player'
  const avatar = user.user_metadata?.avatar_url
  const pct = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0

  const handleShare = () => {
    const slug = username.toLowerCase().replace(/\\s+/g, '-')
    const url = `${window.location.origin}/profile/${slug}`
    navigator.clipboard.writeText(url).catch(() => {})
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.09] bg-[#090a12]/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-7">
        <a href="/" className="group flex min-w-0 items-center gap-3" aria-label="Leonida Tracker home">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-[#ffb36e] via-[#f34f91] to-[#7254d8] shadow-[0_0_26px_rgba(244,79,145,.22)]">
            <MapPinned size={18} className="text-white" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-sm font-bold uppercase tracking-[0.16em] text-white sm:text-base">Leonida <span className="text-[#ff8eae]">Tracker</span></span>
            <span className="hidden text-[9px] uppercase tracking-[0.24em] text-white/35 sm:block">Your story. Your checklist.</span>
          </span>
        </a>

        <div className="hidden min-w-[190px] flex-1 items-center gap-3 sm:flex sm:max-w-[250px]">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">
              <span>Story progress</span><span className="text-[#ff9bb5]">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#ffb36e] via-[#ff6e9c] to-[#9a83ff] shadow-[0_0_12px_rgba(255,110,156,.45)] transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button onClick={handleShare} className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-white/60 transition hover:border-[#ff8eae]/35 hover:bg-[#ff8eae]/10 hover:text-white" title="Copy profile link">
            <Share2 size={14} /><span className="hidden sm:inline">Share profile</span>
          </button>
          {avatar && <Image src={avatar} alt={username} width={32} height={32} className="rounded-full border border-white/20 object-cover" />}
          <span className="hidden max-w-[120px] truncate text-xs font-medium text-white/75 md:block">{username}</span>
          <button onClick={onLogout} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/45 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-200" title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
