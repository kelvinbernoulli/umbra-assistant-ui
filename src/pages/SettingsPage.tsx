import { ArrowRight, Check, Moon, ShieldCheck, Sun } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/SectionHeading'
import { useUmbra } from '../hooks/useUmbra'
import AccountSettings from '../components/AccountSettings'

export default function SettingsPage() {
  const { theme, setTheme } = useUmbra()

  return (
    <>
      <AccountSettings />
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
        <SectionHeading eyebrow="Workspace role" title="Administration" />
        <Link className="admin-entry-card" to="/admin">
          <span><ShieldCheck size={18} /></span>
          <div><strong>Open admin dashboard</strong><small>View server health and registered source types.</small></div>
          <ArrowRight size={16} />
        </Link>
      </section>
    </>
  )
}
