import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Header variant="white" />
        <div className="cart-page">
          <div className="cart-container empty">
            <h1 className="cart-title">Cart</h1>
            <div className="cart-empty-content">
              <p>Your cart is empty</p>
              <Link to="/shop" className="cart-continue-btn">
                Go to Shop
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header variant="white" />
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Cart</h1>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.title} />
                  ) : (
                    <div className="cart-item-placeholder" />
                  )}
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <p className="cart-item-category">{item.category}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-price">{item.price}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
}
