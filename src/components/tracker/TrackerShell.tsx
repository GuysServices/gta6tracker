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
import AdminDashboard from './AdminDashboard'
import CompletionCenter from './CompletionCenter'
import CommunityHub from './CommunityHub'
import CommunitySubmissionForm from './CommunitySubmissionForm'
import { Map, ListChecks, BookOpen, Home, Users, Zap, Globe, ShieldCheck, CheckCircle2, Trophy, MapPin } from 'lucide-react'
import clsx from 'clsx'

type Tab = 'missions' | 'world' | 'chapters' | 'properties' | 'fences' | 'cheats' | 'leonida' | 'completion' | 'community' | 'submit' | 'admin'

interface Props {
  user: User
  isAdmin: boolean
  chapters: Chapter[]
  initialProgress: UserProgress[]
  globalStats: { mission_id: string; completed_count: number }[]
  completedCount: number
  totalMissions: number
  adminUsers: { id: string; username: string; avatar_url: string | null; created_at: string; completed: number; totalProgress: number; lastActive: string | null }[]
  communityPlayers: { id: string; username: string; avatar_url: string | null; completed: number; lastActive: string | null }[]
  adminLocations: { id: number; name: string; area: string; categoryLabel: string }[]
}

export default function TrackerShell({
  user,
  isAdmin,
  chapters,
  initialProgress,
  globalStats,
  completedCount: initialCompleted,
  totalMissions,
  adminUsers,
  communityPlayers,
  adminLocations,
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
        <div className="mx-auto flex w-full max-w-5xl overflow-x-auto px-4 sm:px-6">
          {([
            { id: 'missions' as Tab, label: 'Missions',     icon: ListChecks },
            { id: 'world'    as Tab, label: 'Car Finder',   icon: Map },
            { id: 'leonida'  as Tab, label: 'Leonida Map',  icon: Globe },
            { id: 'completion' as Tab, label: '100% Completion', icon: CheckCircle2 },
            { id: 'community' as Tab, label: 'Community', icon: Trophy },
            { id: 'submit' as Tab, label: 'Submit Discovery', icon: MapPin },
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
                'flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition',
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
        <AdminDashboard
          users={adminUsers}
          chapters={chapters}
          locations={adminLocations}
          totalCompletions={globalStats.reduce((sum, item) => sum + item.completed_count, 0)}
        />
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
      ) : activeTab === 'completion' ? (
        <CompletionCenter />
      ) : activeTab === 'community' ? (
        <CommunityHub players={communityPlayers} chapters={chapters} globalStats={globalStats} />
      ) : activeTab === 'submit' ? (
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-7 sm:px-6">
          <div className="mb-5"><p className="mb-1 text-[10px] font-bold uppercase tracking-[.22em] text-[#ff9bb5]">Help expand the map</p><h2 className="text-2xl font-bold">Submit a Community Discovery</h2><p className="mt-1 text-sm text-white/45">Share a location, vehicle, collectible, or other discovery. Submissions are reviewed before being added to the map.</p></div>
          <CommunitySubmissionForm />
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
