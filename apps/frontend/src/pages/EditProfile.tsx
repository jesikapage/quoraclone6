import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setAuth, logout, token } = useAuthStore((state) => state);

  const nameParts = (user?.name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [credential, setCredential] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);

  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = `${firstName} ${lastName}`.trim() || 'Nama Kamu';
  const initials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '?';

  function showAlertMsg(type: 'success' | 'error', msg: string) {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function getStrength(val: string) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
    const colors = ['#636466', '#b92b27', '#EF9F27', '#1D9E75', '#0F6E56'];
    return { score, label: val ? labels[score] : '', color: val ? colors[score] : '#636466' };
  }

  const strength = getStrength(newPass);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      showAlertMsg('error', 'Nama depan wajib diisi.');
      return;
    }
    if (user && token) {
      setAuth({ ...user, name: fullName, avatarUrl: avatarPreview || user.avatarUrl }, token);
    }
    // TODO: API PATCH /api/profile
    showAlertMsg('success', 'Profil berhasil disimpan!');
  }

  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currPass) { showAlertMsg('error', 'Masukkan password saat ini.'); return; }
    if (newPass.length < 8) { showAlertMsg('error', 'Password baru minimal 8 karakter.'); return; }
    if (newPass !== confPass) { showAlertMsg('error', 'Konfirmasi password tidak cocok.'); return; }
    // TODO: API POST /api/auth/change-password
    showAlertMsg('success', 'Password berhasil diubah!');
    setCurrPass(''); setNewPass(''); setConfPass('');
  }

  const inputClass = "w-full bg-white border border-[#dee0e1] focus:border-[#282829] text-[#282829] text-sm px-3 py-2 rounded-[3px] outline-none transition placeholder-[#939598]";
  const labelClass = "block text-[13px] font-semibold text-[#282829] mb-1";

  return (
    <div className="min-h-screen bg-[#f7f7f8] font-sans text-[#282829]">

      {/* Navbar — Mobile-responsive version */}
      <nav className="h-[50px] bg-white border-b border-[#dee0e1] sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto h-full flex items-center gap-3 px-3 sm:px-4">
          <span
            className="text-[#b92b27] text-xl sm:text-2xl font-bold tracking-tighter cursor-pointer select-none"
            onClick={() => navigate('/')}
          >
            Quora
          </span>
          <div className="flex-1" />
          <nav className="hidden sm:flex gap-1 items-center text-xs sm:text-sm">
            <Link to="/" className="text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-2 sm:px-3 py-1.5 rounded-[3px] transition">Beranda</Link>
            <Link to="/notifikasi" className="text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-2 sm:px-3 py-1.5 rounded-[3px] transition">Notifikasi</Link>
            <Link to="/profile/edit" className="text-[#282829] font-semibold bg-[#f1f2f2] px-2 sm:px-3 py-1.5 rounded-[3px]">Profil</Link>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-[#b92b27] hover:bg-[#fff0f0] px-2 sm:px-3 py-1.5 rounded-[3px] transition"
            >
              Keluar
            </button>
          </nav>
          
          {/* Mobile menu toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden text-[#636466] hover:text-[#282829] p-2"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {showMobileMenu && (
          <div className="sm:hidden bg-white border-t border-[#dee0e1] py-2 px-3 space-y-1">
            <Link to="/" className="block text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-3 py-2 rounded-[3px] transition text-sm">Beranda</Link>
            <Link to="/notifikasi" className="block text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-3 py-2 rounded-[3px] transition text-sm">Notifikasi</Link>
            <Link to="/profile/edit" className="block text-[#282829] font-semibold bg-[#f1f2f2] px-3 py-2 rounded-[3px] text-sm">Profil</Link>
            <button
              onClick={() => { logout(); navigate('/login'); setShowMobileMenu(false); }}
              className="block w-full text-left text-[#b92b27] hover:bg-[#fff0f0] px-3 py-2 rounded-[3px] transition text-sm"
            >
              Keluar
            </button>
          </div>
        )}
      </nav>

      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col sm:flex-row gap-4 sm:gap-5">

        {/* Sidebar kiri: navigasi pengaturan (responsive) */}
        <aside className="w-full sm:w-[220px] flex-shrink-0">
          <div className="bg-white border border-[#dee0e1] rounded-[3px] overflow-hidden">
            {/* Mini profile */}
            <div className="p-3 sm:p-4 border-b border-[#dee0e1] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2b69d1] flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarPreview
                  ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  : <span className="text-sm font-bold text-white">{initials}</span>
                }
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#282829] truncate">{fullName}</p>
                <p className="text-[10px] sm:text-[11px] text-[#636466] truncate">{credential || 'Tambah kredensial'}</p>
              </div>
            </div>
            {/* Menu */}
            <div className="flex sm:flex-col gap-0">
              {[
                { key: 'profile', label: 'Edit Profil', icon: '👤' },
                { key: 'account', label: 'Keamanan Akun', icon: '🔒' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key as 'profile' | 'account'); setShowMobileMenu(false); }}
                  className={`flex-1 sm:w-full text-center sm:text-left flex sm:flex items-center gap-3 px-2 sm:px-4 py-2.5 text-[11px] sm:text-[13px] transition ${
                    activeTab === item.key
                      ? 'bg-[#ebf0ff] text-[#2b69d1] font-semibold border-r-2 border-[#2b69d1] sm:border-r-2 border-b-2 sm:border-b-0'
                      : 'text-[#282829] hover:bg-[#f1f2f2]'
                  }`}
                >
                  <span className="text-base">{item.icon}</span><span className="hidden sm:inline">{item.label}</span><span className="inline sm:hidden text-xs">{item.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Konten utama (responsive) ── */}
        <div className="flex-1 min-w-0 max-w-full sm:max-w-[700px] space-y-4">

          {/* Alert */}
          {alert && (
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-[3px] text-xs sm:text-sm border animate-fadeIn ${
              alert.type === 'success'
                ? 'bg-[#e6f7f2] border-[#1D9E75] text-[#0F6E56]'
                : 'bg-[#fff0f0] border-[#b92b27] text-[#b92b27]'
            }`}>
              <span>{alert.type === 'success' ? '✓' : '✗'}</span>
              <span>{alert.msg}</span>
            </div>
          )}

          {/* ── TAB: Edit Profil ── */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#dee0e1] rounded-[3px]">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[#dee0e1]">
                <h2 className="text-[14px] sm:text-[15px] font-bold text-[#282829]">Edit Profil</h2>
                <p className="text-[12px] sm:text-[13px] text-[#636466] mt-0.5">Informasi ini terlihat publik di profil kamu.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="px-3 sm:px-6 py-4 sm:py-5">

                {/* Avatar section — mobile friendly */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 mb-6 pb-6 border-b border-[#dee0e1]">
                  <div
                    className="relative w-20 h-20 group cursor-pointer flex-shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-20 h-20 rounded-full bg-[#2b69d1] flex items-center justify-center overflow-hidden border-2 border-[#dee0e1]">
                      {avatarPreview
                        ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        : <span className="text-3xl font-bold text-white">{initials}</span>
                      }
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="text-white text-xs font-bold">Ganti</span>
                    </div>
                  </div>

                  <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleAvatarChange} />

                  <div className="text-center sm:text-left flex-1">
                    <p className="font-bold text-[14px] sm:text-[15px] text-[#282829]">{fullName}</p>
                    <p className="text-[11px] sm:text-[12px] text-[#636466] mt-0.5">{credential || 'Tambahkan kredensial...'}</p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[12px] sm:text-[13px] font-semibold text-[#2b69d1] border border-[#2b69d1] hover:bg-[#ebf0ff] px-3 py-1.5 rounded-[3px] transition"
                      >
                        Upload Foto
                      </button>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="text-[12px] sm:text-[13px] font-semibold text-[#636466] border border-[#dee0e1] hover:border-[#b92b27] hover:text-[#b92b27] px-3 py-1.5 rounded-[3px] transition"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#939598] mt-2">JPG, PNG atau GIF. Maks 5MB.</p>
                  </div>
                </div>

                {/* Form fields — responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Nama Depan <span className="text-[#b92b27]">*</span></label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nama depan"
                      className={`${inputClass} text-[13px]`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Nama Belakang</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nama belakang"
                      className={`${inputClass} text-[13px]`}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Kredensial</label>
                  <input
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    placeholder="Contoh: Mahasiswa Informatika UNTAN"
                    maxLength={60}
                    className={`${inputClass} text-[13px]`}
                  />
                  <div className="flex flex-col sm:flex-row justify-between mt-1 gap-1">
                    <p className="text-[10px] sm:text-[11px] text-[#939598]">Tampil di bawah nama di setiap postingan.</p>
                    <p className="text-[10px] sm:text-[11px] text-[#939598]">{credential.length}/60</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className={labelClass}>Tentang Saya</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Ceritakan tentang dirimu, minat, atau keahlianmu..."
                    rows={4}
                    className={`${inputClass} resize-y text-[13px]`}
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-[#dee0e1]">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="border border-[#dee0e1] text-[#636466] hover:text-[#282829] hover:border-[#939598] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2b69d1] hover:bg-[#1c5bbf] text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── TAB: Keamanan Akun / Ganti Password ── */}
          {activeTab === 'account' && (
            <div className="bg-white border border-[#dee0e1] rounded-[3px]">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[#dee0e1]">
                <h2 className="text-[14px] sm:text-[15px] font-bold text-[#282829]">Keamanan Akun</h2>
                <p className="text-[12px] sm:text-[13px] text-[#636466] mt-0.5">Pastikan akun kamu aman dengan password yang kuat dan unik.</p>
              </div>

              <form onSubmit={handleSavePassword} className="px-3 sm:px-6 py-4 sm:py-5">

                {/* Password saat ini */}
                <div className="mb-5">
                  <label className={labelClass}>Password Saat Ini <span className="text-[#b92b27]">*</span></label>
                  <div className="relative">
                    <input
                      type={showCurr ? 'text' : 'password'}
                      value={currPass}
                      onChange={(e) => setCurrPass(e.target.value)}
                      placeholder="Masukkan password saat ini"
                      className={`${inputClass} pr-20 sm:pr-24 text-[13px]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurr(!showCurr)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] sm:text-[12px] text-[#2b69d1] font-semibold hover:underline whitespace-nowrap"
                    >
                      {showCurr ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                </div>

                <hr className="border-[#dee0e1] my-5" />

                {/* Password baru */}
                <div className="mb-5">
                  <label className={labelClass}>Password Baru <span className="text-[#b92b27]">*</span></label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className={`${inputClass} pr-20 sm:pr-24 text-[13px]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] sm:text-[12px] text-[#2b69d1] font-semibold hover:underline whitespace-nowrap"
                    >
                      {showNew ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {newPass && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: i <= strength.score ? strength.color : '#dee0e1' }}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] sm:text-[11px] mt-1 font-semibold" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Konfirmasi password */}
                <div className="mb-6">
                  <label className={labelClass}>Konfirmasi Password Baru <span className="text-[#b92b27]">*</span></label>
                  <div className="relative">
                    <input
                      type={showConf ? 'text' : 'password'}
                      value={confPass}
                      onChange={(e) => setConfPass(e.target.value)}
                      placeholder="Ulangi password baru"
                      className={`${inputClass} pr-20 sm:pr-24 text-[13px]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConf(!showConf)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] sm:text-[12px] text-[#2b69d1] font-semibold hover:underline whitespace-nowrap"
                    >
                      {showConf ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  {confPass && (
                    <p className="text-[10px] sm:text-[11px] mt-1 font-semibold" style={{ color: newPass === confPass ? '#1D9E75' : '#b92b27' }}>
                      {newPass === confPass ? '✓ Password cocok' : '✗ Password tidak cocok'}
                    </p>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-[#dee0e1]">
                  <button
                    type="button"
                    onClick={() => { setCurrPass(''); setNewPass(''); setConfPass(''); }}
                    className="border border-[#dee0e1] text-[#636466] hover:text-[#282829] hover:border-[#939598] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full transition"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2b69d1] hover:bg-[#1c5bbf] text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full transition"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EditProfile;