import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Register from './pages/Register';
import Beranda from './pages/Beranda';
import PostDetailPage from './pages/PostDetailPage';
import NotificationDetailPage from './pages/NotificationDetailPage';
import Notifikasi from './pages/Notifikasi';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Pastikan route di bawah ini tertutup dengan benar */}
        <Route path="/" element={<ProtectedRoute><Beranda /></ProtectedRoute>} />
        <Route path="/post/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
        <Route path="/notification/:notificationId" element={<ProtectedRoute><NotificationDetailPage /></ProtectedRoute>} />
        <Route path="/notifikasi" element={<ProtectedRoute><Notifikasi /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;