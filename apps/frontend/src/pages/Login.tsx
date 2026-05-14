import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Login Success:", credentialResponse);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#181919]">
      {/* Background Image (Ilustrasi Quora) */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url('https://qsf.fs.quoracdn.net/-4-ans_frontend_assets.images.home_page_bg_desktop.png-26-474930283d061ad3.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[750px] bg-[#262626] rounded-md shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#333]">
        
        {/* Sisi Kiri: Login Method (Google/FB) */}
        <div className="w-full md:w-1/2 p-10 border-b md:border-b-0 md:border-r border-[#333] flex flex-col items-center justify-center text-center">
          <h1 className="text-[#b92b27] text-6xl font-bold tracking-tighter mb-1">Quora</h1>
          <p className="text-[#939598] text-sm font-bold mb-6">Bahasa Indonesia</p>
          <p className="text-[#939598] text-sm font-semibold mb-8">
            Tempat berbagi pengetahuan dan memahami dunia lebih baik
          </p>

          <div className="w-full space-y-3">
            {/* Tombol Google */}
            <div className="flex justify-center w-full">
               <GoogleLogin 
                 onSuccess={handleGoogleSuccess} 
                 theme="filled_black" 
                 shape="rectangular"
                 text="continue_with"
                 width="280px"
               />
            </div>
            
            {/* Tombol Facebook - Dikembalikan lagi */}
            <button className="w-[280px] flex items-center justify-center gap-3 bg-[#181919] hover:bg-[#202020] text-white border border-[#333] py-2 px-4 rounded-md text-sm font-bold transition mx-auto">
              <span className="text-blue-600 font-bold text-lg">f</span> 
              Lanjutkan dengan Facebook
            </button>
            
            <div className="pt-2">
              <Link 
                to="/register" 
                className="text-[#939598] hover:underline text-sm inline-block"
              >
                Daftar dengan surel
              </Link>
            </div>
          </div>

          <p className="text-[11px] text-[#717274] mt-10">
            Dengan melanjutkan, Anda menunjukkan bahwa Anda menyetujui <span className="text-[#2b69d1] cursor-pointer hover:underline">Persyaratan Layanan</span> dan <span className="text-[#2b69d1] cursor-pointer hover:underline">Kebijakan Privasi</span> Quora.
          </p>
        </div>

        {/* Sisi Kanan: Form Login Manual */}
        <div className="w-full md:w-1/2 p-10 flex flex-col">
          <h2 className="text-[#e2e2e2] text-sm font-bold border-b border-[#333] pb-2 mb-6">Masuk</h2>
          
          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1">Surel</label>
              <input 
                type="email" 
                placeholder="Surel Anda"
                className="w-full bg-[#181919] border border-[#333] p-2.5 rounded-sm text-white text-sm focus:outline-none focus:border-[#2b69d1] transition"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#e2e2e2] mb-1">Sandi</label>
              <input 
                type="password" 
                placeholder="Kata sandi Anda"
                className="w-full bg-[#181919] border border-[#333] p-2.5 rounded-sm text-white text-sm focus:outline-none focus:border-[#2b69d1] transition"
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <button className="text-[#939598] text-[13px] hover:underline">Lupa kata sandi?</button>
              <button className="bg-[#2b69d1] hover:bg-[#3277ed] text-white px-6 py-2 rounded-full text-sm font-bold transition">
                Masuk
              </button>
            </div>
          </div>

          {/* Footer Card */}
          <div className="mt-auto pt-10 text-center border-t border-[#333] md:border-none">
             <div className="flex flex-wrap justify-center gap-x-2 text-[11px] text-[#939598]">
               <span className="hover:underline cursor-pointer">Tentang Kami</span><span>•</span>
               <span className="hover:underline cursor-pointer">Karier</span><span>•</span>
               <span className="hover:underline cursor-pointer">Privasi</span><span>•</span>
               <span className="hover:underline cursor-pointer">Ketentuan</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;