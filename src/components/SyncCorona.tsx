import { Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'

export function SyncCorona({ percent, size = 'large' }: { percent?: number; size?: 'small' | 'large' }) {
  const normalized = Math.max(0, Math.min(100, percent ?? 0))
  const circumference = 2 * Math.PI * 43
  return <div className={`sync-corona sync-corona--${size}`} aria-label={percent === undefined ? 'Umbra' : `${normalized}% of sources connected`}>
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle className="sync-corona__track" cx="50" cy="50" r="43" /><circle className="sync-corona__progress" cx="50" cy="50" r="43" style={{ '--circumference': circumference, '--offset': circumference * (1 - normalized / 100) } as CSSProperties} /></svg>
    <span className="sync-corona__core"><Sparkles size={size === 'small' ? 13 : 18} strokeWidth={1.7} /></span>
  </div>
}
