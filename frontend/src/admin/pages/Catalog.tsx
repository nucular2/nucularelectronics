import React, { useMemo, useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../data/products';
import { Check, Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type EditorMode = 'add' | 'edit';

const DEFAULT_CATEGORIES = ['Components', 'Accessories', 'Spare parts', 'Complete solutions', 'Apparel'];

function normalizeQuery(value: string) {
  return value.trim().toLowerCase();
}

export default function Catalog() {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = normalizeQuery(query);
    return products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (!q) return true;
      return normalizeQuery(p.title).includes(q) || normalizeQuery(p.category).includes(q) || normalizeQuery(p.price).includes(q);
    });
  }, [products, query, category]);

  const openAdd = () => {
    setEditorMode('add');
    setEditingId(null);
    setFormData({
      category: DEFAULT_CATEGORIES[0],
      title: '',
      price: '',
      image: '',
      isPreorder: false,
    });
    setEditorOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditorMode('edit');
    setEditingId(product.id);
    setFormData(product);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const saveEditor = () => {
    const title = (formData.title || '').trim();
    const price = (formData.price || '').trim();
    const nextCategory = (formData.category || '').trim();

    if (!title || !price || !nextCategory) return;

    if (editorMode === 'add') {
      addProduct({
        category: nextCategory,
        title,
        price,
        image: (formData.image || '').trim(),
        isPreorder: Boolean(formData.isPreorder),
      });
      closeEditor();
      return;
    }

    if (editingId != null) {
      updateProduct(editingId, {
        category: nextCategory,
        title,
        price,
        image: (formData.image || '').trim(),
        isPreorder: Boolean(formData.isPreorder),
      });
      closeEditor();
    }
  };

  const removeProduct = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    deleteProduct(id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 28, color: '#111' }}>Catalog</div>
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 400, fontSize: 14, color: '#666' }}>
            Products list with edit and delete actions.
          </div>
        </div>
        <button
          type="button"
          onClick={openAdd}
          style={{
            height: 40,
            padding: '0 14px',
            borderRadius: 12,
            border: '1px solid #111',
            background: '#111',
            color: '#fff',
            fontFamily: 'var(--font-family)',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Plus size={16} /> Add product
        </button>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #eaeaea',
          borderRadius: 14,
          padding: 16,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 520 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              style={{
                width: '100%',
                height: 40,
                borderRadius: 12,
                border: '1px solid #eaeaea',
                padding: '0 12px 0 38px',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-family)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              height: 40,
              borderRadius: 12,
              border: '1px solid #eaeaea',
              padding: '0 12px',
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              color: '#111',
              background: '#fff',
              outline: 'none',
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 14, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#666', fontSize: 12 }}>
                <th style={{ padding: '12px 12px', borderBottom: '1px solid #eaeaea', fontWeight: 600 }}>Product</th>
                <th style={{ padding: '12px 12px', borderBottom: '1px solid #eaeaea', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '12px 12px', borderBottom: '1px solid #eaeaea', fontWeight: 600 }}>Price</th>
                <th style={{ padding: '12px 12px', borderBottom: '1px solid #eaeaea', fontWeight: 600 }}>Preorder</th>
                <th style={{ padding: '12px 12px', borderBottom: '1px solid #eaeaea', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 20, color: '#999', fontFamily: 'var(--font-family)' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: '#f1f5f9',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {p.image ? (
                            <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : null}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600, fontSize: 14, color: '#111' }}>
                            {p.title}
                          </div>
                          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 400, fontSize: 12, color: '#666' }}>
                            ID {p.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 12px', fontFamily: 'var(--font-family)', fontSize: 14, color: '#111' }}>{p.category}</td>
                    <td style={{ padding: '12px 12px', fontFamily: 'var(--font-family)', fontSize: 14, color: '#111' }}>{p.price}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          height: 24,
                          padding: '0 10px',
                          borderRadius: 999,
                          background: p.isPreorder ? '#fff7ed' : '#f1f5f9',
                          border: '1px solid #eaeaea',
                          color: p.isPreorder ? '#c2410c' : '#666',
                          fontFamily: 'var(--font-family)',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {p.isPreorder ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/catalog/${p.id}`)}
                          style={{
                            height: 34,
                            padding: '0 10px',
                            borderRadius: 10,
                            border: '1px solid #eaeaea',
                            background: '#fff',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family)',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#111',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <Eye size={14} /> Details
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          style={{
                            height: 34,
                            padding: '0 10px',
                            borderRadius: 10,
                            border: '1px solid #eaeaea',
                            background: '#fff',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family)',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#111',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProduct(p.id)}
                          style={{
                            height: 34,
                            padding: '0 10px',
                            borderRadius: 10,
                            border: '1px solid #eaeaea',
                            background: '#fff',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-family)',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#b91c1c',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editorOpen ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: 560, maxWidth: '100%', background: '#fff', borderRadius: 14, border: '1px solid #eaeaea' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderBottom: '1px solid #eaeaea',
              }}
            >
              <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 18, color: '#111' }}>
                {editorMode === 'add' ? 'Add product' : 'Edit product'}
              </div>
              <button
                type="button"
                onClick={closeEditor}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: '1px solid #eaeaea',
                  background: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#666', fontWeight: 600 }}>Title</div>
                  <input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      height: 40,
                      borderRadius: 12,
                      border: '1px solid #eaeaea',
                      padding: '0 12px',
                      fontFamily: 'var(--font-family)',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#666', fontWeight: 600 }}>Category</div>
                  <select
                    value={formData.category || DEFAULT_CATEGORIES[0]}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      height: 40,
                      borderRadius: 12,
                      border: '1px solid #eaeaea',
                      padding: '0 12px',
                      fontFamily: 'var(--font-family)',
                      fontSize: 14,
                      outline: 'none',
                      background: '#fff',
                    }}
                  >
                    {DEFAULT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#666', fontWeight: 600 }}>Price</div>
                  <input
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="$0.00"
                    style={{
                      height: 40,
                      borderRadius: 12,
                      border: '1px solid #eaeaea',
                      padding: '0 12px',
                      fontFamily: 'var(--font-family)',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#666', fontWeight: 600 }}>Image URL</div>
                  <input
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/path/to/image.png"
                    style={{
                      height: 40,
                      borderRadius: 12,
                      border: '1px solid #eaeaea',
                      padding: '0 12px',
                      fontFamily: 'var(--font-family)',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-family)', fontSize: 14, color: '#111' }}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.isPreorder)}
                  onChange={(e) => setFormData({ ...formData, isPreorder: e.target.checked })}
                />
                Preorder
              </label>
            </div>

            <div style={{ padding: 16, display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #eaeaea' }}>
              <button
                type="button"
                onClick={closeEditor}
                style={{
                  height: 40,
                  padding: '0 14px',
                  borderRadius: 12,
                  border: '1px solid #eaeaea',
                  background: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#111',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEditor}
                style={{
                  height: 40,
                  padding: '0 14px',
                  borderRadius: 12,
                  border: '1px solid #111',
                  background: '#111',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family)',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Check size={16} /> Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
