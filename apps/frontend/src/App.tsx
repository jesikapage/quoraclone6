import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Beranda from './pages/Beranda'
import DetailPost from './pages/DetailPost'
import Notifications from './pages/Notifications'
import NotificationDetailPage from './pages/NotificationDetailPage'
import EditProfile from './pages/EditProfile'
import Mengikuti from './pages/Mengikuti'
import Jawab from './pages/Jawab'
import Ruang from './pages/Ruang'
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

      {/* Notifications – both old and new paths */}
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/notifikasi" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/notifikasi/:notificationId" element={<ProtectedRoute><NotificationDetailPage /></ProtectedRoute>} />

      <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/mengikuti" element={<ProtectedRoute><Mengikuti /></ProtectedRoute>} />
      <Route path="/jawab" element={<ProtectedRoute><Jawab /></ProtectedRoute>} />
      <Route path="/ruang" element={<ProtectedRoute><Ruang /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App