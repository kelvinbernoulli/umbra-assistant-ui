import { ArrowRight, Check, Moon, ShieldCheck, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { Toggle } from '../components/Toggle'
import { useSettings } from '../hooks/useSettings'
import { useUmbra } from '../hooks/useUmbra'

export default function SettingsPage() {
  const { theme, setTheme } = useUmbra()
  const { settings, updateSettings } = useSettings()

  return (
    <>
      <section className="settings-section">
        <SectionHeading eyebrow="Appearance" title="Choose your atmosphere" />
        <div className="theme-options" role="radiogroup" aria-label="Color theme">
          <button className={`theme-option${theme === 'dark' ? ' theme-option--active' : ''}`} onClick={() => setTheme('dark')} role="radio" aria-checked={theme === 'dark'}>
            <span className="theme-option__preview theme-option__preview--dark"><i /><i /><i /></span>
            <span><strong><Moon size={15} /> Dark</strong><small>The original eclipse-inspired workspace</small></span>
            <span className="theme-option__check">{theme === 'dark' && <Check size={14} />}</span>
          </button>
          <button className={`theme-option${theme === 'light' ? ' theme-option--active' : ''}`} onClick={() => setTheme('light')} role="radio" aria-checked={theme === 'light'}>
            <span className="theme-option__preview theme-option__preview--light"><i /><i /><i /></span>
            <span><strong><Sun size={15} /> Light</strong><small>A warm, clear workspace for daytime</small></span>
            <span className="theme-option__check">{theme === 'light' && <Check size={14} />}</span>
          </button>
        </div>
      </section>

      <section className="settings-section">
        <SectionHeading eyebrow="Daily rhythm" title="Brief & suggestions" />
        <div className="setting-row">
          <div><strong>Morning brief</strong><span>Prepare a focused summary every morning at 7:30.</span></div>
          <Toggle active={settings.morningBrief} onClick={() => updateSettings({ morningBrief: !settings.morningBrief })} label="Morning brief" />
        </div>
        <div className="setting-row">
          <div><strong>Proactive suggestions</strong><span>Surface useful actions when Umbra finds a clear connection.</span></div>
          <Toggle active={settings.proactiveSuggestions} onClick={() => updateSettings({ proactiveSuggestions: !settings.proactiveSuggestions })} label="Proactive suggestions" />
        </div>
      </section>

      <section className="settings-section">
        <SectionHeading eyebrow="Workspace role" title="Administration" />
        <Link className="admin-entry-card" to="/admin">
          <span><ShieldCheck size={18} /></span>
          <div><strong>Open admin dashboard</strong><small>Manage aggregate analytics, users, sources, and system health.</small></div>
          <ArrowRight size={16} />
        </Link>
      </section>
    </>
  )
}
