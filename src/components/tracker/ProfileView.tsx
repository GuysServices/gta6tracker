import { Chapter } from '@/lib/missions'
import { UserProgress, Profile } from '@/types'
import { Check, X, SkipForward, ArrowLeft, Trophy, MapPinned } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

interface Props {
  profile: Profile
  chapters: Chapter[]
  progress: UserProgress[]
  completed: number
  totalMissions: number
}

export default function ProfileView({ profile, chapters, progress, completed, totalMissions }: Props) {
  const progressMap: Record<string, UserProgress> = {}
  for (const p of progress) progressMap[p.mission_id] = p
  const pct = totalMissions > 0 ? Math.round((completed / totalMissions) * 100) : 0
  const skipped = progress.filter(p => p.status === 'skipped').length
  const failed = progress.filter(p => p.status === 'failed').length

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080910] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,105,139,.16),transparent_42%),radial-gradient(ellipse_at_100%_45%,rgba(104,91,214,.10),transparent_35%)]" />
      <header className="relative border-b border-white/[0.08] bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-5xl items-center justify-between px-4 sm:px-7">
          <Link href="/" className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white/75 transition hover:text-white"><MapPinned size={17} className="text-[#ff9bb5]" /> Leonida <span className="text-[#ff9bb5]">Tracker</span></Link>
          <span className="text-[9px] uppercase tracking-[0.22em] text-white/30">Player profile</span>
        </div>
      </header>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-7 sm:py-12">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-xs font-medium text-white/40 transition hover:text-[#ff9bb5]"><ArrowLeft size={14} /> Back to tracker</Link>

        <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.10] bg-[#11121d]/90 p-5 shadow-[0_20px_70px_rgba(0,0,0,.24)] sm:p-8">
          <div aria-hidden="true" className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#f34f91]/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              {profile.avatar_url ? <Image src={profile.avatar_url} alt={profile.username} width={72} height={72} className="h-[72px] w-[72px] rounded-2xl border border-white/15 object-cover shadow-lg" /> : <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-[#ff9bb5]/20 bg-[#ff9bb5]/10 font-display text-2xl font-bold text-[#ff9bb5]">{profile.username.slice(0, 1).toUpperCase()}</div>}
              <div className="min-w-0">
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#ff9bb5]">Leonida resident</p>
                <h1 className="truncate font-display text-3xl font-bold tracking-wide text-white sm:text-4xl">{profile.username}</h1>
                <p className="mt-1 text-xs text-white/40">Public playthrough progress</p>
              </div>
            </div>
            <div className="sm:ml-auto sm:w-56">
              <div className="mb-2 flex items-end justify-between"><span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">Story completion</span><span className="font-display text-3xl font-bold text-[#ff9bb5]">{pct}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#ffb36e] via-[#ff6e9c] to-[#9b83ff]" style={{ width: `${pct}%` }} /></div>
              <p className="mt-2 text-right text-[10px] text-white/35">{completed} of {totalMissions} missions complete</p>
            </div>
          </div>
          <div className="relative mt-7 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-5">
            <div className="rounded-xl bg-white/[0.035] p-3"><div className="flex items-center gap-2 font-display text-xl font-bold text-[#8ce7ee]"><Trophy size={15} />{completed}</div><p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-white/35">Completed</p></div>
            <div className="rounded-xl bg-white/[0.035] p-3"><div className="font-display text-xl font-bold text-[#ffdc9b]">{skipped}</div><p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-white/35">Skipped</p></div>
            <div className="rounded-xl bg-white/[0.035] p-3"><div className="font-display text-xl font-bold text-[#ff9bb5]">{failed}</div><p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-white/35">Failed</p></div>
          </div>
        </section>

        <div className="mb-5 flex items-end justify-between gap-3">
          <div><p className="mb-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#ff9bb5]">Chapter breakdown</p><h2 className="font-display text-2xl font-bold text-white">The journey so far</h2></div>
          <span className="text-[10px] text-white/35">{chapters.length} chapters</span>
        </div>

        <div className="space-y-3">
          {chapters.map(ch => {
            const total = ch.missions.length
            const done = ch.missions.filter(m => progressMap[m.id]?.status === 'completed').length
            const cpct = total > 0 ? Math.round((done / total) * 100) : 0
            return (
              <section key={ch.id} className="overflow-hidden rounded-2xl border border-white/[0.085] bg-[#11121d]/80">
                <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
                  <span className="font-display text-lg font-bold text-[#ff9bb5]">{String(ch.number).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1 truncate font-display text-base font-semibold text-white">{ch.name}</span>
                  <span className="text-xs tabular-nums text-white/50">{done}/{total}</span>
                  <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-white/10 sm:block"><div className="h-full rounded-full bg-gradient-to-r from-[#ffb36e] to-[#ff6e9c]" style={{ width: `${cpct}%` }} /></div>
                  <span className="w-9 text-right text-[10px] text-white/35">{cpct}%</span>
                </div>
                <div className="flex flex-wrap gap-1.5 border-t border-white/[0.06] px-4 py-3 sm:px-5">
                  {ch.missions.map(m => {
                    const s = progressMap[m.id]?.status ?? 'incomplete'
                    return <div key={m.id} title={`${m.name} — ${s}`} className={clsx('flex h-7 w-7 items-center justify-center rounded-lg border text-[10px]', s === 'completed' ? 'border-[#72dce8]/20 bg-[#72dce8]/10 text-[#8ce7ee]' : s === 'failed' ? 'border-[#ff79a8]/20 bg-[#ff79a8]/10 text-[#ff9bb5]' : s === 'skipped' ? 'border-[#ffd27a]/20 bg-[#ffd27a]/10 text-[#ffdc9b]' : 'border-white/[0.06] bg-white/[0.025] text-white/20')}>
                      {s === 'completed' ? <Check size={12} /> : s === 'failed' ? <X size={12} /> : s === 'skipped' ? <SkipForward size={12} /> : <span className="h-1 w-1 rounded-full bg-current" />}
                    </div>
                  })}
                </div>
              </section>
            )
          })}
        </div>
        <p className="mt-10 text-center text-[9px] uppercase tracking-[0.18em] text-white/25">Independent fan-made project · Not affiliated with Rockstar Games</p>
      </div>
    </main>
  )
}
