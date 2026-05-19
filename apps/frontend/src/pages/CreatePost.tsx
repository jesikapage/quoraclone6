import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CreatePost({ onClose, onSuccess }: Props) {
  const { user } = useAuthStore();

  const [content, setContent] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState('');
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
    if (!content.trim()) { setError('Pertanyaan tidak boleh kosong.'); return; }
    if (isOverLimit) { setError(`Melebihi batas ${maxChar} karakter.`); return; }
    setError(null);
    setIsSubmitting(true);
    // TODO: API call ke backend Rito
    await new Promise((res) => setTimeout(res, 700));
    setIsSubmitting(false);
    onSuccess?.();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] bg-[#262626] border border-[#444] rounded-[3px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Tab header — "Tambah Pertanyaan" | "Buat Postingan" */}
        <div className="flex border-b border-[#444]">
          {(['question', 'post'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-sm font-semibold py-3 transition border-b-2 ${
                activeTab === tab
                  ? 'border-[#e2e2e2] text-[#e2e2e2]'
                  : 'border-transparent text-[#636466] hover:text-[#e2e2e2] hover:bg-[#2e2e2e]'
              }`}
            >
              {tab === 'question' ? 'Tambah Pertanyaan' : 'Buat Postingan'}
            </button>
          ))}
          <button onClick={onClose} className="text-[#636466] hover:text-[#e2e2e2] text-lg px-4 transition">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 pt-4 pb-3">

            {/* User info */}
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name}`}
                alt="avatar"
                className="w-9 h-9 rounded-full border border-[#444]"
              />
              <div>
                <p className="text-sm font-bold text-[#e2e2e2] leading-tight">{user?.name || 'Kamu'}</p>
                {/* Audience selector */}
                <button
                  type="button"
                  className="flex items-center gap-1 mt-0.5 text-[12px] text-[#939598] border border-[#444] rounded-full px-2 py-0.5 hover:border-[#636466] transition"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  Semua orang
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(null); }}
              placeholder={
                activeTab === 'question'
                  ? "Mulai pertanyaan dengan 'Apa', 'Bagaimana', 'Mengapa', 'Apakah'..."
                  : "Bagikan sesuatu..."
              }
              rows={4}
              className={`w-full bg-transparent border-0 border-b-2 ${
                isOverLimit ? 'border-[#b92b27]' : 'border-[#444] focus:border-[#e2e2e2]'
              } text-[#e2e2e2] text-[16px] font-semibold leading-relaxed pb-2 outline-none transition resize-none placeholder-[#636466]`}
            />

            <div className="flex justify-end mt-1 mb-3">
              <span className={`text-[11px] ${isOverLimit ? 'text-[#b92b27]' : 'text-[#636466]'}`}>
                {content.length}/{maxChar}
              </span>
            </div>

            {/* Tambahkan detail */}
            {!showDetail ? (
              <button
                type="button"
                onClick={() => setShowDetail(true)}
                className="text-[13px] text-[#636466] hover:text-[#e2e2e2] mb-3 flex items-center gap-1 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Tambahkan detail (opsional)
              </button>
            ) : (
              <div className="mb-3">
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Tambahkan konteks atau detail pertanyaan kamu..."
                  rows={3}
                  autoFocus
                  className="w-full bg-[#1e1e1e] border border-[#444] focus:border-[#636466] text-[#e2e2e2] text-sm px-3 py-2 rounded-[3px] outline-none transition resize-none placeholder-[#636466]"
                />
              </div>
            )}

            {/* Preview gambar */}
            {imagePreview && (
              <div className="relative mb-3 rounded-[3px] overflow-hidden border border-[#444]">
                <img src={imagePreview} alt="preview" className="w-full max-h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white text-xs px-2 py-1 rounded-[3px] transition"
                >
                  ✕ Hapus
                </button>
              </div>
            )}

            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />

            {error && <p className="text-xs text-[#b92b27] mb-2">✗ {error}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#444] bg-[#1e1e1e]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Tambah Foto"
                className="flex items-center gap-1.5 text-[#636466] hover:text-[#e2e2e2] hover:bg-[#333] px-2.5 py-1.5 rounded-[3px] transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span className="text-xs font-semibold">Foto</span>
              </button>
              <button
                type="button"
                title="Tambah Tautan"
                className="flex items-center gap-1.5 text-[#636466] hover:text-[#e2e2e2] hover:bg-[#333] px-2.5 py-1.5 rounded-[3px] transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span className="text-xs font-semibold">Tautan</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#444] text-[#939598] hover:text-[#e2e2e2] hover:border-[#636466] text-sm font-semibold px-4 py-1.5 rounded-full transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim() || isOverLimit}
                className={`text-white text-sm font-bold px-5 py-1.5 rounded-full transition ${
                  isSubmitting || !content.trim() || isOverLimit
                    ? 'bg-[#1a3a6b] cursor-not-allowed opacity-50'
                    : 'bg-[#2b69d1] hover:bg-[#3277ed]'
                }`}
              >
                {isSubmitting ? 'Memposting...' : activeTab === 'question' ? 'Tambah Pertanyaan' : 'Posting'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}