'use client'

import { useMemo } from 'react'
import { Award, Crown, Flame, Medal, Trophy, Users } from 'lucide-react'
import type { Chapter } from '@/lib/missions'

type Player = { id: string; username: string; avatar_url: string | null; completed: number; lastActive: string | null }
type Props = { players: Player[]; chapters: Chapter[]; globalStats: { mission_id: string; completed_count: number }[] }

function badgesFor(count: number) {
  return [
    ...(count >= 1 ? ['First Steps'] : []),
    ...(count >= 10 ? ['Getting Serious'] : []),
    ...(count >= 25 ? ['Dedicated'] : []),
    ...(count >= 50 ? ['Leonida Regular'] : []),
    ...(count >= 100 ? ['100 Club'] : []),
  ]
}

export default function CommunityHub({ players, chapters, globalStats }: Props) {
  const missions = useMemo(() => chapters.flatMap(chapter => chapter.missions), [chapters])
  const today = new Date().toISOString().slice(0, 10)
  const dailyMission = missions[(Math.floor(new Date(today).getTime() / 86400000) % Math.max(1, missions.length))]
  const stats = new Map(globalStats.map(item => [item.mission_id, item.completed_count]))
  const dailyCompletions = dailyMission ? stats.get(dailyMission.id) ?? 0 : 0
  const ranked = players.slice().sort((a, b) => b.completed - a.completed || a.username.localeCompare(b.username))
  const totalCompletions = players.reduce((sum, player) => sum + player.completed, 0)

  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-7 sm:px-6">
      <div className="mb-6"><p className="mb-1 text-[10px] font-bold uppercase tracking-[.22em] text-[#ff9bb5]">The Leonida community</p><h2 className="font-display text-3xl font-bold">Community Hub</h2><p className="mt-1 text-sm text-white/40">See player progress, earn milestone badges, and take on the daily mission.</p></div>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-4"><Users size={17} className="text-[#ff9bb5]"/><div className="mt-3 text-2xl font-bold">{players.length.toLocaleString()}</div><p className="text-[10px] uppercase tracking-wider text-white/35">Public players</p></div>
        <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-4"><Trophy size={17} className="text-[#ff9bb5]"/><div className="mt-3 text-2xl font-bold">{totalCompletions.toLocaleString()}</div><p className="text-[10px] uppercase tracking-wider text-white/35">Community mission clears</p></div>
        <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-4"><Award size={17} className="text-[#ff9bb5]"/><div className="mt-3 text-2xl font-bold">{ranked.filter(player=>player.completed>=10).length}</div><p className="text-[10px] uppercase tracking-wider text-white/35">Players with 10+ clears</p></div>
      </div>
      {dailyMission && <div className="mb-5 overflow-hidden rounded-2xl border border-[#ff79a8]/25 bg-gradient-to-br from-[#ff79a8]/10 to-[#11121d] p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#ffb4ca]"><Flame size={14}/> Daily mission · {today}</div>
        <h3 className="mt-2 font-display text-2xl font-bold">{dailyMission.name}</h3>
        <p className="mt-1 text-xs text-white/45">{chapters.find(chapter=>chapter.missions.some(m=>m.id===dailyMission.id))?.name} · {dailyMission.type}</p>
        <p className="mt-3 text-xs text-white/65">{dailyMission.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3"><span className="text-[10px] text-white/40">{dailyCompletions} community completions</span><span className="rounded-lg border border-[#ff79a8]/25 bg-[#ff79a8]/10 px-3 py-1.5 text-[10px] font-bold text-[#ffb4ca]">+250 XP challenge</span></div>
        <p className="mt-2 text-[9px] text-white/25">Daily challenge reward is a tracker milestone preview; XP rewards are not yet stored as a separate account balance.</p>
      </div>}
      <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-5">
        <div className="mb-4 flex items-center justify-between"><div><h3 className="font-display text-xl font-bold">Mission leaderboard</h3><p className="text-[10px] text-white/35">Ranked by completed missions</p></div><Crown size={19} className="text-[#ffcf70]"/></div>
        <div className="divide-y divide-white/[.06]">
          {ranked.slice(0,50).map((player,index)=>{
            const badges=badgesFor(player.completed)
            const xp=player.completed*100
            const level=Math.floor(xp/500)+1
            return <div key={player.id} className="flex items-center gap-3 py-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${index===0?'bg-[#ffcf70]/15 text-[#ffcf70]':index===1?'bg-white/10 text-white/70':index===2?'bg-orange-400/10 text-orange-200':'bg-white/[.04] text-white/35'}`}>{index+1}</div>
              {player.avatar_url ? <img src={player.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover"/> : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff79a8]/10 text-xs font-bold text-[#ffb4ca]">{player.username.slice(0,1).toUpperCase()}</div>}
              <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white">{player.username}</div><div className="mt-1 flex flex-wrap gap-1">{badges.length?badges.slice(-2).map(badge=><span key={badge} className="rounded bg-[#ff79a8]/10 px-1.5 py-0.5 text-[8px] text-[#ffb4ca]">{badge}</span>):<span className="text-[9px] text-white/25">New player</span>}</div></div>
              <div className="text-right"><div className="text-xs font-bold text-white">{player.completed} clears</div><div className="mt-1 text-[9px] text-white/35">Level {level} · {xp.toLocaleString()} XP</div></div>
            </div>
          })}
          {!ranked.length&&<p className="py-8 text-center text-xs text-white/35">No public player stats yet.</p>}
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-lg border border-white/[.07] bg-white/[.02] p-3 text-[10px] leading-4 text-white/35"><Medal size={13} className="mt-0.5 shrink-0 text-[#ffb4ca]"/> Badges and levels are calculated from saved mission completions. Public leaderboard displays usernames and completion totals only.</div>
    </section>
  )
}
