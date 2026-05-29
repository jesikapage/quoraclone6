import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import Navbar from '../components/Navbar';

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#181818',
  surface: '#242424',
  surfaceHover: '#2d2d2d',
  border: '#393939',
  textPrimary: '#D5D6D7',
  textSecondary: '#B1B3B6',
  textMuted: '#87898c',
  blue: '#3A7AEF',
  blueBg: '#3A7AEF1a',
  red: '#b92b27',
  redBg: '#b92b271a',
  green: '#1D9E75',
};
const FONT = "-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// ── Draggable Avatar ──────────────────────────────────────────────────────────
interface DraggableAvatarProps {
  src: string | null;
  initials: string;
  size?: number;
  offsetX: number;
  offsetY: number;
  onOffsetChange?: (x: number, y: number) => void;
}

function DraggableAvatar({ src, initials, size = 80, offsetX, offsetY, onOffsetChange }: DraggableAvatarProps) {
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
      const newX = Math.max(-50, Math.min(50, startOffset.current.x + ev.clientX - startMouse.current.x));
      const newY = Math.max(-50, Math.min(50, startOffset.current.y + ev.clientY - startMouse.current.y));
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

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!src) return;
    const touch = e.touches[0];
    isDragging.current = true;
    startMouse.current = { x: touch.clientX, y: touch.clientY };
    startOffset.current = { x: offsetX, y: offsetY };
    const onTouchMove = (ev: TouchEvent) => {
      if (!isDragging.current) return;
      const t = ev.touches[0];
      const newX = Math.max(-50, Math.min(50, startOffset.current.x + t.clientX - startMouse.current.x));
      const newY = Math.max(-50, Math.min(50, startOffset.current.y + t.clientY - startMouse.current.y));
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
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        width: size, height: size, borderRadius: '50%',
        overflow: 'hidden', border: `2px solid ${C.border}`,
        background: C.blue, flexShrink: 0, position: 'relative',
        cursor: src ? 'grab' : 'default', userSelect: 'none',
      }}
      title={src ? 'Geser untuk mengatur posisi foto' : undefined}
    >
      {src ? (
        <img
          src={src} alt="Avatar" draggable={false}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none',
            objectPosition: `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`,
          }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size * 0.35, fontWeight: 800, color: '#fff', fontFamily: FONT }}>
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setAuth, token } = useAuthStore();

  const nameParts = (user?.name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [credential, setCredential] = useState('');
  const [bio, setBio] = useState('');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarOffsetX, setAvatarOffsetX] = useState(0);
  const [avatarOffsetY, setAvatarOffsetY] = useState(0);

  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');

  const fullName = `${firstName} ${lastName}`.trim() || 'Nama Kamu';
  const initials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '?';

  function showAlertMsg(type: 'success' | 'error', msg: string) {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showAlertMsg('error', 'Ukuran file maksimal 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
      setAvatarOffsetX(0);
      setAvatarOffsetY(0);
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatarPreview(null);
    setAvatarOffsetX(0);
    setAvatarOffsetY(0);
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: fullName, avatar: avatarPreview || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { showAlertMsg('error', data.error || 'Gagal menyimpan profil.'); return; }
      // Update auth store → Navbar & seluruh app ikut update
      if (user) setAuth({ ...user, name: fullName, avatar: avatarPreview || user.avatar }, token);
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) { showAlertMsg('error', data.error || 'Gagal mengubah password.'); return; }
      showAlertMsg('success', 'Password berhasil diubah!');
      setCurrPass(''); setNewPass(''); setConfPass('');
    } catch {
      showAlertMsg('error', 'Koneksi ke server gagal.');
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', background: '#1e1e1e', border: `1px solid ${C.border}`,
    borderRadius: 3, padding: '8px 12px', fontSize: 13, color: C.textPrimary,
    outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = C.blue);
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = C.border);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: FONT }}>
      {/* Navbar sama dengan Beranda */}
      <Navbar search={search} onSearchChange={setSearch} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── Sidebar kiri ── */}
        <aside className="ep-sidebar" style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, overflow: 'hidden' }}>
            {/* Preview profil */}
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <DraggableAvatar
                src={avatarPreview} initials={initials} size={40}
                offsetX={avatarOffsetX} offsetY={avatarOffsetY}
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

            {/* Tab sidebar */}
            {([
              { key: 'profile', label: 'Edit Profil', icon: '👤' },
              { key: 'account', label: 'Keamanan Akun', icon: '🔒' },
            ] as const).map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    textAlign: 'left', padding: '10px 16px', border: 'none',
                    background: isActive ? C.blueBg : 'none',
                    color: isActive ? C.blue : C.textPrimary,
                    fontWeight: isActive ? 700 : 400, fontSize: 13,
                    fontFamily: FONT, cursor: 'pointer',
                    borderRight: isActive ? `2px solid ${C.blue}` : '2px solid transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHover; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Konten utama ── */}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 700 }}>

          {/* Alert */}
          {alert && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
              borderRadius: 3, fontSize: 13, marginBottom: 12, fontFamily: FONT,
              background: alert.type === 'success' ? '#e6f7f2' : '#fff0f0',
              border: `1px solid ${alert.type === 'success' ? C.green : C.red}`,
              color: alert.type === 'success' ? '#0F6E56' : C.red,
            }}>
              {alert.type === 'success' ? '✓' : '✗'} {alert.msg}
            </div>
          )}

          {/* ── Tab Edit Profil ── */}
          {activeTab === 'profile' && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3 }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Edit Profil</h2>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: '4px 0 0' }}>Informasi ini terlihat publik di profil kamu.</p>
              </div>

              <form onSubmit={handleSaveProfile} style={{ padding: '20px 24px' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <DraggableAvatar
                      src={avatarPreview} initials={initials} size={80}
                      offsetX={avatarOffsetX} offsetY={avatarOffsetY}
                      onOffsetChange={(x, y) => { setAvatarOffsetX(x); setAvatarOffsetY(y); }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="ep-avatar-overlay"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.55)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        opacity: 0, cursor: 'pointer', transition: 'opacity 0.18s',
                      }}
                    >
                      <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
                        Ganti<br />Foto
                      </span>
                    </div>
                  </div>

                  <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />

                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: '0 0 10px' }}>{fullName}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        type="button" onClick={() => fileInputRef.current?.click()}
                        style={{ fontSize: 13, fontWeight: 600, color: C.blue, border: `1px solid ${C.blue}`, borderRadius: 3, padding: '6px 14px', background: 'none', cursor: 'pointer', fontFamily: FONT }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.blueBg}
                        onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
                      >
                        Upload Foto Profil
                      </button>
                      {avatarPreview && (
                        <button
                          type="button" onClick={removeAvatar}
                          style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 3, padding: '6px 14px', background: 'none', cursor: 'pointer', fontFamily: FONT }}
                          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = C.red; b.style.color = C.red; }}
                          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = C.border; b.style.color = C.textSecondary; }}
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: C.textMuted, margin: '8px 0 0' }}>
                      JPG, PNG atau GIF. Maks 5MB.
                      {avatarPreview && <span style={{ color: C.blue }}> · Geser foto untuk mengatur posisi</span>}
                    </p>
                  </div>
                </div>

                {/* Nama */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                      Nama Depan <span style={{ color: C.red }}>*</span>
                    </label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nama depan" style={inp} onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Nama Belakang</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nama belakang" style={inp} onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                </div>

                {/* Kredensial */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Kredensial</label>
                  <input type="text" value={credential} onChange={(e) => setCredential(e.target.value)} placeholder="Contoh: Mahasiswa Informatika UNTAN" maxLength={60} style={inp} onFocus={focusBorder} onBlur={blurBorder} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>Tampil di bawah nama di setiap postingan.</p>
                    <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>{credential.length}/60</p>
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Tentang Saya</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ceritakan tentang dirimu..." rows={4}
                    style={{ ...inp, resize: 'vertical' } as React.CSSProperties}
                    onFocus={focusBorder as any} onBlur={blurBorder as any}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <button type="button" onClick={() => navigate('/')} style={{ border: `1px solid ${C.border}`, color: C.textSecondary, fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 100, background: 'none', cursor: 'pointer', fontFamily: FONT }}>
                    Batal
                  </button>
                  <button type="submit"
                    style={{ background: C.blue, color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 22px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: FONT }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#1c5bbf'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.blue}
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Tab Keamanan Akun ── */}
          {activeTab === 'account' && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3 }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, margin: 0 }}>Keamanan Akun</h2>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: '4px 0 0' }}>Pastikan akun kamu aman dengan password yang kuat.</p>
              </div>

              <form onSubmit={handleSavePassword} style={{ padding: '20px 24px' }}>
                {/* Password saat ini */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                    Password Saat Ini <span style={{ color: C.red }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input type={showCurr ? 'text' : 'password'} value={currPass} onChange={(e) => setCurrPass(e.target.value)} placeholder="Masukkan password saat ini" style={{ ...inp, paddingRight: 96 }} onFocus={focusBorder} onBlur={blurBorder} />
                    <button type="button" onClick={() => setShowCurr(!showCurr)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 12, color: C.blue, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                      {showCurr ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '0 0 20px' }} />

                {/* Password baru */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                    Password Baru <span style={{ color: C.red }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input type={showNew ? 'text' : 'password'} value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Minimal 6 karakter" style={{ ...inp, paddingRight: 96 }} onFocus={focusBorder} onBlur={blurBorder} />
                    <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 12, color: C.blue, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                      {showNew ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  {newPass && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} style={{ height: 4, flex: 1, borderRadius: 100, background: i <= strength.score ? strength.color : C.border, transition: 'background 0.3s' }} />
                        ))}
                      </div>
                      <p style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: strength.color, fontFamily: FONT }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Konfirmasi password */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                    Konfirmasi Password Baru <span style={{ color: C.red }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input type={showConf ? 'text' : 'password'} value={confPass} onChange={(e) => setConfPass(e.target.value)} placeholder="Ulangi password baru" style={{ ...inp, paddingRight: 96 }} onFocus={focusBorder} onBlur={blurBorder} />
                    <button type="button" onClick={() => setShowConf(!showConf)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 12, color: C.blue, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
                      {showConf ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  {confPass && (
                    <p style={{ fontSize: 11, marginTop: 4, fontWeight: 600, fontFamily: FONT, color: newPass === confPass ? C.green : C.red }}>
                      {newPass === confPass ? '✓ Password cocok' : '✗ Password tidak cocok'}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <button type="button" onClick={() => { setCurrPass(''); setNewPass(''); setConfPass(''); }} style={{ border: `1px solid ${C.border}`, color: C.textSecondary, fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 100, background: 'none', cursor: 'pointer', fontFamily: FONT }}>
                    Reset
                  </button>
                  <button type="submit"
                    style={{ background: C.blue, color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 22px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: FONT }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#1c5bbf'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = C.blue}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .ep-sidebar { display: block; }
        @media (max-width: 640px) { .ep-sidebar { display: none; } }
        .ep-avatar-overlay:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default EditProfile;