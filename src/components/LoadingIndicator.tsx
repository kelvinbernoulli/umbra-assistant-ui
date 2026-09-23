export default function LoadingIndicator({ label, className = '' }: { label: string; className?: string }) {
  return <span className={`loading-indicator ${className}`} role="status" aria-live="polite">
    <span className="loading-indicator__spinner" aria-hidden="true" />
    <span>{label}</span>
  </span>
}
