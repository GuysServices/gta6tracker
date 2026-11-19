'use client'

import { Chapter } from '@/lib/missions'
import { UserProgress } from '@/types'

interface Props {
  chapters: Chapter[]
  progress: Record<string, UserProgress>
  totalMissions: number
  completedCount: number
}

export default function StatsBar({ chapters, progress, totalMissions, completedCount }: Props) {
  const skipped  = Object.values(progress).filter(p => p.status === 'skipped').length
  const failed   = Object.values(progress).filter(p => p.status === 'failed').length

  return (
    <div className="border-b border-vc-border bg-vc-panel/50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Chapter dots */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {chapters.map(ch => {
            const total = ch.missions.length
            const done  = ch.missions.filter(m => progress[m.id]?.status === 'completed').length
            const pct   = Math.round((done / total) * 100)
            const full  = pct === 100

            return (
              <div key={ch.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center font-display font-bold text-sm border transition-all ${
                    full
                      ? 'bg-vc-cyan/20 border-vc-cyan text-vc-cyan'
                      : pct > 0
                      ? 'bg-vc-border border-vc-border text-vc-text'
                      : 'bg-transparent border-vc-border/40 text-vc-muted'
                  }`}
                >
                  {ch.number}
                </div>
                <div className="text-vc-muted/60 text-[10px] font-display">{pct}%</div>
              </div>
            )
          })}
        </div>

        {/* Summary stats */}
        <div className="flex gap-6 text-sm">
          <span className="text-vc-cyan font-display">{completedCount} <span className="text-vc-muted/60 font-normal text-xs">done</span></span>
          <span className="text-vc-gold font-display">{skipped} <span className="text-vc-muted/60 font-normal text-xs">skipped</span></span>
          <span className="text-vc-pink font-display">{failed} <span className="text-vc-muted/60 font-normal text-xs">failed</span></span>
          <span className="text-vc-muted font-display ml-auto">{totalMissions - completedCount - skipped - failed} remaining</span>
        </div>
      </div>
    </div>
  )
}
