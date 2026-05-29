import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../stores/auth.store';
import bgQuora from '../assets/bg-quora.jpeg';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    setErrorMessage('');
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || "Gagal masuk menggunakan Google.");
        return;
      }
      setAuth(data.user, data.token);
      navigate('/', { state: { fromLogin: true } });
    } catch (error) {
      setErrorMessage("Koneksi ke server gagal. Pastikan backend sudah berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || "Surel atau kata sandi tidak valid.");
        return;
      }
      setAuth(data.user, data.token);
      navigate('/');
    } catch (error) {
      setErrorMessage("Koneksi ke server gagal. Pastikan backend sudah berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat selection:bg-neutral-700"
      style={{ backgroundImage: `url(${bgQuora})` }}
    >
      {/* Kecerahan Overlay Diturunkan agar gambar latar lebih terang */}
      <div className="absolute inset-0 bg-black/25 z-0" />
      
      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-[714px] bg-[#242424] text-[#D5D6D7] rounded-md shadow-2xl flex flex-col border border-[#393939] m-4 overflow-hidden">

        {/* Header */}
        <div className="w-full flex flex-col items-center pt-10 pb-6 text-center px-4">
          <h1 className="text-[#b92b27] text-[56px] font-black tracking-tight leading-none mb-1" style={{ fontFamily: 'Georgia, serif' }}>Qoora</h1>
          <p className="text-[#B1B3B6] text-[13px] font-bold tracking-wide mb-3">Bahasa Indonesia</p>
          <p className="text-[#E4E6E8] text-[16px] font-bold tracking-wide max-w-[500px]">
            Tempat berbagi pengetahuan dan memahami dunia lebih baik
          </p>
        </div>

        {/* Tengah */}
        <div className="flex flex-col md:flex-row border-t border-[#393939]">

          {/* Kolom Kiri */}
          <div className="w-full md:w-[50%] p-6 md:p-8 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-[#393939]">
            <p className="text-[13px] text-[#B1B3B6] leading-relaxed font-normal text-left w-full max-w-[280px] mb-6">
              Dengan melanjutkan, Anda menunjukkan bahwa Anda menyetujui{' '}
              <span className="text-[#3A7AEF] cursor-pointer hover:underline">Persyaratan Layanan</span> dan{' '}
              <span className="text-[#3A7AEF] cursor-pointer hover:underline">Kebijakan Privasi</span> Qoora.
            </p>
            
            <div className="w-full flex flex-col items-center justify-center space-y-3">
              <div className="flex justify-center w-full max-w-[280px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log("Login Failed")}
                  theme="filled_black"
                  shape="rectangular"
                  text="continue_with"
                  width="280px"
                />
              </div>
              
              <Link to="/register" className="text-[#E4E6E8] hover:bg-[#333333] text-[14px] font-medium py-2 px-4 rounded-full w-full max-w-[280px] text-center transition-colors">
                Daftar dengan surel
              </Link>
            </div>
          </div>

          {/* Kolom Kanan */}
          <form onSubmit={handleManualLogin} className="w-full md:w-[50%] p-6 md:p-8 flex flex-col justify-start">
            <h2 className="text-[#E4E6E8] text-[15px] font-bold border-b border-[#393939] pb-2 mb-5">Masuk</h2>

            {errorMessage && (
              <div className="bg-[#b92b27] text-white text-[13px] p-2 rounded mb-4 text-center font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-bold text-[#E4E6E8] mb-1.5">Surel</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Surel Anda"
                  className="w-full bg-[#181818] border border-[#393939] px-3 py-2 text-[15px] text-[#E4E6E8] placeholder-[#87898c] rounded-sm outline-none focus:border-[#3A7AEF] transition-colors hover:border-[#666666]"
                  required
                />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-[#E4E6E8] mb-1.5">Sandi</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi Anda"
                  className="w-full bg-[#181818] border border-[#393939] px-3 py-2 text-[15px] text-[#E4E6E8] placeholder-[#87898c] rounded-sm outline-none focus:border-[#3A7AEF] transition-colors hover:border-[#666666]"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Link to="#" className="text-[#B1B3B6] hover:underline text-[13px]">
                  Lupa kata sandi?
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-full text-[14px] font-bold transition-colors text-white
                    ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#2E69FF] hover:bg-[#477BFF]'}`}
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </button>
              </div>
            </div>
          </form>

        </div>
        
        {/* Footer */}
        <div className="w-full bg-[#1e1e1e] border-t border-[#393939] py-4 text-center">
          <p className="text-[#B1B3B6] text-[13px]">
            <Link to="#" className="hover:underline">Tentang Kami</Link> ·{' '}
            <Link to="#" className="hover:underline">Karier</Link> ·{' '}
            <Link to="#" className="hover:underline">Privasi</Link> ·{' '}
            <Link to="#" className="hover:underline">Ketentuan</Link> ·{' '}
            <Link to="#" className="hover:underline">Kontak</Link> ·{' '}
            <Link to="#" className="hover:underline">Bahasa</Link> ·{' '}
            <Link to="#" className="hover:underline">Pers</Link> ·{' '}
            © Qoora, Inc. 2026
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;