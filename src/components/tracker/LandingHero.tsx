'use client'

import { createClient } from '@/lib/supabase'
import { Users, Map, Trophy } from 'lucide-react'

interface Props {
  totalMissions: number
  globalStats: { mission_id: string; completed_count: number }[]
}

export default function LandingHero({ totalMissions, globalStats }: Props) {
  const supabase = createClient()
  const totalCompletions = globalStats.reduce((a, b) => a + b.completed_count, 0)

  const handleLogin = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="scanline min-h-screen flex flex-col">
      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-24 text-center">
        {/* Title */}
        <div className="mb-3 text-vc-cyan/60 font-display text-sm tracking-[0.3em] uppercase">
          Leonida Progress
        </div>
        <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight mb-2">
          <span className="text-vc-bright glow-cyan">GTA VI</span>
        </h1>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-vc-pink glow-pink mb-6">
          Mission Tracker
        </h2>
        <p className="text-vc-muted max-w-md mb-10 text-balance leading-relaxed">
          Check off missions, track chapters, leave notes. Your progress saved. See how the community is moving through Leonida.
        </p>

        {/* Stats row */}
        <div className="flex gap-8 mb-12 text-center">
          <div>
            <div className="font-display text-3xl font-bold text-vc-cyan glow-cyan">{totalMissions}</div>
            <div className="text-vc-muted text-xs tracking-wider mt-1">MISSIONS</div>
          </div>
          <div className="w-px bg-vc-border" />
          <div>
            <div className="font-display text-3xl font-bold text-vc-gold glow-gold">5</div>
            <div className="text-vc-muted text-xs tracking-wider mt-1">CHAPTERS</div>
          </div>
          <div className="w-px bg-vc-border" />
          <div>
            <div className="font-display text-3xl font-bold text-vc-pink glow-pink">{totalCompletions.toLocaleString()}</div>
            <div className="text-vc-muted text-xs tracking-wider mt-1">COMPLETIONS</div>
          </div>
        </div>

        {/* Login buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* GitHub */}
          <button
            onClick={() => handleLogin('github')}
            className="px-7 py-3.5 bg-vc-panel border border-vc-border text-vc-bright font-display tracking-wider hover:border-vc-cyan/50 hover:text-vc-cyan transition-all duration-200 flex items-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>

          {/* Google */}
          <button
            onClick={() => handleLogin('google')}
            className="px-7 py-3.5 bg-vc-cyan/10 border border-vc-cyan/40 text-vc-cyan font-display tracking-wider hover:bg-vc-cyan/20 hover:border-vc-cyan transition-all duration-200 flex items-center gap-3 border-glow-cyan"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="text-vc-muted/50 text-xs">Free. No spam. Progress saved to your account.</p>
      </div>

      {/* Features row */}
      <div className="relative z-10 border-t border-vc-border">
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Map, color: 'text-vc-cyan', title: 'Full Chapter Map', body: 'Every chapter and mission, laid out. Main, side, heist, strangers.' },
            { icon: Trophy, color: 'text-vc-gold', title: 'Your Progress', body: 'Check off missions, mark failures, leave notes for each one.' },
            { icon: Users, color: 'text-vc-pink', title: 'Community Stats', body: 'See which missions the world is struggling with and which are cleared.' },
          ].map(({ icon: Icon, color, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon className={`${color} shrink-0 mt-0.5`} size={20} />
              <div>
                <div className="font-display font-semibold text-vc-bright mb-1">{title}</div>
                <div className="text-vc-muted text-sm leading-relaxed">{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
