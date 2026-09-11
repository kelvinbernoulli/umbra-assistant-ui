import { ApiAccess } from '../components/ApiState'
import TimelineFeed from '../components/TimelineFeed'
import { Link } from 'react-router-dom'
export default function CalendarPage() {
  return <div className="page"><div className="page-intro"><p className="eyebrow">Your schedule</p><h1>Calendar records</h1><p className="page-intro__copy">Events and reminders saved in your workspace.</p></div><div className="api-actions"><Link className="button button--outline" to="/connections">Manage calendar connection</Link></div><ApiAccess><TimelineFeed calendar /></ApiAccess></div>
}
