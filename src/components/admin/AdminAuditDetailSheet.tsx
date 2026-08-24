import { Check, Copy, LockKeyhole, X } from 'lucide-react'
import { useState } from 'react'
import type { AdminAuditEvent } from '../../adminData'
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap'
import AdminStatusBadge from './AdminStatusBadge'

type AdminAuditDetailSheetProps = {
  event: AdminAuditEvent | null
  onClose: () => void
}

export function AdminAuditDetailSheet({ event, onClose }: AdminAuditDetailSheetProps) {
  const [copied, setCopied] = useState(false)
  const sheetRef = useDialogFocusTrap<HTMLElement>({
    active: Boolean(event),
    onClose,
    initialFocusSelector: '[data-sheet-close]',
  })

  if (!event) return null

  const tone = event.severity === 'warning' ? 'warning' : event.severity === 'success' ? 'healthy' : 'neutral'
  const correlationId = `cor_${event.id.replace('evt-', '')}_redacted`

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(correlationId)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="sheet-backdrop" onMouseDown={onClose}>
      <aside ref={sheetRef} className="detail-sheet admin-audit-sheet" onMouseDown={(clickEvent) => clickEvent.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="audit-detail-title">
        <div className="detail-sheet__header">
          <div><span className="eyebrow">Audit event</span><strong>{event.id}</strong></div>
          <button data-sheet-close className="icon-button icon-button--bare" onClick={onClose} aria-label="Close audit details"><X size={18} /></button>
        </div>
        <div className="detail-sheet__content">
          <AdminStatusBadge label={event.severity} tone={tone} />
          <h2 id="audit-detail-title">{event.action}</h2>
          <dl className="admin-detail-list">
            <div><dt>Actor</dt><dd>{event.actor}</dd></div>
            <div><dt>Target</dt><dd>{event.target}</dd></div>
            <div><dt>Category</dt><dd>{event.category}</dd></div>
            <div><dt>Recorded</dt><dd>{event.time}</dd></div>
            <div><dt>Correlation ID</dt><dd>{correlationId}</dd></div>
          </dl>
          <div className="settings-note"><LockKeyhole size={15} /><span>Payload content and private user data are redacted from the admin audit trail.</span></div>
        </div>
        <div className="detail-sheet__actions">
          <button className="button button--outline" onClick={copyId}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy correlation ID'}</button>
          <button className="button button--gold" onClick={onClose}>Done</button>
        </div>
      </aside>
    </div>
  )
}

export default AdminAuditDetailSheet
