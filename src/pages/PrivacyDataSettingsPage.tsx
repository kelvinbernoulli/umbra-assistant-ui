import { CheckCircle2, ChevronRight, Download, LockKeyhole, ShieldCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { Toggle } from '../components/Toggle'
import { useSettings } from '../hooks/useSettings'

export default function PrivacyDataSettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notice, setNotice] = useState('')

  const exportData = () => {
    const exportPayload = {
      product: 'Umbra Assistant',
      exportedAt: new Date().toISOString(),
      preferences: settings,
      note: 'This frontend export contains browser-saved settings. Connected source content is exported by the Umbra backend.',
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
      <div className="settings-note settings-note--prominent">
        <ShieldCheck size={18} />
        <div><strong>Your memory stays separated</strong><span>Every connected source is isolated to your private user namespace.</span></div>
      </div>

      <section className="settings-section">
        <SectionHeading eyebrow="Memory controls" title="Decide what Umbra can connect" />
        <div className="setting-row">
          <div><strong>Semantic memory search</strong><span>Use stored embeddings to find meaning across connected sources.</span></div>
          <Toggle active={settings.semanticSearch} onClick={() => updateSettings({ semanticSearch: !settings.semanticSearch })} label="Semantic memory search" />
        </div>
        <div className="setting-row">
          <div><strong>Cross-source suggestions</strong><span>Connect related messages, emails, and calendar events.</span></div>
          <Toggle active={settings.crossSourceSuggestions} onClick={() => updateSettings({ crossSourceSuggestions: !settings.crossSourceSuggestions })} label="Cross-source suggestions" />
        </div>
        <div className="setting-row">
          <div><strong>Location-triggered reminders</strong><span>Allow location only while a location reminder is active.</span></div>
          <Toggle active={settings.locationTriggers} onClick={() => updateSettings({ locationTriggers: !settings.locationTriggers })} label="Location-triggered reminders" />
        </div>
        <label className="setting-row">
          <div><strong>Memory retention</strong><span>Choose how long indexed content remains searchable.</span></div>
          <select className="setting-control" value={settings.retentionPeriod} onChange={(event) => updateSettings({ retentionPeriod: event.target.value })}>
            <option value="forever">Keep until deleted</option>
            <option value="365-days">One year</option>
            <option value="90-days">90 days</option>
            <option value="30-days">30 days</option>
          </select>
        </label>
      </section>

      <section className="settings-section">
        <SectionHeading eyebrow="AI privacy" title="How your data improves Umbra" />
        <div className="setting-row">
          <div><strong>Share de-identified diagnostics</strong><span>Help improve reliability without sharing message or event content.</span></div>
          <Toggle active={settings.modelImprovement} onClick={() => updateSettings({ modelImprovement: !settings.modelImprovement })} label="Share de-identified diagnostics" />
        </div>
        <div className="settings-note"><LockKeyhole size={15} /><span>Your private source content is never included in this setting.</span></div>
      </section>

      <section className="settings-section">
        <SectionHeading eyebrow="Your information" title="Export or remove local data" />
        <div className="data-actions">
          <button type="button" onClick={exportData}>
            <span><Download size={17} /></span>
            <div><strong>Export your data</strong><small>Download browser-saved preferences as JSON</small></div>
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
