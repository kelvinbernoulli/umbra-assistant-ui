import { Activity, Bot, Database, RefreshCw, Search, ShieldCheck, Undo2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AdminKpi } from '../../adminData'
import AdminMetricCard from '../../components/admin/AdminMetricCard'
import AdminStatusBadge from '../../components/admin/AdminStatusBadge'
import AdminTrendChart from '../../components/admin/AdminTrendChart'
import { SectionHeading } from '../../components/SectionHeading'
import { SourceGlyph } from '../../components/SourceBadge'
import { useAdmin } from '../../hooks/useAdmin'

const metricIcons = {
  users: Users,
  items: Database,
  searches: Search,
  automation: Bot,
} satisfies Record<AdminKpi['id'], typeof Users>

export default function AdminOverviewPage() {
  const {
    activity,
    canUndo,
    kpis,
    lastHealthRefresh,
    range,
    refreshHealth,
    setRange,
    sources,
    systemHealth,
    undoLastAction,
    usageTrend,
  } = useAdmin()
  const healthyServices = systemHealth.filter((service) => service.status === 'operational').length
  const chartPoints = usageTrend.map((point) => ({
    label: point.label,
    value: point.itemsIngested,
    displayValue: `${Math.round(point.itemsIngested / 1000)}k`,
  }))

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Platform overview</p>
          <h2>Everything important, at a glance.</h2>
          <p>Aggregate product usage and operational health. Private source content is never shown here.</p>
        </div>
        <div className="admin-page-heading__actions">
          <label className="admin-range-control">
            <span className="sr-only">Analytics period</span>
            <select className="setting-control" value={range} onChange={(event) => setRange(event.target.value as typeof range)}>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </label>
          <button className="button button--outline" onClick={refreshHealth}><RefreshCw size={15} /> Refresh</button>
          <button className="icon-button" onClick={undoLastAction} disabled={!canUndo} aria-label="Undo last admin action" title="Undo last admin action"><Undo2 size={16} /></button>
        </div>
      </div>

      <div className="admin-metrics">
        {kpis.map((metric) => (
          <AdminMetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            helper={range === '7d' ? metric.helper.replace('30 days', '7 days') : metric.helper}
            change={`${Math.abs(metric.change)}%`}
            changeTone={metric.change > 0 ? 'positive' : metric.change < 0 ? 'negative' : 'neutral'}
            icon={metricIcons[metric.id]}
          />
        ))}
      </div>

      <div className="admin-overview-grid">
        <section className="admin-panel admin-panel--chart">
          <AdminTrendChart
            title="Items indexed"
            description={`${range === '7d' ? 'Daily' : 'Thirty-day'} ingestion volume across isolated user namespaces.`}
            points={chartPoints}
          />
        </section>

        <section className="admin-panel">
          <SectionHeading eyebrow="Connectors" title="Source health" action={<Link className="text-link" to="/admin/sources">Manage sources</Link>} />
          <div className="admin-source-health">
            {sources.map((source) => (
              <div className="admin-source-health__row" key={source.id}>
                <span className={`source-icon source-icon--${source.id}`}><SourceGlyph source={source.id} size={17} /></span>
                <div><strong>{source.name}</strong><span>{source.connectedUsers.toLocaleString()} connected users</span></div>
                <div className="admin-source-health__meta"><AdminStatusBadge label={source.status} tone={source.status === 'operational' ? 'healthy' : source.status === 'degraded' ? 'warning' : 'neutral'} /><span>{source.deliveryRate}% delivery</span></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-overview-grid admin-overview-grid--lower">
        <section className="admin-panel">
          <SectionHeading eyebrow="Audit trail" title="Recent activity" action={<Link className="text-link" to="/admin/activity">View all activity</Link>} />
          <div className="admin-activity-preview">
            {activity.slice(0, 4).map((event) => (
              <div key={event.id}>
                <span className={`admin-activity-preview__icon admin-activity-preview__icon--${event.severity}`}><Activity size={14} /></span>
                <p><strong>{event.action}</strong><span>{event.target} · {event.actor}</span></p>
                <time>{event.time}</time>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel admin-health-summary">
          <span className="admin-health-summary__icon"><ShieldCheck size={22} /></span>
          <div>
            <p className="eyebrow">System health</p>
            <h3>{healthyServices} of {systemHealth.length} services operational</h3>
            <p>Last manual check: {lastHealthRefresh}</p>
          </div>
          <Link className="button button--outline" to="/admin/health">Open health monitor</Link>
        </section>
      </div>
    </>
  )
}
