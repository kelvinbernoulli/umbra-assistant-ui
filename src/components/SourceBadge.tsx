import { Calendar, FileText, Mail, MessageCircle } from 'lucide-react'
import { sourceMeta, type Source } from '../data'

export function SourceGlyph({ source, size = 15 }: { source: Source; size?: number }) {
  const props = { size, strokeWidth: 1.8, 'aria-hidden': true as const }
  if (source === 'whatsapp') return <MessageCircle {...props} />
  if (source === 'gmail') return <Mail {...props} />
  if (source === 'calendar') return <Calendar {...props} />
  return <FileText {...props} />
}

export function SourceBadge({ source, quiet = false }: { source: Source; quiet?: boolean }) {
  return (
    <span className={`source-badge source-badge--${source}${quiet ? ' source-badge--quiet' : ''}`}>
      <SourceGlyph source={source} size={12} />
      {sourceMeta[source].label}
    </span>
  )
}
