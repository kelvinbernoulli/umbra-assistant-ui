import { useCallback, useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ApiAccess, ApiState } from '../components/ApiState'
import { useSearch } from '../hooks/useSearch'
import { useAutoLoad } from '../hooks/useAutoLoad'
export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  return <div className="page page--search">
    <div className="page-intro"><p className="eyebrow">Workspace memory</p><h1>Search your memory</h1><p className="page-intro__copy">Find matching text across your saved items.</p></div>
    <SearchForm key={query} query={query} onSearch={(value) => setParams(value ? { q: value } : {})} />
    <ApiAccess>{query ? <SearchMatches key={query} query={query} /> : <div className="empty-state"><Search size={24} /><strong>What are you looking for?</strong><span>Enter words from a message, event, or document.</span></div>}</ApiAccess>
  </div>
}
function SearchForm({ query, onSearch }: { query: string; onSearch: (value: string) => void }) {
  const [input, setInput] = useState(query)
  function submit(event: FormEvent) { event.preventDefault(); onSearch(input.trim()) }
  return <form className="memory-search" onSubmit={submit}><Search size={20} /><input aria-label="Search memory" placeholder="Search saved items…" value={input} onChange={(event) => setInput(event.target.value)} /><button type="submit" className="button button--gold">Search</button></form>
}
function SearchMatches({ query }: { query: string }) {
  const { results, search, error, isLoading } = useSearch()
  const load = useCallback(() => search({ query, limit: 100 }), [search, query])
  useAutoLoad(load)
  return <section className="search-results">
    <ApiState loading={isLoading || (!results && !error)} error={error} empty={results && !results.length ? 'No matching items. Try different words.' : undefined} onRetry={load} />
    {results && <><h2>{results.length} results for “{query}”</h2><div className="result-list">{results.map((result) => <article className="api-record" key={result.id}><p className="api-record__text">{result.snippet}</p></article>)}</div><p className="page-intro__copy">Up to 100 matches, newest first.</p></>}
  </section>
}
