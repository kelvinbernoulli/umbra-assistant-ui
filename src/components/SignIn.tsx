import { useContext, useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { GoogleAuthStatusContext } from '../context/GoogleAuthStatusContext'
import { googleClientId } from '../constansts/googleAuth'
import { apiReq, getApiErrorMessage } from '../constansts/requests'

export default function SignIn({ signIn }: { signIn: (credential: string) => Promise<void> }) {
  const scriptError = useContext(GoogleAuthStatusContext)
  const [nonce, setNonce] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {

    if (!googleClientId) return
    let active = true
    const controller = new AbortController()
    void apiReq.post<{ nonce: string }>('/auth/challenge', {}, { signal: controller.signal })
      .then(({ data }) => { if (active) setNonce(data.nonce) })
      .catch(cause => { if (active) setError(getApiErrorMessage(cause)) })
    return () => { active = false; controller.abort() }
  }, [attempt])
  async function complete(credential?: string) {
    if (pending) return
    if (!credential) { setError('Google did not return a sign-in credential. Please try again.'); return }
    setPending(true)
    setError(null)
    try { await signIn(credential) }
    catch (cause) { setError(getApiErrorMessage(cause)); setNonce('') }
    finally { setPending(false) }
  }
  return <section className="settings-section account-sign-in">
    <p className="eyebrow">Your account</p><h2>Welcome to your workspace</h2>
    <p>Sign in with Google. Your first sign-in creates your account and personal workspace automatically.</p>
    {!googleClientId ? <p role="alert">Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID and restart the frontend.</p>
      : scriptError ? <p role="alert">Google sign-in could not load. Check your connection and reload this page.</p>
        : nonce && !pending ? <GoogleLogin key={nonce} nonce={nonce} onSuccess={({ credential }) => void complete(credential)} onError={() => setError('Google sign-in failed. Please try again.')} useOneTap={false} />
          : !error && <p role="status">{pending ? 'Signing in…' : 'Preparing Google sign-in…'}</p>}
    {error && <div role="alert"><p>{error}</p><button className="button button--outline" disabled={pending} onClick={() => { setError(null); setNonce(''); setAttempt(value => value + 1) }}>Try again</button></div>}
    <p className="page-intro__copy">You can connect Google Calendar after signing in.</p>
  </section>
}
