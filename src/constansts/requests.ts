import axios from 'axios'

// VITE_API_BASE_URL includes the API prefix (the server defaults to /api/v1).
export const backendBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '')
  || '/api/v1'
export const apiReq = axios.create({ baseURL: backendBaseUrl, timeout: 30_000, withCredentials: true, headers: { 'X-Requested-With': 'XmlHttpRequest' } })

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail: unknown = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail.map((item: { msg?: string }) => item.msg || 'Invalid input').join('; ')
    }
    if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.'
    if (!error.response) return 'Unable to reach the server. Check your connection and API URL.'
    return `Request failed (${error.response.status}). Please try again.`
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

apiReq.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/')) {
    window.dispatchEvent(new Event('umbra:session-expired'))
  }
  return Promise.reject(error)
})
