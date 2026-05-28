import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setAuth, logout, token } = useAuthStore();

  const nameParts = (user?.name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [credential, setCredential] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
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

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) { showAlertMsg('error', 'Nama depan wajib diisi.'); return; }
    if (!token) { showAlertMsg('error', 'Sesi habis, silakan login ulang.'); return; }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fullName,
          avatar: avatarPreview || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { showAlertMsg('error', data.error || 'Gagal menyimpan profil.'); return; }
      if (user) setAuth(data.user, token);
      showAlertMsg('success', 'Profil berhasil disimpan!');
    } catch {
      showAlertMsg('error', 'Koneksi ke server gagal.');
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currPass) { showAlertMsg('error', 'Masukkan password saat ini.'); return; }
    if (newPass.length < 6) { showAlertMsg('error', 'Password baru minimal 6 karakter.'); return; }
    if (newPass !== confPass) { showAlertMsg('error', 'Konfirmasi password tidak cocok.'); return; }
    if (!token) { showAlertMsg('error', 'Sesi habis, silakan login ulang.'); return; }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currPass,
          newPassword: newPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) { showAlertMsg('error', data.error || 'Gagal mengubah password.'); return; }
      showAlertMsg('success', 'Password berhasil diubah!');
      setCurrPass(''); setNewPass(''); setConfPass('');
    } catch {
      showAlertMsg('error', 'Koneksi ke server gagal.');
    }
  }

  const inputClass = "w-full bg-white border border-[#dee0e1] focus:border-[#282829] text-[#282829] text-sm px-3 py-2 rounded-[3px] outline-none transition placeholder-[#939598]";
  const labelClass = "block text-[13px] font-semibold text-[#282829] mb-1";

  return (
    <div className="min-h-screen bg-[#f7f7f8] font-sans text-[#282829]">
      <nav className="h-[50px] bg-white border-b border-[#dee0e1] sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1000px] mx-auto h-full flex items-center gap-3 px-4">
          <span className="text-[#b92b27] text-2xl font-bold tracking-tighter cursor-pointer select-none" onClick={() => navigate('/')}>
            Quora
          </span>
          <div className="flex-1" />
          <nav className="flex gap-1 items-center text-sm">
            <Link to="/" className="text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-3 py-1.5 rounded-[3px] transition">Beranda</Link>
            <Link to="/notifications" className="text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-3 py-1.5 rounded-[3px] transition">Notifikasi</Link>
            <Link to="/profile/edit" className="text-[#282829] font-semibold bg-[#f1f2f2] px-3 py-1.5 rounded-[3px]">Profil</Link>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-[#b92b27] hover:bg-[#fff0f0] px-3 py-1.5 rounded-[3px] transition">
              Keluar
            </button>
          </nav>
        </div>
      </nav>

      <div className="max-w-[1000px] mx-auto px-4 py-6 flex gap-5">
        <aside className="w-[220px] flex-shrink-0 hidden md:block">
          <div className="bg-white border border-[#dee0e1] rounded-[3px] overflow-hidden">
            <div className="p-4 border-b border-[#dee0e1] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2b69d1] flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatarPreview
                  ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  : <span className="text-sm font-bold text-white">{initials}</span>}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#282829] truncate">{fullName}</p>
                <p className="text-[11px] text-[#636466] truncate">{credential || 'Tambah kredensial'}</p>
              </div>
            </div>
            {[
              { key: 'profile', label: 'Edit Profil', icon: '👤' },
              { key: 'account', label: 'Keamanan Akun', icon: '🔒' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as 'profile' | 'account')}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-[13px] transition ${
                  activeTab === item.key
                    ? 'bg-[#ebf0ff] text-[#2b69d1] font-semibold border-r-2 border-[#2b69d1]'
                    : 'text-[#282829] hover:bg-[#f1f2f2]'
                }`}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0 max-w-[700px] space-y-4">
          {alert && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-[3px] text-sm border ${
              alert.type === 'success' ? 'bg-[#e6f7f2] border-[#1D9E75] text-[#0F6E56]' : 'bg-[#fff0f0] border-[#b92b27] text-[#b92b27]'
            }`}>
              <span>{alert.type === 'success' ? '✓' : '✗'}</span>
              {alert.msg}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white border border-[#dee0e1] rounded-[3px]">
              <div className="px-6 py-4 border-b border-[#dee0e1]">
                <h2 className="text-[15px] font-bold text-[#282829]">Edit Profil</h2>
                <p className="text-[13px] text-[#636466] mt-0.5">Informasi ini terlihat publik di profil kamu.</p>
              </div>
              <form onSubmit={handleSaveProfile} className="px-6 py-5">
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#dee0e1]">
                  <div className="relative w-20 h-20 group cursor-pointer flex-shrink-0" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-20 h-20 rounded-full bg-[#2b69d1] flex items-center justify-center overflow-hidden border-2 border-[#dee0e1]">
                      {avatarPreview
                        ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        : <span className="text-3xl font-bold text-white">{initials}</span>}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <span className="text-white text-xs font-bold">Ganti</span>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <div>
                    <p className="font-bold text-[15px] text-[#282829]">{fullName}</p>
                    <div className="flex gap-2 mt-3">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[13px] font-semibold text-[#2b69d1] border border-[#2b69d1] hover:bg-[#ebf0ff] px-3 py-1.5 rounded-[3px] transition">
                        Upload Foto Profil
                      </button>
                      {avatarPreview && (
                        <button type="button" onClick={removeAvatar} className="text-[13px] font-semibold text-[#636466] border border-[#dee0e1] hover:border-[#b92b27] hover:text-[#b92b27] px-3 py-1.5 rounded-[3px] transition">
                          Hapus
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#939598] mt-2">JPG, PNG atau GIF. Maks 5MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>Nama Depan <span className="text-[#b92b27]">*</span></label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nama depan" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nama Belakang</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nama belakang" className={inputClass} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className={labelClass}>Kredensial</label>
                  <input type="text" value={credential} onChange={(e) => setCredential(e.target.value)} placeholder="Contoh: Mahasiswa Informatika UNTAN" maxLength={60} className={inputClass} />
                  <div className="flex justify-between mt-1">
                    <p className="text-[11px] text-[#939598]">Tampil di bawah nama di setiap postingan.</p>
                    <p className="text-[11px] text-[#939598]">{credential.length}/60</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className={labelClass}>Tentang Saya</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ceritakan tentang dirimu..." rows={4} className={`${inputClass} resize-y`} />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#dee0e1]">
                  <button type="button" onClick={() => navigate('/')} className="border border-[#dee0e1] text-[#636466] hover:text-[#282829] text-sm font-semibold px-5 py-2 rounded-full transition">Batal</button>
                  <button type="submit" className="bg-[#2b69d1] hover:bg-[#1c5bbf] text-white text-sm font-bold px-6 py-2 rounded-full transition">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white border border-[#dee0e1] rounded-[3px]">
              <div className="px-6 py-4 border-b border-[#dee0e1]">
                <h2 className="text-[15px] font-bold text-[#282829]">Keamanan Akun</h2>
                <p className="text-[13px] text-[#636466] mt-0.5">Pastikan akun kamu aman dengan password yang kuat.</p>
              </div>
              <form onSubmit={handleSavePassword} className="px-6 py-5">
                <div className="mb-5">
                  <label className={labelClass}>Password Saat Ini <span className="text-[#b92b27]">*</span></label>
                  <div className="relative">
                    <input type={showCurr ? 'text' : 'password'} value={currPass} onChange={(e) => setCurrPass(e.target.value)} placeholder="Masukkan password saat ini" className={`${inputClass} pr-24`} />
                    <button type="button" onClick={() => setShowCurr(!showCurr)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#2b69d1] font-semibold hover:underline">
                      {showCurr ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                </div>

                <hr className="border-[#dee0e1] my-5" />

                <div className="mb-5">
                  <label className={labelClass}>Password Baru <span className="text-[#b92b27]">*</span></label>
                  <div className="relative">
                    <input type={showNew ? 'text' : 'password'} value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Minimal 6 karakter" className={`${inputClass} pr-24`} />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#2b69d1] font-semibold hover:underline">
                      {showNew ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  {newPass && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= strength.score ? strength.color : '#dee0e1' }} />
                        ))}
                      </div>
                      <p className="text-[11px] mt-1 font-semibold" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className={labelClass}>Konfirmasi Password Baru <span className="text-[#b92b27]">*</span></label>
                  <div className="relative">
                    <input type={showConf ? 'text' : 'password'} value={confPass} onChange={(e) => setConfPass(e.target.value)} placeholder="Ulangi password baru" className={`${inputClass} pr-24`} />
                    <button type="button" onClick={() => setShowConf(!showConf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#2b69d1] font-semibold hover:underline">
                      {showConf ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  {confPass && (
                    <p className="text-[11px] mt-1 font-semibold" style={{ color: newPass === confPass ? '#1D9E75' : '#b92b27' }}>
                      {newPass === confPass ? '✓ Password cocok' : '✗ Password tidak cocok'}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#dee0e1]">
                  <button type="button" onClick={() => { setCurrPass(''); setNewPass(''); setConfPass(''); }} className="border border-[#dee0e1] text-[#636466] text-sm font-semibold px-5 py-2 rounded-full transition">Reset</button>
                  <button type="submit" className="bg-[#2b69d1] hover:bg-[#1c5bbf] text-white text-sm font-bold px-6 py-2 rounded-full transition">Update Password</button>
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