'use client'

import { useState, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { Chapter } from '@/lib/missions'
import { UserProgress, MissionStatus } from '@/types'
import { createClient } from '@/lib/supabase'
import ChapterCard from './ChapterCard'
import TopBar from './TopBar'
import StatsBar from './StatsBar'
import WorldTab from './WorldTab'
import { Map, ListChecks } from 'lucide-react'
import clsx from 'clsx'

type Tab = 'missions' | 'world'

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('missions')

  const supabase = createClient()

  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length

  const showError = useCallback((msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(null), 6000)
  }, [])

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

      const payload = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))

      if (!res.ok) {
        if (res.status === 401) {
          showError('Session expired — reloading…')
          setTimeout(() => window.location.reload(), 1500)
          return
        }
        const msg = payload?.error ?? `Server error (${res.status})`
        console.error('[TrackerShell] updateMission failed:', msg)
        showError(`Couldn't save — ${msg}`)
        return
      }

      if (!payload?.data) {
        console.error('[TrackerShell] updateMission: ok response but no data', payload)
        showError('Save may have failed — no data returned. Try refreshing.')
        return
      }

      setProgress(prev => ({ ...prev, [missionId]: payload.data }))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[TrackerShell] updateMission network error:', msg)
      showError(`Network error — check your connection. (${msg})`)
    } finally {
      setSaving(null)
    }
  }, [showError])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const globalMap: Record<string, number> = {}
  for (const g of globalStats) globalMap[g.mission_id] = g.completed_count

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#080910] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,105,139,.11),transparent_55%),radial-gradient(ellipse_at_100%_25%,rgba(104,91,214,.08),transparent_38%)]"
      />

      {/* Error banner */}
      {errorMsg && (
        <div
          role="alert"
          className="relative z-50 flex items-center justify-between gap-3 border-b border-rose-400/20 bg-rose-900/40 px-5 py-3 text-sm text-rose-200 backdrop-blur-sm"
        >
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="shrink-0 text-rose-300/60 transition hover:text-rose-200"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

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

      {/* Tab switcher */}
      <div className="relative z-10 border-b border-white/[0.08] bg-[#0a0b14]">
        <div className="mx-auto flex max-w-5xl px-4 sm:px-6">
          {(
            [
              { id: 'missions' as Tab, label: 'Missions', icon: ListChecks },
              { id: 'world'    as Tab, label: 'World',    icon: Map },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition',
                activeTab === id
                  ? 'border-[#ff79a8] text-white'
                  : 'border-transparent text-white/35 hover:text-white/60',
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'missions' ? (
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-7 sm:px-6 sm:py-9">
          {chapters.map(chapter => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              progress={progress}
              globalMap={globalMap}
              saving={saving}
              expanded={expandedChapter === chapter.id}
              onToggle={() =>
                setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)
              }
              onUpdate={updateMission}
            />
          ))}
        </div>
      ) : (
        <div className="relative z-10 w-full">
          <WorldTab />
        </div>
      )}

      <footer className="relative z-10 mt-auto border-t border-white/[0.08] bg-black/20 px-4 py-6 text-center text-[9px] uppercase tracking-[0.18em] text-white/25">
        Leonida Tracker · Independent fan-made project · Not affiliated with Rockstar Games
      </footer>
    </div>
  )
}
