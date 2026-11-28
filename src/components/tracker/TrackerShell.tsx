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
import ChapterGuide from './ChapterGuide'
import PropertyTracker from './PropertyTracker'
import FenceDirectory from './FenceDirectory'
import CheatCodes from './CheatCodes'
import MapTab from './MapTab'
import { Map, ListChecks, BookOpen, Home, Users, Zap, Globe, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'

type Tab = 'missions' | 'world' | 'chapters' | 'properties' | 'fences' | 'cheats' | 'leonida' | 'admin'

interface Props {
  user: User
  isAdmin: boolean
  chapters: Chapter[]
  initialProgress: UserProgress[]
  globalStats: { mission_id: string; completed_count: number }[]
  completedCount: number
  totalMissions: number
}

export default function TrackerShell({
  user,
  isAdmin,
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
    setTimeout(() => setErrorMsg(null), 7000)
  }, [])

  const updateMission = useCallback(async (
    missionId: string,
    status: MissionStatus,
    note?: string,
  ) => {
    if (saving) return

    // ── OPTIMISTIC UPDATE ─────────────────────────────────────────
    // Apply immediately so buttons feel instant. We'll roll back if
    // the server fails.
    const previous = progress[missionId]
    const optimistic: UserProgress = {
      user_id: user.id,
      mission_id: missionId,
      status,
      note: note ?? null,
      updated_at: new Date().toISOString(),
    }
    setProgress(prev => ({ ...prev, [missionId]: optimistic }))
    setSaving(missionId)

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'same-origin' is the default for same-origin fetches,
        // but being explicit ensures the session cookie is always included.
        credentials: 'same-origin',
        body: JSON.stringify({ mission_id: missionId, status, note }),
      })

      // Always parse the body — even error responses have a JSON payload.
      let payload: { data?: UserProgress; error?: string } = {}
      try { payload = await res.json() } catch { /* empty body */ }

      if (!res.ok) {
        // Roll back the optimistic update.
        setProgress(prev => {
          const next = { ...prev }
          if (previous) {
            next[missionId] = previous
          } else {
            delete next[missionId]
          }
          return next
        })

        if (res.status === 401) {
          showError('Session expired — please sign in again.')
          setTimeout(() => window.location.reload(), 2000)
          return
        }

        const msg = payload.error ?? `Server error (${res.status})`
        console.error('[TrackerShell] updateMission failed:', res.status, msg)
        showError(`Couldn't save "${missionId}" — ${msg}`)
        return
      }

      // Server confirmed — replace optimistic record with real one if returned.
      if (payload.data) {
        setProgress(prev => ({ ...prev, [missionId]: payload.data! }))
      }
      // If no data returned (synthetic response from route fallback) the
      // optimistic record stays — it's already correct.

    } catch (err) {
      // Network failure — roll back.
      setProgress(prev => {
        const next = { ...prev }
        if (previous) {
          next[missionId] = previous
        } else {
          delete next[missionId]
        }
        return next
      })
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[TrackerShell] updateMission network error:', msg)
      showError(`Network error — ${msg}`)
    } finally {
      setSaving(null)
    }
  }, [saving, progress, user.id, showError])

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

      {/* ── Error banner ──────────────────────────────────────────── */}
      {errorMsg && (
        <div
          role="alert"
          className="relative z-50 flex items-center justify-between gap-3 border-b border-rose-400/20 bg-rose-900/40 px-5 py-3 text-sm text-rose-200 backdrop-blur-sm"
        >
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="shrink-0 text-rose-300/60 transition hover:text-rose-200"
            aria-label="Dismiss"
          >✕</button>
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

      {/* ── Tab switcher ──────────────────────────────────────────── */}
      <div className="relative z-10 border-b border-white/[0.08] bg-[#0a0b14]">
        <div className="mx-auto flex max-w-5xl px-4 sm:px-6">
          {([
            { id: 'missions' as Tab, label: 'Missions',     icon: ListChecks },
            { id: 'world'    as Tab, label: 'Car Finder',   icon: Map },
            { id: 'leonida'  as Tab, label: 'Leonida Map',  icon: Globe },
            { id: 'chapters' as Tab, label: 'Chapter Guide',icon: BookOpen },
            { id: 'properties' as Tab, label: 'Properties', icon: Home },
            { id: 'fences'   as Tab, label: 'Fences',       icon: Users },
            { id: 'cheats'   as Tab, label: 'Cheats',       icon: Zap },
            ...(isAdmin ? [{ id: 'admin' as Tab, label: 'Admin', icon: ShieldCheck }] : []),
          ] as const).map(({ id, label, icon: Icon }) => (
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
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────────── */}
      {activeTab === 'admin' && isAdmin ? (
        <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-[#ff79a8]/20 bg-[#11121d]/90 shadow-[0_20px_70px_rgba(0,0,0,.25)]">
            <div className="border-b border-white/[0.08] bg-gradient-to-r from-[#ff79a8]/10 to-transparent px-6 py-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ff79a8]/25 bg-[#ff79a8]/10 text-[#ff9bb5]"><ShieldCheck size={21} /></span>
                <div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ff9bb5]">Owner controls</p><h1 className="mt-1 font-display text-2xl font-bold text-white">Admin Dashboard</h1></div>
              </div>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-5"><p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Tracked missions</p><p className="mt-2 font-display text-3xl font-bold text-white">{totalMissions.toLocaleString()}</p></div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-5"><p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Community completions</p><p className="mt-2 font-display text-3xl font-bold text-[#ff9bb5]">{globalStats.reduce((sum, item) => sum + item.completed_count, 0).toLocaleString()}</p></div>
            </div>
            <div className="mx-6 mb-6 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4 text-sm leading-6 text-white/65"><span className="font-semibold text-emerald-300">Owner access verified.</span> This tab is available only to the account matching the server-side ADMIN_EMAIL setting.</div>
          </div>
        </section>
      ) : activeTab === 'missions' ? (
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
      ) : activeTab === 'world' ? (
        <div className="relative z-10 w-full">
          <WorldTab />
        </div>
      ) : activeTab === 'leonida' ? (
        <div className="relative z-10 w-full">
          <MapTab />
        </div>
      ) : activeTab === 'chapters' ? (
        <div className="relative z-10 w-full">
          <ChapterGuide />
        </div>
      ) : activeTab === 'properties' ? (
        <div className="relative z-10 w-full">
          <PropertyTracker />
        </div>
      ) : activeTab === 'fences' ? (
        <div className="relative z-10 w-full">
          <FenceDirectory />
        </div>
      ) : (
        <div className="relative z-10 w-full">
          <CheatCodes />
        </div>
      )}

      <footer className="relative z-10 mt-auto border-t border-white/[0.08] bg-black/20 px-4 py-6 text-center text-[9px] uppercase tracking-[0.18em] text-white/25">
        Leonida Tracker · Independent fan-made project · Not affiliated with Rockstar Games
      </footer>
    </div>
  )
}
