import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { items, addToCart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [removedItems, setRemovedItems] = useState<any[]>([]);

  const getSku = (item: any) => {
    const raw = typeof item?.sku === 'string' ? item.sku : '';
    if (raw) return raw;
    const id = Number(item?.id);
    if (id === 1) return 'NUCP24F';
    if (id === 2) return 'NUCD';
    if (id === 3) return 'ULIGHT';
    if (id === 6) return 'NUCSURAD';
    if (id === 15) return 'NUCP24FSUR';
    if (id === 18) return '7459066';
    return String(item?.title || '').replace(/\s+/g, ' ').trim().toUpperCase();
  };

  if (items.length === 0 && removedItems.length === 0) {
    return (
      <>
        <Header variant="white" />
        <div className="cart-page">
          <div className="cart-container cart-container-empty">
            <h1 className="cart-title">Cart</h1>
            <div className="cart-empty">
              <div className="cart-empty-illustration">
                <img src="/cart.png" alt="Cart is empty" />
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

  const handleRemove = (item: any) => {
    setRemovedItems((prev) => {
      if (prev.some((x) => x?.id === item?.id)) return prev;
      return [...prev, item];
    });
    removeFromCart(item.id);
  };

  const handleReturn = (item: any) => {
    setRemovedItems((prev) => prev.filter((x) => x?.id !== item?.id));
    addToCart(item);
    const qty = Number(item?.quantity);
    if (Number.isFinite(qty) && qty > 1) {
      window.setTimeout(() => updateQuantity(item.id, qty), 0);
    }
  };

  return (
    <>
      <Header variant="white" />
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Cart</h1>
          <div className="cart-layout">
            <div className="cart-main">
            <div className="cart-items">
              {items.map((item, index) => (
                <div key={item.id} className={`cart-item${index < items.length - 1 ? ' cart-item--divider' : ''}`}>
                  <div className="cart-item-main">
                    <div className="cart-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.title} />
                      ) : (
                        <div className="cart-item-placeholder" />
                      )}
                    </div>
                    <div className="cart-item-details">
                      <button
                        type="button"
                        className="cart-item-title cart-item-title-link"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.title}
                      </button>
                      <p className="cart-item-sku">{getSku(item)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-qty-select-wrap">
                        <select
                          className="cart-qty-select"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          aria-label="Quantity"
                        >
                          {Array.from({ length: 10 }, (_, idx) => idx + 1).map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="cart-price-remove">
                        <p className="cart-item-price">{item.price}</p>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="preorder-badge">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6.25C8.41421 6.25 8.75 6.58579 8.75 7V12C8.75 12.4142 8.41421 12.75 8 12.75C7.58579 12.75 7.25 12.4142 7.25 12V7C7.25 6.58579 7.58579 6.25 8 6.25Z" fill="#222222" />
                <path d="M8 5C8.55229 5 9 4.55228 9 4C9 3.44772 8.55229 3 8 3C7.44772 3 7 3.44772 7 4C7 4.55228 7.44772 5 8 5Z" fill="#222222" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z" fill="#222222" />
              </svg>
              <span>Waiting time after pre-order ~ 7 months</span>
            </div>
            {removedItems.length > 0 ? (
              <div className="cart-items cart-items-removed">
                {removedItems.map((item, index) => (
                  <div
                    key={`removed-${item.id}`}
                    className={`cart-item cart-item--removed${index < removedItems.length - 1 ? ' cart-item--divider' : ''}`}
                  >
                    <div className="cart-item-main">
                      <div className="cart-item-image">
                        {item.image ? <img src={item.image} alt={item.title} /> : <div className="cart-item-placeholder" />}
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-title">{item.title}</div>
                        <p className="cart-item-sku">{getSku(item)}</p>
                      </div>
                      <div className="cart-item-actions">
                        <div className="cart-qty-select-wrap cart-qty-select-wrap--removed">
                          <div className="cart-item-removed-label">Item removed</div>
                        </div>
                        <div className="cart-price-remove">
                          <p className="cart-item-price">{item.price}</p>
                          <button className="remove-btn" onClick={() => handleReturn(item)}>
                            Return
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            </div>
            <div className="cart-summary-column">
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
              </aside>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
