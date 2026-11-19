'use client'

import { Chapter } from '@/lib/missions'
import { UserProgress, MissionStatus } from '@/types'
import { ChevronDown } from 'lucide-react'
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
  const total     = chapter.missions.length
  const completed = chapter.missions.filter(m => progress[m.id]?.status === 'completed').length
  const pct       = Math.round((completed / total) * 100)
  const full      = pct === 100

  const protagonistColor = {
    lucia: 'border-vc-pink',
    jason: 'border-vc-cyan',
    both:  'border-vc-gold',
  }[chapter.protagonist]

  const protagonistLabel = {
    lucia: 'Lucia',
    jason: 'Jason',
    both:  'Both',
  }[chapter.protagonist]

  return (
    <div className={clsx(
      'border border-vc-border bg-vc-panel rounded transition-all duration-200',
      full && 'border-vc-cyan/30',
    )}>
      {/* Chapter header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-vc-border/20 transition-colors"
      >
        {/* Number */}
        <div className={clsx(
          'shrink-0 w-10 h-10 rounded border-l-2 flex items-center justify-center font-display font-bold text-xl bg-vc-black',
          protagonistColor,
        )}>
          {chapter.number}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-display font-semibold text-vc-bright text-lg leading-tight">
              {chapter.name}
            </span>
            <span className="text-vc-muted/50 text-xs font-display tracking-wider">{protagonistLabel}</span>
          </div>
          <div className="text-vc-muted text-sm mt-0.5 truncate">{chapter.description}</div>
        </div>

        {/* Progress */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className={clsx(
            'font-display font-bold text-lg',
            full ? 'text-vc-cyan glow-cyan' : 'text-vc-text',
          )}>
            {completed}/{total}
          </span>
          <div className="w-20 h-1 bg-vc-border rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-500',
                full ? 'bg-vc-cyan' : 'bg-gradient-to-r from-vc-cyan/60 to-vc-pink/60',
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <ChevronDown
          size={16}
          className={clsx(
            'shrink-0 text-vc-muted transition-transform duration-200',
            expanded && 'rotate-180',
          )}
        />
      </button>

      {/* Mission list */}
      {expanded && (
        <div className="border-t border-vc-border divide-y divide-vc-border/40">
          {chapter.missions.map(mission => (
            <MissionRow
              key={mission.id}
              mission={mission}
              progress={progress[mission.id]}
              globalCount={globalMap[mission.id] ?? 0}
              saving={saving === mission.id}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
