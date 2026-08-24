import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found__orb" /><span className="eyebrow">404 · Lost in the penumbra</span>
      <h1>This page slipped out of view.</h1><p>Your memory is still right where you left it.</p>
      <Link className="button button--gold" to="/">Return to your brief</Link>
    </div>
  )
}
