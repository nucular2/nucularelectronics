import React, { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../data/products';
import { Folder, FolderOpen, Edit, Plus, Trash2, ChevronRight, ChevronDown, Package, X, Check, Upload } from 'lucide-react';

interface CategoryNode {
  id: string;
  name: string;
  count: number;
  products: Product[];
  children?: CategoryNode[];
}

const Catalog: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [expanded, setExpanded] = useState<string[]>(['root']);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  // Transform flat product list into category tree
  const categoryTree = useMemo(() => {
    const categories: { [key: string]: Product[] } = {};
    
    // Group products by category
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    // Create tree structure
    const rootChildren: CategoryNode[] = Object.keys(categories).map(catName => ({
      id: catName,
      name: catName,
      count: categories[catName].length,
      products: categories[catName]
    }));

    return [{
      id: 'root',
      name: 'Shop',
      count: products.length,
      products: [],
      children: rootChildren
    }];
  }, [products]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      category: 'Components',
      title: '',
      price: '',
      image: '',
      isPreorder: false
    });
    setIsAdding(true);
  };

  const handleSave = () => {
    if (isAdding) {
      if (formData.title && formData.price && formData.category) {
        addProduct(formData as Omit<Product, 'id'>);
        setIsAdding(false);
        setFormData({});
      }
    } else if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      setEditingProduct(null);
      setFormData({});
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const renderForm = () => {
    if (!isAdding && !editingProduct) return null;

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '500px', maxWidth: '90%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>{isAdding ? 'Добавить товар' : 'Редактировать товар'}</h2>
            <button onClick={() => { setIsAdding(false); setEditingProduct(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Название</label>
              <input 
                type="text" 
                value={formData.title || ''} 
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Категория</label>
              <select 
                value={formData.category || 'Components'} 
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Components">Components</option>
                <option value="Accessories">Accessories</option>
                <option value="Spare parts">Spare parts</option>
                <option value="Complete solutions">Complete solutions</option>
                <option value="Apparel">Apparel</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Цена</label>
              <input 
                type="text" 
                value={formData.price || ''} 
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="$0.00 or Preorder"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Изображение (URL)</label>
              <input 
                type="text" 
                value={formData.image || ''} 
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                placeholder="/path/to/image.png"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="isPreorder"
                checked={formData.isPreorder || false} 
                onChange={e => setFormData({ ...formData, isPreorder: e.target.checked })}
              />
              <label htmlFor="isPreorder">Предзаказ</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                style={{ padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Отмена
              </button>
              <button 
                onClick={handleSave}
                style={{ padding: '10px 20px', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Check size={18} /> Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTree = (nodes: CategoryNode[]) => {
    return (
      <ul style={{ listStyle: 'none', paddingLeft: '20px' }}>
        {nodes.map(node => (
          <li key={node.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '4px', cursor: 'pointer', background: '#f8f9fa' }}>
              <div onClick={() => toggleExpand(node.id)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', minWidth: '20px' }}>
                {(node.children && node.children.length > 0) || (node.products && node.products.length > 0) ? (
                  expanded.includes(node.id) ? <ChevronDown size={16} color="#666" /> : <ChevronRight size={16} color="#666" />
                ) : <span style={{ width: '16px' }}></span>}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                {expanded.includes(node.id) ? <FolderOpen size={18} color="#f39c12" /> : <Folder size={18} color="#f39c12" />}
                <span style={{ fontWeight: 500, color: '#333' }}>{node.name}</span>
                <span style={{ fontSize: '12px', color: '#999', background: '#eee', padding: '2px 6px', borderRadius: '10px' }}>{node.count}</span>
              </div>
            </div>
            
            {expanded.includes(node.id) && (
              <div style={{ borderLeft: '1px solid #ddd', marginLeft: '12px' }}>
                {/* Render Subcategories */}
                {node.children && renderTree(node.children)}
                
                {/* Render Products */}
                {node.products && node.products.length > 0 && (
                  <ul style={{ listStyle: 'none', paddingLeft: '20px', marginTop: '4px' }}>
                    {node.products.map(product => (
                      <li key={product.id} style={{ padding: '6px 8px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                        <Package size={14} color="#7f8c8d" />
                        <div style={{ width: '30px', height: '30px', borderRadius: '4px', overflow: 'hidden', background: '#eee' }}>
                          {product.image && <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <span style={{ color: '#555', flex: 1 }}>{product.title}</span>
                        <span style={{ color: '#999', fontSize: '12px', marginRight: '10px' }}>{product.price}</span>
                        <button 
                          onClick={() => handleEdit(product)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3498db', padding: '4px' }}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Управление каталогом</h1>
        <button 
          onClick={handleAdd}
          style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}
        >
          <Plus size={18} /> Добавить товар
        </button>
      </div>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid #eee', marginBottom: '16px', color: '#666' }}>
          Структура каталога
        </div>
        {renderTree(categoryTree)}
      </div>

      {renderForm()}
    </div>
  );
};

export default Catalog;
