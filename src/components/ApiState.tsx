import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUmbra } from '../hooks/useUmbra'

export function ApiAccess({ children }: { children: ReactNode; workspace?: boolean }) {
  const location = useLocation()
  const { auth, sessionLoading, sessionError, retrySession } = useUmbra()
  if (sessionLoading) return <div className="empty-state" role="status">Connecting to your workspace…</div>
  if (sessionError) return <div className="empty-state" role="alert"><strong>Could not connect to your workspace</strong><span>{sessionError}</span><button className="button button--outline" onClick={() => void retrySession()}>Try again</button></div>
  if (!auth) return <div className="empty-state"><strong>Your workspace is waiting</strong><span>Sign in to see your saved messages, events, and connections.</span><Link className="button button--gold" to="/signin" state={{ from: location.pathname + location.search }}>Sign in with Google</Link></div>
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
