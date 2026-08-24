import { useEffect, useRef } from 'react'

type DialogFocusTrapOptions = {
  active?: boolean
  onClose: () => void
  focusableSelector?: string
  initialFocusSelector?: string
}

const defaultFocusableSelector = 'button:not(:disabled), input:not(:disabled), a[href]'

export function useDialogFocusTrap<T extends HTMLElement>({
  active = true,
  onClose,
  focusableSelector = defaultFocusableSelector,
  initialFocusSelector,
}: DialogFocusTrapOptions) {
  const dialogRef = useRef<T>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return

      const controls = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector)
      if (!controls?.length) return

      const first = controls[0]
      const last = controls[controls.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKey)

    if (initialFocusSelector) {
      window.requestAnimationFrame(() => {
        dialogRef.current?.querySelector<HTMLElement>(initialFocusSelector)?.focus()
      })
    }

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKey)
      window.requestAnimationFrame(() => previousFocusRef.current?.focus())
    }
  }, [active, focusableSelector, initialFocusSelector, onClose])

  return dialogRef
}
