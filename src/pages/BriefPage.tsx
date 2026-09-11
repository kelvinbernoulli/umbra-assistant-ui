import { ArrowRight, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ApiState } from '../components/ApiState'
import { useBrief } from '../hooks/useBrief'
import { useAutoLoad } from '../hooks/useAutoLoad'

export default function BriefPage() {
  const { brief, fetchBrief, isLoading, error } = useBrief()
  useAutoLoad(fetchBrief)
  return <div className="page page--brief">
    <div className="page-intro page-intro--row">
      <div><p className="eyebrow">Your daily overview</p><h1>Your brief</h1><p className="page-intro__copy">The latest summary from Umbra.</p></div>
      <button className="button button--outline" disabled={isLoading} onClick={() => void fetchBrief()}><RefreshCw size={15} /> Refresh</button>
    </div>
    <ApiState loading={isLoading || (!brief && !error)} error={error} onRetry={fetchBrief} />
    {brief && <section className="brief-card">
      <div className="brief-card__glow" aria-hidden="true" />
      <div className="api-record"><h2>{brief.title}</h2><p className="brief-card__summary">{brief.summary}</p></div>
    </section>}
    <div className="api-actions"><Link className="button button--outline" to="/timeline">Open timeline <ArrowRight size={15} /></Link><Link className="button button--outline" to="/calendar">Calendar records <ArrowRight size={15} /></Link></div>
  </div>
}
