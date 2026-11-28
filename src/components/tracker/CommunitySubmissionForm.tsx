'use client'

import { useState } from 'react'
import { Plus, Send, X } from 'lucide-react'

export default function CommunitySubmissionForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [category, setCategory] = useState('Discovery')
  const [description, setDescription] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/community-submissions', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, area, category, description, evidence_url: evidenceUrl || null }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Submission failed.')
      setMessage('Discovery submitted. It will stay community-reported until reviewed.')
      setName(''); setArea(''); setDescription(''); setEvidenceUrl('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Submission failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mb-4">
      <button onClick={() => setOpen(value => !value)} className="inline-flex items-center gap-2 rounded-lg border border-[#ff79a8]/30 bg-[#ff79a8]/10 px-3 py-2 text-xs font-semibold text-[#ffb4ca] hover:bg-[#ff79a8]/15">
        {open ? <X size={13}/> : <Plus size={13}/>} Submit a community discovery
      </button>
      {open && <form onSubmit={submit} className="mt-3 grid gap-3 rounded-xl border border-[#ff79a8]/20 bg-[#11121d] p-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-[10px] text-white/45">Discovery name</label><input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="What did you find?" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-[#ff79a8]/50"/></div>
        <div><label className="mb-1 block text-[10px] text-white/45">Area / location</label><input required maxLength={160} value={area} onChange={e=>setArea(e.target.value)} placeholder="Where did you find it?" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-[#ff79a8]/50"/></div>
        <div><label className="mb-1 block text-[10px] text-white/45">Category</label><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0a0b14] px-3 py-2 text-xs text-white"><option>Discovery</option><option>Vehicle</option><option>Collectible</option><option>Easter Egg</option><option>Location</option><option>Other</option></select></div>
        <div><label className="mb-1 block text-[10px] text-white/45">Evidence link (optional)</label><input type="url" maxLength={500} value={evidenceUrl} onChange={e=>setEvidenceUrl(e.target.value)} placeholder="https://…" className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-[#ff79a8]/50"/></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-[10px] text-white/45">Details</label><textarea required maxLength={1500} rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Explain how to find it and what confirms it…" className="w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none focus:border-[#ff79a8]/50"/></div>
        <div className="flex items-center justify-between gap-3 sm:col-span-2"><p className="text-[10px] leading-4 text-white/30">Submissions are reviewed before being added to the verified map. No unconfirmed coordinates are placed on GTADB tiles.</p><button disabled={busy} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#ff79a8] px-4 py-2 text-xs font-bold text-[#160b11] disabled:opacity-50"><Send size={12}/>{busy?'Submitting…':'Submit discovery'}</button></div>
        {message && <p role="status" className="text-xs text-[#ffb4ca] sm:col-span-2">{message}</p>}
      </form>}
    </div>
  )
}
