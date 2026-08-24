import { useEffect, useRef } from 'react'
import { CheckCircle2, ChevronRight, Mic, MoreHorizontal, Plus, Zap } from 'lucide-react'
import { SourceBadge } from '../components/SourceBadge'
import { useUmbra } from '../hooks/useUmbra'
import { agenda, weekDays } from '../data'

export default function CalendarPage() {
  const { openCommand, reminders } = useUmbra()
  const weekRef = useRef<HTMLDivElement>(null)
  const activeDayRef = useRef<HTMLButtonElement>(null)
  const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  useEffect(() => {
    if (!window.matchMedia('(max-width: 620px)').matches || !weekRef.current || !activeDayRef.current) return
    const target = activeDayRef.current.offsetLeft - (weekRef.current.clientWidth - activeDayRef.current.offsetWidth) / 2
    weekRef.current.scrollTo({ left: target, behavior: 'instant' })
  }, [])

  return (
    <div className="page">
      <div className="page-intro page-intro--row">
        <div>
          <p className="eyebrow">{todayLabel}</p>
          <h1>Your day, in context.</h1>
          <p className="page-intro__copy">Events and reminders, enriched with what you already know.</p>
        </div>
        <button className="button button--gold" onClick={() => openCommand('type')}><Plus size={16} /> Add with Umbra</button>
      </div>

      <div className="week-strip" ref={weekRef}>
        <button className="week-strip__control" aria-label="Previous week"><ChevronRight className="flip" size={17} /></button>
        {weekDays.map((day) => (
          <button ref={day.active ? activeDayRef : undefined} className={`week-day${day.active ? ' week-day--active' : ''}`} key={day.date}>
            <span>{day.label}</span><strong>{day.date}</strong><i className={`load-dots load-dots--${day.load}`} />
          </button>
        ))}
        <button className="week-strip__control" aria-label="Next week"><ChevronRight size={17} /></button>
      </div>

      <div className="calendar-layout">
        <section className="day-agenda">
          <div className="day-agenda__header"><span>Today</span><span>{4 + reminders.length} items · 3h 20m</span></div>
          {reminders.map((reminder) => (
            <article className="voice-reminder-event" key={reminder.id}>
              <span className="voice-reminder-event__icon"><Mic size={16} /></span>
              <div><span className="eyebrow">Voice reminder · just added</span><h3>{reminder.title}</h3><p>{reminder.description}</p></div>
              <CheckCircle2 size={17} />
            </article>
          ))}
          {agenda.map((event) => (
            <article className={`calendar-event calendar-event--${event.state}`} key={event.id}>
              <div className="calendar-event__time"><strong>{event.time}</strong><span>{event.period}</span><small>{event.end}</small></div>
              <span className={`event-rule event-rule--${event.source}`} />
              <div className="calendar-event__body">
                <div><SourceBadge source={event.source} quiet />{event.state === 'next' && <span className="next-badge">Up next</span>}</div>
                <h3>{event.title}</h3><p>{event.detail}</p>
              </div>
              <button className="icon-button icon-button--bare"><MoreHorizontal size={18} /></button>
            </article>
          ))}
        </section>

        <aside className="calendar-aside">
          <div className="focus-card">
            <span className="focus-card__icon"><Zap size={18} /></span>
            <span className="eyebrow">Umbra suggests</span>
            <h3>Protect your 11 AM focus block</h3>
            <p>The Q3 report is due tomorrow. You have a clear 60-minute window before lunch.</p>
            <button className="button button--outline">Keep protected</button>
          </div>
          <div className="calendar-stat-card">
            <div><span>Meeting load</span><strong>Light</strong></div>
            <div className="load-meter"><span /><span /><span /><i /><i /></div>
            <p>You have 5h 10m of open time today.</p>
          </div>
          <button className="voice-nudge" onClick={() => openCommand('voice')}><span><Mic size={17} /></span><div><strong>Add something by voice</strong><small>“Lunch with Ada tomorrow at 1”</small></div><ChevronRight size={16} /></button>
        </aside>
      </div>
    </div>
  )
}
