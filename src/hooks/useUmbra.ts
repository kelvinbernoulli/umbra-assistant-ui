import { useContext } from 'react'
import { UmbraContext } from '../context/UmbraContext'

export function useUmbra() {
  const value = useContext(UmbraContext)

  if (!value) {
    throw new Error('useUmbra must be used inside UmbraContext')
  }

  return value
}
