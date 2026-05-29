import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default GuestRoute