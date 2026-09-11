import { Link } from 'react-router-dom'
import ServerHealthPanel from '../../components/ServerHealthPanel'
export default function AdminOverviewPage() {
  return <><ServerHealthPanel /><div className="api-actions"><Link className="button button--outline" to="/admin/sources">View registered sources</Link></div><p className="page-intro__copy">Usage analytics are not available yet.</p></>
}
