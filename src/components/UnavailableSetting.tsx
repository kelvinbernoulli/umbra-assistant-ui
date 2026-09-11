import { Toggle } from './Toggle'

export default function UnavailableSetting({ title }: { title: string }) {
  return <div className="setting-row"><div><strong>{title}</strong><span>Not available yet.</span></div><Toggle active={false} disabled label={title} /></div>
}
