'use client'

import { useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { Chapter } from '@/lib/missions'
import { UserProgress, MissionStatus } from '@/types'
import { createClient } from '@/lib/supabase'
import ChapterCard from './ChapterCard'
import TopBar from './TopBar'
import StatsBar from './StatsBar'

interface Props {
  user: User
  chapters: Chapter[]
  initialProgress: UserProgress[]
  globalStats: { mission_id: string; completed_count: number }[]
  completedCount: number
  totalMissions: number
}

export default function TrackerShell({
  user,
  chapters,
  initialProgress,
  globalStats,
  completedCount: initialCompleted,
  totalMissions,
}: Props) {
  const [progress, setProgress] = useState<Record<string, UserProgress>>(() => {
    const map: Record<string, UserProgress> = {}
    for (const p of initialProgress) map[p.mission_id] = p
    return map
  })
  const [saving, setSaving] = useState<string | null>(null)
  const [expandedChapter, setExpandedChapter] = useState<string | null>(chapters[0]?.id ?? null)

  const supabase = createClient()

  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length

  const updateMission = useCallback(async (
    missionId: string,
    status: MissionStatus,
    note?: string,
  ) => {
    setSaving(missionId)
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mission_id: missionId, status, note }),
      })
      if (res.ok) {
        const { data } = await res.json()
        setProgress(prev => ({ ...prev, [missionId]: data }))
      }
    } finally {
      setSaving(null)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const globalMap: Record<string, number> = {}
  for (const g of globalStats) globalMap[g.mission_id] = g.completed_count

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        user={user}
        completedCount={completedCount}
        totalMissions={totalMissions}
        onLogout={handleLogout}
      />

      <StatsBar
        chapters={chapters}
        progress={progress}
        totalMissions={totalMissions}
        completedCount={completedCount}
      />

      <div className="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-4">
        {chapters.map(chapter => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            progress={progress}
            globalMap={globalMap}
            saving={saving}
            expanded={expandedChapter === chapter.id}
            onToggle={() => setExpandedChapter(
              expandedChapter === chapter.id ? null : chapter.id
            )}
            onUpdate={updateMission}
          />
        ))}
      </div>

      <footer className="border-t border-vc-border mt-auto py-6 text-center text-vc-muted/40 text-xs">
        Not affiliated with Rockstar Games. Fan-made tracker.
      </footer>
    </div>
  )
}
