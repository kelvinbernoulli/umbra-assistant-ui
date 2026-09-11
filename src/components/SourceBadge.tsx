import { Calendar, FileText, Mail, MessageCircle } from 'lucide-react'
import { sourceLabel, sourceStyle } from '../utils/serverData'

export function SourceGlyph({ source, size = 15 }: { source: string; size?: number }) {
  const props = { size, strokeWidth: 1.8, 'aria-hidden': true as const }
  if (source === 'whatsapp') return <MessageCircle {...props} />
  if (source === 'gmail') return <Mail {...props} />
  if (source === 'calendar' || source === 'gcal') return <Calendar {...props} />
  return <FileText {...props} />
}

export function SourceBadge({ source, quiet = false }: { source: string; quiet?: boolean }) {
  return (
    <span className={`source-badge source-badge--${sourceStyle(source)}${quiet ? ' source-badge--quiet' : ''}`}>
      <SourceGlyph source={source} size={12} />
      {sourceLabel(source)}
    </span>
  )
}
