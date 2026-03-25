import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../data/products';
import { ProductContent, ProductKitItem, ProductSpec, useProductContent } from '../../context/ProductContentContext';

function stripMoney(value: string) {
  const n = Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function toMoneyString(value: number) {
  if (!Number.isFinite(value)) return '$0.00';
  return `$${value.toFixed(2)}`;
}

function toNumberId(value: string | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeSpecs(specs: ProductSpec[] | undefined) {
  return (specs || []).filter((s) => String(s.label || '').trim() || String(s.value || '').trim());
}

function normalizeKit(items: ProductKitItem[] | undefined) {
  return (items || []).filter((i) => String(i.title || '').trim() || String(i.quantity || '').trim());
}

function normalizeImages(images: string[] | undefined) {
  return (images || []).map((x) => String(x || '').trim()).filter(Boolean);
}

export default function AdminProductEditor() {
  const { id } = useParams<{ id: string }>();
  const productId = toNumberId(id);
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  const { getContent, upsertContent, deleteContent } = useProductContent();

  const product = useMemo(() => (productId ? products.find((p) => p.id === productId) : undefined), [productId, products]);
  const savedContent = useMemo(() => (productId ? getContent(productId) : undefined), [getContent, productId]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priceNumber, setPriceNumber] = useState(0);
  const [isPreorder, setIsPreorder] = useState(false);
  const [image, setImage] = useState('');

  const [code, setCode] = useState('');
  const [overview, setOverview] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [kitItems, setKitItems] = useState<ProductKitItem[]>([]);

  useEffect(() => {
    if (!product) return;
    setTitle(product.title || '');
    setCategory(product.category || '');
    setIsPreorder(Boolean(product.isPreorder));
    setImage(product.image || '');
    setPriceNumber(product.isPreorder ? 0 : stripMoney(product.price));

    const c = savedContent || {};
    setCode(String(c.code || ''));
    setOverview(String(c.overview || ''));
    setImages(Array.isArray(c.images) ? c.images : []);
    setSpecs(Array.isArray(c.specs) ? c.specs : []);
    setKitItems(Array.isArray(c.kitItems) ? c.kitItems : []);
  }, [product, savedContent]);

  if (!productId || !product) {
    return (
      <div className="admin-card">
        <div className="admin-card-title">Товар не найден</div>
        <div style={{ marginTop: 12 }}>
          <button type="button" className="admin-button" onClick={() => navigate('/admin/catalog')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const onSave = () => {
    const base: Partial<Product> = {
      title,
      category,
      isPreorder,
      image: image.trim() || undefined,
      price: isPreorder ? 'Preorder' : toMoneyString(priceNumber),
    };
    updateProduct(productId, base);

    const content: ProductContent = {
      code: code.trim() || undefined,
      overview: overview.trim() || undefined,
      images: normalizeImages(images),
      specs: normalizeSpecs(specs),
      kitItems: normalizeKit(kitItems),
    };

    const hasAny =
      Boolean(content.code) ||
      Boolean(content.overview) ||
      (content.images && content.images.length > 0) ||
      (content.specs && content.specs.length > 0) ||
      (content.kitItems && content.kitItems.length > 0);

    if (hasAny) upsertContent(productId, content);
    else deleteContent(productId);

    navigate('/admin/catalog');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 28, color: 'rgba(231, 233, 238, 0.96)' }}>
            Product editor
          </div>
          <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 14 }}>
            ID {productId}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="admin-button" onClick={() => navigate('/admin/catalog')}>
            Cancel
          </button>
          <button type="button" className="admin-button active" onClick={onSave}>
            Save
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="admin-card">
            <div className="admin-card-title" style={{ marginBottom: 12 }}>Основное</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Title</div>
                <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Category</div>
                <input className="admin-input" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Price</div>
                <input
                  className="admin-input"
                  type="number"
                  step="0.01"
                  value={priceNumber}
                  onChange={(e) => setPriceNumber(Number(e.target.value))}
                  disabled={isPreorder}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12 }}>Preorder</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-family)' }}>
                  <input type="checkbox" checked={isPreorder} onChange={(e) => setIsPreorder(e.target.checked)} />
                  <span className="admin-muted">Preorder вместо цены</span>
                </label>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Main image URL</div>
                <input className="admin-input" value={image} onChange={(e) => setImage(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-title" style={{ marginBottom: 12 }}>Как на странице товара</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Product code</div>
                <input className="admin-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. 12f-he" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 12, marginBottom: 6 }}>Overview</div>
                <textarea
                  className="admin-input"
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  style={{ height: 120, paddingTop: 12, paddingBottom: 12, resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-title" style={{ marginBottom: 12 }}>Specifications</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {specs.map((s, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'center' }}>
                  <input className="admin-input" value={s.label} onChange={(e) => setSpecs((prev) => prev.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)))} placeholder="Label" />
                  <input className="admin-input" value={s.value} onChange={(e) => setSpecs((prev) => prev.map((x, i) => (i === idx ? { ...x, value: e.target.value } : x)))} placeholder="Value" />
                  <button type="button" className="admin-button" onClick={() => setSpecs((prev) => prev.filter((_, i) => i !== idx))}>
                    Delete
                  </button>
                </div>
              ))}
              <div>
                <button type="button" className="admin-button" onClick={() => setSpecs((prev) => [...prev, { label: '', value: '' }])}>
                  Add spec
                </button>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-title" style={{ marginBottom: 12 }}>Kit</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {kitItems.map((k, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 160px auto', gap: 10, alignItems: 'center' }}>
                  <input className="admin-input" value={k.title} onChange={(e) => setKitItems((prev) => prev.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))} placeholder="Item title" />
                  <input className="admin-input" value={k.quantity} onChange={(e) => setKitItems((prev) => prev.map((x, i) => (i === idx ? { ...x, quantity: e.target.value } : x)))} placeholder="Qty" />
                  <button type="button" className="admin-button" onClick={() => setKitItems((prev) => prev.filter((_, i) => i !== idx))}>
                    Delete
                  </button>
                </div>
              ))}
              <div>
                <button type="button" className="admin-button" onClick={() => setKitItems((prev) => [...prev, { title: '', quantity: '' }])}>
                  Add kit item
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="admin-card">
            <div className="admin-card-title" style={{ marginBottom: 12 }}>Images</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {images.map((url, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center' }}>
                  <input className="admin-input" value={url} onChange={(e) => setImages((prev) => prev.map((x, i) => (i === idx ? e.target.value : x)))} placeholder="https://..." />
                  <button type="button" className="admin-button" onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}>
                    Delete
                  </button>
                </div>
              ))}
              <button type="button" className="admin-button" onClick={() => setImages((prev) => [...prev, ''])}>
                Add image
              </button>
            </div>
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {normalizeImages(images).slice(0, 6).map((url) => (
                <div key={url} style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
                  <img src={url} alt="" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

