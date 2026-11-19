'use client'

import { createClient } from '@/lib/supabase'
import { Users, Map, Trophy, CheckCircle2, StickyNote, BarChart3, ArrowUpRight, Sparkles } from 'lucide-react'

interface Props {
  totalMissions: number
  globalStats: { mission_id: string; completed_count: number }[]
}

export default function LandingHero({ totalMissions, globalStats }: Props) {
  const supabase = createClient()
  const totalCompletions = globalStats.reduce((a, b) => a + b.completed_count, 0)

  // Keep the existing Supabase OAuth providers and callback route unchanged.
  const handleLogin = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const features = [
    { icon: CheckCircle2, color: '#71e4e8', text: 'Track completed, failed, and skipped missions' },
    { icon: StickyNote, color: '#ffd27a', text: 'Keep personal notes on every mission' },
    { icon: BarChart3, color: '#ff79ad', text: 'Compare your progress with the community' },
  ]

  const highlights = [
    {
      icon: Map,
      color: '#70dce7',
      eyebrow: 'THE WHOLE STORY',
      title: 'Every mission, in one place',
      body: 'Keep chapters, main missions, side missions, heists, and strangers organized as you play.',
    },
    {
      icon: Trophy,
      color: '#ffd27a',
      eyebrow: 'YOUR PLAYTHROUGH',
      title: 'Your progress, your way',
      body: 'Update mission statuses, add notes, and keep your personal run moving forward.',
    },
    {
      icon: Users,
      color: '#ff79ad',
      eyebrow: 'THE COMMUNITY',
      title: 'See how everyone is doing',
      body: 'Explore global completion activity and see which missions players are getting through.',
    },
  ]

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#080910] text-white">
      {/* Cinematic Vice City-inspired atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,16,0.18)_0%,rgba(8,9,16,0.28)_38%,#080910_78%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_22%,rgba(255,105,139,0.24),transparent_38%),radial-gradient(ellipse_at_85%_42%,rgba(104,91,214,0.18),transparent_32%),radial-gradient(ellipse_at_12%_55%,rgba(0,190,211,0.12),transparent_30%)]" />
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-pink-500/10 blur-[100px]" />
        <div className="absolute right-[-12rem] top-[28rem] h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.11]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '76px 76px', maskImage: 'linear-gradient(to bottom, black, transparent 78%)' }} />

        {/* Stylized sunset and distant skyline: original CSS/SVG artwork, no external assets required. */}
        <div className="absolute left-1/2 top-[5.5rem] h-[25rem] w-[25rem] -translate-x-1/2 rounded-full opacity-80 blur-[1px]" style={{ background: 'linear-gradient(180deg,#ffb36e 0%,#ff6d91 48%,#a34ca8 100%)', boxShadow: '0 0 100px rgba(255,91,135,.25)' }} />
        <div className="absolute left-1/2 top-[5.5rem] h-[25rem] w-[25rem] -translate-x-1/2 overflow-hidden rounded-full opacity-35">
          <div className="absolute inset-x-0 top-[58%] h-[3px] bg-[#171326]" />
          <div className="absolute inset-x-0 top-[64%] h-[7px] bg-[#171326]" />
          <div className="absolute inset-x-0 top-[73%] h-[4px] bg-[#171326]" />
          <div className="absolute inset-x-0 top-[82%] h-[8px] bg-[#171326]" />
        </div>
        <svg className="absolute inset-x-0 top-[17rem] h-[24rem] w-full opacity-70" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" fill="none">
          <path d="M0 220h58v-52h34v52h25v-92h42v92h30v-62h54v62h30v-128h54v128h29v-72h48v72h33v-105h55v105h36v-50h50v50h32v-145h60v145h33v-88h42v88h34v-116h56v116h29v-66h46v66h32v-140h60v140h35v-85h42v85h32v-112h56v112h35v-60h48v60h35v-96h54v96h32v-130h54v130h40v-75h48v75h35v-108h56v108h31v-65h43v65h40v-150h61v150h44v-78h48v78h34v-112h56v112h40v200H0V220Z" fill="#10101d" />
          <path d="M0 300h1440" stroke="#ff83a8" strokeOpacity=".45" />
          <path d="M0 330h1440" stroke="#65dbe4" strokeOpacity=".2" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#080910] via-[#080910]/90 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/[0.09] bg-[#080910]/45 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="group flex items-center gap-3" aria-label="Leonida Tracker home">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-[#ff9a76] via-[#f34f91] to-[#7254d8] shadow-[0_0_28px_rgba(244,79,145,.28)]">
              <span className="font-display text-sm font-black tracking-tight text-white">LT</span>
            </span>
            <span className="font-display text-sm font-bold uppercase tracking-[0.19em] text-white sm:text-base">Leonida <span className="text-[#ff8aa9]">Tracker</span></span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-[#ff8aa9]/25 bg-[#ff8aa9]/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ff9bb5] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff8aa9] shadow-[0_0_10px_#ff8aa9]" /> Beta
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">Unofficial fan project</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="top" className="relative z-10 mx-auto grid min-h-[690px] w-full max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-16 lg:py-24">
        <div className="relative max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/25 px-4 py-2 shadow-lg backdrop-blur-md">
            <Sparkles size={13} className="text-[#ffb27d]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75">Welcome to Leonida</span>
            <span className="h-1 w-1 rounded-full bg-[#ff8aa9]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#ff9bb5]">GTA VI</span>
          </div>

          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.42em] text-[#ffb17f] sm:text-xs">Your story. Your checklist.</p>
          <h1 className="max-w-3xl font-display text-[clamp(3.6rem,8vw,7.5rem)] font-black uppercase leading-[0.83] tracking-[-0.065em] text-white drop-shadow-[0_8px_35px_rgba(0,0,0,.3)]">
            Make every
            <span className="mt-3 block bg-gradient-to-r from-[#ffc078] via-[#ff709d] to-[#b58bff] bg-clip-text pb-3 text-transparent">mission count.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
            Your personal companion for the streets of Leonida. Track every mission, remember the details, and follow your progress from the first chapter to the last.
          </p>

          <div className="mt-9 flex flex-col gap-4">
            {features.map(({ icon: Icon, color, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/75">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06]" style={{ boxShadow: `0 0 18px ${color}18` }}>
                  <Icon size={15} style={{ color }} />
                </span>
                {text}
              </div>
            ))}
          </div>

          {/* Live totals */}
          <div className="mt-12 flex max-w-xl flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/15 pt-7">
            <div>
              <div className="font-display text-3xl font-bold tracking-tight text-white">{totalMissions.toLocaleString()}</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">Missions</div>
            </div>
            <div className="hidden h-10 w-px bg-white/15 sm:block" />
            <div>
              <div className="font-display text-3xl font-bold tracking-tight text-white">5</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">Chapters</div>
            </div>
            <div className="hidden h-10 w-px bg-white/15 sm:block" />
            <div>
              <div className="font-display text-3xl font-bold tracking-tight text-[#ff9bb5]">{totalCompletions.toLocaleString()}</div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">Community completions</div>
            </div>
          </div>
        </div>

        {/* Sign-in panel */}
        <div className="relative mx-auto w-full max-w-[430px] lg:ml-auto lg:mr-2">
          <div aria-hidden="true" className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#ff7b9e]/20 via-[#9b70ff]/10 to-[#54dce6]/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.65rem] border border-white/15 bg-[#11111b]/85 p-7 shadow-[0_30px_100px_rgba(0,0,0,.55)] backdrop-blur-2xl sm:p-9">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff9bb5] to-transparent" />
            <div className="mb-8 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Player access</span>
              <span className="rounded-full border border-[#75dfe5]/20 bg-[#75dfe5]/[0.08] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8de8ec]">Free account</span>
            </div>

            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ff8aa9]/25 bg-gradient-to-br from-[#ff9a76]/20 via-[#f34f91]/15 to-[#7254d8]/20 shadow-[0_0_35px_rgba(244,79,145,.12)]">
                <span className="font-display text-xl font-black tracking-tight text-[#ff9bb5]">LT</span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[1.7rem]">Pick up where you left off.</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">Sign in to save your missions and sync your progress across devices.</p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleLogin('google')}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-5 py-3.5 text-sm font-semibold text-[#17151c] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_10px_35px_rgba(255,255,255,.12)] focus:outline-none focus:ring-2 focus:ring-[#ff9bb5] focus:ring-offset-2 focus:ring-offset-[#11111b]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
                <ArrowUpRight size={15} className="ml-auto text-black/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleLogin('github')}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.055] px-5 py-3.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.10] focus:outline-none focus:ring-2 focus:ring-[#ff9bb5] focus:ring-offset-2 focus:ring-offset-[#11111b]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
                <ArrowUpRight size={15} className="ml-auto text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/30">Free forever</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#75dfe5]" />
              <p className="text-xs leading-5 text-white/45">No email form to fill out. Your progress is saved to your account and ready when you return.</p>
            </div>
          </div>
          <p className="mt-5 text-center text-[9px] uppercase tracking-[0.18em] text-white/30">Not affiliated with Rockstar Games</p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="relative z-10 border-t border-white/10 bg-[#090a12]/80">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff9bb5]">Built for your playthrough</p>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">Everything in its right place.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/40">One place to keep track of the details while you explore Leonida.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map(({ icon: Icon, color, eyebrow, title, body }, index) => (
              <article key={title} className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]">
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full opacity-[0.08] blur-2xl transition group-hover:opacity-20" style={{ background: color }} />
                <div className="relative flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border" style={{ color, borderColor: `${color}35`, background: `${color}12` }}>
                    <Icon size={19} />
                  </span>
                  <span className="font-display text-xs font-bold tracking-[0.2em] text-white/20">0{index + 1}</span>
                </div>
                <p className="relative mt-7 text-[9px] font-semibold uppercase tracking-[0.25em]" style={{ color }}>{eyebrow}</p>
                <h3 className="relative mt-2 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="relative mt-2 text-sm leading-6 text-white/45">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-6 text-center sm:flex-row sm:text-left">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">Leonida Tracker · An independent fan-made project</p>
            <p className="text-[10px] text-white/25">Track your journey, one mission at a time.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
