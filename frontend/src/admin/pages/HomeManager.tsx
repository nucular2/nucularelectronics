import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import HomeCmsSections from '../../components/home/HomeCmsSections';
import { defaultHomeCmsConfig, type HomeCmsConfig } from '../../cms/homeConfig';

function arrayBufferToBase64(buf: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function getAdminToken() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error('Not authenticated');
  return token;
}

export default function HomeManager() {
  const [config, setConfig] = useState<HomeCmsConfig>(defaultHomeCmsConfig);
  const [raw, setRaw] = useState<string>(JSON.stringify(defaultHomeCmsConfig, null, 2));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const previewConfig = useMemo(() => {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed as HomeCmsConfig;
      return config;
    } catch {
      return config;
    }
  }, [raw, config]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/content/home');
      const payload = await r.json().catch(() => null);
      const next = payload?.config && typeof payload.config === 'object' ? (payload.config as HomeCmsConfig) : defaultHomeCmsConfig;
      setConfig(next);
      setRaw(JSON.stringify(next, null, 2));
    } catch {
      setConfig(defaultHomeCmsConfig);
      setRaw(JSON.stringify(defaultHomeCmsConfig, null, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const next = JSON.parse(raw) as HomeCmsConfig;
      const token = await getAdminToken();
      const r = await fetch('/api/admin/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ config: next }),
      });
      const payload = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(payload?.message || `Save failed: ${r.status}`);
      setConfig(next);
      alert('Saved');
    } catch (e: any) {
      alert(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file: File, folder: string) => {
    const token = await getAdminToken();
    const buf = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(buf);
    const r = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', base64, folder }),
    });
    const payload = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(payload?.message || `Upload failed: ${r.status}`);
    const url = String(payload?.url || '');
    if (!url) throw new Error('Upload failed: missing url');
    return url;
  };

  const updateJson = (updater: (draft: any) => void) => {
    try {
      const draft = JSON.parse(raw);
      updater(draft);
      setRaw(JSON.stringify(draft, null, 2));
    } catch {
      setRaw(JSON.stringify(config, null, 2));
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '520px 1fr', gap: 16, alignItems: 'start' }}>
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div className="admin-card-title">Home editor</div>
            <div className="admin-card-subtitle">Редактирование блоков и картинок, общий для desktop/mobile</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="admin-button" onClick={() => void load()} disabled={loading || saving}>
              Reload
            </button>
            <button type="button" className="admin-button active" onClick={() => void save()} disabled={loading || saving}>
              Save
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
              Category cards images
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                <input
                  className="admin-input"
                  value={previewConfig.categoryCards?.leftImageUrl || ''}
                  onChange={(e) =>
                    updateJson((d) => {
                      d.categoryCards = d.categoryCards || {};
                      d.categoryCards.leftImageUrl = e.target.value;
                    })
                  }
                  placeholder="Left image URL"
                />
                <input
                  type="file"
                  accept="image/*"
                  disabled={!!uploadingKey}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const key = 'category-left';
                    setUploadingKey(key);
                    void (async () => {
                      try {
                        const url = await upload(file, 'home');
                        updateJson((d) => {
                          d.categoryCards = d.categoryCards || {};
                          d.categoryCards.leftImageUrl = url;
                        });
                      } finally {
                        setUploadingKey(null);
                      }
                    })();
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                <input
                  className="admin-input"
                  value={previewConfig.categoryCards?.rightImageUrl || ''}
                  onChange={(e) =>
                    updateJson((d) => {
                      d.categoryCards = d.categoryCards || {};
                      d.categoryCards.rightImageUrl = e.target.value;
                    })
                  }
                  placeholder="Right image URL"
                />
                <input
                  type="file"
                  accept="image/*"
                  disabled={!!uploadingKey}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const key = 'category-right';
                    setUploadingKey(key);
                    void (async () => {
                      try {
                        const url = await upload(file, 'home');
                        updateJson((d) => {
                          d.categoryCards = d.categoryCards || {};
                          d.categoryCards.rightImageUrl = url;
                        });
                      } finally {
                        setUploadingKey(null);
                      }
                    })();
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
              Kits images
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
              {(previewConfig.solutions?.cards || []).map((c, idx) => (
                <div key={c.id || idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                  <input
                    className="admin-input"
                    value={c.imageUrl || ''}
                    onChange={(e) =>
                      updateJson((d) => {
                        if (!d.solutions) d.solutions = {};
                        if (!Array.isArray(d.solutions.cards)) d.solutions.cards = [];
                        if (!d.solutions.cards[idx]) d.solutions.cards[idx] = {};
                        d.solutions.cards[idx].imageUrl = e.target.value;
                      })
                    }
                    placeholder="Image URL"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    disabled={!!uploadingKey}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const key = `kit-${idx}`;
                      setUploadingKey(key);
                      void (async () => {
                        try {
                          const url = await upload(file, 'kits');
                          updateJson((d) => {
                            if (!d.solutions) d.solutions = {};
                            if (!Array.isArray(d.solutions.cards)) d.solutions.cards = [];
                            if (!d.solutions.cards[idx]) d.solutions.cards[idx] = {};
                            d.solutions.cards[idx].imageUrl = url;
                          });
                        } finally {
                          setUploadingKey(null);
                        }
                      })();
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
              Raw JSON
            </div>
            <textarea
              className="admin-input"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              style={{ height: 320, paddingTop: 12, paddingBottom: 12, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
            />
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-card-title">Preview</div>
        <div className="admin-card-subtitle">Визуально как на главной</div>
        <div style={{ marginTop: 12, background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: 24 }}>
            <HomeCmsSections config={previewConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}

