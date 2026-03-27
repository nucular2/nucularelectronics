import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Search, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { NewsBlock, NewsItem } from '../../context/NewsContext';
import NewsBlocks from '../../components/news/NewsBlocks';

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

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

function normalizeBlocks(blocks: any): NewsBlock[] {
  const list = Array.isArray(blocks) ? blocks : [];
  const out: NewsBlock[] = [];
  for (const b of list) {
    const type = String(b?.type || '').trim();
    const id = String(b?.id || '').trim() || createId(type || 'b');
    if (type === 'heading') {
      const text = String(b?.text || '').trim();
      if (!text) continue;
      const levelRaw = Number(b?.level);
      const level = levelRaw === 3 || levelRaw === 4 ? (levelRaw as 3 | 4) : (2 as const);
      out.push({ id, type: 'heading', text, level });
      continue;
    }
    if (type === 'paragraph') {
      const text = String(b?.text || '').trim();
      if (!text) continue;
      out.push({ id, type: 'paragraph', text, bold: Boolean(b?.bold) || undefined });
      continue;
    }
    if (type === 'image') {
      const url = String(b?.url || '').trim();
      if (!url) continue;
      const alt = String(b?.alt || '').trim() || undefined;
      const caption = String(b?.caption || '').trim() || undefined;
      out.push({ id, type: 'image', url, alt, caption });
      continue;
    }
    if (type === 'list') {
      const items = Array.isArray(b?.items) ? b.items : [];
      const cleaned = items.map((x: any) => String(x || '').trim()).filter(Boolean);
      if (cleaned.length === 0) continue;
      out.push({ id, type: 'list', items: cleaned, ordered: Boolean(b?.ordered) || undefined });
      continue;
    }
    if (type === 'link') {
      const href = String(b?.href || '').trim();
      const text = String(b?.text || '').trim();
      if (!href || !text) continue;
      out.push({ id, type: 'link', href, text });
      continue;
    }
    if (type === 'video') {
      const url = String(b?.url || '').trim();
      if (!url) continue;
      const title = String(b?.title || '').trim() || undefined;
      out.push({ id, type: 'video', url, title });
      continue;
    }
    if (type === 'quote') {
      const text = String(b?.text || '').trim();
      if (!text) continue;
      const author = String(b?.author || '').trim() || undefined;
      out.push({ id, type: 'quote', text, author });
      continue;
    }
    if (type === 'slider') {
      const rawImages = Array.isArray(b?.images) ? b.images : [];
      const images = rawImages
        .map((img: any) => ({ url: String(img?.url || img || '').trim(), alt: String(img?.alt || '').trim() || undefined }))
        .filter((img: any) => Boolean(img.url));
      if (images.length === 0) continue;
      const caption = String(b?.caption || '').trim() || undefined;
      out.push({ id, type: 'slider', images, caption });
      continue;
    }
    if (type === 'divider') {
      out.push({ id, type: 'divider' });
      continue;
    }
  }
  return out;
}

