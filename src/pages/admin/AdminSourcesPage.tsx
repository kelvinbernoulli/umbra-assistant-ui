import { CheckCircle2, DatabaseZap, Pause, Play, RefreshCw, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AdminSourceId } from '../../adminData'
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog'
import AdminMetricCard from '../../components/admin/AdminMetricCard'
import AdminStatusBadge from '../../components/admin/AdminStatusBadge'
import { SourceGlyph } from '../../components/SourceBadge'
import { useAdmin } from '../../hooks/useAdmin'

const ingestionIssues = [
  { id: 'evt_redacted_71c2', source: 'calendar' as AdminSourceId, category: 'Rate limited', attempts: 3, time: '4 min ago', state: 'Retrying' },
  { id: 'evt_redacted_18f4', source: 'gmail' as AdminSourceId, category: 'Expired cursor', attempts: 1, time: '38 min ago', state: 'Recovered' },
  { id: 'evt_redacted_a920', source: 'whatsapp' as AdminSourceId, category: 'Invalid signature', attempts: 0, time: '2 hr ago', state: 'Rejected' },
]

export default function AdminSourcesPage() {
  const { retrySource, sources, toggleSource } = useAdmin()
  const [pendingPause, setPendingPause] = useState<AdminSourceId | null>(null)
  const [notice, setNotice] = useState('')
  const connectedUsers = sources.reduce((total, source) => total + source.connectedUsers, 0)
  const itemsToday = sources.reduce((total, source) => total + source.itemsToday, 0)
  const averageDelivery = sources.reduce((total, source) => total + source.deliveryRate, 0) / sources.length
  const pendingSource = sources.find((source) => source.id === pendingPause)

  const runSourceToggle = (sourceId: AdminSourceId) => {
    const source = sources.find((candidate) => candidate.id === sourceId)
    if (!source) return
    if (source.status !== 'paused') {
      setPendingPause(sourceId)
      return
    }
    toggleSource(sourceId)
    setNotice(`${source.name} ingestion resumed for this admin session.`)
  }

  const confirmPause = () => {
    if (!pendingSource) return
    toggleSource(pendingSource.id)
    setNotice(`${pendingSource.name} ingestion was paused for this admin session.`)
    setPendingPause(null)
  }

  const runRetry = (sourceId: AdminSourceId) => {
    const source = sources.find((candidate) => candidate.id === sourceId)
    retrySource(sourceId)
    if (source) setNotice(`${source.name} synchronization check completed.`)
  }

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="eyebrow">Ingestion control</p><h2>Sources</h2><p>Monitor aggregate connector health and control ingestion across Umbra.</p></div>
      </div>

      <div className="admin-metrics admin-metrics--three">
        <AdminMetricCard label="Connected accounts" value={connectedUsers.toLocaleString()} helper="Across active user namespaces" icon={Users} />
        <AdminMetricCard label="Items today" value={itemsToday.toLocaleString()} helper="Normalized and indexed" icon={DatabaseZap} />
        <AdminMetricCard label="Average delivery" value={`${averageDelivery.toFixed(2)}%`} helper="Webhook success rate" change="live" changeTone="positive" icon={RefreshCw} />
      </div>

      {notice && <div className="settings-inline-status" role="status"><CheckCircle2 size={15} /> {notice}</div>}

      <div className="admin-source-grid">
        {sources.map((source) => (
          <article className={`admin-source-card admin-source-card--${source.status}`} key={source.id}>
            <div className="admin-source-card__header">
              <span className={`source-icon source-icon--${source.id}`}><SourceGlyph source={source.id} size={19} /></span>
              <div><h3>{source.name}</h3><span>{source.connectedUsers.toLocaleString()} connected users</span></div>
              <AdminStatusBadge label={source.status} tone={source.status === 'operational' ? 'healthy' : source.status === 'degraded' ? 'warning' : 'neutral'} />
            </div>
            <dl className="admin-source-stats">
              <div><dt>Items today</dt><dd>{source.itemsToday.toLocaleString()}</dd></div>
              <div><dt>Delivery</dt><dd>{source.deliveryRate}%</dd></div>
              <div><dt>Latency</dt><dd>{source.latency}</dd></div>
              <div><dt>Last event</dt><dd>{source.lastEvent}</dd></div>
            </dl>
            <div className="admin-source-card__actions">
              <Link className="button button--ghost" to={`/admin/activity?source=${source.id}`}>View logs</Link>
              <button className="button button--outline" onClick={() => runRetry(source.id)}><RefreshCw size={14} /> Retry sync</button>
              <button className={`button ${source.status === 'paused' ? 'button--gold' : 'button--ghost admin-action--danger'}`} onClick={() => runSourceToggle(source.id)}>{source.status === 'paused' ? <Play size={14} /> : <Pause size={14} />}{source.status === 'paused' ? 'Resume' : 'Pause'}</button>
            </div>
          </article>
        ))}
      </div>

      <section className="admin-panel">
        <div className="admin-panel__heading"><div><p className="eyebrow">Redacted metadata</p><h3>Recent ingestion issues</h3></div><span>No payload content is retained here</span></div>
        <div className="admin-table-wrap" tabIndex={0} aria-label="Recent ingestion issues">
          <table className="admin-table admin-table--compact">
            <caption className="sr-only">Recent redacted connector ingestion issues.</caption>
            <thead><tr><th scope="col">Event</th><th scope="col">Source</th><th scope="col">Category</th><th scope="col">Attempts</th><th scope="col">Seen</th><th scope="col">State</th><th scope="col">Action</th></tr></thead>
            <tbody>{ingestionIssues.map((issue) => <tr key={issue.id}><td><code>{issue.id}</code></td><td><span className="admin-source-inline"><SourceGlyph source={issue.source} size={14} /> {sources.find((source) => source.id === issue.source)?.name}</span></td><td>{issue.category}</td><td>{issue.attempts}</td><td className="admin-table__muted">{issue.time}</td><td><AdminStatusBadge label={issue.state} tone={issue.state === 'Recovered' ? 'healthy' : issue.state === 'Retrying' ? 'warning' : 'error'} /></td><td><button className="button button--ghost" onClick={() => runRetry(issue.source)}><RefreshCw size={13} /> Retry</button></td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <AdminConfirmDialog
        open={Boolean(pendingSource)}
        title={`Pause ${pendingSource?.name ?? 'this source'} ingestion?`}
        description="New webhook events for this provider will stop processing for every user until an administrator resumes it. Existing indexed content is unaffected."
        confirmLabel="Pause ingestion"
        danger
        onCancel={() => setPendingPause(null)}
        onConfirm={confirmPause}
      />
    </>
  )
}
