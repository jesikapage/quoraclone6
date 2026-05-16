import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Beranda from './pages/Beranda';
import Komentar from './pages/Komentar';
import Notifikasi from './pages/Notifikasi';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Mengubah /beranda menjadi / */}
        <Route path="/" element={<ProtectedRoute><Beranda /></ProtectedRoute>} />
        
        <Route path="/komentar/:postId" element={<ProtectedRoute><Komentar /></ProtectedRoute>} />
        <Route path="/notifikasi" element={<ProtectedRoute><Notifikasi /></ProtectedRoute>} />
        
        {/* Jika mengetik URL ngawur, otomatis dilempar ke halaman utama (/) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;