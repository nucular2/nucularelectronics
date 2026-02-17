import React, { useState } from 'react';
import Header from "../components/Header";
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [activeTab, setActiveTab] = useState('Components');
  const { addToCart } = useCart();

  const tabs = [
    'Components',
    'Accessories',
    'Spare parts',
    'Complete solutions',
    'Apparel'
  ];

  const filteredProducts = products.filter(product => product.category === activeTab);

  return (
    <>
      <Header variant="white" />
      <div className="shop-page">
        <div className="shop-container">
          <h1 className="shop-title">Shop</h1>
          
          <div className="shop-tabs">
            {tabs.map(tab => (
              <button 
                key={tab} 
                className={`shop-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="shop-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="shop-card">
                <div className={`shop-card-image-container ${!product.image ? 'placeholder' : ''}`}>
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="shop-card-image" />
                  ) : (
                    <svg width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z" fill="#E9E9E9" />
                      <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                    </svg>
                  )}
                </div>
                <h3 className="shop-card-title">{product.title}</h3>
                <p className={`shop-card-price ${product.isPreorder ? 'preorder' : ''}`}>{product.price}</p>
                {!product.isPreorder && (
                  <button 
                    className="card-button buy-button"
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
