import { useEffect } from 'react'

/** The supplied loader must be stable (useCallback). Requests abort on hook unmount. */
export function useAutoLoad(load: () => Promise<unknown>) {
  useEffect(() => { void load() }, [load])
}
