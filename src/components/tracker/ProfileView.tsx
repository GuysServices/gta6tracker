import { Chapter } from '@/lib/missions'
import { UserProgress, Profile } from '@/types'
import { Check, X, SkipForward } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

interface Props {
  profile: Profile
  chapters: Chapter[]
  progress: UserProgress[]
  completed: number
  totalMissions: number
}

export default function ProfileView({ profile, chapters, progress, completed, totalMissions }: Props) {
  const progressMap: Record<string, UserProgress> = {}
  for (const p of progress) progressMap[p.mission_id] = p

  const pct = Math.round((completed / totalMissions) * 100)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <Link href="/" className="text-vc-muted/50 hover:text-vc-cyan text-sm transition-colors mb-8 inline-block">
        ← Leonida Tracker
      </Link>

      {/* Profile header */}
      <div className="flex items-center gap-5 mb-8 p-5 border border-vc-border bg-vc-panel rounded">
        {profile.avatar_url && (
          <Image
            src={profile.avatar_url}
            alt={profile.username}
            width={56}
            height={56}
            className="rounded-full border border-vc-border"
          />
        )}
        <div>
          <h1 className="font-display font-bold text-2xl text-vc-bright">{profile.username}</h1>
          <p className="text-vc-muted text-sm mt-0.5">Leonida Progress</p>
        </div>
        <div className="ml-auto text-right">
          <div className="font-display font-bold text-3xl text-vc-cyan glow-cyan">{pct}%</div>
          <div className="text-vc-muted text-xs">{completed}/{totalMissions} missions</div>
        </div>
      </div>

      {/* Chapter breakdown */}
      <div className="flex flex-col gap-3">
        {chapters.map(ch => {
          const total = ch.missions.length
          const done  = ch.missions.filter(m => progressMap[m.id]?.status === 'completed').length
          const cpct  = Math.round((done / total) * 100)

          return (
            <div key={ch.id} className="border border-vc-border bg-vc-panel rounded overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="font-display font-bold text-vc-muted/60 w-6">{ch.number}</span>
                <span className="font-display font-semibold text-vc-bright flex-1">{ch.name}</span>
                <span className="font-display text-sm text-vc-muted">{done}/{total}</span>
                <div className="w-16 h-1 bg-vc-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-vc-cyan to-vc-pink"
                    style={{ width: `${cpct}%` }}
                  />
                </div>
              </div>
              <div className="border-t border-vc-border/40 px-4 py-2 flex flex-wrap gap-1">
                {ch.missions.map(m => {
                  const s = progressMap[m.id]?.status ?? 'incomplete'
                  return (
                    <div
                      key={m.id}
                      title={`${m.name} — ${s}`}
                      className={clsx(
                        'w-6 h-6 rounded flex items-center justify-center text-xs',
                        s === 'completed' ? 'bg-vc-cyan/20 text-vc-cyan' :
                        s === 'failed'    ? 'bg-vc-pink/20 text-vc-pink' :
                        s === 'skipped'   ? 'bg-vc-gold/20 text-vc-gold' :
                                            'bg-vc-border/40 text-vc-muted/30',
                      )}
                    >
                      {s === 'completed' ? <Check size={10} /> :
                       s === 'failed'    ? <X size={10} /> :
                       s === 'skipped'   ? <SkipForward size={10} /> :
                       <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
