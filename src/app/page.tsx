import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CHAPTERS, getTotalMissions } from '@/lib/missions'
import { UserProgress } from '@/types'
import TrackerShell from '@/components/tracker/TrackerShell'
import LandingHero from '@/components/tracker/LandingHero'
import { GTA6_LOCATIONS } from '@/lib/gta6route-locations'

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const isAdmin = Boolean(user?.email && configuredAdminEmail && user.email.toLowerCase() === configuredAdminEmail)

  let progress: UserProgress[] = []
  let adminUsers: { id: string; username: string; avatar_url: string | null; created_at: string; completed: number; totalProgress: number; lastActive: string | null }[] = []
  let globalStats: { mission_id: string; completed_count: number }[] = []

  if (user) {
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
    progress = data ?? []
  }

  // Global completion stats (public, no auth needed)
  const { data: statsData } = await supabase
    .from('user_progress')
    .select('mission_id')
    .eq('status', 'completed')

  if (statsData) {
    const counts: Record<string, number> = {}
    for (const row of statsData) {
      counts[row.mission_id] = (counts[row.mission_id] ?? 0) + 1
    }
    globalStats = Object.entries(counts).map(([mission_id, completed_count]) => ({
      mission_id,
      completed_count,
    }))
  }

  if (isAdmin) {
    const [{ data: profiles }, { data: allProgress }] = await Promise.all([
      supabase.from('profiles').select('id, username, avatar_url, created_at').order('created_at', { ascending: false }),
      supabase.from('user_progress').select('user_id, status, updated_at'),
    ])
    const byUser = new Map<string, { completed: number; totalProgress: number; lastActive: string | null }>()
    for (const row of allProgress ?? []) {
      const current = byUser.get(row.user_id) ?? { completed: 0, totalProgress: 0, lastActive: null }
      current.totalProgress += 1
      if (row.status === 'completed') current.completed += 1
      if (!current.lastActive || row.updated_at > current.lastActive) current.lastActive = row.updated_at
      byUser.set(row.user_id, current)
    }
    adminUsers = (profiles ?? []).map(profile => ({
      ...profile,
      ...byUser.get(profile.id) ?? { completed: 0, totalProgress: 0, lastActive: null },
    }))
  }

  const totalMissions = getTotalMissions()
  const completedCount = progress.filter(p => p.status === 'completed').length

  return (
    <main className="min-h-screen bg-vc-black">
      {!user ? (
        <LandingHero totalMissions={totalMissions} globalStats={globalStats} />
      ) : (
        <TrackerShell
          user={user}
          isAdmin={isAdmin}
          adminUsers={adminUsers}
          adminLocations={GTA6_LOCATIONS.map(({ id, name, area, categoryLabel }) => ({ id, name, area, categoryLabel }))}
          chapters={CHAPTERS}
          initialProgress={progress}
          globalStats={globalStats}
          completedCount={completedCount}
          totalMissions={totalMissions}
        />
      )}
    </main>
  )
}
