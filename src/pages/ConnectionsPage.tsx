import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ApiState } from '../components/ApiState'
import { SourceBadge } from '../components/SourceBadge'
import ConnectCalendar from '../components/connectCalendar'
import { useConnections, useDisconnectConnection } from '../hooks/useConnections'
import { useAutoLoad } from '../hooks/useAutoLoad'
import { formatTimestamp, sourceLabel } from '../utils/serverData'
export default function ConnectionsPage() {
  return <div className="page"><div className="page-intro"><p className="eyebrow">Your connected world</p><h1>Sources</h1><p className="page-intro__copy">Connection status reported by your Umbra server.</p></div>
    <Connections />
  </div>
}
function Connections() {
  const { connections, fetchConnections, isLoading, error } = useConnections()
  const { disconnect, isLoading: disconnecting, error: disconnectError } = useDisconnectConnection()
  const [confirming, setConfirming] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  useAutoLoad(fetchConnections)
  async function confirmDisconnect(provider: string) {
    setNotice('')
    const result = await disconnect(provider)
    if (result) {
      setConfirming(null)
      setNotice(`${sourceLabel(result.provider)}: ${result.status}`)
      await fetchConnections()
    }
  }
  return <>
    <div className="api-actions"><button className="button button--outline" disabled={isLoading || disconnecting} onClick={() => void fetchConnections()}><RefreshCw size={15} /> Refresh status</button></div>
    <ApiState loading={isLoading || (!connections && !error)} error={error} empty={connections && !connections.length ? 'No sources registered.' : undefined} onRetry={fetchConnections} />
    {notice && <p role="status">{notice}</p>}
    {disconnectError && <p role="alert">{disconnectError}</p>}
    {connections && <><p>{connections.filter((item) => item.status === 'connected').length} of {connections.length} sources connected</p>
      <div className="connections-grid">{connections.map((item) => <article className="connection-card" key={item.provider}>
        <SourceBadge source={item.provider} /><h2>{sourceLabel(item.provider)}</h2><p>{item.status}</p>
        {item.connected_at && <p>Connected {formatTimestamp(item.connected_at)}</p>}
        {item.provider === 'gcal' && item.status === 'disconnected' && <div className="api-actions"><ConnectCalendar disabled={disconnecting} onConnected={(message) => { setNotice(message); void fetchConnections() }} /></div>}
        {item.status !== 'disconnected' && <div className="api-actions">
          {confirming === item.provider ? <><button className="button button--danger" disabled={disconnecting} onClick={() => void confirmDisconnect(item.provider)}>Confirm disconnect</button><button className="button button--outline" disabled={disconnecting} onClick={() => setConfirming(null)}>Cancel</button></> : <button className="button button--outline" disabled={disconnecting} onClick={() => setConfirming(item.provider)}>Disconnect</button>}
        </div>}
      </article>)}</div>
      <p className="page-intro__copy">Connect Google Calendar to authorize read-only access. Other account connections are not available yet.</p></>}
  </>
}
