import { ArrowLeft, X } from 'lucide-react'
import type { TimelineEvent } from '../types/api'
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap'
import { formatTimestamp, sourceLabel, sourceStyle } from '../utils/serverData'
import { SourceBadge, SourceGlyph } from './SourceBadge'

export default function DetailSheet({ item, onClose }: { item: TimelineEvent; onClose: () => void }) {
  const sheetRef = useDialogFocusTrap<HTMLElement>({ onClose, focusableSelector: 'button:not(:disabled), a[href]', initialFocusSelector: 'button' })
  return <div className="sheet-backdrop" onMouseDown={onClose}>
    <aside ref={sheetRef} className="detail-sheet" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${item.title} details`}>
      <div className="detail-sheet__header"><button className="icon-button icon-button--bare detail-sheet__back" onClick={onClose} aria-label="Back to timeline"><ArrowLeft size={18} /></button><SourceBadge source={item.source} /><button className="icon-button icon-button--bare" onClick={onClose} aria-label="Close details"><X size={18} /></button></div>
      <div className="detail-sheet__content"><span className="eyebrow">{item.type}</span><h2>{item.title}</h2>
        <div className="detail-sheet__sender"><span className={`source-icon source-icon--${sourceStyle(item.source)}`}><SourceGlyph source={item.source} /></span><div><strong>{sourceLabel(item.source)}</strong><span>Saved {formatTimestamp(item.timestamp)}</span></div></div>
        <p className="record-detail-text">{item.detail}</p>
      </div>
      <div className="detail-sheet__actions"><button className="button button--outline" onClick={onClose}>Back to your workspace</button></div>
    </aside>
  </div>
}
