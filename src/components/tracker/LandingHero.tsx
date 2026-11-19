'use client'

import { createClient } from '@/lib/supabase'
import { Users, Map, Trophy, CheckCircle2, StickyNote, BarChart3 } from 'lucide-react'

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
    <div className="min-h-screen bg-vc-black flex flex-col">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(255,45,120,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '-5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(123,47,255,0.04) 0%, transparent 70%)',
        }} />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Nav bar */}
      <nav className="relative z-10 border-b border-vc-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ff2d78, #7b2fff)' }}>
              <span className="text-white font-display font-bold text-xs">VI</span>
            </div>
            <span className="font-display font-semibold text-vc-bright tracking-wide">Leonida Tracker</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-vc-muted">
            <span className="text-vc-cyan/70 font-display text-xs tracking-widest">BETA</span>
          </div>
        </div>
      </nav>

      {/* Hero — split layout */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full py-16 md:py-24 grid md:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-vc-pink/30 bg-vc-pink/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-vc-pink animate-pulse" />
              <span className="text-vc-pink text-xs font-display tracking-widest">GTA VI · LEONIDA</span>
            </div>

            <h1 className="font-display font-bold leading-none mb-6" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
              <span className="block text-vc-bright">Track Every</span>
              <span className="block" style={{
                background: 'linear-gradient(90deg, #ff2d78, #7b2fff, #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Mission.</span>
            </h1>

            <p className="text-vc-muted leading-relaxed mb-10 max-w-sm text-base">
              Your complete GTA VI progress tracker. Every chapter, every mission — checked off, noted, and compared against the community.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-3 mb-10">
              {[
                { icon: CheckCircle2, color: '#00d4ff', text: 'Mark missions complete, failed, or skipped' },
                { icon: StickyNote,   color: '#ffc72c', text: 'Add personal notes to any mission' },
                { icon: BarChart3,    color: '#ff2d78', text: 'See real-time global completion stats' },
              ].map(({ icon: Icon, color, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={15} style={{ color, flexShrink: 0 }} />
                  <span className="text-vc-muted text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex gap-8">
              <div>
                <div className="font-display font-bold text-2xl text-vc-bright">{totalMissions}</div>
                <div className="text-vc-muted/50 text-xs mt-0.5">missions</div>
              </div>
              <div className="w-px bg-vc-border" />
              <div>
                <div className="font-display font-bold text-2xl text-vc-bright">5</div>
                <div className="text-vc-muted/50 text-xs mt-0.5">chapters</div>
              </div>
              <div className="w-px bg-vc-border" />
              <div>
                <div className="font-display font-bold text-2xl text-vc-bright">{totalCompletions.toLocaleString()}</div>
                <div className="text-vc-muted/50 text-xs mt-0.5">tracked</div>
              </div>
            </div>
          </div>

          {/* Right — login card */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-sm">
              <div
                className="rounded-2xl p-8 border border-vc-border"
                style={{ background: 'rgba(13,13,26,0.9)', backdropFilter: 'blur(20px)' }}
              >
                {/* Card header */}
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(123,47,255,0.2))', border: '1px solid rgba(255,45,120,0.2)' }}>
                    <span className="font-display font-bold text-xl" style={{
                      background: 'linear-gradient(135deg, #ff2d78, #7b2fff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>VI</span>
                  </div>
                  <h2 className="font-display font-semibold text-vc-bright text-xl mb-1">Sign in to track</h2>
                  <p className="text-vc-muted text-sm">Your progress syncs across devices</p>
                </div>

                {/* Login buttons */}
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    onClick={() => handleLogin('github')}
                    className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl font-display text-sm tracking-wide transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f0f0ff',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </button>

                  <button
                    onClick={() => handleLogin('google')}
                    className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl font-display text-sm tracking-wide transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f0f0ff',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-vc-border" />
                  <span className="text-vc-muted/40 text-xs">free forever</span>
                  <div className="flex-1 h-px bg-vc-border" />
                </div>

                {/* Trust line */}
                <p className="text-center text-vc-muted/40 text-xs leading-relaxed">
                  No email required. Progress saved instantly.<br />Share your profile with a link.
                </p>
              </div>

              {/* Below card */}
              <p className="text-center text-vc-muted/30 text-xs mt-4">
                Not affiliated with Rockstar Games
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom feature strip */}
      <div className="relative z-10 border-t border-vc-border/50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Map,
              color: '#00d4ff',
              title: 'Full Chapter Map',
              body: 'Every chapter and mission laid out — main story, side missions, heists, strangers.',
            },
            {
              icon: Trophy,
              color: '#ffc72c',
              title: 'Personal Progress',
              body: 'Mark each mission done, failed, or skipped. Add notes. See your completion rate.',
            },
            {
              icon: Users,
              color: '#ff2d78',
              title: 'Community Stats',
              body: 'Live data on how many players have completed each mission. See where people are struggling.',
            },
          ].map(({ icon: Icon, color, title, body }) => (
            <div key={title} className="flex gap-4">
              <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <div className="font-display font-semibold text-vc-bright mb-1 text-sm">{title}</div>
                <div className="text-vc-muted text-sm leading-relaxed">{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
