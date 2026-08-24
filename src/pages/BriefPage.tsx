import { ArrowRight, ChevronRight, MessageCircle, Mic } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { SourceBadge } from '../components/SourceBadge'
import { SyncCorona } from '../components/SyncCorona'
import { useUmbra } from '../hooks/useUmbra'
import { agenda, priorities } from '../data'

export default function BriefPage() {
  const { openCommand, connections } = useUmbra()
  const connectedCount = connections.filter((connection) => connection.status === 'connected').length
  const syncPercent = Math.round((connectedCount / connections.length) * 100)
  const now = new Date()
  const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(now)
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page page--brief">
      <div className="page-intro brief-page-intro">
        <div>
          <p className="eyebrow">{todayLabel}</p>
          <h1>{greeting}, Kelvin.</h1>
          <p className="page-intro__copy">Here’s what deserves your attention today.</p>
        </div>
        <button className="button button--gold button--voice" onClick={() => openCommand('voice')}>
          <Mic size={16} /> Talk to Umbra
        </button>
      </div>

      <section className="brief-card">
        <div className="brief-card__glow" aria-hidden="true" />
        <div className="brief-card__lead">
          <SyncCorona percent={syncPercent} />
          <div>
            <div className="brief-card__status"><span className="live-dot" /> {connectedCount} of {connections.length} sources synced <span>·</span> updated just now</div>
            <p className="brief-card__summary">A calm start. One report needs your review, you have four events today, and Dave is still waiting on a dinner answer.</p>
          </div>
        </div>
        <div className="brief-card__facts">
          <div><strong>4</strong><span>events today</span></div>
          <div><strong>2</strong><span>need a reply</span></div>
          <div><strong>1</strong><span>deadline near</span></div>
        </div>
      </section>

      <div className="brief-layout">
        <section>
          <SectionHeading
            eyebrow="What matters"
            title="Your priorities"
            action={<Link className="text-link" to="/timeline">Open timeline <ArrowRight size={14} /></Link>}
          />
          <div className="priority-list">
            {priorities.map((priority, index) => (
              <article className="priority-card" key={priority.id}>
                <span className="priority-card__index">0{index + 1}</span>
                <div className="priority-card__content">
                  <div className="priority-card__meta">
                    <SourceBadge source={priority.source} />
                    <span>{priority.due}</span>
                  </div>
                  <h3>{priority.title}</h3>
                  <p>{priority.detail}</p>
                </div>
                <Link to={priority.source === 'calendar' ? '/calendar' : '/timeline'} className="round-arrow" aria-label={priority.action}>
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <aside className="brief-aside">
          <SectionHeading eyebrow="Coming up" title="Your afternoon" />
          <div className="agenda-card">
            {agenda.slice(1, 4).map((event) => (
              <div className="mini-event" key={event.id}>
                <div className="mini-event__time"><strong>{event.time}</strong><span>{event.period}</span></div>
                <span className={`event-rule event-rule--${event.source}`} />
                <div className="mini-event__copy"><strong>{event.title}</strong><span>{event.detail}</span></div>
              </div>
            ))}
            <Link className="agenda-card__link" to="/calendar">See full day <ChevronRight size={14} /></Link>
          </div>

          <div className="waiting-card">
            <div className="waiting-card__icon"><MessageCircle size={17} /></div>
            <div><span className="eyebrow">Still waiting</span><strong>Dave asked about dinner</strong><p>“Noya has a table at 7:30.”</p></div>
            <Link to="/timeline" aria-label="Open Dave's message"><ChevronRight size={17} /></Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
