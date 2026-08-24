import { Activity, CheckCircle2, RefreshCw, ShieldCheck, TriangleAlert } from 'lucide-react'
import AdminMetricCard from '../../components/admin/AdminMetricCard'
import AdminStatusBadge from '../../components/admin/AdminStatusBadge'
import { useAdmin } from '../../hooks/useAdmin'

export default function AdminHealthPage() {
  const { activity, lastHealthRefresh, refreshHealth, systemHealth } = useAdmin()
  const operationalCount = systemHealth.filter((service) => service.status === 'operational').length
  const averageUptime = systemHealth.reduce((total, service) => total + service.uptime, 0) / systemHealth.length
  const warnings = activity.filter((event) => event.severity === 'warning' && (event.category === 'system' || event.category === 'security')).slice(0, 3)

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="eyebrow">Operations</p><h2>System health</h2><p>Follow an event from webhook receipt through retrieval and agent execution.</p></div>
        <div className="admin-page-heading__actions"><span className="admin-last-refresh">Last refresh: {lastHealthRefresh}</span><button className="button button--outline" onClick={refreshHealth}><RefreshCw size={15} /> Run checks</button></div>
      </div>

      <div className="admin-metrics admin-metrics--three">
        <AdminMetricCard label="Operational services" value={`${operationalCount}/${systemHealth.length}`} helper="Core platform services" icon={CheckCircle2} />
        <AdminMetricCard label="Average uptime" value={`${averageUptime.toFixed(2)}%`} helper="Rolling 30-day availability" change="stable" changeTone="positive" icon={ShieldCheck} />
        <AdminMetricCard label="Open warnings" value={warnings.length.toString()} helper="No private payloads included" change={warnings.length ? 'review' : 'clear'} changeTone={warnings.length ? 'negative' : 'positive'} icon={TriangleAlert} />
      </div>

      <section className="admin-panel">
        <div className="admin-panel__heading"><div><p className="eyebrow">Event pipeline</p><h3>From source to answer</h3></div><span>Live service snapshot</span></div>
        <ol className="admin-pipeline" aria-label="Umbra event processing pipeline">
          {systemHealth.map((service, index) => (
            <li key={service.id} className={`admin-pipeline__step admin-pipeline__step--${service.status}`}>
              <span className="admin-pipeline__number">{index + 1}</span>
              <div><strong>{service.name}</strong><span>{service.latency}</span></div>
              <AdminStatusBadge label={service.status} tone={service.status === 'operational' ? 'healthy' : service.status === 'degraded' ? 'warning' : 'error'} />
            </li>
          ))}
        </ol>
      </section>

      <div className="admin-service-grid">
        {systemHealth.map((service) => (
          <article className="admin-service-card" key={service.id}>
            <div className="admin-service-card__header"><div><h3>{service.name}</h3><p>{service.description}</p></div><AdminStatusBadge label={service.status} tone={service.status === 'operational' ? 'healthy' : service.status === 'degraded' ? 'warning' : 'error'} /></div>
            <dl>
              <div><dt>Uptime</dt><dd>{service.uptime}%</dd></div>
              <div><dt>Latency</dt><dd>{service.latency}</dd></div>
              <div><dt>Throughput</dt><dd>{service.throughput}</dd></div>
              <div><dt>Checked</dt><dd>{service.lastChecked}</dd></div>
            </dl>
            <div className="admin-uptime" role="meter" aria-label={`${service.name} uptime`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={service.uptime}><span style={{ width: `${service.uptime}%` }} /></div>
          </article>
        ))}
      </div>

      <section className="admin-panel">
        <div className="admin-panel__heading"><div><p className="eyebrow">Attention queue</p><h3>Recent operational warnings</h3></div><Activity size={17} /></div>
        <div className="admin-incident-list">
          {warnings.map((warning) => <div key={warning.id}><span><TriangleAlert size={15} /></span><div><strong>{warning.action}</strong><p>{warning.target} · {warning.time}</p></div><code>{warning.id}</code></div>)}
          {!warnings.length && <div className="empty-state"><CheckCircle2 size={23} /><strong>All clear</strong><span>No current system warnings.</span></div>}
        </div>
      </section>
    </>
  )
}
