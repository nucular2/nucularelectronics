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
  contacts?: any;
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
  const [openMenuOrderId, setOpenMenuOrderId] = useState<string | null>(null);

  useEffect(() => {
    // TEMPORARY: Allow viewing orders without login for design review
    if (!user) {
      // navigate("/login?redirect=/orders");
      // return;
      console.log('Viewing orders in design mode (not logged in)');
    }
    setLoading(true);
    
    if (!user) {
      setOrders([
        {
          id: "123456",
          user_id: "mock-user",
          items: [
            { id: 1, productId: 1, name: "Nucular controller P24F", quantity: 1, price: 610, image: "/miniature.svg", sku: "NUCP24F" },
          ],
          total_amount: 610,
          status: "Processing",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "789012",
          user_id: "mock-user",
          items: [
            { id: 2, productId: 2, name: "On-board computer", quantity: 1, price: 110, image: "/miniature.png", sku: "NUCOBC" },
          ],
          total_amount: 110,
          status: "Delivered",
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ] as any);
      setLoading(false);
      return;
    }

    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (data) {
          setOrders(data as Order[]);
          try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;
            if (token) {
              const r = await fetch("/api/retailcrm/sync", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ orderIds: (data as any[]).map((o) => o.id) }),
              });
              if (r.ok) {
                const payload = await r.json();
                const updates = payload?.updates || {};
                setOrders((prev) =>
                  prev.map((o) => (updates[o.id]?.status ? { ...o, status: updates[o.id].status } : o))
                );
              }
            }
          } catch (_) {}
        }
        setLoading(false);
      });
  }, [user, navigate]);

  useEffect(() => {
    if (!openMenuOrderId) return;
    const onDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(".order-menu-wrap")) return;
      setOpenMenuOrderId(null);
    };
    document.addEventListener("mousedown", onDocumentMouseDown);
    return () => document.removeEventListener("mousedown", onDocumentMouseDown);
  }, [openMenuOrderId]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCancelOrder = async (orderId: string) => {
    setOpenMenuOrderId(null);
    if (!user) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Canceled" as OrderStatus } : o))
      );
      return;
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: "Canceled" })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "Canceled" } : o)));
  };

  const handleGoToPayment = (orderId: string) => {
    setOpenMenuOrderId(null);
    navigate(`/orders/${orderId}`, { state: { action: "pay" } });
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

  function formatMoney(value: unknown) {
    const num = typeof value === "number" ? value : Number(value);
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  }

  function displayOrderNumber(order: Order) {
    const crmNumber = order?.contacts?.crm?.number;
    return crmNumber ? String(crmNumber) : order.id;
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

            <main className="orders-content orders-content--wide">
              <div className="orders-mobile-bar">
                <button className="orders-mobile-link active">Orders</button>
                <button className="orders-mobile-link" onClick={() => navigate("/profile")}>User info</button>
                <button className="orders-mobile-link" onClick={() => navigate("/update-password")}>Password</button>
                <button className="orders-mobile-link logout" onClick={handleSignOut}>Log out</button>
              </div>
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

              <div className="orders-list-header">
                <div>Order ID</div>
                <div>Order date</div>
                <div>Status</div>
                <div>Order amount</div>
                <div />
              </div>

              {loading && <div className="orders-loading">Loading orders...</div>}
              {error && <div className="orders-error">{error}</div>}

              {!loading && !error && filteredOrders.length === 0 ? (
                <div className="orders-empty-state">
                  <div className="orders-empty-illustration">
                    <svg width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M133 184.573V125.695L188 103.501V162.909C188 166.171 186.019 169.106 182.994 170.327L138.497 188.283C135.868 189.344 133 187.409 133 184.573ZM178.07 160.718C178.226 161.102 178.042 161.54 177.658 161.696L159.408 169.124C159.024 169.28 158.587 169.096 158.431 168.712C158.274 168.329 158.459 167.891 158.842 167.735L177.092 160.307C177.476 160.15 177.914 160.335 178.07 160.718ZM177.658 152.696C178.042 152.54 178.226 152.102 178.07 151.718C177.914 151.335 177.476 151.15 177.092 151.307L158.842 158.735C158.459 158.891 158.274 159.329 158.431 159.712C158.587 160.096 159.024 160.28 159.408 160.124L177.658 152.696Z"
                        fill="#222222"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M197.75 88.013L124 59.1953L50.25 88.013V157.251H25C24.5858 157.251 24.25 157.587 24.25 158.001C24.25 158.415 24.5858 158.751 25 158.751H50.25V167.216C50.25 172.401 53.3905 177.07 58.1933 179.025L124 205.81L189.807 179.025C194.61 177.07 197.75 172.401 197.75 167.216V158.751H225C225.414 158.751 225.75 158.415 225.75 158.001C225.75 157.587 225.414 157.251 225 157.251H197.75V88.013ZM160.497 102.573L89.5423 74.27L124 60.8058L194.976 88.5393L160.497 102.573ZM124.75 118.743L196.25 89.6401V167.216C196.25 171.791 193.479 175.911 189.241 177.636L124.75 203.886V118.743ZM123.25 118.743V203.886L58.7588 177.636C54.521 175.911 51.75 171.791 51.75 167.216V89.6401L73.25 98.3913V122.716C73.25 126.244 75.3685 129.427 78.6229 130.789L93.1667 136.873C96.2963 138.182 99.75 135.884 99.75 132.491V109.178L123.25 118.743ZM124 117.428L53.0243 88.5393L87.4972 75.0692L158.493 103.389L124 117.428ZM98.25 132.491V108.706L74.75 99.1169V122.716C74.75 125.639 76.5053 128.277 79.2019 129.405L93.7457 135.489C95.887 136.385 98.25 134.812 98.25 132.491Z"
                        fill="#222222"
                      />
                      <path d="M33 29.8182H40.4375L30.875 44V34.1818H23.4375L33 20V29.8182Z" fill="#222222" />
                      <path d="M160.836 223.182H167.034L159.065 235V226.818H152.867L160.836 215V223.182Z" fill="#222222" />
                      <path d="M217.664 41.5455H222.622L216.247 51V44.4545H211.289L217.664 35V41.5455Z" fill="#222222" />
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
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/orders/${order.id}`, { state: { order } })}
                    >
                      <div className="order-id">{displayOrderNumber(order)}</div>
                      <div className="order-date">{formatDate(order.created_at)}</div>
                      <div className="order-status">
                      <span className={`status-badge ${getStatusStyle(order.status)}`}>
                        {order.status === "Paid" && (
                          <svg className="paid-check-icon" viewBox="0 0 20 20" aria-hidden="true">
                            <circle cx="10" cy="10" r="10" fill="#27AE60" />
                            <path
                              d="M5.5 10.2L8.4 13.1L14.7 6.9"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {order.status}
                      </span>
                      </div>
                      <div className="order-amount">${formatMoney(order.total_amount)}</div>
                      <div
                        className="order-menu-wrap"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          className="order-menu-btn"
                          aria-label="Order actions"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuOrderId((prev) => (prev === order.id ? null : order.id));
                          }}
                        >
                          <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2" cy="2" r="2" fill="#111"/>
                            <circle cx="2" cy="8" r="2" fill="#111"/>
                            <circle cx="2" cy="14" r="2" fill="#111"/>
                          </svg>
                        </button>
                        {openMenuOrderId === order.id && (
                          <div className="order-menu" role="menu" onMouseDown={(e) => e.stopPropagation()}>
                            <button
                              className="order-menu-item"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuOrderId(null);
                            navigate(`/orders/${order.id}`, { state: { order } });
                              }}
                            >
                              Order details
                            </button>
                            <button className="order-menu-item" role="menuitem" onClick={() => handleGoToPayment(order.id)}>
                              Go to payment
                            </button>
                            <button
                              className="order-menu-item order-menu-item-danger"
                              role="menuitem"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel order
                            </button>
                          </div>
                        )}
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
