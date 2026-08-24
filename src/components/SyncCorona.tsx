import { Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'

export function SyncCorona({ percent = 100, size = 'large' }: { percent?: number; size?: 'small' | 'large' }) {
  const normalized = Math.max(0, Math.min(100, percent))
  const radius = 43
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - normalized / 100)
  return (
    <div className={`sync-corona sync-corona--${size}`} aria-label={`${normalized}% of sources synced`}>
      <svg viewBox="0 0 100 100" role="img" aria-hidden="true">
        <circle className="sync-corona__track" cx="50" cy="50" r={radius} />
        <circle
          className="sync-corona__progress"
          cx="50"
          cy="50"
          r={radius}
          style={{ '--circumference': circumference, '--offset': offset } as CSSProperties}
        />
      </svg>
      <span className="sync-corona__core">
        <Sparkles size={size === 'small' ? 13 : 18} strokeWidth={1.7} />
      </span>
    </div>
  )
}
