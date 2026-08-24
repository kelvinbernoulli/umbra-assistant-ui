import { useState } from 'react'
import { Check, ChevronRight, Inbox, SlidersHorizontal } from 'lucide-react'
import DetailSheet from '../components/DetailSheet'
import { SourceBadge, SourceGlyph } from '../components/SourceBadge'
import { sourceMeta, timelineItems, type Source, type TimelineItem } from '../data'

export default function TimelinePage() {
  const [source, setSource] = useState<'all' | Source>('all')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [selected, setSelected] = useState<TimelineItem | null>(null)
  const [items, setItems] = useState(timelineItems)
  const filtered = items.filter((item) => (source === 'all' || item.source === source) && (!unreadOnly || item.unread))
  const days = ['Today', 'Yesterday', 'Earlier this week'] as const

  const openItem = (item: TimelineItem) => {
    setSelected({ ...item, unread: false })
    setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, unread: false } : candidate))
  }

  return (
    <div className="page">
      <div className="page-intro page-intro--row">
        <div>
          <p className="eyebrow">One continuous view</p>
          <h1>Your timeline</h1>
          <p className="page-intro__copy">Messages, emails, events, and reminders — ordered by when they happened.</p>
        </div>
        <button className="button button--outline"><SlidersHorizontal size={15} /> More filters</button>
      </div>

      <div className="filter-row" role="group" aria-label="Filter timeline by source">
        {(['all', 'whatsapp', 'gmail', 'calendar', 'manual'] as const).map((filter) => (
          <button
            key={filter}
            className={`filter-pill${source === filter ? ' filter-pill--active' : ''}`}
            onClick={() => setSource(filter)}
          >
            {filter !== 'all' && <SourceGlyph source={filter} size={13} />}
            {filter === 'all' ? 'Everything' : sourceMeta[filter].label}
          </button>
        ))}
        <span className="filter-divider" />
        <label className="check-filter">
          <input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} />
          <span><Check size={11} /></span> Unread only
        </label>
      </div>

      <div className="timeline-feed">
        {days.map((day) => {
          const dayItems = filtered.filter((item) => item.day === day)
          if (!dayItems.length) return null

          return (
            <section className="timeline-group" key={day}>
              <div className="timeline-group__heading"><span>{day}</span><span>{dayItems.length} items</span></div>
              <div className="timeline-group__items">
                {dayItems.map((item) => (
                  <button className={`timeline-item${item.unread ? ' timeline-item--unread' : ''}`} key={item.id} onClick={() => openItem(item)}>
                    <span className={`timeline-item__glyph source-icon source-icon--${item.source}`}><SourceGlyph source={item.source} size={17} /></span>
                    <span className="timeline-item__body">
                      <span className="timeline-item__top"><strong>{item.sender}</strong><time>{item.time}</time></span>
                      <span className="timeline-item__title">{item.title}</span>
                      <span className="timeline-item__preview">{item.preview}</span>
                      <span className="timeline-item__meta"><SourceBadge source={item.source} quiet /> {item.meta}</span>
                    </span>
                    <ChevronRight size={17} className="timeline-item__arrow" />
                  </button>
                ))}
              </div>
            </section>
          )
        })}
        {!filtered.length && (
          <div className="empty-state"><Inbox size={24} /><strong>Nothing here yet</strong><span>Try widening your filters.</span></div>
        )}
      </div>

      {selected && <DetailSheet item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