function blocksToExcerpt(blocks: NewsBlock[]) {
  const firstPara = blocks.find((b) => b.type === 'paragraph') as NewsBlock | undefined;
  const firstText = firstPara && firstPara.type === 'paragraph' ? firstPara.text : '';
  const t = String(firstText || '').trim();
  if (!t) return '';
  return t.length > 140 ? `${t.slice(0, 140)}...` : t;
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
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

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
        normalizeQuery(n.text).includes(q) ||
        normalizeQuery(JSON.stringify(n.blocks || '')).includes(q)
      );
    });
  }, [news, query]);

  const openAdd = () => {
    setEditorMode('add');
    setEditingId(null);
    setFormData({
      title: '',
      date: '',
      image: '',
      text: '',
      link: '',
      blocks: [{ id: createId('p'), type: 'paragraph', text: '' }],
    });
    setEditorOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditorMode('edit');
    setEditingId(item.id);
    const blocks = normalizeBlocks(item.blocks?.length ? item.blocks : [{ id: createId('p'), type: 'paragraph', text: item.text }]);
    setFormData({ ...item, blocks, text: item.text || blocksToExcerpt(blocks) });
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
    const manualText = String(formData.text || '').trim();
    const link = String(formData.link || '').trim();
    const blocks = normalizeBlocks(formData.blocks);
    const excerpt = manualText || blocksToExcerpt(blocks);

    if (!title || !date || !excerpt) return;

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
            text: excerpt,
            link: link || `/news/${nextId}`,
            blocks,
          });
        } else if (editingId != null) {
          const idx = next.findIndex((n) => n.id === editingId);
          if (idx !== -1) {
            next[idx] = {
              ...next[idx],
              title,
              date,
              image: image || '/new1.png',
              text: excerpt,
              link: link || next[idx].link || `/news/${editingId}`,
              blocks,
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

  const uploadBlockImage = async (blockId: string, file: File) => {
    setUploadingBlockId(blockId);
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
      setFormData((p) => {
        const nextBlocks = Array.isArray(p.blocks) ? [...p.blocks] : [];
        const idx = nextBlocks.findIndex((b: any) => String(b?.id) === blockId);
        if (idx !== -1) nextBlocks[idx] = { ...nextBlocks[idx], type: 'image', url };
        return { ...p, blocks: nextBlocks };
      });
    } catch (e: any) {
      alert(e?.message || String(e));
    } finally {
      setUploadingBlockId(null);
    }
  };

  const uploadSliderImage = async (blockId: string, file: File) => {
    setUploadingBlockId(blockId);
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
      setFormData((p) => {
        const nextBlocks = Array.isArray(p.blocks) ? [...p.blocks] : [];
        const idx = nextBlocks.findIndex((b: any) => String(b?.id) === blockId);
        if (idx === -1) return p;
        const prev: any = nextBlocks[idx] as any;
        const images = Array.isArray(prev?.images) ? [...prev.images] : [];
        images.push({ url });
        nextBlocks[idx] = { ...prev, type: 'slider', images };
        return { ...p, blocks: nextBlocks };
      });
    } catch (e: any) {
      alert(e?.message || String(e));
    } finally {
      setUploadingBlockId(null);
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
            className="admin-card admin-modal-card"
            style={{ width: 720, maxWidth: '100%' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div>
                <div className="admin-card-title">{editorMode === 'add' ? 'Add news' : 'Edit news'}</div>
                <div className="admin-card-subtitle">Мини-конструктор: заголовки, текст, картинки</div>
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
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Image</div>
                <input className="admin-input" value={String(formData.image || '')} onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))} placeholder="" />
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
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Card text (optional)</div>
                <textarea
                  className="admin-input"
                  value={String(formData.text || '')}
                  onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))}
                  style={{ height: 140, paddingTop: 12, paddingBottom: 12, resize: 'vertical' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 10 }}>Content blocks</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('h2'), type: 'heading', level: 2, text: '' }],
                      }))
                    }
                  >
                    + H2
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('h3'), type: 'heading', level: 3, text: '' }],
                      }))
                    }
                  >
                    + H3
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('h4'), type: 'heading', level: 4, text: '' }],
                      }))
                    }
                  >
                    + H4
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('p'), type: 'paragraph', text: '' }],
                      }))
                    }
                  >
                    + Text
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('pb'), type: 'paragraph', bold: true, text: '' }],
                      }))
                    }
                  >
                    + Bold text
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('ul'), type: 'list', ordered: false, items: [''] }],
                      }))
                    }
                  >
                    + List
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('ol'), type: 'list', ordered: true, items: [''] }],
                      }))
                    }
                  >
                    + Numbered
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('a'), type: 'link', href: '', text: '' }],
                      }))
                    }
                  >
                    + Link
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('img'), type: 'image', url: '', alt: '', caption: '' }],
                      }))
                    }
                  >
                    + Image
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('vid'), type: 'video', url: '', title: '' }],
                      }))
                    }
                  >
                    + Video
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('q'), type: 'quote', text: '', author: '' }],
                      }))
                    }
                  >
                    + Quote
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('sl'), type: 'slider', images: [], caption: '' }],
                      }))
                    }
                  >
                    + Slider
                  </button>
                  <button
                    type="button"
                    className="admin-button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        blocks: [...(Array.isArray(p.blocks) ? p.blocks : []), { id: createId('hr'), type: 'divider' }],
                      }))
                    }
                  >
                    + Divider
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(Array.isArray(formData.blocks) ? formData.blocks : []).map((block: any, idx: number) => (
                    <div
                      key={String(block?.id || idx)}
                      style={{
                        borderRadius: 14,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                        <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
                          {String(block?.type || 'block')}
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button
                            type="button"
                            className="admin-button"
                            onClick={() =>
                              setFormData((p) => {
                                const nextBlocks = Array.isArray(p.blocks) ? [...p.blocks] : [];
                                if (idx <= 0) return p;
                                const t = nextBlocks[idx - 1];
                                nextBlocks[idx - 1] = nextBlocks[idx];
                                nextBlocks[idx] = t;
                                return { ...p, blocks: nextBlocks };
                              })
                            }
                            style={{ width: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={idx === 0}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            className="admin-button"
                            onClick={() =>
                              setFormData((p) => {
                                const nextBlocks = Array.isArray(p.blocks) ? [...p.blocks] : [];
                                if (idx >= nextBlocks.length - 1) return p;
                                const t = nextBlocks[idx + 1];
                                nextBlocks[idx + 1] = nextBlocks[idx];
                                nextBlocks[idx] = t;
                                return { ...p, blocks: nextBlocks };
                              })
                            }
                            style={{ width: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={idx === (Array.isArray(formData.blocks) ? formData.blocks.length : 0) - 1}
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            className="admin-button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).filter((b: any) => String(b?.id) !== String(block?.id)),
                              }))
                            }
                            style={{ width: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {block?.type === 'heading' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10 }}>
                          <select
                            className="admin-input"
                            value={String(block?.level || 2)}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id)
                                    ? { ...b, level: Number(e.target.value) }
                                    : b
                                ),
                              }))
                            }
                          >
                            <option value="2">H2</option>
                            <option value="3">H3</option>
                            <option value="4">H4</option>
                          </select>
                          <input
                            className="admin-input"
                            value={String(block?.text || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, text: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="Heading text"
                          />
                        </div>
                      ) : null}

                      {block?.type === 'paragraph' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-family)', fontSize: 12 }}>
                            <input
                              type="checkbox"
                              checked={Boolean(block?.bold)}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                    String(b?.id) === String(block?.id) ? { ...b, bold: e.target.checked } : b
                                  ),
                                }))
                              }
                            />
                            Bold
                          </label>
                          <textarea
                            className="admin-input"
                            value={String(block?.text || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, text: e.target.value } : b
                                ),
                              }))
                            }
                            style={{ height: 120, paddingTop: 12, paddingBottom: 12, resize: 'vertical' }}
                            placeholder="Text"
                          />
                        </div>
                      ) : null}

                      {block?.type === 'list' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-family)', fontSize: 12 }}>
                            <input
                              type="checkbox"
                              checked={Boolean(block?.ordered)}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                    String(b?.id) === String(block?.id) ? { ...b, ordered: e.target.checked } : b
                                  ),
                                }))
                              }
                            />
                            Numbered
                          </label>
                          <textarea
                            className="admin-input"
                            value={Array.isArray(block?.items) ? block.items.join('\n') : ''}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id)
                                    ? { ...b, items: e.target.value.split('\n').map((x) => x.trim()).filter((x) => x.length > 0) }
                                    : b
                                ),
                              }))
                            }
                            style={{ height: 120, paddingTop: 12, paddingBottom: 12, resize: 'vertical' }}
                            placeholder="One item per line"
                          />
                        </div>
                      ) : null}

                      {block?.type === 'link' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <input
                            className="admin-input"
                            value={String(block?.text || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, text: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="Link text"
                          />
                          <input
                            className="admin-input"
                            value={String(block?.href || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, href: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="https://..."
                          />
                        </div>
                      ) : null}

                      {block?.type === 'image' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingBlockId === String(block?.id)}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void uploadBlockImage(String(block?.id), file);
                              }}
                            />
                            <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
                              {uploadingBlockId === String(block?.id) ? 'Uploading…' : 'Upload image'}
                            </div>
                          </div>
                          <input
                            className="admin-input"
                            value={String(block?.url || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, url: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="Image URL"
                          />
                          <input
                            className="admin-input"
                            value={String(block?.caption || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, caption: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="Caption (optional)"
                          />
                        </div>
                      ) : null}

                      {block?.type === 'video' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <input
                            className="admin-input"
                            value={String(block?.url || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, url: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="Video URL (YouTube/Vimeo/embed)"
                          />
                          <input
                            className="admin-input"
                            value={String(block?.title || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, title: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="Title (optional)"
                          />
                        </div>
                      ) : null}

                      {block?.type === 'quote' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                          <textarea
                            className="admin-input"
                            value={String(block?.text || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, text: e.target.value } : b
                                ),
                              }))
                            }
                            style={{ height: 120, paddingTop: 12, paddingBottom: 12, resize: 'vertical' }}
                            placeholder="Quote"
                          />
                          <input
                            className="admin-input"
                            value={String(block?.author || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, author: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="Author (optional)"
                          />
                        </div>
                      ) : null}

                      {block?.type === 'slider' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingBlockId === String(block?.id)}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void uploadSliderImage(String(block?.id), file);
                              }}
                            />
                            <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
                              {uploadingBlockId === String(block?.id) ? 'Uploading…' : 'Add image'}
                            </div>
                          </div>
                          <div style={{ display: 'grid', gap: 8 }}>
                            {(Array.isArray(block?.images) ? block.images : []).map((img: any, imgIdx: number) => (
                              <div key={`${String(block?.id)}-${imgIdx}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                                <input
                                  className="admin-input"
                                  value={String(img?.url || '')}
                                  onChange={(e) =>
                                    setFormData((p) => ({
                                      ...p,
                                      blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) => {
                                        if (String(b?.id) !== String(block?.id)) return b;
                                        const images = Array.isArray(b?.images) ? [...b.images] : [];
                                        images[imgIdx] = { ...(images[imgIdx] || {}), url: e.target.value };
                                        return { ...b, images };
                                      }),
                                    }))
                                  }
                                  placeholder="Image URL"
                                />
                                <button
                                  type="button"
                                  className="admin-button"
                                  onClick={() =>
                                    setFormData((p) => ({
                                      ...p,
                                      blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) => {
                                        if (String(b?.id) !== String(block?.id)) return b;
                                        const images = Array.isArray(b?.images) ? [...b.images] : [];
                                        images.splice(imgIdx, 1);
                                        return { ...b, images };
                                      }),
                                    }))
                                  }
                                  style={{ width: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5' }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            className="admin-button"
                            onClick={() =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) => {
                                  if (String(b?.id) !== String(block?.id)) return b;
                                  const images = Array.isArray(b?.images) ? [...b.images] : [];
                                  images.push({ url: '' });
                                  return { ...b, images };
                                }),
                              }))
                            }
                          >
                            + URL
                          </button>
                          <input
                            className="admin-input"
                            value={String(block?.caption || '')}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                blocks: (Array.isArray(p.blocks) ? p.blocks : []).map((b: any) =>
                                  String(b?.id) === String(block?.id) ? { ...b, caption: e.target.value } : b
                                ),
                              }))
                            }
                            placeholder="Caption (optional)"
                          />
                        </div>
                      ) : null}

                      {block?.type === 'divider' ? (
                        <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
                          Divider
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 10 }}>Preview</div>
                <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxSizing: 'border-box' }}>
                  <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 22, color: '#111', marginBottom: 6 }}>
                    {String(formData.title || '').trim() || 'Untitled'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#999', marginBottom: 12 }}>
                    {String(formData.date || '').trim()}
                  </div>
                  {String(formData.image || '').trim() ? (
                    <div style={{ width: '100%', height: 220, borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                      <img
                        src={String(formData.image || '')}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  ) : null}
                  <NewsBlocks blocks={normalizeBlocks(formData.blocks)} />
                </div>
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
