import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <>
        <Header variant="white" />
        <div className="cart-page">
          <div className="cart-container cart-container-empty">
            <h1 className="cart-title">Cart</h1>
            <div className="cart-empty">
              <div className="cart-empty-illustration">
                <img src="/сart.png" alt="Cart is empty" />
              </div>
              <h2 className="cart-empty-title">Cart is empty</h2>
              <p className="cart-empty-text">
                To place an order, select and add items to your shopping cart.
              </p>
              <Link to="/shop" className="cart-empty-button">
                Go to shop
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
          <div className="cart-layout">
            <div className="cart-main">
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
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
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
            </div>
            <aside className="cart-summary">
              <h2 className="cart-summary-title">Order summary</h2>
              <div className="cart-summary-row">
                <span className="cart-summary-label">Quantity</span>
                <span className="cart-summary-value">{totalItems}</span>
              </div>
              <div className="cart-summary-row cart-summary-row-total">
                <span className="cart-summary-label">Total</span>
                <span className="cart-summary-value">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                className="checkout-btn"
                onClick={() => {
                  if (!user) {
                    navigate('/login?redirect=/checkout');
                  } else {
                    navigate('/checkout');
                  }
                }}
              >
                Go to checkout
              </button>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
