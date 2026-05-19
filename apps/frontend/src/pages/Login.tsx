import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../stores/auth.store'; 
import bgQuora from '../assets/BG QUORA.jpeg'; 

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("Google Credential Token:", credentialResponse.credential);
    
    const dummyGoogleUser = {
      id: "99",
      name: "Jesika Google User",
      email: "jesika.oauth@gmail.com",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Google"
    };

    setAuth(dummyGoogleUser, credentialResponse.credential || "dummy-jwt-oauth-token");
    alert("Login Google Sukses! Mengalihkan ke Beranda...");
    navigate('/'); 
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Harap isi surel dan sandi Anda!");
      return;
    }

    const dummyManualUser = {
      id: "1",
      name: "Jesika Manager",
      email: email,
      avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jesika"
    };

    setAuth(dummyManualUser, "dummy-jwt-token-from-manual-login");
    alert(`Masuk berhasil! Selamat datang kembali, ${dummyManualUser.name}`);
    navigate('/');
  };

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat font-sans selection:bg-neutral-700"
      style={{ backgroundImage: `url(${bgQuora})` }}
    >
      {/* Overlay Gelap Transparan */}
      <div className="absolute inset-0 bg-black/15 z-0" />

      {/* Main Container Card Box */}
      <div className="relative z-10 w-full max-w-[714px] bg-[#262626] text-[#b4b4b4] rounded shadow-2xl flex flex-col border border-[#333333] m-4 overflow-hidden">
        
        {/* HEADER: Logo & Slogan (Memenuhi Atas Card) */}
        <div className="w-full flex flex-col items-center pt-8 pb-5 text-center px-4">
          <h1 className="text-[#b92b27] text-[52px] font-bold tracking-tight leading-none mb-1">Quora</h1>
          <p className="text-[#87898c] text-[13px] font-bold tracking-wide mb-3">Bahasa Indonesia</p>
          <p className="text-[#e2e2e2] text-[17px] font-bold tracking-wide max-w-[600px]">
            Tempat berbagi pengetahuan dan memahami dunia lebih baik
          </p>
        </div>

        {/* BODY: Split Konten Kiri & Kanan */}
        <div className="flex flex-col md:flex-row border-t border-[#333333]">
          
          {/* SISI KIRI: OAuth Medsos & Terms */}
          <div className="w-full md:w-[53%] p-6 md:p-8 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-[#333333]">
            {/* Teks Ketentuan Layanan (Sekarang Pindah ke Atas Sesuai Gambar) */}
            <p className="text-[13px] text-[#87898c] leading-snug font-normal text-left w-full max-w-[280px] mb-6">
              Dengan melanjutkan, Anda menunjukkan bahwa Anda menyetujui{' '}
              <span className="text-[#2b69d1] cursor-pointer hover:underline">Persyaratan Layanan</span> dan{' '}
              <span className="text-[#2b69d1] cursor-pointer hover:underline">Kebijakan Privasi</span> Quora.
            </p>

            <div className="w-full space-y-3 flex flex-col items-center">
              {/* Tombol Google */}
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
              
              {/* Tombol Facebook */}
              <button 
                type="button"
                className="w-[280px] h-[40px] flex items-center justify-center gap-3 bg-[#1c1c1c] hover:bg-[#222222] text-[#e2e2e2] border border-[#333333] rounded text-[14px] font-bold transition-colors"
              >
                <svg className="h-[18px] w-[18px] text-[#1877f2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Lanjutkan dengan Facebook
              </button>
              
              <div className="pt-4">
                <Link to="/register" className="text-[#87898c] hover:bg-neutral-800/40 px-3 py-1.5 rounded text-[13px] font-medium transition">
                  Daftar dengan surel
                </Link>
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
                />
              </div>
              
              <div className="flex items-center justify-between pt-3">
                <button type="button" className="text-[#87898c] text-[13px] font-medium hover:underline">
                  Lupa kata sandi?
                </button>
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

        {/* FOOTER: Baris Paling Bawah */}
        <div className="w-full bg-[#1f1f1f] border-t border-[#333333] py-3.5 px-4 text-center">
          <div className="flex flex-wrap justify-center gap-x-2 text-[12px] text-[#87898c] font-medium">
            <span className="hover:underline cursor-pointer">Tentang Kami</span><span>·</span>
            <span className="hover:underline cursor-pointer">Karier</span><span>·</span>
            <span className="hover:underline cursor-pointer">Privasi</span><span>·</span>
            <span className="hover:underline cursor-pointer">Ketentuan</span><span>·</span>
            <span className="hover:underline cursor-pointer">Kontak</span><span>·</span>
            <span className="hover:underline cursor-pointer">Bahasa</span><span>·</span>
            <span className="hover:underline cursor-pointer">Pers</span><span>·</span>
            <span>© Quora, Inc. 2026</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;