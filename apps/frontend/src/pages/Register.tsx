import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import bgQuora from '../assets/BG QUORA.jpeg';

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    setIsLoading(true);
    setErrorMessage('');
    try {
      // ✅ Sudah menggunakan .env
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Gagal daftar via Google.');
        return;
      }
      setAuth(data.user, data.token);
      navigate('/');
    } catch {
      setErrorMessage('Koneksi ke server gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Semua field wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Sudah menggunakan .env
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Gagal mendaftar. Email mungkin sudah digunakan.');
        return;
      }

      // ✅ Auto login setelah register berhasil (Sudah menggunakan .env)
      const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        setAuth(loginData.user, loginData.token);
        navigate('/');
      } else {
        // Register berhasil tapi auto-login gagal, arahkan ke login manual
        navigate('/login');
      }
    } catch {
      setErrorMessage('Koneksi ke server gagal. Pastikan backend sudah berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgQuora})` }}
    >
      <div className="absolute inset-0 bg-black/15 z-0" />
      <div className="relative z-10 w-full max-w-[714px] bg-[#262626] text-[#b4b4b4] rounded shadow-2xl flex flex-col border border-[#333333] m-4 overflow-hidden">

        {/* Header */}
        <div className="w-full flex flex-col items-center pt-8 pb-5 text-center px-4">
          <h1 className="text-[#b92b27] text-[52px] font-black tracking-tight leading-none mb-1">Quora</h1>
          <p className="text-[#87898c] text-[13px] font-bold tracking-wide mb-3">Bahasa Indonesia</p>
          <p className="text-[#e2e2e2] text-[17px] font-bold tracking-wide max-w-[600px]">
            Tempat berbagi pengetahuan dan memahami dunia lebih baik
          </p>
        </div>

        <div className="flex flex-col md:flex-row border-t border-[#333333]">

          {/* Kolom kiri — Google OAuth */}
          <div className="w-full md:w-[53%] p-6 md:p-8 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-[#333333]">
            <p className="text-[13px] text-[#87898c] leading-snug font-normal text-left w-full max-w-[280px] mb-6">
              Dengan mendaftar, Anda menyetujui{' '}
              <span className="text-[#2b69d1] cursor-pointer hover:underline">Persyaratan Layanan</span> Quora.
            </p>
            <div className="w-full space-y-3 flex flex-col items-center justify-center my-auto">
              <div className="flex justify-center w-full max-w-[280px]">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrorMessage('Login Google gagal.')}
                  theme="filled_black"
                  shape="rectangular"
                  text="signup_with"
                  width="280px"
                />
              </div>
              <p className="text-[#87898c] text-[13px] pt-4">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-[#2b69d1] hover:underline font-bold ml-1">
                  Masuk
                </Link>
              </p>
            </div>
          </div>

          {/* Kolom kanan — Form register */}
          <form onSubmit={handleRegister} className="w-full md:w-[47%] p-6 md:p-8 flex flex-col justify-start">
            <h2 className="text-[#e2e2e2] text-[15px] font-bold border-b border-[#333333] pb-1.5 mb-5">Daftar</h2>

            {errorMessage && (
              <div className="bg-[#b92b27] text-white text-[13px] p-2 rounded mb-4 text-center font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Siapa nama Anda?"
                  className="w-full bg-[#1c1c1c] border border-[#333333] px-3 py-2 text-sm text-white placeholder-[#555555] rounded-sm outline-none focus:border-[#2b69d1] transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1.5">
                  Surel
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Surel Anda"
                  className="w-full bg-[#1c1c1c] border border-[#333333] px-3 py-2 text-sm text-white placeholder-[#555555] rounded-sm outline-none focus:border-[#2b69d1] transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1.5">
                  Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Buat kata sandi (min. 6 karakter)"
                  className="w-full bg-[#1c1c1c] border border-[#333333] px-3 py-2 text-sm text-white placeholder-[#555555] rounded-sm outline-none focus:border-[#2b69d1] transition-colors"
                  disabled={isLoading}
                />
                {/* Indikator panjang password */}
                {password.length > 0 && password.length < 6 && (
                  <p className="text-[11px] text-[#b92b27] mt-1">
                    {6 - password.length} karakter lagi
                  </p>
                )}
                {password.length >= 6 && (
                  <p className="text-[11px] text-green-500 mt-1">✓ Kata sandi valid</p>
                )}
              </div>

              <div className="flex justify-end items-center pt-3">
                <button
                  type="submit"
                  disabled={isLoading || password.length < 6}
                  className={`px-6 py-1.5 rounded-full text-[14px] font-bold transition-colors shadow-sm text-white
                    ${isLoading || password.length < 6
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-[#2b69d1] hover:bg-[#3277ed]'
                    }`}
                >
                  {isLoading ? 'Memproses...' : 'Daftar'}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Register;