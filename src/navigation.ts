import { CalendarDays, Inbox, Link2, Search, Sparkles, type LucideIcon } from 'lucide-react'

export const navItems: Array<{ to: string; label: string; icon: LucideIcon; end?: boolean }> = [
  { to: '/', label: 'Brief', icon: Sparkles, end: true },
  { to: '/timeline', label: 'Timeline', icon: Inbox },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/connections', label: 'Connections', icon: Link2 },
]

export const pageTitles: Record<string, string> = {
  '/': 'Morning brief',
  '/signin': 'Sign in',
  '/notifications': 'Notifications',
  '/timeline': 'Timeline',
  '/search': 'Search memory',
  '/calendar': 'Calendar',
  '/connections': 'Connections',
  '/admin': 'Admin overview',
  '/admin/users': 'Admin users',
  '/admin/sources': 'Admin sources',
  '/admin/activity': 'Admin activity',
  '/admin/health': 'System health',
  '/settings': 'Settings',
  '/settings/voice-language': 'Voice & language',
  '/settings/notifications': 'Notifications',
  '/settings/privacy-data': 'Privacy & data',
}
