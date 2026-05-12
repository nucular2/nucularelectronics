import React, { useEffect, useMemo, useState } from 'react';
import { getSupabaseAccessTokenOrThrow } from '../../lib/supabase';
import { defaultShopCmsConfig, type ShopCmsConfig } from '../../cms/shopConfig';

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
  return await getSupabaseAccessTokenOrThrow();
}

export default function ShopManager() {
  const [config, setConfig] = useState<ShopCmsConfig>(defaultShopCmsConfig);
  const [raw, setRaw] = useState<string>(JSON.stringify(defaultShopCmsConfig, null, 2));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const previewConfig = useMemo(() => {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed as ShopCmsConfig;
      return config;
    } catch {
      return config;
    }
  }, [raw, config]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/content/shop');
      const payload = await r.json().catch(() => null);
      const next = payload?.config && typeof payload.config === 'object' ? (payload.config as ShopCmsConfig) : defaultShopCmsConfig;
      setConfig(next);
      setRaw(JSON.stringify(next, null, 2));
    } catch {
      setConfig(defaultShopCmsConfig);
      setRaw(JSON.stringify(defaultShopCmsConfig, null, 2));
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
      const next = JSON.parse(raw) as ShopCmsConfig;
      const token = await getAdminToken();
      const r = await fetch('/api/admin/shop', {
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

  const bannersDesktop = Array.isArray(previewConfig?.banners?.desktop) ? previewConfig.banners.desktop : [];
  const bannersMobile = Array.isArray(previewConfig?.banners?.mobile) ? previewConfig.banners.mobile : [];

  const renderBannerEditor = (kind: 'desktop' | 'mobile', list: any[]) => {
    return (
      <div style={{ display: 'grid', gap: 10 }}>
        {list.map((b, idx) => (
          <div key={String(b?.id || idx)} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
            <input
              className="admin-input"
              value={String(b?.imageUrl || '')}
              onChange={(e) =>
                updateJson((d) => {
                  d.banners = d.banners || {};
                  d.banners[kind] = Array.isArray(d.banners[kind]) ? d.banners[kind] : [];
                  if (!d.banners[kind][idx]) d.banners[kind][idx] = {};
                  d.banners[kind][idx].id = d.banners[kind][idx].id || b?.id || String(idx);
                  d.banners[kind][idx].alt = d.banners[kind][idx].alt || b?.alt || `Shop banner ${idx + 1}`;
                  d.banners[kind][idx].imageUrl = e.target.value;
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
                const key = `${kind}-${idx}`;
                setUploadingKey(key);
                void (async () => {
                  try {
                    const url = await upload(file, `shop-banners/${kind}`);
                    updateJson((d) => {
                      d.banners = d.banners || {};
                      d.banners[kind] = Array.isArray(d.banners[kind]) ? d.banners[kind] : [];
                      if (!d.banners[kind][idx]) d.banners[kind][idx] = {};
                      d.banners[kind][idx].id = d.banners[kind][idx].id || b?.id || String(idx);
                      d.banners[kind][idx].alt = d.banners[kind][idx].alt || b?.alt || `Shop banner ${idx + 1}`;
                      d.banners[kind][idx].imageUrl = url;
                    });
                  } catch (err: any) {
                    alert(err?.message || String(err));
                  } finally {
                    setUploadingKey(null);
                    e.currentTarget.value = '';
                  }
                })();
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '520px 1fr', gap: 16, alignItems: 'start' }}>
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div className="admin-card-title">Shop banners</div>
            <div className="admin-card-subtitle">Отдельно для desktop и mobile</div>
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

        <div style={{ marginTop: 12, display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
              Desktop (3 banners)
            </div>
            {renderBannerEditor('desktop', bannersDesktop)}
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
              Mobile (3 banners)
            </div>
            {renderBannerEditor('mobile', bannersMobile)}
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>
              Raw JSON
            </div>
            <textarea
              className="admin-input"
              style={{ height: 260, paddingTop: 10, paddingBottom: 10, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', fontSize: 12 }}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Preview</div>
        <div className="admin-card-subtitle" style={{ marginTop: 6 }}>
          Открой /shop в новой вкладке для полного превью
        </div>
        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="admin-muted" style={{ fontSize: 12 }}>
              Desktop
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {bannersDesktop.map((b: any) => (
                <img key={b.id} src={b.imageUrl} alt={b.alt} style={{ width: 220, height: 80, borderRadius: 10, objectFit: 'cover', background: '#111' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <div className="admin-muted" style={{ fontSize: 12 }}>
              Mobile
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {bannersMobile.map((b: any) => (
                <img key={b.id} src={b.imageUrl} alt={b.alt} style={{ width: 120, height: 90, borderRadius: 10, objectFit: 'cover', background: '#111' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
