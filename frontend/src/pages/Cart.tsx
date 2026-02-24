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
                    <div className="cart-item-main">
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
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-arrow"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M0.227806 0.234315C0.531547 -0.0781049 1.02401 -0.0781049 1.32775 0.234315L7 6.06863L12.6723 0.234315C12.976 -0.0781049 13.4685 -0.0781049 13.7722 0.234315C14.0759 0.546734 14.0759 1.05327 13.7722 1.36569L7.54997 7.76569C7.24623 8.07811 6.75377 8.07811 6.45003 7.76569L0.227806 1.36569C-0.0759353 1.05327 -0.0759353 0.546734 0.227806 0.234315Z" fill="#B0B0B0" />
                            </svg>
                          </button>
                        </div>
                        <div className="cart-price-remove">
                          <p className="cart-item-price">{item.price}</p>
                          <button
                            className="remove-btn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="preorder-warning">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath={`url(#clip0_${item.id})`}>
                          <path d="M8 6.25C8.41421 6.25 8.75 6.58579 8.75 7V12C8.75 12.4142 8.41421 12.75 8 12.75C7.58579 12.75 7.25 12.4142 7.25 12V7C7.25 6.58579 7.58579 6.25 8 6.25Z" fill="#222222" />
                          <path d="M8 5C8.55229 5 9 4.55228 9 4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4C7 4.55228 7.44772 5 8 5Z" fill="#222222" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z" fill="#222222" />
                        </g>
                        <defs>
                          <clipPath id={`clip0_${item.id}`}>
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Waiting time after pre-order ~ 7 months</span>
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
