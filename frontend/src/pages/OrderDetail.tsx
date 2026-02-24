import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type OrderStatus = "New" | "Processing" | "Awaiting payment" | "Paid" | "Shipped" | "Awaiting pickup" | "Delivered" | "Canceled";

interface Order {
  id: string;
  user_id: string;
  items: any;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  recipient_info?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  shipping_address?: {
    country: string;
    city: string;
    street: string;
    zipCode: string;
    flat?: string;
  };
  contacts?: {
    telegram?: string;
    whatsapp?: string;
    comment?: string;
  };
}

export default function OrderDetail() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/orders/${id}`);
      return;
    }
    if (!id) return;

    setLoading(true);
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (data) {
          setOrder(data as Order);
        }
        setLoading(false);
      });
  }, [user, navigate, id]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    const { error } = await supabase
      .from("orders")
      .update({ status: "Canceled" })
      .eq("id", order.id);
      
    if (error) {
      alert("Error canceling order: " + error.message);
    } else {
      setOrder({ ...order, status: "Canceled" });
    }
  };

  function formatDate(value: string) {
    const d = new Date(value);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusStyle(status: OrderStatus) {
    switch (status) {
      case "New": return "status-new";
      case "Processing": return "status-processing";
      case "Awaiting payment": return "status-awaiting-payment";
      case "Paid": return "status-paid";
      case "Shipped": return "status-shipped";
      case "Awaiting pickup": return "status-awaiting-pickup";
      case "Delivered": return "status-delivered";
      case "Canceled": return "status-canceled";
      default: return "status-default";
    }
  }

  if (loading) {
    return (
      <>
        <Header variant="white" />
        <div className="orders-page">
          <div className="orders-container">
            <div className="orders-loading">Loading order details...</div>
          </div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header variant="white" />
        <div className="orders-page">
          <div className="orders-container">
            <div className="orders-error">{error || "Order not found"}</div>
            <Link to="/orders" className="back-link">← Back to orders</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header variant="white" />
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-layout">
            <aside className="orders-sidebar">
              <div className="orders-sidebar-title">Orders</div>
              <nav className="orders-nav">
                <button className="orders-nav-item active" onClick={() => navigate("/orders")}>Orders</button>
                <button className="orders-nav-item" onClick={() => navigate("/profile")}>User info</button>
                <button className="orders-nav-item" onClick={() => navigate("/update-password")}>Password</button>
                <button className="orders-nav-item logout" onClick={handleSignOut}>Log out</button>
              </nav>
            </aside>

            <main className="orders-content">
              <div className="order-detail-header">
                <Link to="/orders" className="back-link">
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 9L1 5L5 1" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to orders
                </Link>
                <h1 className="order-detail-title">Order #{order.id.slice(0, 8)}</h1>
              </div>

              {["New", "Processing"].includes(order.status) && (
                <div className="order-notification">
                  <div className="notification-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="9" stroke="#111" strokeWidth="1.5"/>
                      <path d="M10 6V11" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="10" cy="14" r="1" fill="#111"/>
                    </svg>
                  </div>
                  <div className="notification-text">
                    We have received your order and will contact you to clarify the details
                  </div>
                </div>
              )}

              <div className="order-info-grid">
                <div className="info-row">
                  <div className="info-label">Status</div>
                  <div className="info-value">
                    <span className={`status-badge-box ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-label">Order date</div>
                  <div className="info-value">{formatDate(order.created_at)}</div>
                </div>

                <div className="info-row">
                  <div className="info-label">Recipient name</div>
                  <div className="info-value">
                    {order.recipient_info?.firstName} {order.recipient_info?.lastName}
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-label">Phone number</div>
                  <div className="info-value">
                    {order.recipient_info?.phone}
                    <button className="edit-link">Edit</button>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-label">E-mail</div>
                  <div className="info-value">{order.recipient_info?.email}</div>
                </div>

                <div className="info-row">
                  <div className="info-label">Shipping address</div>
                  <div className="info-value address-value">
                    {order.shipping_address ? (
                      <>
                        {order.shipping_address.street} {order.shipping_address.flat ? `APT ${order.shipping_address.flat}` : ""}
                        <br />
                        {order.shipping_address.city}, {order.shipping_address.zipCode}, {order.shipping_address.country}
                      </>
                    ) : "N/A"}
                    <button className="edit-link">Edit</button>
                  </div>
                </div>

                {order.contacts?.comment && (
                  <div className="info-row">
                    <div className="info-label">Comment</div>
                    <div className="info-value">{order.contacts.comment}</div>
                  </div>
                )}
                
                {/* Example of additional fields for delivered orders, based on screenshot 2 */}
                {order.status === "Delivered" && (
                   <>
                     <div className="info-row">
                       <div className="info-label">Shipping service</div>
                       <div className="info-value">UPS</div>
                     </div>
                     <div className="info-row">
                       <div className="info-label">Payment</div>
                       <div className="info-value">
                         PayPal<br/>
                         {formatDate(order.created_at)}
                       </div>
                     </div>
                   </>
                )}
              </div>

              <div className="order-items-list">
                {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                  <div key={index} className="order-item-row">
                    <div className="item-image-col">
                       {/* Placeholder or actual image if available */}
                       <div className="item-image-placeholder">
                         {item.image ? <img src={item.image} alt={item.name} /> : <div className="no-image">IMG</div>}
                       </div>
                    </div>
                    <div className="item-details-col">
                      <div className="item-name">{item.name}</div>
                      <div className="item-sku">{item.sku || "NUC" + item.id?.toString().slice(0, 4).toUpperCase()}</div>
                    </div>
                    <div className="item-price-col">
                      ${item.price} x {item.quantity}
                    </div>
                    <div className="item-total-col">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary-section">
                <h2 className="summary-title">Order summary</h2>
                
                <div className="summary-row">
                  <div className="summary-label">Quantity</div>
                  <div className="summary-value">
                    {Array.isArray(order.items) ? order.items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0}
                  </div>
                </div>

                <div className="summary-row">
                  <div className="summary-label">Subtotal</div>
                  <div className="summary-value">${order.total_amount.toFixed(2)}</div>
                </div>
                
                {/* Assuming shipping is included or separate? Screenshot implies subtotal matches total if no shipping shown */}
                {/* <div className="summary-row">
                  <div className="summary-label">Shipping</div>
                  <div className="summary-value">$0.00</div>
                </div> */}

                <div className="summary-row total-row">
                  <div className="summary-label">Total</div>
                  <div className="summary-value">${order.total_amount.toFixed(2)}</div>
                </div>

                {["New", "Processing", "Awaiting payment"].includes(order.status) && (
                  <button className="cancel-order-btn" onClick={handleCancelOrder}>
                    Cancel order
                  </button>
                )}
              </div>

            </main>
          </div>
        </div>
      </div>
    </>
  );
}