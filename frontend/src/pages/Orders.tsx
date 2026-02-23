import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type OrderStatus = "New" | "Paid" | "Shipped";

interface Order {
  id: string;
  user_id: string;
  items: any;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/orders");
      return;
    }
    setLoading(true);
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: sortDirection === "asc" })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (data) {
          setOrders(data as Order[]);
        }
        setLoading(false);
      });
  }, [user, navigate, sortDirection]);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  function formatDate(value: string) {
    const d = new Date(value);
    return d.toLocaleString();
  }

  function statusClass(status: OrderStatus) {
    if (status === "New") return "order-status order-status-new";
    if (status === "Paid") return "order-status order-status-paid";
    return "order-status order-status-shipped";
  }

  return (
    <>
      <Header variant="white" />
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-layout">
            <aside className="orders-sidebar">
              <div className="orders-sidebar-link active">Orders</div>
              <div
                className="orders-sidebar-link"
                onClick={() => navigate("/profile")}
              >
                User info
              </div>
              <div className="orders-sidebar-link">Password</div>
              <div className="orders-sidebar-link" onClick={() => navigate("/logout")}>
                Log out
              </div>
            </aside>
            <main>
              <h1 className="orders-title">Orders</h1>
          <div className="orders-filters">
            <div className="orders-filter-group">
              <button
                className={
                  statusFilter === "all"
                    ? "orders-filter-button active"
                    : "orders-filter-button"
                }
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={
                  statusFilter === "New"
                    ? "orders-filter-button active"
                    : "orders-filter-button"
                }
                onClick={() => setStatusFilter("New")}
              >
                New
              </button>
              <button
                className={
                  statusFilter === "Paid"
                    ? "orders-filter-button active"
                    : "orders-filter-button"
                }
                onClick={() => setStatusFilter("Paid")}
              >
                Paid
              </button>
              <button
                className={
                  statusFilter === "Shipped"
                    ? "orders-filter-button active"
                    : "orders-filter-button"
                }
                onClick={() => setStatusFilter("Shipped")}
              >
                Shipped
              </button>
            </div>
            <button
              className="orders-sort-button"
              onClick={() =>
                setSortDirection(sortDirection === "desc" ? "asc" : "desc")
              }
            >
              Sort by date {sortDirection === "desc" ? "↓" : "↑"}
            </button>
          </div>
          {loading && <div className="orders-loading">Loading orders...</div>}
          {error && <div className="auth-error">{error}</div>}
          {!loading && filteredOrders.length === 0 && !error && (
            <div className="orders-empty">
              <p>No orders yet.</p>
            </div>
          )}
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">Order #{order.id}</div>
                    <div className="order-date">
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                  <div className={statusClass(order.status)}>
                    {order.status}
                  </div>
                </div>
                <div className="order-body">
                  <div className="order-amount">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="order-timestamps">
                    <div>
                      <span>Created</span>
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    <div>
                      <span>Updated</span>
                      <span>{formatDate(order.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
