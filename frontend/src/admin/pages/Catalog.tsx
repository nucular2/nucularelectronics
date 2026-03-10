import React, { useState, useMemo } from 'react';
import { products, Product } from '../../data/products';
import { Folder, FolderOpen, Edit, Plus, Trash2, ChevronRight, ChevronDown, Package } from 'lucide-react';

interface CategoryNode {
  id: string;
  name: string;
  count: number;
  products: Product[];
  children?: CategoryNode[];
}

const Catalog: React.FC = () => {
  const [expanded, setExpanded] = useState<string[]>(['root']);

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
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
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

              <div style={{ display: 'flex', gap: '8px' }}>
                <button title="Редактировать" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3498db' }}><Edit size={16} /></button>
                <button title="Добавить" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2ecc71' }}><Plus size={16} /></button>
                <button title="Удалить" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }}><Trash2 size={16} /></button>
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
                        <span style={{ color: '#555' }}>{product.title}</span>
                        <span style={{ color: '#999', fontSize: '12px', marginLeft: 'auto' }}>{product.price}</span>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3498db', padding: 0, marginLeft: '8px' }}>
                          <Edit size={14} />
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
        <button style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <Plus size={18} /> Добавить товар
        </button>
      </div>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid #eee', marginBottom: '16px', color: '#666' }}>
          Структура каталога (из src/data/products.ts)
        </div>
        {renderTree(categoryTree)}
      </div>
    </div>
  );
};

export default Catalog;
