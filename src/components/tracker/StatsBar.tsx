'use client'

import { Chapter } from '@/lib/missions'
import { UserProgress } from '@/types'
import { Check, CircleDashed } from 'lucide-react'

interface Props {
  chapters: Chapter[]
  progress: Record<string, UserProgress>
  totalMissions: number
  completedCount: number
}

export default function StatsBar({ chapters, progress, totalMissions, completedCount }: Props) {
  const skipped = Object.values(progress).filter(p => p.status === 'skipped').length
  const failed = Object.values(progress).filter(p => p.status === 'failed').length
  const remaining = Math.max(0, totalMissions - completedCount - skipped - failed)
  const pct = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0

  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#0d0e18]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(255,105,139,.10),transparent_38%),radial-gradient(ellipse_at_90%_100%,rgba(91,177,215,.08),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-7 sm:py-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff9bb5]">Your Leonida story</p>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">Mission control</h1>
            <p className="mt-1 text-xs text-white/40">Every job. Every choice. Your own record.</p>
          </div>
          <div className="flex flex-wrap items-end gap-5 sm:gap-7">
            <div><div className="font-display text-2xl font-bold text-white">{completedCount}<span className="ml-1 text-sm font-medium text-white/35">/ {totalMissions}</span></div><div className="text-[9px] uppercase tracking-[0.2em] text-white/35">Completed</div></div>
            <div className="hidden h-9 w-px bg-white/10 sm:block" />
            <div><div className="font-display text-2xl font-bold text-[#ffd27a]">{skipped}</div><div className="text-[9px] uppercase tracking-[0.2em] text-white/35">Skipped</div></div>
            <div><div className="font-display text-2xl font-bold text-[#ff8eae]">{failed}</div><div className="text-[9px] uppercase tracking-[0.2em] text-white/35">Failed</div></div>
            <div><div className="font-display text-2xl font-bold text-[#8edfe4]">{pct}%</div><div className="text-[9px] uppercase tracking-[0.2em] text-white/35">Story progress</div></div>
          </div>
        </div>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#ffb36e] via-[#ff6e9c] to-[#9b83ff] shadow-[0_0_18px_rgba(255,110,156,.35)] transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {chapters.map(ch => {
            const total = ch.missions.length
            const done = ch.missions.filter(m => progress[m.id]?.status === 'completed').length
            const cpct = total > 0 ? Math.round((done / total) * 100) : 0
            const full = cpct === 100
            return (
              <div key={ch.id} className="group min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-2.5 transition hover:border-[#ff8eae]/25 hover:bg-white/[0.045] sm:p-3">
                <div className="mb-2 flex items-center justify-between gap-1">
                  <span className={`font-display text-lg font-bold ${full ? 'text-[#8edfe4]' : 'text-white/80'}`}>0{ch.number}</span>
                  {full ? <Check size={13} className="text-[#8edfe4]" /> : <CircleDashed size={13} className="text-white/25" />}
                </div>
                <div className="mb-2 hidden truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45 sm:block">{ch.name}</div>
                <div className="h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#ffb36e] to-[#ff6e9c] transition-all duration-500" style={{ width: `${cpct}%` }} /></div>
                <div className="mt-1.5 text-[9px] tabular-nums text-white/35">{done}/{total} <span className="hidden sm:inline">complete</span></div>
              </div>
            )
          })}
        </div>
        <p className="sr-only">{remaining} missions remaining. {failed} failed.</p>
      </div>
    </section>
  )
}
