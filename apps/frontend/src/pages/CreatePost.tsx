import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CreatePost({ onClose, onSuccess }: Props) {
  const { user, token } = useAuthStore();

  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'question' | 'post'>('question');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxChar = 500;
  const isOverLimit = content.length > maxChar;

  useEffect(() => { textareaRef.current?.focus(); }, []);
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          imageUrl: imagePreview || undefined,
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
    }
  }

  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <div className="w-full max-w-[540px] bg-[#262626] border border-[#444] rounded-[3px] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        <div className="flex border-b border-[#444]">
          {(['question', 'post'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 text-sm font-semibold py-3 transition border-b-2 ${
                activeTab === tab ? 'border-[#e2e2e2] text-[#e2e2e2]' : 'border-transparent text-[#636466] hover:text-[#e2e2e2] hover:bg-[#2e2e2e]'
              }`}>
              {tab === 'question' ? 'Tambah Pertanyaan' : 'Buat Postingan'}
            </button>
          ))}
          <button onClick={onClose} className="text-[#636466] hover:text-[#e2e2e2] text-lg px-4 transition">✕</button>
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

            {imagePreview && (
              <div className="relative mb-3 rounded-[3px] overflow-hidden border border-[#444]">
                <img src={imagePreview} alt="preview" className="w-full max-h-48 object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white text-xs px-2 py-1 rounded-[3px] transition">✕ Hapus</button>
              </div>
            )}

            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
            {error && <p className="text-xs text-[#b92b27] mb-2">✗ {error}</p>}
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-[#444] bg-[#1e1e1e]">
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-[#636466] hover:text-[#e2e2e2] hover:bg-[#333] px-2.5 py-1.5 rounded-[3px] transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="text-xs font-semibold">Foto</span>
            </button>

            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="border border-[#444] text-[#939598] hover:text-[#e2e2e2] text-sm font-semibold px-4 py-1.5 rounded-full transition">Batal</button>
              <button type="submit" disabled={isSubmitting || !content.trim() || isOverLimit}
                className={`text-white text-sm font-bold px-5 py-1.5 rounded-full transition ${
                  isSubmitting || !content.trim() || isOverLimit ? 'bg-[#1a3a6b] cursor-not-allowed opacity-50' : 'bg-[#2b69d1] hover:bg-[#3277ed]'
                }`}>
                {isSubmitting ? 'Memposting...' : activeTab === 'question' ? 'Tambah Pertanyaan' : 'Posting'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}