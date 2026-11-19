'use client'

import { useState } from 'react'
import { Mission } from '@/lib/missions'
import { UserProgress, MissionStatus } from '@/types'
import { Check, X, SkipForward, RotateCcw, Users, ChevronDown, Loader2, StickyNote, Lightbulb } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  mission: Mission
  progress: UserProgress | undefined
  globalCount: number
  saving: boolean
  onUpdate: (missionId: string, status: MissionStatus, note?: string) => Promise<void>
}

const TYPE_PILL: Record<string, string> = {
  main:      'border-[#72dce8]/20 bg-[#72dce8]/[0.08] text-[#8ce7ee]',
  optional:  'border-[#b49aff]/20 bg-[#9c82ff]/[0.09] text-[#c3b4ff]',
  heist:     'border-[#ffd27a]/20 bg-[#ffd27a]/[0.08] text-[#ffdc9b]',
  strangers: 'border-white/10 bg-white/[0.045] text-white/50',
}

const STATUS_STYLES: Record<MissionStatus, string> = {
  completed:  'bg-[#72dce8]/[0.055]',
  failed:     'bg-[#ff79a8]/[0.055]',
  skipped:    'bg-[#ffd27a]/[0.045]',
  incomplete: '',
}

export default function MissionRow({ mission, progress, globalCount, saving, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState(progress?.note ?? '')
  const [noteEditing, setNoteEditing] = useState(false)
  const status = progress?.status ?? 'incomplete'

  const handleStatus = async (newStatus: MissionStatus) => {
    if (saving) return
    const next = status === newStatus ? 'incomplete' : newStatus
    await onUpdate(mission.id, next, note || undefined)
  }

  const handleNoteSave = async () => {
    setNoteEditing(false)
    await onUpdate(mission.id, status === 'incomplete' ? 'incomplete' : status, note || undefined)
  }

  const protagonistTone =
    mission.protagonist === 'lucia' ? 'bg-[#ff79a8]'
    : mission.protagonist === 'jason' ? 'bg-[#72dce8]'
    : 'bg-[#ffd27a]'

  const statusLabel =
    status === 'completed' ? 'Completed'
    : status === 'failed' ? 'Failed'
    : status === 'skipped' ? 'Skipped'
    : 'Not started'

  const isMissable = mission.tip?.toUpperCase().includes('MISSABLE') || mission.tip?.toUpperCase().includes('TIME-SENSITIVE')

  return (
    <div className={clsx('group transition-colors duration-200', status !== 'incomplete' && STATUS_STYLES[status])}>
      <div className="flex items-center gap-2.5 px-3 py-3 sm:gap-3 sm:px-5">
        <span className={clsx('h-8 w-[3px] shrink-0 rounded-full opacity-80', protagonistTone)} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={clsx(
              'text-[13px] font-medium sm:text-sm',
              status === 'completed' ? 'text-white/45 line-through'
              : status === 'skipped' ? 'text-white/50'
              : 'text-white/85',
            )}>
              {mission.name}
            </span>
            <span className={clsx(
              'rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em]',
              TYPE_PILL[mission.type],
            )}>
              {mission.type}
            </span>
            {isMissable && status === 'incomplete' && (
              <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em] text-rose-300">
                missable
              </span>
            )}
            {status !== 'incomplete' && (
              <span className={clsx(
                'text-[8px] font-bold uppercase tracking-[0.13em]',
                status === 'completed' ? 'text-[#8ce7ee]'
                : status === 'failed' ? 'text-[#ff9bb5]'
                : 'text-[#ffdc9b]',
              )}>
                {statusLabel}
              </span>
            )}
          </div>

          {expanded && (
            <div className="mt-2.5 space-y-2.5">
              <p className="text-xs leading-5 text-white/45">{mission.description}</p>

              {mission.tip && (
                <div className="flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-3 py-2">
                  <Lightbulb size={12} className="mt-0.5 shrink-0 text-[#ffdc9b]" />
                  <p className="text-[11px] leading-5 text-[#ffdc9b]/80">{mission.tip}</p>
                </div>
              )}

              <div className="flex items-start gap-2">
                <StickyNote size={13} className="mt-0.5 shrink-0 text-white/30" />
                <div className="min-w-0 flex-1">
                  {noteEditing ? (
                    <input
                      autoFocus
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      onBlur={handleNoteSave}
                      onKeyDown={e => e.key === 'Enter' && handleNoteSave()}
                      placeholder="Add a note for this mission…"
                      className="w-full rounded-lg border border-[#72dce8]/25 bg-black/30 px-3 py-2 text-xs text-white outline-none transition placeholder:text-white/25 focus:border-[#72dce8]/60"
                    />
                  ) : (
                    <button
                      onClick={() => setNoteEditing(true)}
                      className="text-left text-xs text-white/40 transition hover:text-[#8ce7ee]"
                    >
                      {note || '+ Add personal note'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {globalCount > 0 && (
          <div className="hidden shrink-0 items-center gap-1 text-[10px] tabular-nums text-white/30 lg:flex">
            <Users size={11} />
            <span>{globalCount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-0.5">
          {saving ? (
            <Loader2 size={15} className="mx-2 animate-spin text-white/45" />
          ) : (
            <>
              <button
                onClick={() => handleStatus('completed')}
                aria-label="Mark completed"
                title="Mark completed"
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition',
                  status === 'completed'
                    ? 'bg-[#72dce8]/15 text-[#8ce7ee]'
                    : 'text-white/30 hover:bg-[#72dce8]/10 hover:text-[#8ce7ee]',
                )}
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => handleStatus('failed')}
                aria-label="Mark failed"
                title="Mark failed"
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition',
                  status === 'failed'
                    ? 'bg-[#ff79a8]/15 text-[#ff9bb5]'
                    : 'text-white/30 hover:bg-[#ff79a8]/10 hover:text-[#ff9bb5]',
                )}
              >
                <X size={14} />
              </button>
              <button
                onClick={() => handleStatus('skipped')}
                aria-label="Mark skipped"
                title="Mark skipped"
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition',
                  status === 'skipped'
                    ? 'bg-[#ffd27a]/15 text-[#ffdc9b]'
                    : 'text-white/30 hover:bg-[#ffd27a]/10 hover:text-[#ffdc9b]',
                )}
              >
                <SkipForward size={14} />
              </button>
              {status !== 'incomplete' && (
                <button
                  onClick={() => handleStatus('incomplete')}
                  aria-label="Reset mission status"
                  title="Reset"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.06] hover:text-white/70"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse mission details' : 'Expand mission details'}
            aria-expanded={expanded}
            className="ml-0.5 flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.06] hover:text-white/75"
          >
            <ChevronDown size={14} className={clsx('transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      </div>
    </div>
  )
}
