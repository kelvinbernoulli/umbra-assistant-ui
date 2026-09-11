import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  LockKeyhole,
  Mic,
  Search,
  Square,
  X,
} from 'lucide-react'
import type { VoiceMode } from '../context/UmbraContext'
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap'
import { useSettings } from '../hooks/useSettings'
import { useCommands } from '../hooks/useCommands'

type VoiceStage = 'idle' | 'listening' | 'processing' | 'result' | 'unsupported' | 'disabled' | 'error' | 'request-error'

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
  const { submitCommand, error: commandError, reset: resetCommand } = useCommands()
  const { settings } = useSettings()
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const recognitionSessionRef = useRef(0)
  const suppressRecognitionEndRef = useRef(false)
  const voiceResultRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const [input, setInput] = useState('')
  const [stage, setStage] = useState<VoiceStage>('idle')
  const requestSessionRef = useRef(0)
  const [resultCopy, setResultCopy] = useState('')

  const clearTimer = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = null
  }

  const closeDeck = useCallback(() => {
    requestSessionRef.current += 1
    resetCommand()
    recognitionSessionRef.current += 1
    suppressRecognitionEndRef.current = true
    recognitionRef.current?.abort()
    recognitionRef.current = null
    clearTimer()
    onClose()
  }, [onClose, resetCommand])

  const dialogRef = useDialogFocusTrap<HTMLElement>({
    active: open,
    onClose: closeDeck,
  })

  const processCommand = useCallback((rawValue: string, fromVoice = false) => {
    const value = rawValue.trim()
    if (!value) return
    voiceResultRef.current = fromVoice
    recognitionSessionRef.current += 1
    suppressRecognitionEndRef.current = true
    recognitionRef.current?.abort()
    recognitionRef.current = null
    setInput(value)
    setResultCopy('')
    clearTimer()
    if (/^(search|find)\b/i.test(value)) {
      const query = value.replace(/^(search(?::| for)?|find)\s*/i, '')
      navigate(`/search?q=${encodeURIComponent(query || value)}`)
      closeDeck()
      return
    }
    if (/^(show|open)( me)?( my| the)? (calendar|schedule|agenda)$/i.test(value)) {
      navigate('/calendar')
      closeDeck()
      return
    }
    const session = ++requestSessionRef.current
    setStage('processing')
    void submitCommand(value).then((result) => {
      if (session !== requestSessionRef.current) return
      if (result) {
        setResultCopy(result.message)
        setStage(result.success ? 'result' : 'request-error')
      } else setStage('request-error')
    })
  }, [closeDeck, navigate, submitCommand])
  const startListening = useCallback(() => {
    clearTimer()

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

  if (!open) return null

  const quickActions = [
    { icon: Clock3, label: 'Show my calendar' },
    { icon: Search, label: 'Search for meeting' },
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
            disabled={stage === 'processing'}
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
            <div><strong>Sending command…</strong><span>Waiting for the server response.</span></div>
          </div>
        )}

        {stage === 'request-error' && <div className="command-alert" role="alert"><AlertCircle size={17} /><div><strong>Command could not be completed</strong><span>{commandError || resultCopy || 'Please try again.'}</span></div></div>}
        {stage === 'result' && (
          <div className="result-card" aria-live="polite">
            <span className="result-card__check"><Check size={17} /></span>
            <div><strong>Server response</strong><p>{resultCopy}</p></div>
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
