import { ArrowLeft, Clock3, ExternalLink, Paperclip, Sparkles, X } from 'lucide-react'
import { sourceMeta, type TimelineItem } from '../data'
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap'
import { SourceBadge, SourceGlyph } from './SourceBadge'

function DetailSheet({ item, onClose }: { item: TimelineItem; onClose: () => void }) {
  const sheetRef = useDialogFocusTrap<HTMLElement>({
    onClose,
    focusableSelector: 'button:not(:disabled), a[href]',
    initialFocusSelector: 'button',
  })

  return (
    <div className="sheet-backdrop" onMouseDown={onClose}>
      <aside ref={sheetRef} className="detail-sheet" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${item.title} details`}>
        <div className="detail-sheet__header">
          <button className="icon-button icon-button--bare detail-sheet__back" onClick={onClose} aria-label="Back to timeline"><ArrowLeft size={18} /></button>
          <SourceBadge source={item.source} />
          <button className="icon-button icon-button--bare" onClick={onClose} aria-label="Close details"><X size={18} /></button>
        </div>
        <div className="detail-sheet__content">
          <span className="eyebrow">{item.kind} · {item.time}</span>
          <h2>{item.title}</h2>
          <div className="detail-sheet__sender">
            <span className={`source-icon source-icon--${item.source}`}><SourceGlyph source={item.source} /></span>
            <div><strong>{item.sender}</strong><span>{item.meta}</span></div>
          </div>
          <p>{item.body}</p>
          {item.attachment && <div className="attachment"><Paperclip size={15} /><span>{item.attachment.name}</span><small>{item.attachment.size}</small></div>}
          <div className="detail-insight"><Sparkles size={16} /><div><strong>Umbra noticed</strong><p>{item.insight ?? 'This connects to two other items in your memory.'}</p></div></div>
        </div>
        <div className="detail-sheet__actions">
          <button className="button button--outline"><Clock3 size={15} /> Remind me</button>
          <button className="button button--gold">Open in {sourceMeta[item.source].label} <ExternalLink size={14} /></button>
        </div>
      </aside>
    </div>
  )
}

export default DetailSheet
