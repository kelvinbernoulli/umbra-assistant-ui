import { useId, type CSSProperties } from 'react'

export type AdminTrendPoint = {
  label: string
  value: number
  displayValue?: string
}

type AdminTrendChartProps = {
  title: string
  description?: string
  points: AdminTrendPoint[]
  formatValue?: (value: number) => string
}

type ChartBarStyle = CSSProperties & {
  '--admin-bar-height': string
}

const defaultFormatValue = (value: number) => value.toLocaleString()

export function AdminTrendChart({
  title,
  description,
  points,
  formatValue = defaultFormatValue,
}: AdminTrendChartProps) {
  const captionId = useId()
  const highestValue = Math.max(...points.map((point) => point.value), 1)

  return (
    <figure className="admin-chart" aria-labelledby={captionId}>
      <figcaption className="admin-chart__caption" id={captionId}>
        <strong>{title}</strong>
        {description && <span>{description}</span>}
      </figcaption>
      {points.length > 0 ? (
        <ol className="admin-chart__plot">
          {points.map((point) => {
            const height = Math.max(0, Math.min(100, (point.value / highestValue) * 100))
            const displayValue = point.displayValue ?? formatValue(point.value)
            const style: ChartBarStyle = { '--admin-bar-height': `${height}%` }

            return (
              <li className="admin-chart__point" key={point.label} aria-label={`${point.label}: ${displayValue}`}>
                <span className="admin-chart__value" aria-hidden="true">{displayValue}</span>
                <span className="admin-chart__track" aria-hidden="true">
                  <span className="admin-chart__bar" style={style} />
                </span>
                <span className="admin-chart__label" aria-hidden="true">{point.label}</span>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="admin-chart__empty">No trend data is available for this period.</p>
      )}
    </figure>
  )
}

export default AdminTrendChart
