import { Bell, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotificationsPage() {
  return <div className="page">
    <div className="page-intro page-intro--row"><div><p className="eyebrow">Your updates</p><h1>Notifications</h1><p className="page-intro__copy">Updates from your Umbra workspace.</p></div><Link className="button button--outline" to="/settings/notifications"><Settings size={15} /> Notification preferences</Link></div>
    <section className="timeline-feed"><div className="empty-state"><Bell size={25} /><strong>Notifications are not available yet</strong><span>Notification delivery hasn’t been connected. Updates will appear here when it is available.</span></div></section>
  </div>
}
