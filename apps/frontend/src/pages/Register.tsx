import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import bgQuora from '../assets/BG QUORA.jpeg'; 

const Register = () => {
  const navigate = useNavigate(); 

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Register via Google Success:", credentialResponse);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pendaftaran berhasil! Silakan masuk.");
    navigate('/login'); 
  };

  return (
    <div 
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: `url(${bgQuora})` }}
    >
      <div className="absolute inset-0 bg-black/15 z-0" />

      {/* Main Container Card Box */}
      <div className="relative z-10 w-full max-w-[714px] bg-[#262626] text-[#b4b4b4] rounded shadow-2xl flex flex-col border border-[#333333] m-4 overflow-hidden">
        
        {/* HEADER */}
        <div className="w-full flex flex-col items-center pt-8 pb-5 text-center px-4">
          <h1 className="text-[#b92b27] text-[52px] font-bold tracking-tight leading-none mb-1">Quora</h1>
          <p className="text-[#87898c] text-[13px] font-bold tracking-wide mb-3">Bahasa Indonesia</p>
          <p className="text-[#e2e2e2] text-[17px] font-bold tracking-wide max-w-[600px]">
            Tempat berbagi pengetahuan dan memahami dunia lebih baik
          </p>
        </div>

        {/* BODY */}
        <div className="flex flex-col md:flex-row border-t border-[#333333]">
          
          {/* SISI KIRI */}
          <div className="w-full md:w-[53%] p-6 md:p-8 flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-[#333333]">
            <p className="text-[13px] text-[#87898c] leading-snug font-normal text-left w-full max-w-[280px] mb-6">
              Dengan mendaftar, Anda menunjukkan bahwa Anda menyetujui <span className="text-[#2b69d1] cursor-pointer hover:underline">Persyaratan Layanan</span> Quora.
            </p>

            <div className="w-full space-y-3 flex flex-col items-center">
              <div className="flex justify-center w-full max-w-[280px]">
                 <GoogleLogin onSuccess={handleGoogleSuccess} theme="filled_black" shape="rectangular" text="signup_with" width="280px" />
              </div>
              
              <p className="text-[#87898c] text-[13px] mt-6">
                Sudah punya akun? <Link to="/login" className="text-[#2b69d1] hover:underline font-bold ml-1">Masuk</Link>
              </p>
            </div>
          </div>

          {/* SISI KANAN */}
          <form onSubmit={handleRegister} className="w-full md:w-[47%] p-6 md:p-8 flex flex-col justify-start">
            <h2 className="text-[#e2e2e2] text-[15px] font-bold border-b border-[#333333] pb-1.5 mb-5">Daftar</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1.5">Nama Lengkap</label>
                <input type="text" placeholder="Siapa nama Anda?" className="w-full bg-[#1c1c1c] border border-[#333333] px-3 py-2 text-sm text-white placeholder-[#555555] rounded-sm outline-none focus:border-[#2b69d1] transition-colors" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1.5">Surel</label>
                <input type="email" placeholder="Surel Anda" className="w-full bg-[#1c1c1c] border border-[#333333] px-3 py-2 text-sm text-white placeholder-[#555555] rounded-sm outline-none focus:border-[#2b69d1] transition-colors" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1.5">Sandi</label>
                <input type="password" placeholder="Buat kata sandi" className="w-full bg-[#1c1c1c] border border-[#333333] px-3 py-2 text-sm text-white placeholder-[#555555] rounded-sm outline-none focus:border-[#2b69d1] transition-colors" required />
              </div>
              
              <div className="flex justify-end items-center pt-3">
                <button type="submit" className="bg-[#2b69d1] hover:bg-[#3277ed] text-white px-6 py-1.5 rounded-full text-[14px] font-bold transition-colors shadow-sm">
                  Daftar
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* FOOTER */}
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

export default Register;