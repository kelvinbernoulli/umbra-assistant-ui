import { googleClientId } from '../constansts/googleAuth'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'

type ConnectCalendarProps = {
  onConnected: (message: string) => void
  disabled?: boolean
}

export default function ConnectCalendar(props: ConnectCalendarProps) {
  if (!googleClientId) return <p className="page-intro__copy">Google Calendar connection is not configured yet.</p>
  return <GoogleCalendarButton {...props} />
}

function GoogleCalendarButton({ onConnected, disabled = false }: ConnectCalendarProps) {
  const { connect, isLoading, isReady, error } = useGoogleCalendar(onConnected)
  return <div className="google-connection">
    <button className="button button--gold" onClick={connect} disabled={disabled || !isReady || isLoading}>
      {isLoading ? 'Connecting Google Calendar…' : 'Connect Google Calendar'}
    </button>
    {!isReady && !error && <p role="status">Loading Google sign-in…</p>}
    {error && <p role="alert">{error}</p>}
  </div>
}
