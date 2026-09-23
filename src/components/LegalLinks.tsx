import { Link } from 'react-router-dom'

export default function LegalLinks() {
  return <nav className="legal-links" aria-label="Legal information">
    <Link to="/privacy">Privacy policy</Link><span aria-hidden="true">·</span><Link to="/terms">Terms of service</Link>
  </nav>
}
