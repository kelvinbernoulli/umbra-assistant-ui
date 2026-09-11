import { Bot, Database, RefreshCw, Search, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminMetricCard from '../../components/admin/AdminMetricCard'
import { SectionHeading } from '../../components/SectionHeading'
import { SourceGlyph } from '../../components/SourceBadge'
import { ApiState } from '../../components/ApiState'
import { useHealth } from '../../hooks/useHealth'
import { useTypeRegistry } from '../../hooks/useTypeRegistry'
import { useAutoLoad } from '../../hooks/useAutoLoad'
import { sourceLabel, sourceStyle } from '../../utils/serverData'

export default function AdminOverviewPage() {
  const { data: health, checkHealth, isLoading, error } = useHealth()
  const { items: sources, fetchTypes, isLoading: sourcesLoading, error: sourcesError } = useTypeRegistry('sources')
  useAutoLoad(checkHealth)
  useAutoLoad(fetchTypes)
  return <>
    <div className="admin-page-heading"><div><p className="eyebrow">Platform overview</p><h2>Everything important, at a glance.</h2><p>Workspace administration and operational health.</p></div><div className="admin-page-heading__actions"><button className="button button--outline" disabled={isLoading || sourcesLoading} onClick={() => { void checkHealth(); void fetchTypes() }}><RefreshCw size={15} /> Refresh</button></div></div>
    <div className="admin-metrics">{[{ label: 'Active users', icon: Users }, { label: 'Items indexed', icon: Database }, { label: 'Memory searches', icon: Search }, { label: 'Commands completed', icon: Bot }].map(metric => <AdminMetricCard key={metric.label} label={metric.label} value="—" helper="Analytics unavailable" icon={metric.icon} />)}</div>
    <div className="admin-overview-grid"><section className="admin-panel admin-panel--chart"><SectionHeading eyebrow="Memory growth" title="Items indexed" /><div className="empty-state admin-chart-empty"><Database size={26} /><strong>Usage trends will appear here</strong><span>Analytics are not available yet.</span></div></section><section className="admin-panel"><SectionHeading eyebrow="Connectors" title="Registered sources" action={<Link className="text-link" to="/admin/sources">Manage sources</Link>} /><ApiState loading={sourcesLoading || (!sources && !sourcesError)} error={sourcesError} onRetry={fetchTypes} /><div className="admin-source-health">{sources?.map(source => <div className="admin-source-health__row" key={source.name}><span className={'source-icon source-icon--' + sourceStyle(source.name)}><SourceGlyph source={source.name} size={17} /></span><div><strong>{sourceLabel(source.name)}</strong><span>{source.is_default ? 'Built-in source' : 'Custom source'}</span></div></div>)}</div></section></div>
    <div className="admin-overview-grid admin-overview-grid--lower"><section className="admin-panel"><SectionHeading eyebrow="Audit trail" title="Recent activity" action={<Link className="text-link" to="/admin/activity">View activity</Link>} /><div className="empty-state"><strong>No activity feed available</strong><span>Audit events are not available yet.</span></div></section><section className="admin-panel admin-health-summary"><span className="admin-health-summary__icon"><ShieldCheck size={22} /></span><div><p className="eyebrow">System health</p><h3>{health ? health.app : 'Server status'}</h3>{health && <p>{health.status}</p>}<ApiState loading={isLoading || (!health && !error)} error={error} onRetry={checkHealth} /></div><Link className="button button--outline" to="/admin/health">Open health monitor</Link></section></div>
  </>
}
