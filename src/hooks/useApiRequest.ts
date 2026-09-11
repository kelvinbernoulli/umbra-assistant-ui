import axios, { type AxiosRequestConfig } from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { apiReq, getApiErrorMessage } from '../constansts/requests'

/** Runs on demand. A newer request cancels the previous one. */
export function useApiRequest<TResponse, TBody = unknown>() {
  const [data, setData] = useState<TResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)

  useEffect(() => () => { activeRequest.current?.abort() }, [])

  const execute = useCallback(async (
    config: Omit<AxiosRequestConfig<TBody>, 'signal'>,
  ): Promise<TResponse | undefined> => {
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller
    setIsLoading(true)
    setError(null)
    setData(null)

    try {
      const response = await apiReq.request<TResponse>({ ...config, signal: controller.signal })
      if (controller.signal.aborted) return undefined
      setData(response.data)
      return response.data
    } catch (cause) {
      if (!controller.signal.aborted && !axios.isCancel(cause)) {
        setError(getApiErrorMessage(cause))
      }
      return undefined
    } finally {
      if (!controller.signal.aborted) setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    activeRequest.current?.abort()
    activeRequest.current = null
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { data, error, isLoading, execute, reset }
}
