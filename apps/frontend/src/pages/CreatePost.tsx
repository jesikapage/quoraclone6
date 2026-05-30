import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useImageUpload } from '../hooks/useImageUpload';

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

// 1. Pindahkan definisi tab ke luar komponen agar aman dan tidak di-recreate tiap render
const TABS = [
  { id: 'question', label: 'Tambah Pertanyaan' },
  { id: 'post', label: 'Buat Postingan' }
] as const;

export default function CreatePost({ onClose, onSuccess }: Props) {
  const { user, token } = useAuthStore();
  const { uploadImage } = useImageUpload();

  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Kita set default-nya ke 'post' saja agar tombol foto langsung kelihatan saat modal dibuka!
  const [activeTab, setActiveTab] = useState<'question' | 'post'>('post');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxChar = 500;
  const isOverLimit = content.length > maxChar;

  useEffect(() => { textareaRef.current?.focus(); }, []);
  
  useEffect(() => {
    if (activeTab === 'question') {
      removeImage();
    }
  }, [activeTab]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setError(null);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) { setError('Konten tidak boleh kosong.'); return; }
    if (isOverLimit) { setError(`Melebihi batas ${maxChar} karakter.`); return; }
    if (!token) { setError('Kamu harus login dulu.'); return; }

    setError(null);
    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined = undefined;
      if (imageFile && activeTab === 'post') {
        setIsUploading(true);
        const uploaded = await uploadImage(imageFile);
        setIsUploading(false);
        if (!uploaded) {
          setError('Gagal upload gambar. Coba lagi.');
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploaded;
      }

      const endpoint = activeTab === 'question' ? '/questions' : '/posts';

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          ...(activeTab === 'post' && { imageUrl }),
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Gagal memposting.'); return; }
      onSuccess?.();
      onClose();
    } catch {
      setError('Koneksi ke server gagal.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  }

  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`;
  const isLoading = isSubmitting || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <div className="w-full max-w-[540px] bg-[#262626] border border-[#444] rounded-[3px] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* REVISI BAGIAN HEAD TAB MENU */}
        <div className="flex border-b border-[#444] w-full items-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-sm font-semibold py-3 transition border-b-2 text-center ${
                activeTab === tab.id 
                  ? 'border-[#e2e2e2] text-[#e2e2e2]' 
                  : 'border-transparent text-[#636466] hover:text-[#e2e2e2] hover:bg-[#2e2e2e]'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button type="button" onClick={onClose} className="text-[#636466] hover:text-[#e2e2e2] text-lg px-4 py-3 transition border-b-2 border-transparent">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={avatarUrl} alt="avatar" className="w-9 h-9 rounded-full border border-[#444]" />
              <p className="text-sm font-bold text-[#e2e2e2]">{user?.name || 'Kamu'}</p>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(null); }}
              placeholder={activeTab === 'question' ? "Mulai pertanyaan dengan 'Apa', 'Bagaimana'..." : "Bagikan sesuatu..."}
              rows={4}
              className={`w-full bg-transparent border-0 border-b-2 ${isOverLimit ? 'border-[#b92b27]' : 'border-[#444] focus:border-[#e2e2e2]'} text-[#e2e2e2] text-[16px] font-semibold leading-relaxed pb-2 outline-none transition resize-none placeholder-[#636466]`}
            />

            <div className="flex justify-end mt-1 mb-3">
              <span className={`text-[11px] ${isOverLimit ? 'text-[#b92b27]' : 'text-[#636466]'}`}>{content.length}/{maxChar}</span>
            </div>

            {activeTab === 'post' && imagePreview && (
              <div className="relative mb-3 rounded-[3px] overflow-hidden border border-[#444]">
                <img src={imagePreview} alt="preview" className="w-full max-h-48 object-cover" />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <p className="text-white text-sm font-semibold">Mengupload...</p>
                  </div>
                )}
                {!isUploading && (
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white text-xs px-2 py-1 rounded-[3px] transition">
                    ✕ Hapus
                  </button>
                )}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
            {error && <p className="text-xs text-[#b92b27] mb-2">✗ {error}</p>}
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[#444] bg-[#1e1e1e]">
            {activeTab === 'post' ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-[#636466] hover:text-[#e2e2e2] hover:bg-[#333] px-2.5 py-1.5 rounded-[3px] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <span className="text-xs font-semibold">Foto</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="border border-[#444] text-[#939598] hover:text-[#e2e2e2] text-sm font-semibold px-4 py-1.5 rounded-full transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading || !content.trim() || isOverLimit}
                className={`text-white text-sm font-bold px-5 py-1.5 rounded-full transition ${
                  isLoading || !content.trim() || isOverLimit
                    ? 'bg-[#1a3a6b] cursor-not-allowed opacity-50'
                    : 'bg-[#2b69d1] hover:bg-[#3277ed]'
                }`}
              >
                {isUploading ? 'Mengupload...' : isSubmitting ? 'Memposting...' : activeTab === 'question' ? 'Tambah Pertanyaan' : 'Posting'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}