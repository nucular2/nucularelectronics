import React, { useState } from 'react';
import { useReviews, Review } from '../../context/ReviewsContext';
import { Edit, Plus, Trash2, X, Check, MessageSquare } from 'lucide-react';

const ReviewsManager: React.FC = () => {
  const { reviews, addReview, updateReview, deleteReview } = useReviews();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Review>>({});

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData(review);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingReview(null);
    setFormData({
      category: 'Controllers',
      product: '',
      text: '',
      author: '',
      flag: '/flag.png',
      image: '',
      link: ''
    });
    setIsAdding(true);
  };

  const handleSave = () => {
    if (isAdding) {
      if (formData.product && formData.text && formData.author) {
        addReview(formData as Omit<Review, 'id'>);
        setIsAdding(false);
        setFormData({});
      }
    } else if (editingReview) {
      updateReview(editingReview.id, formData);
      setEditingReview(null);
      setFormData({});
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(id);
    }
  };

  const renderForm = () => {
    if (!isAdding && !editingReview) return null;

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>{isAdding ? 'Добавить отзыв' : 'Редактировать отзыв'}</h2>
            <button onClick={() => { setIsAdding(false); setEditingReview(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Название товара</label>
              <input 
                type="text" 
                value={formData.product || ''} 
                onChange={e => setFormData({ ...formData, product: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Категория</label>
              <select 
                value={formData.category || 'Controllers'} 
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Controllers">Controllers</option>
                <option value="uLight controller">uLight controller</option>
                <option value="On-board computer">On-board computer</option>
                <option value="BMS">BMS</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Текст отзыва</label>
              <textarea 
                value={formData.text || ''} 
                onChange={e => setFormData({ ...formData, text: e.target.value })}
                rows={4}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Автор (Страна, Имя)</label>
              <input 
                type="text" 
                value={formData.author || ''} 
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                placeholder="Germany, Max Stoun"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Флаг (URL)</label>
                <input 
                  type="text" 
                  value={formData.flag || ''} 
                  onChange={e => setFormData({ ...formData, flag: e.target.value })}
                  placeholder="/flag.png"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Изображение (URL)</label>
                <input 
                  type="text" 
                  value={formData.image || ''} 
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/image.png"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => { setIsAdding(false); setEditingReview(null); }}
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Управление отзывами</h1>
        <button 
          onClick={handleAdd}
          style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}
        >
          <Plus size={18} /> Добавить отзыв
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', color: '#666', fontSize: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Товар</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Автор</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Текст</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: '#eee', flexShrink: 0 }}>
                      <img src={review.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: '#333' }}>{review.product}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{review.category}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={review.flag} alt="" style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }} />
                    <span style={{ color: '#555' }}>{review.author}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: '#666', maxWidth: '300px' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {review.text}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleEdit(review)}
                      style={{ background: '#3498db', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderForm()}
    </div>
  );
};

export default ReviewsManager;
