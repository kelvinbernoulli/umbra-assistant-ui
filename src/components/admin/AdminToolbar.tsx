import type { ReactNode } from 'react'

type AdminToolbarProps = {
  label: string
  children: ReactNode
  actions?: ReactNode
  summary?: ReactNode
}

export function AdminToolbar({ label, children, actions, summary }: AdminToolbarProps) {
  return (
    <div className="admin-toolbar" role="group" aria-label={label}>
      <div className="admin-toolbar__controls">{children}</div>
      {(summary || actions) && (
        <div className="admin-toolbar__meta">
          {summary && <span className="admin-toolbar__summary" aria-live="polite">{summary}</span>}
          {actions && <div className="admin-toolbar__actions">{actions}</div>}
        </div>
      )}
    </div>
  )
}

export default AdminToolbar
