import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/checkout");
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) {
      navigate("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const address = String(form.get("address") || "");

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        items,
        total_amount: totalPrice,
        status: "New",
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
      })
      .select()
      .single();

    if (error || !data) {
      setError(error?.message || "Failed to create order.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: data.id }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "Failed to start payment.");
      }

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to start payment.");
      setLoading(false);
      return;
    }
  }
  return (
    <>
      <Header variant="white" />
      <div className="auth-page">
        <div className="auth-container" style={{ maxWidth: "520px" }}>
          <h1 className="auth-title">Checkout</h1>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input name="name" placeholder="Name" required className="auth-input" />
            </div>
            <div className="form-group">
              <input name="phone" placeholder="Phone" required className="auth-input" />
            </div>
            <div className="form-group">
              <input name="address" placeholder="Shipping address" required className="auth-input" />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Placing order..." : "Place order"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
