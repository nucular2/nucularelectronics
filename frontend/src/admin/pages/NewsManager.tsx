import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { NewsItem } from '../../context/NewsContext';

type EditorMode = 'add' | 'edit';

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

function arrayBufferToBase64(buf: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [query, setQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadNews = async () => {
    const r = await fetch('/api/content/news');
    const payload = await r.json().catch(() => null);
    const items = Array.isArray(payload?.news) ? payload.news : [];
    setNews(items);
  };

  useEffect(() => {
    void loadNews();
  }, []);

  const filtered = useMemo(() => {
    const q = normalizeQuery(query);
    if (!q) return news;
    return news.filter((n) => {
      return (
        normalizeQuery(n.title).includes(q) ||
        normalizeQuery(n.date).includes(q) ||
        normalizeQuery(n.text).includes(q)
      );
    });
  }, [news, query]);

  const openAdd = () => {
    setEditorMode('add');
    setEditingId(null);
    setFormData({ title: '', date: '', image: '', text: '', link: '' });
    setEditorOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditorMode('edit');
    setEditingId(item.id);
    setFormData({ ...item });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const save = () => {
    const title = String(formData.title || '').trim();
    const date = String(formData.date || '').trim();
    const image = String(formData.image || '').trim();
    const text = String(formData.text || '').trim();
    const link = String(formData.link || '').trim();

    if (!title || !date || !text) return;

    const run = async () => {
      setSaving(true);
      try {
        const next = [...news];
        if (editorMode === 'add') {
          const nextId = Math.max(...next.map((n) => n.id), 0) + 1;
          next.unshift({
            id: nextId,
            title,
            date,
            image: image || '/new1.png',
            text,
            link: link || undefined,
          });
        } else if (editingId != null) {
          const idx = next.findIndex((n) => n.id === editingId);
          if (idx !== -1) {
            next[idx] = {
              ...next[idx],
              title,
              date,
              image: image || '/new1.png',
              text,
              link: link || undefined,
            };
          }
        }

        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        if (!token) throw new Error('Not authenticated');

        const r = await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ news: next }),
        });
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err?.message || `Failed to save: ${r.status}`);
        }
        setNews(next);
        closeEditor();
      } catch (e: any) {
        alert(e?.message || String(e));
      } finally {
        setSaving(false);
      }
    };

    void run();
  };

  const remove = (id: number) => {
    const run = async () => {
      setSaving(true);
      try {
        const next = news.filter((n) => n.id !== id);
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        if (!token) throw new Error('Not authenticated');

        const r = await fetch('/api/admin/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ news: next }),
        });
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err?.message || `Failed to delete: ${r.status}`);
        }
        setNews(next);
      } catch (e: any) {
        alert(e?.message || String(e));
      } finally {
        setSaving(false);
      }
    };
    void run();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const buf = await file.arrayBuffer();
      const base64 = arrayBufferToBase64(buf);
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const r = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', base64, folder: 'news' }),
      });
      const payload = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(payload?.message || `Upload failed: ${r.status}`);
      const url = String(payload?.url || '');
      if (!url) throw new Error('Upload failed: missing url');
      setFormData((p) => ({ ...p, image: url }));
    } catch (e: any) {
      alert(e?.message || String(e));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 28, color: 'rgba(231, 233, 238, 0.96)' }}>
            News
          </div>
          <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 14 }}>
            Добавляй новости как на странице News
          </div>
        </div>
        <button type="button" className="admin-button active" onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Add news
        </button>
      </div>

      <div className="admin-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} className="admin-muted" />
            </div>
            <input
              className="admin-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по заголовку/дате/тексту"
            />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
            {filtered.length === 0 ? (
              <div className="admin-muted">Нет новостей</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '56px 1fr auto',
                      gap: 12,
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
                      <img src={n.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'rgba(231, 233, 238, 0.96)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {n.title}
                      </div>
                      <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
                        {n.date}
                        {n.link ? ` • ${n.link}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button type="button" className="admin-button" onClick={() => openEdit(n)}>
                        Edit
                      </button>
                      <button type="button" className="admin-button" onClick={() => remove(n.id)} style={{ color: '#fca5a5' }} disabled={saving}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editorOpen ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
            boxSizing: 'border-box',
          }}
          onMouseDown={closeEditor}
        >
          <div
            className="admin-card"
            style={{ width: 720, maxWidth: '100%', background: 'rgba(11, 16, 26, 0.86)' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div>
                <div className="admin-card-title">{editorMode === 'add' ? 'Add news' : 'Edit news'}</div>
                <div className="admin-card-subtitle">Поля можно оставить пустыми, кроме title/date/text</div>
              </div>
              <button type="button" className="admin-button" onClick={closeEditor} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Title</div>
                <input className="admin-input" value={String(formData.title || '')} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Date</div>
                <input className="admin-input" value={String(formData.date || '')} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} placeholder="June 20, 2022" />
              </div>
              <div>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Image URL</div>
                <input className="admin-input" value={String(formData.image || '')} onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))} placeholder="/new1.png" />
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadImage(file);
                    }}
                  />
                  <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
                    {uploading ? 'Uploading…' : 'Upload image'}
                  </div>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Link (optional)</div>
                <input className="admin-input" value={String(formData.link || '')} onChange={(e) => setFormData((p) => ({ ...p, link: e.target.value }))} placeholder="/news/..." />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Text</div>
                <textarea
                  className="admin-input"
                  value={String(formData.text || '')}
                  onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))}
                  style={{ height: 140, paddingTop: 12, paddingBottom: 12, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button type="button" className="admin-button" onClick={closeEditor}>
                Cancel
              </button>
              <button type="button" className="admin-button active" onClick={save} disabled={saving}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
