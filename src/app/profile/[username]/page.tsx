import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CHAPTERS, getTotalMissions } from '@/lib/missions'
import { notFound } from 'next/navigation'
import ProfileView from '@/components/tracker/ProfileView'

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.username}'s GTA VI Progress`,
    description: `See ${params.username}'s GTA VI mission tracker on Leonida Progress.`,
  }
}

export default async function ProfilePage({ params }: Props) {
  const supabase = createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) notFound()

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', profile.id)

  const totalMissions = getTotalMissions()
  const completed = (progress ?? []).filter(p => p.status === 'completed').length

  return (
    <main className="min-h-screen bg-vc-black">
      <ProfileView
        profile={profile}
        chapters={CHAPTERS}
        progress={progress ?? []}
        completed={completed}
        totalMissions={totalMissions}
      />
    </main>
  )
}
