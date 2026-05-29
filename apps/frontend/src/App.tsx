import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Beranda from './pages/Beranda'
import DetailPost from './pages/DetailPost'
import Notifikasi from './pages/Notifications'
import EditProfile from './pages/EditProfile'
import ProtectedRoute from './components/ProtectedRoutes'
import GuestRoute from './components/GuestRoute'

function App() {
  return (
    <Routes>
      {/* Guest only */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Protected */}
      <Route path="/" element={<ProtectedRoute><Beranda /></ProtectedRoute>} />
      <Route path="/posts/:id" element={<ProtectedRoute><DetailPost /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifikasi /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App