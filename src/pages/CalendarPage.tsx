import { useCallback, useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronRight, Link2, Mic, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ApiAccess, ApiState } from '../components/ApiState'
import { SourceBadge } from '../components/SourceBadge'
import DetailSheet from '../components/DetailSheet'
import { useUmbra } from '../hooks/useUmbra'
import { useTimeline } from '../hooks/useTimeline'
import { useAutoLoad } from '../hooks/useAutoLoad'
import type { TimelineEvent } from '../types/api'
import { sourceStyle } from '../utils/serverData'

function dayKey(date: Date) { return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() }
export default function CalendarPage() {
  const { openCommand } = useUmbra()
  const [selectedDay, setSelectedDay] = useState(() => new Date())
  const weekRef = useRef<HTMLDivElement>(null)
  const activeDayRef = useRef<HTMLButtonElement>(null)
  const monday = new Date(selectedDay)
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7)
  const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(monday); date.setDate(date.getDate() + index); return date })
  function moveWeek(offset: number) { setSelectedDay(current => { const next = new Date(current); next.setDate(next.getDate() + offset * 7); return next }) }
  useEffect(() => {
    if (!window.matchMedia('(max-width: 620px)').matches || !weekRef.current || !activeDayRef.current) return
    weekRef.current.scrollTo({ left: activeDayRef.current.offsetLeft - (weekRef.current.clientWidth - activeDayRef.current.offsetWidth) / 2, behavior: 'instant' })
  }, [selectedDay])
  return <div className="page"><div className="page-intro page-intro--row"><div><p className="eyebrow">{selectedDay.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p><h1>Your day, in context.</h1><p className="page-intro__copy">Your saved events and reminders, together.</p></div><Link className="button button--gold" to="/connections"><Link2 size={16} /> Connect calendar</Link></div>
    <div className="week-strip" ref={weekRef}><button className="week-strip__control" aria-label="Previous week" onClick={() => moveWeek(-1)}><ChevronRight className="flip" size={17} /></button>{days.map(date => { const active = dayKey(date) === dayKey(selectedDay); return <button ref={active ? activeDayRef : undefined} className={'week-day' + (active ? ' week-day--active' : '')} key={dayKey(date)} aria-pressed={active} onClick={() => setSelectedDay(date)}><span>{date.toLocaleDateString(undefined, { weekday: 'short' })}</span><strong>{date.getDate()}</strong></button> })}<button className="week-strip__control" aria-label="Next week" onClick={() => moveWeek(1)}><ChevronRight size={17} /></button></div>
    <div className="calendar-layout"><section className="day-agenda"><ApiAccess><CalendarRecords selectedDay={selectedDay} /></ApiAccess></section><aside className="calendar-aside"><div className="focus-card"><span className="focus-card__icon"><CalendarDays size={18} /></span><span className="eyebrow">Your connected calendar</span><h3>Bring your schedule into view</h3><p>Connect Google Calendar from Sources to authorize access to your calendar.</p><Link className="button button--outline" to="/connections">Manage calendar connection</Link></div><div className="calendar-stat-card"><div><span>Calendar view</span><strong>Saved records</strong></div><p>Dates show when records were saved; scheduled start and end times are not available yet.</p></div><button className="voice-nudge" onClick={() => openCommand('voice')}><span><Mic size={17} /></span><div><strong>Talk to Umbra</strong><small>Search or open your saved information.</small></div><ChevronRight size={16} /></button></aside></div>
  </div>
}

function CalendarRecords({ selectedDay }: { selectedDay: Date }) {
  const { events, error, isLoading, fetchTimeline } = useTimeline()
  const load = useCallback(() => fetchTimeline(100), [fetchTimeline])
  useAutoLoad(load)
  const [selected, setSelected] = useState<TimelineEvent | null>(null)
  const records = (events ?? []).filter(item => (item.type === 'event' || item.type === 'reminder') && dayKey(new Date(item.timestamp)) === dayKey(selectedDay))
  return <><div className="day-agenda__header"><span>{selectedDay.toLocaleDateString(undefined, { weekday: 'long' })}</span><span>{events ? records.length + ' saved records' : 'Saved records'}</span><button className="text-link" disabled={isLoading} onClick={() => void load()} aria-label="Refresh calendar"><RefreshCw size={14} /></button></div>
    <ApiState loading={isLoading || (!events && !error)} error={error} empty={events && !records.length ? 'No calendar records saved on this day.' : undefined} onRetry={load} />
    {records.map(item => { const time = new Date(item.timestamp); return <article className="calendar-event" key={item.id}><div className="calendar-event__time"><strong>{time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</strong><small>Saved at</small></div><span className={'event-rule event-rule--' + sourceStyle(item.source)} /><div className="calendar-event__body"><div><SourceBadge source={item.source} quiet /></div><h3>{item.title}</h3><p>{item.detail}</p><button className="text-link" onClick={() => setSelected(item)}>View details <ChevronRight size={13} /></button></div></article> })}
    {selected && <DetailSheet item={selected} onClose={() => setSelected(null)} />}
  </>
}
