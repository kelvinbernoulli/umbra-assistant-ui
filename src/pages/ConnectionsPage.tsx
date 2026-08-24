import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, CheckCircle2, Circle, Link2, RefreshCw, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SourceGlyph } from '../components/SourceBadge'
import { SyncCorona } from '../components/SyncCorona'
import { useUmbra } from '../hooks/useUmbra'
import type { Source } from '../data'

export default function ConnectionsPage() {
  const { connections, setConnections } = useUmbra()
  const [syncing, setSyncing] = useState<Source | 'all' | null>(null)
  const [confirming, setConfirming] = useState<Source | null>(null)
  const [notice, setNotice] = useState('')
  const timersRef = useRef<number[]>([])

  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay)
    timersRef.current.push(timer)
  }

  useEffect(() => () => timersRef.current.forEach((timer) => window.clearTimeout(timer)), [])

  const toggleConnection = (id: Source) => {
    const target = connections.find((connection) => connection.id === id)
    if (target?.status === 'connected' && confirming !== id) {
      setConfirming(id)
      setNotice(`Click disconnect again to remove ${target.name}`)
      later(() => setConfirming((current) => current === id ? null : current), 4000)
      later(() => setNotice(''), 4000)
      return
    }
    setConfirming(null)
    setSyncing(id)
    later(() => {
      setConnections((current) => current.map((connection) => connection.id === id
        ? { ...connection, status: connection.status === 'connected' ? 'disconnected' : 'connected', lastSync: connection.status === 'connected' ? undefined : 'Just now' }
        : connection))
      setSyncing(null)
      setNotice('Connection updated')
      later(() => setNotice(''), 2200)
    }, 650)
  }

  const syncAll = () => {
    setSyncing('all')
    later(() => {
      setConnections((current) => current.map((connection) => connection.status === 'connected' ? { ...connection, lastSync: 'Just now' } : connection))
      setSyncing(null)
      setNotice('All sources are up to date')
      later(() => setNotice(''), 2200)
    }, 900)
  }

  const connectedCount = connections.filter((connection) => connection.status === 'connected').length

  return (
    <div className="page">
      <div className="page-intro page-intro--row">
        <div>
          <p className="eyebrow">Your connected world</p>
          <h1>Sources</h1>
          <p className="page-intro__copy">Bring your conversations and schedule into one private memory.</p>
        </div>
        <button className="button button--outline" onClick={syncAll} disabled={syncing !== null}><RefreshCw className={syncing === 'all' ? 'spin' : ''} size={15} /> Sync all</button>
      </div>

      <section className="sync-overview">
        <SyncCorona percent={Math.round((connectedCount / connections.length) * 100)} size="small" />
        <div><strong>{connectedCount} of {connections.length} sources connected</strong><span>Umbra is watching for new context across your accounts.</span></div>
        <span className={`sync-overview__status${connectedCount < connections.length ? ' sync-overview__status--warning' : ''}`}>
          <span className="live-dot" /> {connectedCount === connections.length ? 'All systems normal' : `${connections.length - connectedCount} source disconnected`}
        </span>
      </section>

      <div className="connections-grid">
        {connections.map((connection) => {
          const connected = connection.status === 'connected'

          return (
            <article className="connection-card" key={connection.id}>
              <div className="connection-card__top">
                <span className={`connection-logo connection-logo--${connection.id}`}><SourceGlyph source={connection.id} size={21} /></span>
                <span className={`connection-state${connected ? ' connection-state--connected' : ''}`}>
                  {connected ? <CheckCircle2 size={14} /> : <Circle size={14} />}{connected ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <h3>{connection.name}</h3>
              <span className="connection-card__account">{connection.account}</span>
              <p>{connection.description}</p>
              <div className="connection-card__stats">
                <div><span>Last synced</span><strong>{connection.lastSync ?? 'Never'}</strong></div>
                <div><span>In memory</span><strong>{connection.count ?? '—'}</strong></div>
              </div>
              <button className={`button ${connected ? 'button--outline' : 'button--gold'} connection-card__button`} onClick={() => toggleConnection(connection.id)} disabled={syncing !== null}>
                {syncing === connection.id ? <RefreshCw className="spin" size={15} /> : <Link2 size={15} />}
                {syncing === connection.id ? 'Updating…' : connected ? confirming === connection.id ? 'Confirm disconnect' : 'Disconnect' : 'Connect'}
              </button>
            </article>
          )
        })}
      </div>

      <section className="privacy-panel">
        <div className="privacy-panel__icon"><ShieldCheck size={22} /></div>
        <div><span className="eyebrow">Private by architecture</span><h2>Your sources never mix with anyone else’s.</h2><p>Every message, event, and embedding is scoped to your unique user namespace. Umbra only retrieves context that belongs to you.</p></div>
        <Link to="/settings" className="text-link">Privacy controls <ArrowRight size={14} /></Link>
      </section>
      {notice && <div className="toast" role="status"><Check size={15} /> {notice}</div>}
    </div>
  )
}
