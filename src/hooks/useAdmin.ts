import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'

export function useAdmin() {
  const value = useContext(AdminContext)

  if (!value) {
    throw new Error('useAdmin must be used inside AdminContext')
  }

  return value
}
