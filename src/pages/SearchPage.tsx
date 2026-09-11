import { useCallback, useState, type FormEvent } from 'react'
import { ArrowRight, Search, ShieldCheck, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ApiAccess, ApiState } from '../components/ApiState'
import { useSearch } from '../hooks/useSearch'
import { useAutoLoad } from '../hooks/useAutoLoad'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const choose = (value: string) => setParams(value ? { q: value } : {})
  return <div className="page page--search"><div className="page-intro search-intro"><p className="eyebrow">Your memory</p><h1>Find what matters.</h1><p className="page-intro__copy">Search the messages, events, and documents you’ve saved.</p></div>
    <SearchForm key={query} query={query} onSearch={choose} />
    {query ? <ApiAccess><SearchMatches key={query} query={query} /></ApiAccess> : <div className="search-start"><div className="search-start__orb"><Search size={21} /></div><h2>Search across your digital life</h2><p>Find matching words across your connected sources.</p><div className="suggested-searches">{['Meeting notes', 'Travel confirmations', 'Invoices', 'Appointments'].map(suggestion => <button key={suggestion} onClick={() => choose(suggestion)}><Search size={14} />{suggestion}<ArrowRight size={14} /></button>)}</div><div className="privacy-note"><ShieldCheck size={16} /><span><strong>Your memory stays yours.</strong> Sign in to search your workspace.</span></div></div>}
  </div>
}

function SearchForm({ query, onSearch }: { query: string; onSearch: (value: string) => void }) {
  const [input, setInput] = useState(query)
  function submit(event: FormEvent) { event.preventDefault(); onSearch(input.trim()) }
  return <form className="memory-search" onSubmit={submit}><Search size={20} /><input aria-label="Search memory" placeholder="What are you looking for?" value={input} onChange={event => setInput(event.target.value)} />{input && <button type="button" className="memory-search__clear" onClick={() => { setInput(''); onSearch('') }} aria-label="Clear search"><X size={16} /></button>}<button type="submit" className="button button--gold">Search</button></form>
}

function SearchMatches({ query }: { query: string }) {
  const { results, search, error, isLoading } = useSearch()
  const load = useCallback(() => search({ query, limit: 100 }), [search, query])
  useAutoLoad(load)
  return <section className="search-results"><div className="search-results__summary"><div><span className="eyebrow">Your results</span><h2>{results ? results.length + ' results for “' + query + '”' : 'Searching your memory'}</h2></div><span className="page-intro__copy">Newest first</span></div>
    <ApiState loading={isLoading || (!results && !error)} error={error} empty={results && !results.length ? 'No matching items. Try different words.' : undefined} onRetry={load} />
    <div className="result-list">{results?.map(result => <article className="result-item" key={result.id}><div className="source-icon source-icon--manual"><Search size={18} /></div><div className="result-item__body"><div className="result-item__top"><span className="eyebrow">Saved memory</span></div><p className="record-detail-text">{result.snippet}</p></div></article>)}</div>
    {results && <p className="page-intro__copy dashboard-footnote">Up to 100 matches.</p>}
  </section>
}
