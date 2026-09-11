import { ApiState } from '../../components/ApiState'
import { useTypeRegistry } from '../../hooks/useTypeRegistry'
import { useAutoLoad } from '../../hooks/useAutoLoad'
import { sourceLabel } from '../../utils/serverData'
import type { RegistryKind } from '../../types/api'
export default function AdminSourcesPage() {
  return <><Registry kind="sources" title="Registered sources" /><Registry kind="document-types" title="Document types" /></>
}
function Registry({ kind, title }: { kind: RegistryKind; title: string }) {
  const { items, fetchTypes, error, isLoading } = useTypeRegistry(kind)
  useAutoLoad(fetchTypes)
  return <section className="admin-panel">
    <div className="admin-panel__heading"><h2>{title}</h2><button className="button button--outline" disabled={isLoading} onClick={() => void fetchTypes()}>Refresh {title.toLowerCase()}</button></div>
    <ApiState loading={isLoading || (!items && !error)} error={error} empty={items && !items.length ? 'No entries registered.' : undefined} onRetry={fetchTypes} />
    {items && <div className="api-registry">{items.map((item) => <article className="api-record" key={item.name}><h3>{kind === 'sources' ? sourceLabel(item.name) : item.name}</h3><p>{item.is_default ? 'Built-in' : 'Custom'}</p></article>)}</div>}
  </section>
}
