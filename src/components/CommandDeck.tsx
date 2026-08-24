import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  LockKeyhole,
  MessageCircle,
  Mic,
  Search,
  Square,
  X,
} from 'lucide-react'
import type { ParsedCommand, VoiceMode } from '../context/UmbraContext'
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap'
import { useSettings } from '../hooks/useSettings'
import { useUmbra } from '../hooks/useUmbra'

type VoiceStage = 'idle' | 'listening' | 'processing' | 'confirm' | 'result' | 'unsupported' | 'disabled' | 'error'

type SpeechResultListLike = {
  length: number
  [index: number]: {
    0: { transcript: string }
    isFinal: boolean
  }
}

type SpeechRecognitionEventLike = Event & { results: SpeechResultListLike }

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

function CommandDeck({ open, initialMode, onClose }: { open: boolean; initialMode: VoiceMode; onClose: () => void }) {
  const navigate = useNavigate()
  const { addReminder } = useUmbra()
  const { settings } = useSettings()
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const recognitionSessionRef = useRef(0)
  const suppressRecognitionEndRef = useRef(false)
  const voiceResultRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const [input, setInput] = useState('')
  const [stage, setStage] = useState<VoiceStage>('idle')
  const [parsed, setParsed] = useState<ParsedCommand | null>(null)
  const [resultCopy, setResultCopy] = useState('')

  const clearTimer = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = null
  }

  const closeDeck = useCallback(() => {
    recognitionSessionRef.current += 1
    suppressRecognitionEndRef.current = true
    recognitionRef.current?.abort()
    recognitionRef.current = null
    clearTimer()
    onClose()
  }, [onClose])

  const dialogRef = useDialogFocusTrap<HTMLElement>({
    active: open,
    onClose: closeDeck,
  })

  const processCommand = useCallback((rawValue: string, fromVoice = false) => {
    const value = rawValue.trim()
    if (!value) return
    voiceResultRef.current = fromVoice
    if (recognitionRef.current) {
      recognitionSessionRef.current += 1
      suppressRecognitionEndRef.current = true
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setInput(value)
    setStage('processing')
    setParsed(null)
    setResultCopy('')
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      const lowered = value.toLowerCase()
      if (lowered.includes('remind') || lowered.includes('call dave')) {
        setParsed({
          title: 'Call Dave',
          description: lowered.includes('leave') ? 'When you leave your current location' : 'Today at 6:00 PM',
          meta: 'Umbra will ask for location access only when this reminder is active.',
        })
        setStage('confirm')
        return
      }
      if (lowered.includes('summarize') && lowered.includes('whatsapp')) {
        setResultCopy('You received 34 WhatsApp messages this week. Two need replies: Dave’s dinner plan and Ada’s question about Sunday lunch.')
        setStage('result')
        return
      }
      if (lowered.includes('calendar') || lowered.includes('schedule') || lowered.includes('agenda') || /what(?:'s| is) on today/.test(lowered)) {
        navigate('/calendar')
        closeDeck()
        return
      }
      const cleaned = value.replace(/^search(?::| for)?\s*/i, '').replace(/^find\s*/i, '')
      navigate(`/search?q=${encodeURIComponent(cleaned || value)}`)
      closeDeck()
    }, 720)
  }, [closeDeck, navigate])

  const startListening = useCallback(() => {
    clearTimer()
    setParsed(null)
    setResultCopy('')
    if (!settings.voiceCommands) {
      setStage('disabled')
      return
    }
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Recognition) {
      setStage('unsupported')
      return
    }
    recognitionSessionRef.current += 1
    recognitionRef.current?.abort()
    const recognition = new Recognition()
    const session = recognitionSessionRef.current
    suppressRecognitionEndRef.current = false
    recognition.lang = settings.recognitionLanguage
    recognition.interimResults = true
    recognition.continuous = false
    let latestTranscript = ''
    recognition.onresult = (event) => {
      if (session !== recognitionSessionRef.current) return
      let liveTranscript = ''
      for (let index = 0; index < event.results.length; index += 1) {
        const text = event.results[index][0]?.transcript ?? ''
        liveTranscript += text
      }
      latestTranscript = liveTranscript.trim()
      setInput(latestTranscript)
    }
    recognition.onerror = () => {
      if (session !== recognitionSessionRef.current) return
      suppressRecognitionEndRef.current = true
      setStage('error')
      recognitionRef.current = null
    }
    recognition.onend = () => {
      if (session !== recognitionSessionRef.current) return
      recognitionRef.current = null
      if (suppressRecognitionEndRef.current) {
        suppressRecognitionEndRef.current = false
        return
      }
      if (latestTranscript && settings.autoSubmitVoice) processCommand(latestTranscript, true)
      else if (latestTranscript) {
        voiceResultRef.current = true
        setInput(latestTranscript)
        setStage('idle')
      } else setStage((current) => current === 'listening' ? 'idle' : current)
    }
    recognitionRef.current = recognition
    setInput('')
    setStage('listening')
    try {
      recognition.start()
    } catch {
      setStage('error')
    }
  }, [processCommand, settings.autoSubmitVoice, settings.recognitionLanguage, settings.voiceCommands])

  useEffect(() => {
    if (!open) return
    timerRef.current = window.setTimeout(() => {
      inputRef.current?.focus()
      if (initialMode === 'voice') startListening()
    }, 120)
    return () => {
      clearTimer()
      recognitionSessionRef.current += 1
      suppressRecognitionEndRef.current = true
      recognitionRef.current?.abort()
      recognitionRef.current = null
    }
  }, [initialMode, open, startListening])

  useEffect(() => {
    if (stage !== 'result' || !resultCopy || !voiceResultRef.current || !settings.spokenConfirmations || !('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(resultCopy)
    utterance.lang = settings.responseLanguage === 'same'
      ? settings.recognitionLanguage
      : settings.responseLanguage
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)

    return () => window.speechSynthesis.cancel()
  }, [resultCopy, settings.recognitionLanguage, settings.responseLanguage, settings.spokenConfirmations, stage])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    voiceResultRef.current = false
    processCommand(input)
  }

  const confirmReminder = () => {
    if (parsed) addReminder(parsed)
    setStage('processing')
    timerRef.current = window.setTimeout(() => {
      setResultCopy('Done — I’ll remind you to call Dave when you leave.')
      setStage('result')
    }, 520)
  }

  if (!open) return null

  const quickActions = [
    { icon: Clock3, label: 'Remind me to call Dave when I leave' },
    { icon: Search, label: 'Everything about the Q3 report' },
    { icon: MessageCircle, label: 'Summarize this week’s WhatsApp messages' },
  ]

  return (
    <div className="command-backdrop" onMouseDown={closeDeck}>
      <section
        ref={dialogRef}
        className={`command-deck${stage === 'listening' ? ' command-deck--listening' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="command-deck__topline">
          <div className="command-deck__identity">
            <span className="mini-orb" />
            <span id="command-title">Ask Umbra</span>
          </div>
          <button className="icon-button icon-button--bare" onClick={closeDeck} aria-label="Close command deck">
            <X size={18} />
          </button>
        </div>

        <form className="command-input" onSubmit={submit}>
          <Search size={18} className="command-input__search" />
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={stage === 'listening' ? 'Listening…' : 'Search your memory or give a command…'}
            aria-label="Search or command"
          />
          <button
            type="button"
            className={`voice-button${stage === 'listening' ? ' voice-button--active' : ''}`}
            onClick={stage === 'listening' ? () => recognitionRef.current?.stop() : startListening}
            disabled={stage === 'processing' || stage === 'confirm'}
            aria-label={stage === 'listening' ? 'Stop listening' : 'Start voice command'}
          >
            {stage === 'listening' ? <Square size={14} fill="currentColor" /> : <Mic size={18} />}
          </button>
          <button className="send-button" type="submit" disabled={!input.trim() || stage === 'processing'} aria-label="Run command">
            <ArrowRight size={17} />
          </button>
        </form>

        {stage === 'listening' && (
          <div className="voice-state" aria-live="polite">
            <div className="waveform" aria-hidden="true">
              {Array.from({ length: 17 }, (_, index) => <span key={index} />)}
            </div>
            <div>
              <strong>Listening</strong>
              <span>Speak naturally. I’ll show you what I heard.</span>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div className="processing-state" aria-live="polite">
            <span className="processing-orb" />
            <div><strong>Making sense of that…</strong><span>Finding the right context and action.</span></div>
          </div>
        )}

        {stage === 'confirm' && parsed && (
          <div className="intent-card" aria-live="polite">
            <div className="intent-card__icon"><Clock3 size={18} /></div>
            <div className="intent-card__body">
              <span className="eyebrow">Ready to create</span>
              <strong>{parsed.title}</strong>
              <p>{parsed.description}</p>
              <small><LockKeyhole size={11} /> {parsed.meta}</small>
            </div>
            <div className="intent-card__actions">
              <button className="button button--ghost" onClick={() => setStage('idle')}>Cancel</button>
              <button className="button button--gold" onClick={confirmReminder}><Check size={15} /> Confirm</button>
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="result-card" aria-live="polite">
            <span className="result-card__check"><Check size={17} /></span>
            <div><strong>Done</strong><p>{resultCopy}</p></div>
          </div>
        )}

        {(stage === 'unsupported' || stage === 'disabled' || stage === 'error') && (
          <div className="command-alert" aria-live="polite">
            <AlertCircle size={17} />
            <div>
              <strong>{stage === 'unsupported' ? 'Voice isn’t available in this browser' : stage === 'disabled' ? 'Voice commands are turned off' : 'I couldn’t access the microphone'}</strong>
              <span>{stage === 'disabled' ? 'Turn them on in Voice & language settings, or type above.' : 'You can still type the same command above.'}</span>
            </div>
          </div>
        )}

        {stage === 'idle' && (
          <div className="command-suggestions">
            <div className="command-suggestions__label"><span>Try asking</span><span>Enter to send</span></div>
            {quickActions.map((action) => (
              <button key={action.label} onClick={() => processCommand(action.label)}>
                <span className="suggestion-icon"><action.icon size={15} /></span>
                <span>{action.label}</span>
                <ChevronRight size={15} className="suggestion-arrow" />
              </button>
            ))}
          </div>
        )}

        <div className="command-deck__footer">
          <span><LockKeyhole size={11} /> Results are private to your workspace</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </section>
    </div>
  )
}

export default CommandDeck
