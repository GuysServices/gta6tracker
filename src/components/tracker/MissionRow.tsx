'use client'

import { useState } from 'react'
import { Mission } from '@/lib/missions'
import { UserProgress, MissionStatus } from '@/types'
import { Check, X, SkipForward, RotateCcw, Users, ChevronDown, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  mission: Mission
  progress: UserProgress | undefined
  globalCount: number
  saving: boolean
  onUpdate: (missionId: string, status: MissionStatus, note?: string) => Promise<void>
}

const TYPE_PILL: Record<string, string> = {
  main:      'pill-main',
  side:      'pill-side',
  heist:     'pill-heist',
  strangers: 'pill-strangers',
}

const STATUS_STYLES: Record<MissionStatus, string> = {
  completed: 'bg-vc-cyan/8  border-vc-cyan/20',
  failed:    'bg-vc-pink/8  border-vc-pink/20',
  skipped:   'bg-vc-gold/8  border-vc-gold/20',
  incomplete: '',
}

export default function MissionRow({ mission, progress, globalCount, saving, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote]         = useState(progress?.note ?? '')
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

  return (
    <div className={clsx(
      'transition-colors duration-150',
      status !== 'incomplete' && STATUS_STYLES[status],
    )}>
      <div className="flex items-center gap-3 px-5 py-3">
        {/* Protagonist indicator */}
        <div className={clsx(
          'w-0.5 self-stretch rounded-full',
          mission.protagonist === 'lucia' ? 'bg-vc-pink/60' :
          mission.protagonist === 'jason' ? 'bg-vc-cyan/60' : 'bg-vc-gold/60',
        )} />

        {/* Mission info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={clsx(
              'font-body text-sm',
              status === 'completed' ? 'text-vc-muted line-through' :
              status === 'skipped'   ? 'text-vc-muted/60' : 'text-vc-text',
            )}>
              {mission.name}
            </span>
            <span className={clsx('mission-pill', TYPE_PILL[mission.type])}>
              {mission.type}
            </span>
          </div>
          {expanded && (
            <div className="text-vc-muted/60 text-xs mt-1">{mission.description}</div>
          )}
          {expanded && (
            <div className="mt-2">
              {noteEditing ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    onBlur={handleNoteSave}
                    onKeyDown={e => e.key === 'Enter' && handleNoteSave()}
                    placeholder="Add a note…"
                    className="flex-1 bg-vc-black border border-vc-border text-vc-text text-xs px-2 py-1 outline-none focus:border-vc-cyan/50 transition-colors"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setNoteEditing(true)}
                  className="text-vc-muted/40 hover:text-vc-muted text-xs transition-colors"
                >
                  {note ? note : '+ note'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Global count */}
        {globalCount > 0 && (
          <div className="hidden sm:flex items-center gap-1 text-vc-muted/40 text-xs">
            <Users size={10} />
            <span>{globalCount.toLocaleString()}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {saving ? (
            <Loader2 size={14} className="text-vc-muted animate-spin" />
          ) : (
            <>
              <button
                onClick={() => handleStatus('completed')}
                className={clsx(
                  'w-7 h-7 flex items-center justify-center rounded transition-colors',
                  status === 'completed'
                    ? 'bg-vc-cyan/20 text-vc-cyan'
                    : 'text-vc-muted/40 hover:text-vc-cyan hover:bg-vc-cyan/10',
                )}
                title="Mark completed"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => handleStatus('failed')}
                className={clsx(
                  'w-7 h-7 flex items-center justify-center rounded transition-colors',
                  status === 'failed'
                    ? 'bg-vc-pink/20 text-vc-pink'
                    : 'text-vc-muted/40 hover:text-vc-pink hover:bg-vc-pink/10',
                )}
                title="Mark failed"
              >
                <X size={14} />
              </button>
              <button
                onClick={() => handleStatus('skipped')}
                className={clsx(
                  'w-7 h-7 flex items-center justify-center rounded transition-colors',
                  status === 'skipped'
                    ? 'bg-vc-gold/20 text-vc-gold'
                    : 'text-vc-muted/40 hover:text-vc-gold hover:bg-vc-gold/10',
                )}
                title="Mark skipped"
              >
                <SkipForward size={14} />
              </button>
              {status !== 'incomplete' && (
                <button
                  onClick={() => handleStatus('incomplete')}
                  className="w-7 h-7 flex items-center justify-center rounded text-vc-muted/30 hover:text-vc-muted hover:bg-vc-border/50 transition-colors"
                  title="Reset"
                >
                  <RotateCcw size={12} />
                </button>
              )}
            </>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-7 h-7 flex items-center justify-center text-vc-muted/30 hover:text-vc-muted transition-colors"
          >
            <ChevronDown size={12} className={clsx('transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      </div>
    </div>
  )
}
