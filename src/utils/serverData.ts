export function sourceStyle(source: string): string {
  if (source === 'gcal' || source === 'calendar') return 'calendar'
  return ['gmail', 'whatsapp', 'manual'].includes(source) ? source : 'manual'
}
export function sourceLabel(source: string): string {
  const labels: Record<string, string> = { gcal: 'Google Calendar', calendar: 'Calendar', gmail: 'Gmail', whatsapp: 'WhatsApp', manual: 'Manual' }
  return labels[source] ?? source
}
export function formatTimestamp(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Time unavailable' : date.toLocaleString()
}
export function dateLabel(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}
