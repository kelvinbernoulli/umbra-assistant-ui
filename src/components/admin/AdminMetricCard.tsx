import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react'

export type AdminMetricTone = 'positive' | 'negative' | 'neutral'

type AdminMetricCardProps = {
  label: string
  value: string
  helper: string
  change?: string
  changeTone?: AdminMetricTone
  icon?: LucideIcon
}

export function AdminMetricCard({
  label,
  value,
  helper,
  change,
  changeTone = 'neutral',
  icon: Icon,
}: AdminMetricCardProps) {
  const TrendIcon = changeTone === 'positive'
    ? ArrowUpRight
    : changeTone === 'negative'
      ? ArrowDownRight
      : Minus

  return (
    <article className="admin-metric">
      <div className="admin-metric__topline">
        <span className="admin-metric__label">{label}</span>
        {Icon && (
          <span className="admin-metric__icon" aria-hidden="true">
            <Icon size={17} />
          </span>
        )}
      </div>
      <strong className="admin-metric__value">{value}</strong>
      <div className="admin-metric__context">
        {change && (
          <span className={`admin-metric__change admin-metric__change--${changeTone}`}>
            <TrendIcon size={13} aria-hidden="true" />
            {change}
          </span>
        )}
        <span>{helper}</span>
      </div>
    </article>
  )
}

export default AdminMetricCard
