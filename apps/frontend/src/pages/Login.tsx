import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import { useAuthStore } from '../stores/auth.store'; 
import bgQuora from '../assets/BG QUORA.jpeg'; 

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // =========================================================================
  // LOGIKA LOGIN GOOGLE: Terhubung Langsung ke Backend Bun + Elysia
  // =========================================================================
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    console.log("Google Credential Token:", idToken);
    
    try {
      // Menembak endpoint backend Elysia lokal Anda
      const response = await fetch('https://gcexswmhbjkuev2k2qtaqjqmsa0ugdud.lambda-url.us-east-1.on.aws/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Menyimpan data user asli dan token asli dari backend ke Zustand Store
        setAuth(data.user, data.token); 
        
        // Alihkan halaman ke beranda bawa paket data buat Sonner
        navigate('/', { state: { fromLogin: true } }); 
      } else {
        console.error("Login gagal:", data.message);
      }
    } catch (error) {
      console.error('Terjadi kesalahan koneksi ke backend:', error);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Login manual sementara tetap menggunakan dummy sampai backend siap
    const dummyManualUser = {
      id: "1",
      name: "Jesika Manager",
      email: email,
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jesika"
    };

    setAuth(dummyManualUser, "dummy-jwt-token-from-manual-login");
    navigate('/');
  };

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat selection:bg-neutral-700"
      style={{ backgroundImage: `url(${bgQuora})` }}
    >
      <div className="absolute inset-0 bg-black/15 z-0" />

      <div className="relative z-10 w-full max-w-[714px] bg-[#262626] text-[#b4b4b4] rounded shadow-2xl flex flex-col border border-[#333333] m-4 overflow-hidden">
        
        {/* HEADER: Logo & Slogan */}
        <div className="w-full flex flex-col items-center pt-8 pb-5 text-center px-4">
          <h1 className="text-[#b92b27] text-[52px] font-black tracking-tight leading-none mb-1">Quora</h1>
          <p className="text-[#87898c] text-[13px] font-bold tracking-wide mb-3">Bahasa Indonesia</p>
          <p className="text-[#e2e2e2] text-[17px] font-bold tracking-wide max-w-[600px]">
            Tempat berbagi pengetahuan dan memahami dunia lebih baik
          </p>
        </div>

        {/* BODY */}
        <div className="flex flex-col md:flex-row border-t border-[#333333]">
          
          {/* SISI KIRI: OAuth Medsos & Terms */}
          <div className="w-full md:w-[53%] p-6 md:p-8 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-[#333333]">
            <p className="text-[13px] text-[#87898c] leading-snug font-normal text-left w-full max-w-[280px] mb-6">
              Dengan melanjutkan, Anda menunjukkan bahwa Anda menyetujui{' '}
              <span className="text-[#2b69d1] cursor-pointer hover:underline">Persyaratan Layanan</span> dan{' '}
              <span className="text-[#2b69d1] cursor-pointer hover:underline">Kebijakan Privasi</span> Quora.
            </p>

            <div className="w-full flex flex-col items-center justify-center my-auto">
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
            </div>
          </div>

          {/* SISI KANAN: Form Login Manual */}
          <form onSubmit={handleManualLogin} className="w-full md:w-[47%] p-6 md:p-8 flex flex-col justify-start">
            <h2 className="text-[#e2e2e2] text-[15px] font-bold border-b border-[#333333] pb-1.5 mb-5">Masuk</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1.5">Surel</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Surel Anda"
                  className="w-full bg-[#1c1c1c] border border-[#333333] px-3 py-2 text-sm text-white placeholder-[#555555] rounded-sm outline-none focus:border-[#2b69d1] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1.5">Sandi</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata sandi Anda"
                  className="w-full bg-[#1c1c1c] border border-[#333333] px-3 py-2 text-sm text-white placeholder-[#555555] rounded-sm outline-none focus:border-[#2b69d1] transition-colors"
                  required
                />
              </div>
              
              <div className="flex items-center justify-end pt-3">
                <button 
                  type="submit" 
                  className="bg-[#2b69d1] hover:bg-[#3277ed] text-white px-5 py-1.5 rounded-full text-[14px] font-bold transition-colors shadow-sm"
                >
                  Masuk
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};

export default Login;