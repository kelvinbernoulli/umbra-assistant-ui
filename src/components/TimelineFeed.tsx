import { useCallback, useState } from 'react'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { useTimeline } from '../hooks/useTimeline'
import { useAutoLoad } from '../hooks/useAutoLoad'
import { ApiState } from './ApiState'
import { SourceBadge, SourceGlyph } from './SourceBadge'
import DetailSheet from './DetailSheet'
import type { TimelineEvent } from '../types/api'
import { dateLabel, formatTimestamp, sourceLabel, sourceStyle } from '../utils/serverData'

export default function TimelineFeed() {
  const { events, error, isLoading, fetchTimeline } = useTimeline()
  const load = useCallback(() => fetchTimeline(100), [fetchTimeline])
  useAutoLoad(load)
  const [source, setSource] = useState('all')
  const [selected, setSelected] = useState<TimelineEvent | null>(null)
  const records = events ?? []
  const sources = [...new Set(records.map(item => item.source))]
  const filtered = records.filter(item => source === 'all' || item.source === source)
  const days = [...new Set(filtered.map(item => dateLabel(item.timestamp)))]
  return <>
    <div className="timeline-toolbar"><div className="filter-row" role="group" aria-label="Filter by source">{['all', ...sources].map(value => <button className={'filter-pill' + (source === value ? ' filter-pill--active' : '')} key={value} onClick={() => setSource(value)}>{value !== 'all' && <SourceGlyph source={value} size={13} />}{value === 'all' ? 'Everything' : sourceLabel(value)}</button>)}</div><button className="button button--outline" disabled={isLoading} onClick={() => void load()}><RefreshCw size={15} /> Refresh</button></div>
    <ApiState loading={isLoading || (!events && !error)} error={error} empty={events && !filtered.length ? 'No timeline items found.' : undefined} onRetry={load} />
    {events && <div className="timeline-feed">{days.map(day => {
      const items = filtered.filter(item => dateLabel(item.timestamp) === day)
      return <section className="timeline-group" key={day}><div className="timeline-group__heading"><span>{day}</span><span>{items.length} items</span></div><div className="timeline-group__items">{items.map(item => <button className="timeline-item" key={item.id} onClick={() => setSelected(item)}>
        <span className={'timeline-item__glyph source-icon source-icon--' + sourceStyle(item.source)}><SourceGlyph source={item.source} size={17} /></span><span className="timeline-item__body"><span className="timeline-item__top"><strong>{sourceLabel(item.source)}</strong><time dateTime={item.timestamp}>{formatTimestamp(item.timestamp)}</time></span><span className="timeline-item__title">{item.title}</span><span className="timeline-item__preview">{item.detail}</span><span className="timeline-item__meta"><SourceBadge source={item.source} quiet />{item.type}</span></span><ChevronRight size={17} className="timeline-item__arrow" />
      </button>)}</div></section>
    })}<p className="page-intro__copy">Showing up to 100 recent records.</p></div>}
    {selected && <DetailSheet item={selected} onClose={() => setSelected(null)} />}
  </>
}
