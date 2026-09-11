import { useState } from 'react'
import { useUmbra } from '../hooks/useUmbra'
import { getApiErrorMessage } from '../constansts/requests'

export default function AccountSettings() {
  const { auth, logout } = useUmbra()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function signOut() {
    setPending(true)
    setError(null)
    try { await logout() }
    catch (cause) { setError(getApiErrorMessage(cause)); setPending(false) }
  }
  return <section className="settings-section">
    <p className="eyebrow">Your account</p><h2>{auth.user.name}</h2><p>{auth.user.email}</p>
    <p className="page-intro__copy">Your workspace is connected automatically when you sign in.</p>
    <button className="button button--outline" disabled={pending} onClick={() => void signOut()}>{pending ? 'Signing out…' : 'Sign out'}</button>
    {error && <p role="alert">{error}</p>}
  </section>
}
