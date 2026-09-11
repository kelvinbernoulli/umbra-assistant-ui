import type { ReactNode } from 'react'

// AppShell mounts page content only after the server restores a session.
export function ApiAccess({ children }: { children: ReactNode; workspace?: boolean }) {
  return children
}

export function ApiState({ loading, error, empty, onRetry }: {
  loading: boolean
  error: string | null
  empty?: string
  onRetry: () => unknown
}) {
  if (loading) return <div className="empty-state" role="status">Loading from Umbra…</div>
  if (error) return <div className="empty-state" role="alert"><strong>Could not load data</strong><span>{error}</span><button className="button button--outline" onClick={() => void onRetry()}>Try again</button></div>
  if (empty) return <div className="empty-state"><strong>{empty}</strong></div>
  return null
}
