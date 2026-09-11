import { useCallback, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTimeline } from '../hooks/useTimeline'
import { useAutoLoad } from '../hooks/useAutoLoad'
import { ApiState } from './ApiState'
import { SourceBadge } from './SourceBadge'
import { dateLabel, formatTimestamp } from '../utils/serverData'

export default function TimelineFeed({ calendar = false }: { calendar?: boolean }) {
  const { events, error, isLoading, fetchTimeline } = useTimeline()
  const load = useCallback(() => fetchTimeline(100), [fetchTimeline])
  useAutoLoad(load)
  const [source, setSource] = useState('all')
  const records = (events ?? []).filter((item) => !calendar || item.type === 'event' || item.type === 'reminder')
  const sources = [...new Set(records.map((item) => item.source))]
  const filtered = records.filter((item) => source === 'all' || item.source === source)
  const days = [...new Set(filtered.map((item) => dateLabel(item.timestamp)))]
  return <>
    <div className="api-actions"><button className="button button--outline" disabled={isLoading} onClick={() => void load()}><RefreshCw size={15} /> Refresh</button></div>
    {events && <div className="filter-row" role="group" aria-label="Filter by source">
      {['all', ...sources].map((value) => <button className={`filter-pill${source === value ? ' filter-pill--active' : ''}`} key={value} onClick={() => setSource(value)}>{value === 'all' ? 'All sources' : <SourceBadge source={value} quiet />}</button>)}
    </div>}
    <ApiState loading={isLoading || (!events && !error)} error={error} empty={events && !filtered.length ? calendar ? 'No calendar records found.' : 'No timeline items found.' : undefined} onRetry={load} />
    {events && <div className="timeline-feed">
      {days.map((day) => {
        const items = filtered.filter((item) => dateLabel(item.timestamp) === day)
        return <section className="timeline-group" key={day}>
          <div className="timeline-group__heading"><span>{day}</span><span>{items.length} items</span></div>
          {items.map((item) => <details className="api-record" key={item.id}>
            <summary><SourceBadge source={item.source} /><strong>{item.title}</strong><time dateTime={item.timestamp}>{formatTimestamp(item.timestamp)}</time></summary>
            <p className="eyebrow">{item.type}</p><p className="api-record__text">{item.detail}</p>
          </details>)}
        </section>
      })}
      <p className="page-intro__copy">Showing up to 100 recent records.{calendar ? ' Dates show when records were added; scheduled start and end times are not available yet.' : ''}</p>
    </div>}
  </>
}
