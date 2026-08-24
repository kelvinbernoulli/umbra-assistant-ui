import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, ChevronDown, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import DetailSheet from '../components/DetailSheet'
import { SourceBadge, SourceGlyph } from '../components/SourceBadge'
import { searchResults, sourceMeta, timelineItems, type Source, type TimelineItem } from '../data'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  return <SearchPageContent key={urlQuery} urlQuery={urlQuery} />
}

function SearchPageContent({ urlQuery }: { urlQuery: string }) {
  const [, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(urlQuery)
  const [source, setSource] = useState<'all' | Source>('all')
  const [selected, setSelected] = useState<TimelineItem | null>(null)

  const results = useMemo(() => {
    if (!urlQuery) return []
    const normalized = urlQuery.toLowerCase()
    let matches = searchResults.filter((result) => {
      if (/q3|quarter|report|maya|acquisition/.test(normalized)) return result.id.startsWith('result-q3')
      if (/dentist|dental|checkup/.test(normalized)) return result.id === 'result-dentist'
      if (/flight|travel|new york|jfk|confirmation/.test(normalized)) return result.id === 'result-flight'
      if (/reply|respond|waiting|dave|dinner/.test(normalized)) return result.id === 'result-dave' || result.id === 'result-q3-email'
      if (/family|sunday|lunch|address/.test(normalized)) return result.id === 'result-family'
      const terms = normalized.split(/\W+/).filter((term) => term.length > 3)
      const haystack = `${result.title} ${result.context} ${result.snippet}`.toLowerCase()
      return terms.some((term) => haystack.includes(term))
    })
    if (source !== 'all') matches = matches.filter((result) => result.source === source)
    return matches
  }, [source, urlQuery])

  const search = (event: FormEvent) => {
    event.preventDefault()
    if (query.trim()) setSearchParams({ q: query.trim() })
    else setSearchParams({})
  }

  const chooseSuggestion = (value: string) => {
    setQuery(value)
    setSearchParams({ q: value })
  }

  return (
    <div className="page page--search">
      <div className="page-intro search-intro">
        <p className="eyebrow">Semantic memory</p>
        <h1>Find anything, by meaning.</h1>
        <p className="page-intro__copy">You don’t need the exact words. Ask the way you remember it.</p>
      </div>
      <form className="memory-search" onSubmit={search}>
        <Search size={20} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What did Maya say about the Q3 report?" aria-label="Search memory" />
        {query && <button type="button" className="memory-search__clear" onClick={() => { setQuery(''); setSearchParams({}) }} aria-label="Clear search"><X size={16} /></button>}
        <button className="button button--gold" type="submit">Search</button>
      </form>

      {!urlQuery ? (
        <div className="search-start">
          <div className="search-start__orb"><Search size={21} /></div>
          <h2>Search across your whole digital life</h2>
          <p>Umbra understands the idea behind your question, not only matching keywords.</p>
          <div className="suggested-searches">
            {[
              'What needs my reply today?',
              'Everything about the Q3 report',
              'When is my next dentist appointment?',
              'Travel confirmations from this month',
            ].map((suggestion) => (
              <button key={suggestion} onClick={() => chooseSuggestion(suggestion)}><Sparkles size={14} /> {suggestion}<ArrowRight size={14} /></button>
            ))}
          </div>
          <div className="privacy-note"><ShieldCheck size={16} /><span><strong>Your memory stays yours.</strong> Every result is isolated to your private user namespace.</span></div>
        </div>
      ) : (
        <div className="search-results">
          <div className="search-results__summary">
            <div><span className="eyebrow">Best matches</span><h2>{results.length} things connected to “{urlQuery}”</h2></div>
            <button className="button button--outline"><ChevronDown size={14} /> Most relevant</button>
          </div>
          <div className="filter-row filter-row--search">
            {(['all', 'whatsapp', 'gmail', 'calendar'] as const).map((filter) => (
              <button key={filter} className={`filter-pill${source === filter ? ' filter-pill--active' : ''}`} onClick={() => setSource(filter)}>
                {filter === 'all' ? 'All sources' : sourceMeta[filter].label}
              </button>
            ))}
          </div>
          <div className="result-list">
            {results.map((result) => (
              <button
                type="button"
                className="result-item"
                key={result.id}
                onClick={() => setSelected(timelineItems.find((item) => item.id === result.timelineId) ?? null)}
              >
                <div className={`source-icon source-icon--${result.source}`}><SourceGlyph source={result.source} size={18} /></div>
                <div className="result-item__body">
                  <div className="result-item__top"><SourceBadge source={result.source} quiet /><span>{result.score}</span></div>
                  <h3>{result.title}</h3>
                  <span className="result-item__context">{result.context}</span>
                  <p>{result.snippet}</p>
                </div>
                <span className="round-arrow" aria-hidden="true"><ArrowRight size={16} /></span>
              </button>
            ))}
            {!results.length && <div className="empty-state"><Search size={24} /><strong>No matches in this source</strong><span>Try choosing all sources.</span></div>}
          </div>
        </div>
      )}
      {selected && <DetailSheet item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
