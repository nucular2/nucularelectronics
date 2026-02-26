import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
}

export default function Orders() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  useEffect(() => {
    // TEMPORARY: Allow viewing orders without login for design review
    if (!user) {
      // navigate("/login?redirect=/orders");
      // return;
      console.log('Viewing orders in design mode (not logged in)');
    }
    setLoading(true);
    
    if (!user) {
        // Mock orders
        setOrders([
            {
                id: '123456',
                user_id: 'mock-user',
                items: [{ name: 'Controller', quantity: 1, price: 100 }],
                total_amount: 100,
                status: 'Processing',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: '789012',
                user_id: 'mock-user',
                items: [{ name: 'Motor', quantity: 2, price: 200 }],
                total_amount: 400,
                status: 'Delivered',
                created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
                updated_at: new Date().toISOString()
            }
        ] as any); // Type assertion to bypass strict shape check if needed
        setLoading(false);
        return;
    }

    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (data) {
          setOrders(data as Order[]);
        }
        setLoading(false);
      });
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const filteredOrders = orders.filter((order) => {
    const isCompleted = ["Delivered", "Canceled"].includes(order.status);
    return activeTab === "completed" ? isCompleted : !isCompleted;
  });

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
      case "New":
        return "status-new";
      case "Processing":
        return "status-processing";
      case "Awaiting payment":
        return "status-awaiting-payment";
      case "Paid":
        return "status-paid";
      case "Shipped":
        return "status-shipped";
      case "Awaiting pickup":
        return "status-awaiting-pickup";
      case "Delivered":
        return "status-delivered";
      case "Canceled":
        return "status-canceled";
      default:
        return "status-default";
    }
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
                <button className="orders-nav-item active">Orders</button>
                <button className="orders-nav-item" onClick={() => navigate("/profile")}>
                  User info
                </button>
                <button className="orders-nav-item" onClick={() => navigate("/update-password")}>
                  Password
                </button>
                <button className="orders-nav-item logout" onClick={handleSignOut}>
                  Log out
                </button>
              </nav>
            </aside>

            <main className="orders-content">
              <h1 className="orders-title">Orders</h1>

              <div className="orders-tabs">
                <button
                  className={`orders-tab ${activeTab === "active" ? "active" : ""}`}
                  onClick={() => setActiveTab("active")}
                >
                  Active
                </button>
                <button
                  className={`orders-tab ${activeTab === "completed" ? "active" : ""}`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed
                </button>
              </div>

              {loading && <div className="orders-loading">Loading orders...</div>}
              {error && <div className="orders-error">{error}</div>}

              {!loading && !error && filteredOrders.length === 0 ? (
                <div className="orders-empty-state">
                  <div className="orders-empty-illustration">
                     <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 20L20 40V80L60 100L100 80V40L60 20Z" stroke="#111" strokeWidth="2" fill="none"/>
                      <path d="M20 40L60 60L100 40" stroke="#111" strokeWidth="2"/>
                      <path d="M60 60V100" stroke="#111" strokeWidth="2"/>
                      <path d="M50 10L65 30H55L70 50" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(10, -20)"/>
                    </svg>
                  </div>
                  <h2 className="orders-empty-title">No {activeTab} orders</h2>
                  <p className="orders-empty-text">Your orders will be displayed here.</p>
                </div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="order-card" 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="order-card-header">
                        <span className={`status-badge ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                        <button className="order-menu-btn">
                          <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2" cy="2" r="2" fill="#111"/>
                            <circle cx="2" cy="8" r="2" fill="#111"/>
                            <circle cx="2" cy="14" r="2" fill="#111"/>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="order-card-date">
                        {formatDate(order.created_at)}
                      </div>
                      
                      <div className="order-card-divider"></div>
                      
                      <div className="order-card-details">
                        <div className="order-detail-item">
                          <span className="order-detail-label">Order ID</span>
                          <span className="order-detail-value">{order.id.slice(0, 8)}</span>
                        </div>
                        <div className="order-detail-item right">
                          <span className="order-detail-label">Order amount</span>
                          <span className="order-detail-value bold">${order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
