'use client'

import { Chapter } from '@/lib/missions'
import { UserProgress, MissionStatus } from '@/types'
import { ChevronDown, CheckCircle2 } from 'lucide-react'
import MissionRow from './MissionRow'
import clsx from 'clsx'

interface Props {
  chapter: Chapter
  progress: Record<string, UserProgress>
  globalMap: Record<string, number>
  saving: string | null
  expanded: boolean
  onToggle: () => void
  onUpdate: (missionId: string, status: MissionStatus, note?: string) => Promise<void>
}

export default function ChapterCard({
  chapter, progress, globalMap, saving, expanded, onToggle, onUpdate,
}: Props) {
  const total = chapter.missions.length
  const completed = chapter.missions.filter(m => progress[m.id]?.status === 'completed').length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const full = pct === 100

  const protagonistColor = {
    lucia: 'border-[#ff79a8] text-[#ff9bb5]',
    jason: 'border-[#72dce8] text-[#8ce7ee]',
    both: 'border-[#ffd27a] text-[#ffdc9b]',
  }[chapter.protagonist]
  const protagonistLabel = { lucia: 'Lucia', jason: 'Jason', both: 'Lucia + Jason' }[chapter.protagonist]

  return (
    <article className={clsx(
      'group overflow-hidden rounded-2xl border bg-[#11121d]/90 shadow-[0_12px_45px_rgba(0,0,0,.14)] transition duration-300',
      full ? 'border-[#75dfe5]/30 shadow-[0_0_30px_rgba(117,223,229,.06)]' : 'border-white/[0.085] hover:border-white/[0.16]',
    )}>
      <button onClick={onToggle} aria-expanded={expanded} className="flex w-full items-center gap-3 px-3.5 py-4 text-left transition hover:bg-white/[0.035] sm:gap-4 sm:px-5">
        <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-l-[3px] bg-gradient-to-br from-white/[0.07] to-white/[0.015] font-display text-xl font-bold shadow-inner sm:h-12 sm:w-12', protagonistColor)}>
          {String(chapter.number).padStart(2, '0')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="font-display text-lg font-bold tracking-wide text-white sm:text-xl">{chapter.name}</h2>
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/40">{protagonistLabel}</span>
          </div>
          <p className="mt-1 truncate text-xs text-white/40">{chapter.description}</p>
        </div>
        <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
          <span className={clsx('font-display text-lg font-bold tabular-nums', full ? 'text-[#8ce7ee]' : 'text-white/80')}>{completed}<span className="text-white/30">/{total}</span></span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#ffb36e] to-[#ff6e9c] transition-all duration-500" style={{ width: `${pct}%` }} /></div>
        </div>
        {full && <CheckCircle2 size={17} className="shrink-0 text-[#8ce7ee] sm:hidden" />}
        {!full && <span className="shrink-0 text-[10px] font-semibold tabular-nums text-white/40 sm:hidden">{pct}%</span>}
        <ChevronDown size={17} className={clsx('shrink-0 text-white/35 transition-transform duration-300', expanded && 'rotate-180 text-[#ff9bb5]')} />
      </button>
      {expanded && (
        <div className="border-t border-white/[0.08] bg-black/15">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5 sm:px-5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35">Mission list</span>
            <span className="text-[9px] uppercase tracking-[0.14em] text-white/30">{total} objectives</span>
          </div>
          <div className="divide-y divide-white/[0.055]">
            {chapter.missions.map(mission => (
              <MissionRow key={mission.id} mission={mission} progress={progress[mission.id]} globalCount={globalMap[mission.id] ?? 0} saving={saving === mission.id} onUpdate={onUpdate} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
