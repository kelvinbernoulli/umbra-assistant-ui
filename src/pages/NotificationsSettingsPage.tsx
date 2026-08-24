import { BellRing, CheckCircle2, Clock3 } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'
import { Toggle } from '../components/Toggle'
import { useSettings } from '../hooks/useSettings'

export default function NotificationsSettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [notice, setNotice] = useState('')

  const previewNotification = async () => {
    if (!('Notification' in window)) {
      setNotice('Browser notifications are not supported here. In-app alerts remain available.')
      return
    }

    let permission = window.Notification.permission
    if (permission === 'default') permission = await window.Notification.requestPermission()

    if (permission === 'granted') {
      new window.Notification('Umbra Assistant', {
        body: 'Your afternoon brief is ready. Two items need your attention.',
      })
      setNotice('Preview sent through your browser.')
    } else {
      setNotice('Browser permission was not granted. You can still use in-app alerts.')
    }
  }

  return (
    <>
      <section className="settings-section">
        <SectionHeading eyebrow="Daily brief" title="Choose when Umbra checks in" />
        <div className="setting-row">
          <div><strong>Morning brief</strong><span>Receive your focused daily summary.</span></div>
          <Toggle active={settings.morningBrief} onClick={() => updateSettings({ morningBrief: !settings.morningBrief })} label="Morning brief notifications" />
        </div>
        <label className="setting-row">
          <div><strong>Delivery time</strong><span>Your local time in Africa/Lagos.</span></div>
          <input className="setting-control setting-control--time" type="time" value={settings.briefTime} onChange={(event) => updateSettings({ briefTime: event.target.value })} disabled={!settings.morningBrief} />
        </label>
        <div className="setting-row">
          <div><strong>Weekend briefs</strong><span>Keep Saturday and Sunday in your daily rhythm.</span></div>
          <Toggle active={settings.weekendBriefs} onClick={() => updateSettings({ weekendBriefs: !settings.weekendBriefs })} label="Weekend briefs" />
        </div>
      </section>

      <section className="settings-section">
        <SectionHeading eyebrow="Activity alerts" title="What should interrupt you" />
        <div className="setting-row">
          <div><strong>Important messages</strong><span>Alerts for messages Umbra identifies as time-sensitive.</span></div>
          <Toggle active={settings.importantMessages} onClick={() => updateSettings({ importantMessages: !settings.importantMessages })} label="Important message alerts" />
        </div>
        <div className="setting-row">
          <div><strong>Event reminders</strong><span>Notify you before calendar events begin.</span></div>
          <Toggle active={settings.eventReminders} onClick={() => updateSettings({ eventReminders: !settings.eventReminders })} label="Event reminders" />
        </div>
        <div className="setting-row">
          <div><strong>Command confirmations</strong><span>Show an alert when an Umbra reminder or action is created.</span></div>
          <Toggle active={settings.reminderConfirmations} onClick={() => updateSettings({ reminderConfirmations: !settings.reminderConfirmations })} label="Command confirmations" />
        </div>
      </section>

      <section className="settings-section">
        <SectionHeading eyebrow="Quiet hours" title="Protect your focus" />
        <div className="setting-row">
          <div><strong>Pause non-urgent alerts</strong><span>Critical reminders can still break through.</span></div>
          <Toggle active={settings.quietHours} onClick={() => updateSettings({ quietHours: !settings.quietHours })} label="Quiet hours" />
        </div>
        <div className="settings-time-grid">
          <label><span>From</span><input className="setting-control" type="time" value={settings.quietStart} onChange={(event) => updateSettings({ quietStart: event.target.value })} disabled={!settings.quietHours} /></label>
          <span className="settings-time-grid__rule" aria-hidden="true" />
          <label><span>Until</span><input className="setting-control" type="time" value={settings.quietEnd} onChange={(event) => updateSettings({ quietEnd: event.target.value })} disabled={!settings.quietHours} /></label>
        </div>
      </section>

      <section className="settings-section settings-section--compact">
        <div className="settings-test-row">
          <span className="settings-test-row__icon"><BellRing size={18} /></span>
          <div><strong>Browser notifications</strong><span>Send a private preview to verify browser permission.</span></div>
          <button className="button button--outline" onClick={previewNotification}><Clock3 size={15} /> Send preview</button>
        </div>
        <div className="setting-row">
          <div><strong>Email digest</strong><span>Bundle non-urgent activity into one daily email.</span></div>
          <Toggle active={settings.emailDigest} onClick={() => updateSettings({ emailDigest: !settings.emailDigest })} label="Email digest" />
        </div>
        {notice && <div className="settings-inline-status" role="status"><CheckCircle2 size={15} /> {notice}</div>}
      </section>
    </>
  )
}
