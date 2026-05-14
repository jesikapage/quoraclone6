import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* URL /login nampilin halaman Login */}
        <Route path="/login" element={<Login />} />
        
        {/* URL /register nampilin halaman Register */}
        <Route path="/register" element={<Register />} />
        
        {/* Kalau buka halaman utama langsung diarahkan ke login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;