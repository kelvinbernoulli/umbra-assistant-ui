import { CheckCircle2, ChevronRight, Download, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { useSettings } from '../hooks/useSettings'
import UnavailableSetting from '../components/UnavailableSetting'

export default function PrivacyDataSettingsPage() {
  const { settings, resetSettings } = useSettings()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notice, setNotice] = useState('')

  const exportData = () => {
    const exportPayload = {
      product: 'Umbra Assistant',
      exportedAt: new Date().toISOString(),
      preferences: settings,
      note: 'This frontend export contains browser-saved settings. This does not export connected source content.',
    }
    const file = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = `umbra-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    setNotice('Your browser-saved Umbra data was exported.')
  }

  const deleteLocalData = () => {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith('umbra-'))
        .forEach((key) => window.localStorage.removeItem(key))
    } catch {
      // Reset in-memory settings even if browser storage is unavailable.
    }

    resetSettings()
    setConfirmDelete(false)
    setNotice('Local Umbra settings were reset to their defaults.')
  }

  return (
    <>
      <section className="settings-section">
        <SectionHeading eyebrow="Memory controls" title="Decide what Umbra can connect" />
        <UnavailableSetting title="Semantic memory search" />
        <UnavailableSetting title="Cross-source suggestions" />
        <UnavailableSetting title="Location-triggered reminders" />
        <label className="setting-row"><div><strong>Memory retention</strong><span>Retention preferences are not available yet.</span></div><select className="setting-control" disabled aria-label="Memory retention"><option>Unavailable</option></select></label>
      </section>
      <section className="settings-section">
        <SectionHeading eyebrow="AI privacy" title="Diagnostics preferences" />
        <UnavailableSetting title="Share de-identified diagnostics" />
      </section>
      <section className="settings-section">
        <SectionHeading eyebrow="Your information" title="Export or remove local data" />
        <div className="data-actions">
          <button type="button" onClick={exportData}>
            <span><Download size={17} /></span>
            <div><strong>Export local preferences</strong><small>Download browser-saved preferences as JSON</small></div>
            <ChevronRight size={16} />
          </button>
          <button type="button" className="danger-action" onClick={() => setConfirmDelete(true)}>
            <span><Trash2 size={17} /></span>
            <div><strong>Reset local Umbra data</strong><small>Remove saved settings from this browser</small></div>
            <ChevronRight size={16} />
          </button>
        </div>

        {confirmDelete && (
          <div className="settings-confirm" role="alert">
            <div><strong>Reset browser data?</strong><span>This removes Umbra settings saved on this device. This action cannot be undone.</span></div>
            <div className="settings-confirm__actions">
              <button className="button button--outline" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="button button--danger" onClick={deleteLocalData}><Trash2 size={14} /> Reset data</button>
            </div>
          </div>
        )}

        {notice && <div className="settings-inline-status" role="status"><CheckCircle2 size={15} /> {notice}</div>}
      </section>
    </>
  )
}
