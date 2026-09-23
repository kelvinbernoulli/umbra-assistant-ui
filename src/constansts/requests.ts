import axios from 'axios'

// Production uses Vercel's same-origin proxy so browser session cookies work.
// Local development can override the API URL, including the /api/v1 prefix.
export const backendBaseUrl = import.meta.env.PROD ? '/api/v1'
  : import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '') || '/api/v1'
export const apiReq = axios.create({
  baseURL: backendBaseUrl,
  timeout: 30_000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' } 
})

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
