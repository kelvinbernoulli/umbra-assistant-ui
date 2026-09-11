import { useCallback } from 'react'
import { ArrowRight, ChevronRight, MessageCircle, Mic, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { SourceBadge } from '../components/SourceBadge'
import { SyncCorona } from '../components/SyncCorona'
import { useUmbra } from '../hooks/useUmbra'
import { useBrief } from '../hooks/useBrief'
import { useConnections } from '../hooks/useConnections'
import { useTimeline } from '../hooks/useTimeline'
import { useAutoLoad } from '../hooks/useAutoLoad'
import type { BriefResponse, ConnectionResponse, TimelineEvent } from '../types/api'
import { dateLabel } from '../utils/serverData'

export default function BriefPage() {
  const { openCommand, auth } = useUmbra()
  const now = new Date()
  const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(now)
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = auth?.user.name.trim().split(/\s+/)[0]
  return <div className="page page--brief">
    <div className="page-intro brief-page-intro"><div><p className="eyebrow">{todayLabel}</p><h1>{greeting}{firstName ? ', ' + firstName : ''}.</h1><p className="page-intro__copy">Here’s what deserves your attention today.</p></div><button className="button button--gold button--voice" onClick={() => openCommand('voice')}><Mic size={16} /> Talk to Umbra</button></div>
    {auth ? <ConnectedBrief /> : <BriefLayout />}
  </div>
}

function ConnectedBrief() {
  const { brief, fetchBrief, error, isLoading } = useBrief()
  const { connections, fetchConnections } = useConnections()
  const { events, fetchTimeline, error: recordsError } = useTimeline()
  const load = useCallback(() => fetchTimeline(100), [fetchTimeline])
  useAutoLoad(fetchBrief)
  useAutoLoad(fetchConnections)
  useAutoLoad(load)
  return <BriefLayout brief={brief} connections={connections} events={events} error={error} recordsError={recordsError} loading={isLoading} refresh={fetchBrief} />
}

function BriefLayout({ brief = null, connections = null, events = null, error = null, recordsError = null, loading = false, refresh }: {
  brief?: BriefResponse | null; connections?: ConnectionResponse[] | null; events?: TimelineEvent[] | null; error?: string | null; recordsError?: string | null; loading?: boolean; refresh?: () => unknown
}) {
  const { auth } = useUmbra()
  const connectedCount = connections?.filter(item => item.status === 'connected').length
  const percent = connections?.length ? Math.round((connectedCount ?? 0) / connections.length * 100) : undefined
  const calendar = events?.filter(item => item.type === 'event' || item.type === 'reminder')
  const recent = events?.slice(0, 3) ?? []
  return <>
    <section className="brief-card"><div className="brief-card__glow" aria-hidden="true" /><div className="brief-card__lead"><SyncCorona percent={percent} /><div>
      <div className="brief-card__status">{connections ? connectedCount + ' of ' + connections.length + ' sources connected' : 'Your private workspace'}</div>
      {brief && <span className="eyebrow">{brief.title}</span>}
      <p className="brief-card__summary" role={loading ? 'status' : error ? 'alert' : undefined}>{loading ? 'Preparing your daily overview…' : brief?.summary ?? (auth ? error ?? 'Your brief will appear here when it is available.' : 'Bring your conversations and schedule together. Sign in to see your day in context.')}</p>
      {refresh ? <button className="text-link brief-refresh" disabled={loading} onClick={() => void refresh()}><RefreshCw size={12} /> {error ? 'Try again' : 'Refresh brief'}</button> : <Link className="text-link brief-refresh" to="/signin">Sign in with Google <ArrowRight size={13} /></Link>}
    </div></div><div className="brief-card__facts">
      <div><strong>{events ? calendar?.length : '—'}</strong><span>calendar records</span></div><div><strong>{events ? events.filter(item => item.type === 'message' || item.type === 'email').length : '—'}</strong><span>recent messages</span></div><div><strong>{events ? events.filter(item => item.type === 'reminder').length : '—'}</strong><span>saved reminders</span></div>
    </div></section>
    <div className="brief-layout"><section><SectionHeading eyebrow="Your memory" title="Recent activity" action={<Link className="text-link" to="/timeline">Open timeline <ArrowRight size={14} /></Link>} />
      <div className="priority-list">{recent.map((item, index) => <article className="priority-card" key={item.id}><span className="priority-card__index">{'0' + (index + 1)}</span><div className="priority-card__content"><div className="priority-card__meta"><SourceBadge source={item.source} /><span>{item.type}</span></div><h3>{item.title}</h3><p>{item.detail}</p></div><Link to="/timeline" className="round-arrow" aria-label={'Open ' + item.title}><ArrowRight size={16} /></Link></article>)}
        {!recent.length && <article className="priority-card"><span className="priority-card__index">—</span><div className="priority-card__content"><h3>{auth ? 'Your activity will appear here' : 'A clearer view of your day'}</h3><p>{recordsError ? 'Your saved activity could not be loaded. Open Timeline to try again.' : auth ? 'Saved messages, emails, and events will fill this space.' : 'Sign in to bring your saved messages, emails, and events into view.'}</p></div><Link to={auth ? '/timeline' : '/signin'} className="round-arrow" aria-label={auth ? 'Open timeline' : 'Sign in'}><ArrowRight size={16} /></Link></article>}
      </div>{events && <p className="page-intro__copy dashboard-footnote">From your latest 100 saved records.</p>}
    </section><aside className="brief-aside"><SectionHeading eyebrow="Your schedule" title="Calendar records" /><div className="agenda-card">
      {calendar?.slice(0, 3).map(item => <div className="mini-event" key={item.id}><div className="mini-event__time"><strong>{new Date(item.timestamp).getDate() || '—'}</strong><span>saved</span></div><span className="event-rule event-rule--calendar" /><div className="mini-event__copy"><strong>{item.title}</strong><span>{dateLabel(item.timestamp)}</span></div></div>)}
      {!calendar?.length && <div className="mini-event"><div className="mini-event__time"><strong>—</strong></div><span className="event-rule event-rule--calendar" /><div className="mini-event__copy"><strong>No calendar records to show</strong><span>Your saved events will appear here.</span></div></div>}
      <Link className="agenda-card__link" to="/calendar">Open calendar <ChevronRight size={14} /></Link></div>
      <div className="waiting-card"><div className="waiting-card__icon"><MessageCircle size={17} /></div><div><span className="eyebrow">Your connected world</span><strong>Bring your sources together</strong><p>Manage your account connections.</p></div><Link to="/connections" aria-label="Manage connections"><ChevronRight size={17} /></Link></div>
    </aside></div>
  </>
}
