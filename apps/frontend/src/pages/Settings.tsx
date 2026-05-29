import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore((state) => state);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'general'>('notifications');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    privateProfile: false,
    showActivity: true,
    allowMessages: true,
    theme: 'dark' as 'dark' | 'light',
    language: 'id' as 'id' | 'en',
  });
  const [savedAlert, setSavedAlert] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
    // TODO: API PATCH /api/settings
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] font-sans text-[#282829]">

      {/* Navbar — Mobile-responsive */}
      <nav className="h-[50px] bg-white border-b border-[#dee0e1] sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto h-full flex items-center gap-3 px-3 sm:px-4">
          <span
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#b92b27', fontSize: 22, fontWeight: 900, cursor: 'pointer', userSelect: 'none', letterSpacing: '-0.5px' }}
            onClick={() => navigate('/')}
          >
            Qoora
          </span>
          <div className="flex-1" />
          <nav className="hidden sm:flex gap-1 items-center text-xs sm:text-sm">
            <Link to="/" className="text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-2 sm:px-3 py-1.5 rounded-[3px] transition">Beranda</Link>
            <Link to="/notifikasi" className="text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-2 sm:px-3 py-1.5 rounded-[3px] transition">Notifikasi</Link>
            <Link to="/profile/edit" className="text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-2 sm:px-3 py-1.5 rounded-[3px] transition">Profil</Link>
            <button
              onClick={handleLogout}
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
            <Link to="/profile/edit" className="block text-[#636466] hover:bg-[#f1f2f2] hover:text-[#282829] px-3 py-2 rounded-[3px] transition text-sm">Profil</Link>
            <button
              onClick={() => { handleLogout(); setShowMobileMenu(false); }}
              className="block w-full text-left text-[#b92b27] hover:bg-[#fff0f0] px-3 py-2 rounded-[3px] transition text-sm"
            >
              Keluar
            </button>
          </div>
        )}
      </nav>

      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col sm:flex-row gap-4 sm:gap-5">

        {/* ── Sidebar: navigasi pengaturan (responsive) ── */}
        <aside className="w-full sm:w-[220px] flex-shrink-0">
          <div className="bg-white border border-[#dee0e1] rounded-[3px] overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-[#dee0e1]">
              <p className="text-xs sm:text-sm font-bold text-[#282829]">Pengaturan</p>
            </div>
            {/* Menu */}
            <div className="flex sm:flex-col gap-0">
              {[
                { key: 'notifications', label: '🔔 Notifikasi', icon: '🔔' },
                { key: 'privacy', label: '🔒 Privasi', icon: '🔒' },
                { key: 'general', label: '⚙️ Umum', icon: '⚙️' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => { 
                    setActiveTab(item.key as typeof activeTab); 
                    setShowMobileMenu(false); 
                  }}
                  className={`flex-1 sm:w-full text-center sm:text-left flex sm:flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-4 py-2.5 text-[11px] sm:text-[13px] transition ${
                    activeTab === item.key
                      ? 'bg-[#ebf0ff] text-[#2b69d1] font-semibold border-b-2 sm:border-r-2 sm:border-b-0 border-[#2b69d1]'
                      : 'text-[#282829] hover:bg-[#f1f2f2]'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label.split(' ')[1]}</span>
                  <span className="inline sm:hidden text-[10px]">{item.label.split(' ')[0].replace('🔔', 'Not').replace('🔒', 'Priv').replace('⚙️', 'Gen')}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Konten utama (responsive) ── */}
        <div className="flex-1 min-w-0 max-w-full sm:max-w-[700px] space-y-4">

          {/* Alert */}
          {savedAlert && (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-[3px] text-xs sm:text-sm border bg-[#e6f7f2] border-[#1D9E75] text-[#0F6E56] animate-fadeIn">
              <span>✓</span>
              <span>Pengaturan berhasil disimpan!</span>
            </div>
          )}

          {/* ── TAB: Notifikasi ── */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-[#dee0e1] rounded-[3px]">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[#dee0e1]">
                <h2 className="text-[14px] sm:text-[15px] font-bold text-[#282829]">Pengaturan Notifikasi</h2>
                <p className="text-[12px] sm:text-[13px] text-[#636466] mt-0.5">Atur bagaimana Anda ingin menerima notifikasi.</p>
              </div>

              <div className="px-3 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
                {/* Email Notifications */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#f1f2f2]">
                  <div>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#282829]">Notifikasi Email</p>
                    <p className="text-[11px] sm:text-[12px] text-[#636466] mt-0.5">Terima notifikasi melalui email.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotifications')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                      settings.emailNotifications ? 'bg-[#2b69d1]' : 'bg-[#dee0e1]'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        settings.emailNotifications ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#f1f2f2]">
                  <div>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#282829]">Notifikasi Push</p>
                    <p className="text-[11px] sm:text-[12px] text-[#636466] mt-0.5">Terima notifikasi di browser Anda.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('pushNotifications')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                      settings.pushNotifications ? 'bg-[#2b69d1]' : 'bg-[#dee0e1]'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        settings.pushNotifications ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t border-[#dee0e1]">
                <button
                  onClick={handleSaveSettings}
                  className="bg-[#2b69d1] hover:bg-[#1c5bbf] text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full transition"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}

          {/* ── TAB: Privasi ── */}
          {activeTab === 'privacy' && (
            <div className="bg-white border border-[#dee0e1] rounded-[3px]">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[#dee0e1]">
                <h2 className="text-[14px] sm:text-[15px] font-bold text-[#282829]">Pengaturan Privasi</h2>
                <p className="text-[12px] sm:text-[13px] text-[#636466] mt-0.5">Kelola privasi dan visibilitas profil Anda.</p>
              </div>

              <div className="px-3 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
                {/* Private Profile */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#f1f2f2]">
                  <div>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#282829]">Profil Pribadi</p>
                    <p className="text-[11px] sm:text-[12px] text-[#636466] mt-0.5">Hanya Anda yang dapat melihat profil.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('privateProfile')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                      settings.privateProfile ? 'bg-[#2b69d1]' : 'bg-[#dee0e1]'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        settings.privateProfile ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Show Activity */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#f1f2f2]">
                  <div>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#282829]">Tampilkan Aktivitas</p>
                    <p className="text-[11px] sm:text-[12px] text-[#636466] mt-0.5">Tunjukkan kapan Anda terakhir aktif.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('showActivity')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                      settings.showActivity ? 'bg-[#2b69d1]' : 'bg-[#dee0e1]'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        settings.showActivity ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Messages */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#282829]">Terima Pesan</p>
                    <p className="text-[11px] sm:text-[12px] text-[#636466] mt-0.5">Izinkan orang lain mengirim pesan privat.</p>
                  </div>
                  <button
                    onClick={() => handleToggle('allowMessages')}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                      settings.allowMessages ? 'bg-[#2b69d1]' : 'bg-[#dee0e1]'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        settings.allowMessages ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t border-[#dee0e1]">
                <button
                  onClick={handleSaveSettings}
                  className="bg-[#2b69d1] hover:bg-[#1c5bbf] text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full transition"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}

          {/* ── TAB: Umum ── */}
          {activeTab === 'general' && (
            <div className="bg-white border border-[#dee0e1] rounded-[3px]">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[#dee0e1]">
                <h2 className="text-[14px] sm:text-[15px] font-bold text-[#282829]">Pengaturan Umum</h2>
                <p className="text-[12px] sm:text-[13px] text-[#636466] mt-0.5">Atur preferensi umum aplikasi.</p>
              </div>

              <div className="px-3 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
                {/* Bahasa */}
                <div className="pb-3 sm:pb-4 border-b border-[#f1f2f2]">
                  <p className="text-[13px] sm:text-[14px] font-semibold text-[#282829] mb-2">Bahasa</p>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as 'id' | 'en' }))}
                    className="w-full bg-white border border-[#dee0e1] focus:border-[#282829] text-[#282829] text-xs sm:text-sm px-3 py-2 rounded-[3px] outline-none transition"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Tema */}
                <div>
                  <p className="text-[13px] sm:text-[14px] font-semibold text-[#282829] mb-2">Tema</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                      className={`flex-1 px-3 py-2 rounded-[3px] text-xs sm:text-sm font-semibold transition ${
                        settings.theme === 'light'
                          ? 'bg-[#2b69d1] text-white'
                          : 'bg-[#f1f2f2] text-[#636466] hover:bg-[#dee0e1]'
                      }`}
                    >
                      ☀️ Terang
                    </button>
                    <button
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                      className={`flex-1 px-3 py-2 rounded-[3px] text-xs sm:text-sm font-semibold transition ${
                        settings.theme === 'dark'
                          ? 'bg-[#2b69d1] text-white'
                          : 'bg-[#f1f2f2] text-[#636466] hover:bg-[#dee0e1]'
                      }`}
                    >
                      🌙 Gelap
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-t border-[#dee0e1]">
                <button
                  onClick={handleSaveSettings}
                  className="bg-[#2b69d1] hover:bg-[#1c5bbf] text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 rounded-full transition"
                >
                  Simpan
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
