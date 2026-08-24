export type AdminStatusTone = 'healthy' | 'warning' | 'error' | 'neutral'

type AdminStatusBadgeProps = {
  label: string
  tone?: AdminStatusTone
}

export function AdminStatusBadge({ label, tone = 'neutral' }: AdminStatusBadgeProps) {
  return (
    <span className={`admin-status admin-status--${tone}`}>
      <span className="admin-status__dot" aria-hidden="true" />
      {label}
    </span>
  )
}

export default AdminStatusBadge
