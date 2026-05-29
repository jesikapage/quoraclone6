<<<<<<< HEAD
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import Navbar from '../components/Navbar';

// ── Design tokens (light, same as original Quora profile page) ────────────────
const C = {
  bg: '#f7f7f8',
  surface: '#ffffff',
  border: '#dee0e1',
  textPrimary: '#282829',
  textSecondary: '#636466',
  textMuted: '#939598',
  blue: '#2b69d1',
  red: '#b92b27',
  green: '#1D9E75',
};
const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// ── Draggable Avatar component ─────────────────────────────────────────────────
interface DraggableAvatarProps {
  src: string | null;
  initials: string;
  size?: number;
  onOffsetChange?: (x: number, y: number) => void;
  offsetX: number;
  offsetY: number;
}

function DraggableAvatar({ src, initials, size = 80, onOffsetChange, offsetX, offsetY }: DraggableAvatarProps) {
  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!src) return;
    e.preventDefault();
    isDragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { x: offsetX, y: offsetY };

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = ev.clientX - startMouse.current.x;
      const dy = ev.clientY - startMouse.current.y;
      const newX = Math.max(-50, Math.min(50, startOffset.current.x + dx));
      const newY = Math.max(-50, Math.min(50, startOffset.current.y + dy));
      onOffsetChange?.(newX, newY);
    };
    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [src, offsetX, offsetY, onOffsetChange]);

  // Touch support
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!src) return;
    const touch = e.touches[0];
    isDragging.current = true;
    startMouse.current = { x: touch.clientX, y: touch.clientY };
    startOffset.current = { x: offsetX, y: offsetY };

    const onTouchMove = (ev: TouchEvent) => {
      if (!isDragging.current) return;
      const t = ev.touches[0];
      const dx = t.clientX - startMouse.current.x;
      const dy = t.clientY - startMouse.current.y;
      const newX = Math.max(-50, Math.min(50, startOffset.current.x + dx));
      const newY = Math.max(-50, Math.min(50, startOffset.current.y + dy));
      onOffsetChange?.(newX, newY);
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  }, [src, offsetX, offsetY, onOffsetChange]);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: `2px solid ${C.border}`,
        background: C.blue,
        flexShrink: 0,
        position: 'relative',
        cursor: src ? 'grab' : 'default',
        userSelect: 'none',
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      title={src ? 'Geser untuk mengatur posisi foto' : undefined}
    >
      {src ? (
        <img
          src={src}
          alt="Avatar"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`,
            pointerEvents: 'none',
          }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: size * 0.35, fontWeight: 800, color: '#fff', fontFamily: FONT }}>
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main EditProfile ───────────────────────────────────────────────────────────
=======
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setAuth, logout, token } = useAuthStore();

  const nameParts = (user?.name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [credential, setCredential] = useState('');
  const [bio, setBio] = useState('');
<<<<<<< HEAD

  // Avatar state — use user.avatar from store as base
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );
  // Drag offset for repositioning the photo
  const [avatarOffsetX, setAvatarOffsetX] = useState(0);
  const [avatarOffsetY, setAvatarOffsetY] = useState(0);
=======
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6

  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
<<<<<<< HEAD
  const [search, setSearch] = useState('');
=======
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6

  const fullName = `${firstName} ${lastName}`.trim() || 'Nama Kamu';
  const initials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '?';

  function showAlertMsg(type: 'success' | 'error', msg: string) {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
<<<<<<< HEAD
    if (file.size > 5 * 1024 * 1024) {
      showAlertMsg('error', 'Ukuran file maksimal 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
      // Reset drag offset when a new photo is selected
      setAvatarOffsetX(0);
      setAvatarOffsetY(0);
    };
=======
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatarPreview(null);
<<<<<<< HEAD
    setAvatarOffsetX(0);
    setAvatarOffsetY(0);
=======
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
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
<<<<<<< HEAD

      // ── Update auth store sehingga Navbar & semua komponen ikut update ──
      if (user) {
        const updatedUser = {
          ...user,
          name: fullName,
          avatar: avatarPreview || user.avatar,
        };
        setAuth(updatedUser, token);
      }

=======
      if (user) setAuth(data.user, token);
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
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
<<<<<<< HEAD
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
=======
        body: JSON.stringify({
          currentPassword: currPass,
          newPassword: newPass,
        }),
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
      });
      const data = await res.json();
      if (!res.ok) { showAlertMsg('error', data.error || 'Gagal mengubah password.'); return; }
      showAlertMsg('success', 'Password berhasil diubah!');
      setCurrPass(''); setNewPass(''); setConfPass('');
    } catch {
      showAlertMsg('error', 'Koneksi ke server gagal.');
    }
  }

<<<<<<< HEAD
  const inp = {
    width: '100%', background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 3, padding: '8px 12px', fontSize: 13, color: C.textPrimary,
    outline: 'none', fontFamily: FONT, boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>
      {/* ── Navbar (sama persis dengan Beranda) ── */}
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* ── Left sidebar ── */}
        <aside style={{ width: 220, flexShrink: 0 }} className="profile-sidebar">
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, overflow: 'hidden' }}>
            {/* Profile preview in sidebar */}
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <DraggableAvatar
                src={avatarPreview}
                initials={initials}
                size={40}
                offsetX={avatarOffsetX}
                offsetY={avatarOffsetY}
                onOffsetChange={(x, y) => { setAvatarOffsetX(x); setAvatarOffsetY(y); }}
              />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {fullName}
                </p>
                <p style={{ fontSize: 11, color: C.textSecondary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {credential || 'Tambah kredensial'}
                </p>
              </div>
            </div>

            {/* Sidebar tabs */}
            {[
              { key: 'profile', label: 'Edit Profil', icon: '👤' },
              { key: 'account', label: 'Keamanan Akun', icon: '🔒' },
            ].map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key as 'profile' | 'account')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', textAlign: 'left',
                    padding: '10px 16px', border: 'none',
                    background: isActive ? '#ebf0ff' : 'none',
                    color: isActive ? C.blue : C.textPrimary,
                    fontWeight: isActive ? 700 : 400,
                    fontSize: 13, fontFamily: FONT, cursor: 'pointer',
                    borderRight: isActive ? `2px solid ${C.blue}` : '2px solid transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f1f2f2'; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 700 }}>
          {/* Alert */}
          {alert && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 3, fontSize: 13, marginBottom: 12,
              background: alert.type === 'success' ? '#e6f7f2' : '#fff0f0',
              border: `1px solid ${alert.type === 'success' ? C.green : C.red}`,
              color: alert.type === 'success' ? '#0F6E56' : C.red,
              fontFamily: FONT,
            }}>
=======
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
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
              <span>{alert.type === 'success' ? '✓' : '✗'}</span>
              {alert.msg}
            </div>
          )}

<<<<<<< HEAD
          {/* ── Edit Profil tab ── */}
          {activeTab === 'profile' && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3 }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Edit Profil</h2>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: '4px 0 0' }}>Informasi ini terlihat publik di profil kamu.</p>
              </div>

              <form onSubmit={handleSaveProfile} style={{ padding: '20px 24px' }}>
                {/* Avatar section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                  {/* Draggable avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <DraggableAvatar
                      src={avatarPreview}
                      initials={initials}
                      size={80}
                      offsetX={avatarOffsetX}
                      offsetY={avatarOffsetY}
                      onOffsetChange={(x, y) => { setAvatarOffsetX(x); setAvatarOffsetY(y); }}
                    />
                    {/* Hover overlay to click and upload */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.42)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        opacity: 0, cursor: 'pointer', transition: 'opacity 0.18s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.opacity = '0'}
                    >
                      <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
                        Ganti<br/>Foto
                      </span>
                    </div>
                  </div>

                  <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />

                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: '0 0 10px' }}>{fullName}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          fontSize: 13, fontWeight: 600, color: C.blue,
                          border: `1px solid ${C.blue}`, borderRadius: 3,
                          padding: '6px 14px', background: 'none', cursor: 'pointer',
                          fontFamily: FONT, transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#ebf0ff'}
                        onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
                      >
                        Upload Foto Profil
                      </button>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          style={{
                            fontSize: 13, fontWeight: 600, color: C.textSecondary,
                            border: `1px solid ${C.border}`, borderRadius: 3,
                            padding: '6px 14px', background: 'none', cursor: 'pointer',
                            fontFamily: FONT, transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = C.red; b.style.color = C.red; }}
                          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = C.border; b.style.color = C.textSecondary; }}
                        >
=======
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
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
                          Hapus
                        </button>
                      )}
                    </div>
<<<<<<< HEAD
                    <p style={{ fontSize: 11, color: C.textMuted, margin: '8px 0 0' }}>
                      JPG, PNG atau GIF. Maks 5MB.
                      {avatarPreview && <span style={{ color: C.blue }}> · Geser foto untuk mengatur posisi</span>}
                    </p>
                  </div>
                </div>

                {/* Name fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                      Nama Depan <span style={{ color: C.red }}>*</span>
                    </label>
                    <input
                      type="text" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nama depan" style={inp}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = C.blue}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = C.border}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                      Nama Belakang
                    </label>
                    <input
                      type="text" value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nama belakang" style={inp}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = C.blue}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = C.border}
                    />
                  </div>
                </div>

                {/* Credential */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Kredensial</label>
                  <input
                    type="text" value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    placeholder="Contoh: Mahasiswa Informatika UNTAN"
                    maxLength={60} style={inp}
                    onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = C.blue}
                    onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = C.border}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>Tampil di bawah nama di setiap postingan.</p>
                    <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>{credential.length}/60</p>
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Tentang Saya</label>
                  <textarea
                    value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder="Ceritakan tentang dirimu..." rows={4}
                    style={{ ...inp, resize: 'vertical' } as any}
                    onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = C.blue}
                    onBlur={(e) => (e.target as HTMLTextAreaElement).style.borderColor = C.border}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <button
                    type="button" onClick={() => navigate('/')}
                    style={{ border: `1px solid ${C.border}`, color: C.textSecondary, fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 100, background: 'none', cursor: 'pointer', fontFamily: FONT }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={{ background: C.blue, color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 22px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: FONT }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#1c5bbf'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.blue}
                  >
                    Simpan Perubahan
                  </button>
=======
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
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
                </div>
              </form>
            </div>
          )}

<<<<<<< HEAD
          {/* ── Keamanan Akun tab ── */}
          {activeTab === 'account' && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3 }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Keamanan Akun</h2>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: '4px 0 0' }}>Pastikan akun kamu aman dengan password yang kuat.</p>
              </div>

              <form onSubmit={handleSavePassword} style={{ padding: '20px 24px' }}>
                {/* Current password */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                    Password Saat Ini <span style={{ color: C.red }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurr ? 'text' : 'password'} value={currPass}
                      onChange={(e) => setCurrPass(e.target.value)}
                      placeholder="Masukkan password saat ini"
                      style={{ ...inp, paddingRight: 96 }}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = C.blue}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = C.border}
                    />
                    <button
                      type="button" onClick={() => setShowCurr(!showCurr)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 12, color: C.blue, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
                    >
=======
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
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
                      {showCurr ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                </div>

<<<<<<< HEAD
                <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '0 0 20px' }} />

                {/* New password */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                    Password Baru <span style={{ color: C.red }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNew ? 'text' : 'password'} value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      style={{ ...inp, paddingRight: 96 }}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = C.blue}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = C.border}
                    />
                    <button
                      type="button" onClick={() => setShowNew(!showNew)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 12, color: C.blue, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
                    >
=======
                <hr className="border-[#dee0e1] my-5" />

                <div className="mb-5">
                  <label className={labelClass}>Password Baru <span className="text-[#b92b27]">*</span></label>
                  <div className="relative">
                    <input type={showNew ? 'text' : 'password'} value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Minimal 6 karakter" className={`${inputClass} pr-24`} />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#2b69d1] font-semibold hover:underline">
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
                      {showNew ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  {newPass && (
<<<<<<< HEAD
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} style={{ height: 4, flex: 1, borderRadius: 100, background: i <= strength.score ? strength.color : C.border, transition: 'background 0.3s' }} />
                        ))}
                      </div>
                      <p style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: strength.color, fontFamily: FONT }}>{strength.label}</p>
=======
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= strength.score ? strength.color : '#dee0e1' }} />
                        ))}
                      </div>
                      <p className="text-[11px] mt-1 font-semibold" style={{ color: strength.color }}>{strength.label}</p>
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
                    </div>
                  )}
                </div>

<<<<<<< HEAD
                {/* Confirm password */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                    Konfirmasi Password Baru <span style={{ color: C.red }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConf ? 'text' : 'password'} value={confPass}
                      onChange={(e) => setConfPass(e.target.value)}
                      placeholder="Ulangi password baru"
                      style={{ ...inp, paddingRight: 96 }}
                      onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = C.blue}
                      onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = C.border}
                    />
                    <button
                      type="button" onClick={() => setShowConf(!showConf)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 12, color: C.blue, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
                    >
=======
                <div className="mb-6">
                  <label className={labelClass}>Konfirmasi Password Baru <span className="text-[#b92b27]">*</span></label>
                  <div className="relative">
                    <input type={showConf ? 'text' : 'password'} value={confPass} onChange={(e) => setConfPass(e.target.value)} placeholder="Ulangi password baru" className={`${inputClass} pr-24`} />
                    <button type="button" onClick={() => setShowConf(!showConf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#2b69d1] font-semibold hover:underline">
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
                      {showConf ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  {confPass && (
<<<<<<< HEAD
                    <p style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: newPass === confPass ? C.green : C.red, fontFamily: FONT }}>
=======
                    <p className="text-[11px] mt-1 font-semibold" style={{ color: newPass === confPass ? '#1D9E75' : '#b92b27' }}>
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
                      {newPass === confPass ? '✓ Password cocok' : '✗ Password tidak cocok'}
                    </p>
                  )}
                </div>

<<<<<<< HEAD
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <button
                    type="button" onClick={() => { setCurrPass(''); setNewPass(''); setConfPass(''); }}
                    style={{ border: `1px solid ${C.border}`, color: C.textSecondary, fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 100, background: 'none', cursor: 'pointer', fontFamily: FONT }}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    style={{ background: C.blue, color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 22px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: FONT }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#1c5bbf'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.blue}
                  >
                    Update Password
                  </button>
=======
                <div className="flex justify-end gap-3 pt-4 border-t border-[#dee0e1]">
                  <button type="button" onClick={() => { setCurrPass(''); setNewPass(''); setConfPass(''); }} className="border border-[#dee0e1] text-[#636466] text-sm font-semibold px-5 py-2 rounded-full transition">Reset</button>
                  <button type="submit" className="bg-[#2b69d1] hover:bg-[#1c5bbf] text-white text-sm font-bold px-6 py-2 rounded-full transition">Update Password</button>
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
<<<<<<< HEAD

      <style>{`
        .profile-sidebar { display: block; }
        @media (max-width: 640px) {
          .profile-sidebar { display: none; }
        }
      `}</style>
=======
>>>>>>> 9f3fbd90285a761db25ca98548d38e30be9c94b6
    </div>
  );
};

export default EditProfile;