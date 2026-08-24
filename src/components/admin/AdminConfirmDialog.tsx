import { AlertTriangle, X } from 'lucide-react'
import { useDialogFocusTrap } from '../../hooks/useDialogFocusTrap'

type AdminConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  danger?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
}: AdminConfirmDialogProps) {
  const dialogRef = useDialogFocusTrap<HTMLDivElement>({
    active: open,
    onClose: onCancel,
    initialFocusSelector: '[data-dialog-cancel]',
  })

  if (!open) return null

  return (
    <div className="admin-dialog-backdrop" onMouseDown={onCancel}>
      <div ref={dialogRef} className="admin-dialog" role="alertdialog" aria-modal="true" aria-labelledby="admin-dialog-title" aria-describedby="admin-dialog-description" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button icon-button--bare admin-dialog__close" onClick={onCancel} aria-label="Close confirmation"><X size={17} /></button>
        <span className={`admin-dialog__icon${danger ? ' admin-dialog__icon--danger' : ''}`}><AlertTriangle size={20} /></span>
        <div>
          <p className="eyebrow">Confirm admin action</p>
          <h2 id="admin-dialog-title">{title}</h2>
          <p id="admin-dialog-description">{description}</p>
        </div>
        <div className="admin-dialog__actions">
          <button data-dialog-cancel className="button button--outline" onClick={onCancel}>Cancel</button>
          <button className={`button ${danger ? 'button--danger' : 'button--gold'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

export default AdminConfirmDialog
