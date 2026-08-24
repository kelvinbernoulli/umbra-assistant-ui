export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark${compact ? ' brand-mark--compact' : ''}`} aria-label="Umbra">
      <span className="brand-mark__orb" aria-hidden="true" />
      {!compact && <span className="brand-mark__name">umbra</span>}
    </div>
  )
}
