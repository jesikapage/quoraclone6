import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom'; // Tambahkan useNavigate

const Register = () => {
  const navigate = useNavigate(); // Inisialisasi navigasi

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Register via Google Success:", credentialResponse);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Nanti di sini panggil API Backend Rito
    alert("Pendaftaran berhasil! Silakan masuk.");
    navigate('/login'); // Pindah ke halaman login setelah klik daftar
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#181919]">
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url('https://qsf.fs.quoracdn.net/-4-ans_frontend_assets.images.home_page_bg_desktop.png-26-474930283d061ad3.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10 w-full max-w-[750px] bg-[#262626] rounded-md shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#333]">
        
        {/* Kiri */}
        <div className="w-full md:w-1/2 p-10 border-b md:border-b-0 md:border-r border-[#333] flex flex-col items-center justify-center text-center">
          <h1 className="text-[#b92b27] text-6xl font-bold tracking-tighter mb-1">Quora</h1>
          <p className="text-[#939598] text-sm font-bold mb-6">Bahasa Indonesia</p>
          <p className="text-[#939598] text-sm font-semibold mb-8 px-4">
            Bergabunglah dengan komunitas pengetahuan terbesar di dunia.
          </p>

          <div className="w-full space-y-3">
            <div className="flex justify-center w-full">
               <GoogleLogin onSuccess={handleGoogleSuccess} theme="filled_black" shape="rectangular" text="signup_with" width="280px" />
            </div>
            
            {/* Link Kembali ke Login */}
            <p className="text-[#939598] text-sm mt-6">
              Sudah punya akun? <Link to="/login" className="text-[#2b69d1] hover:underline font-bold">Masuk</Link>
            </p>
          </div>

          <p className="text-[11px] text-[#717274] mt-16">
            Dengan mendaftar, Anda menyetujui <span className="text-[#2b69d1] cursor-pointer hover:underline">Persyaratan Layanan</span>.
          </p>
        </div>

        {/* Kanan */}
        <form onSubmit={handleRegister} className="w-full md:w-1/2 p-10 flex flex-col">
          <h2 className="text-[#e2e2e2] text-sm font-bold border-b border-[#333] pb-2 mb-6">Daftar</h2>
          
          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1">Nama Lengkap</label>
              <input type="text" placeholder="Siapa nama Anda?" className="w-full bg-[#181919] border border-[#333] p-2.5 rounded-sm text-white text-sm focus:border-[#2b69d1] outline-none" required />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1">Surel</label>
              <input type="email" placeholder="Surel Anda" className="w-full bg-[#181919] border border-[#333] p-2.5 rounded-sm text-white text-sm focus:border-[#2b69d1] outline-none" required />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1">Sandi</label>
              <input type="password" placeholder="Buat kata sandi" className="w-full bg-[#181919] border border-[#333] p-2.5 rounded-sm text-white text-sm focus:border-[#2b69d1] outline-none" required />
            </div>
            
            <div className="flex justify-end items-center pt-2">
              <button type="submit" className="bg-[#2b69d1] hover:bg-[#3277ed] text-white px-8 py-2 rounded-full text-sm font-bold transition">
                Daftar
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Register;