import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CHAPTERS, getTotalMissions } from '@/lib/missions'
import { UserProgress } from '@/types'
import TrackerShell from '@/components/tracker/TrackerShell'
import LandingHero from '@/components/tracker/LandingHero'

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let progress: UserProgress[] = []
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

  const totalMissions = getTotalMissions()
  // Server-only owner allowlist; this email is never sent to the browser.
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const isAdmin = Boolean(user?.email && configuredAdminEmail && user.email.toLowerCase() === configuredAdminEmail)
  const completedCount = progress.filter(p => p.status === 'completed').length

  return (
    <main className="min-h-screen bg-vc-black">
      {!user ? (
        <LandingHero totalMissions={totalMissions} globalStats={globalStats} />
      ) : (
        <TrackerShell
          user={user}
          isAdmin={isAdmin}
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
