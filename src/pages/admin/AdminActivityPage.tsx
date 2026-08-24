import { Download, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AdminAuditEvent } from '../../adminData'
import AdminAuditDetailSheet from '../../components/admin/AdminAuditDetailSheet'
import AdminStatusBadge from '../../components/admin/AdminStatusBadge'
import AdminToolbar from '../../components/admin/AdminToolbar'
import { sourceMeta, type Source } from '../../data'
import { useAdmin } from '../../hooks/useAdmin'

type CategoryFilter = 'all' | AdminAuditEvent['category']
type SeverityFilter = 'all' | AdminAuditEvent['severity']

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export default function AdminActivityPage() {
  const { activity } = useAdmin()
  const [searchParams] = useSearchParams()
  const sourceQuery = searchParams.get('source') as Source | null
  const initialQuery = sourceQuery && sourceQuery in sourceMeta ? sourceMeta[sourceQuery].label : ''
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [severity, setSeverity] = useState<SeverityFilter>('all')
  const [selected, setSelected] = useState<AdminAuditEvent | null>(null)

  const filteredActivity = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return activity.filter((event) => {
      const matchesQuery = !normalizedQuery || `${event.actor} ${event.action} ${event.target} ${event.id}`.toLowerCase().includes(normalizedQuery)
      const matchesCategory = category === 'all' || event.category === category
      const matchesSeverity = severity === 'all' || event.severity === severity
      return matchesQuery && matchesCategory && matchesSeverity
    })
  }, [activity, category, query, severity])

  const resetFilters = () => {
    setQuery('')
    setCategory('all')
    setSeverity('all')
  }

  const exportActivity = () => {
    const header = ['Event ID', 'Time', 'Actor', 'Action', 'Target', 'Category', 'Outcome']
    const rows = filteredActivity.map((event) => [event.id, event.time, event.actor, event.action, event.target, event.category, event.severity])
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
    const file = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = `umbra-audit-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="eyebrow">Immutable record</p><h2>Admin activity</h2><p>Review access, source, security, and system events with private payloads redacted.</p></div>
      </div>

      <AdminToolbar
        label="Filter audit activity"
        summary={`${filteredActivity.length} events`}
        actions={<><button className="button button--ghost" onClick={resetFilters}><RotateCcw size={14} /> Reset</button><button className="button button--outline" onClick={exportActivity} disabled={!filteredActivity.length}><Download size={14} /> Export CSV</button></>}
      >
        <label className="admin-search-control"><span className="sr-only">Search activity</span><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actor, action, or event ID" /></label>
        <label><span className="sr-only">Filter by category</span><select className="setting-control" value={category} onChange={(event) => setCategory(event.target.value as CategoryFilter)}><option value="all">All categories</option><option value="user">User</option><option value="source">Source</option><option value="security">Security</option><option value="system">System</option></select></label>
        <label><span className="sr-only">Filter by outcome</span><select className="setting-control" value={severity} onChange={(event) => setSeverity(event.target.value as SeverityFilter)}><option value="all">All outcomes</option><option value="success">Success</option><option value="info">Information</option><option value="warning">Warning</option></select></label>
      </AdminToolbar>

      <div className="admin-table-wrap" tabIndex={0} aria-label="Admin activity table">
        <table className="admin-table">
          <caption className="sr-only">Redacted administrative activity for the Umbra workspace.</caption>
          <thead><tr><th scope="col">Time</th><th scope="col">Actor</th><th scope="col">Action</th><th scope="col">Target</th><th scope="col">Category</th><th scope="col">Outcome</th><th scope="col">Details</th></tr></thead>
          <tbody>
            {filteredActivity.map((event) => (
              <tr key={event.id}>
                <td><span className="admin-table__muted">{event.time}</span></td>
                <td><div className="admin-actor"><span>{event.initials}</span><strong>{event.actor}</strong></div></td>
                <td><strong className="admin-table__primary">{event.action}</strong><small className="admin-table__id">{event.id}</small></td>
                <td>{event.target}</td>
                <td className="admin-table__capitalize">{event.category}</td>
                <td><AdminStatusBadge label={event.severity} tone={event.severity === 'success' ? 'healthy' : event.severity === 'warning' ? 'warning' : 'neutral'} /></td>
                <td><button className="button button--ghost" onClick={() => setSelected(event)}>Inspect</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filteredActivity.length && <div className="empty-state"><Search size={23} /><strong>No audit events match</strong><span>Clear a filter or broaden your search.</span></div>}
      </div>

      <AdminAuditDetailSheet key={selected?.id ?? 'no-event'} event={selected} onClose={() => setSelected(null)} />
    </>
  )
}
