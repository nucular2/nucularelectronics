import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { refreshSupabaseSessionIfNeeded, supabase } from "../lib/supabase";

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
    crm?: {
      id?: number | string;
      number?: string | number;
      status?: string | null;
      fullPaidAt?: string | null;
      paidAt?: string | null;
      paymentStatuses?: string[];
      syncedAt?: string;
    };
    payment?: {
      provider?: string;
      status?: string;
      paidAt?: string;
      amount?: number;
      updatedAt?: string;
    };
    telegram?: string;
    whatsapp?: string;
    comment?: string;
  };
}

export default function OrderDetail() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const designStorageKey = "design_profile_v1";

  const [editingRecipient, setEditingRecipient] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [recipientForm, setRecipientForm] = useState({ firstName: "", lastName: "" });
  const [phoneForm, setPhoneForm] = useState("");
  const [emailForm, setEmailForm] = useState("");
  const [addressForm, setAddressForm] = useState({ country: "", city: "", street: "", zipCode: "", flat: "" });

  useEffect(() => {
    if (!id) return;

    const stateOrder = (location.state as any)?.order as Order | undefined;
    if (stateOrder?.id === id) {
      setOrder(stateOrder);
      setError(null);
      setLoading(false);
      return;
    }

    if (!user) {
      const mockOrder: Order = {
        id,
        user_id: "mock-user",
        items: [
          { id: 1, productId: 1, name: "Nucular controller P24F", quantity: 1, price: 610, image: "/miniature.svg", sku: "NUCP24F" },
        ],
        total_amount: 610,
        status: "Processing",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        recipient_info: {
          firstName: "Dmitry",
          lastName: "User",
          phone: "+7 900 123 45 67",
          email: "demo@example.com",
        },
        shipping_address: {
          country: "Russia",
          city: "Moscow",
          street: "Lenina st.",
          zipCode: "101000",
          flat: "42",
        },
      };
      setOrder(mockOrder);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const run = async () => {
      try {
        await refreshSupabaseSessionIfNeeded();
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) {
          setError(error.message);
          return;
        }
        if (!data) return;
        setOrder(data as Order);
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
              body: JSON.stringify({ orderIds: [id] }),
            });
            if (r.ok) {
              const payload = await r.json();
              const updatedStatus = payload?.updates?.[id]?.status;
              if (updatedStatus) {
                setOrder((prev) => (prev ? { ...prev, status: updatedStatus } : prev));
              }
            }
          }
        } catch (_) {}
      } catch (e: any) {
        setError(e?.message || "Session expired");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [user, id, location.state]);

  useEffect(() => {
    if (!order) return;
    setRecipientForm({
      firstName: order.recipient_info?.firstName || "",
      lastName: order.recipient_info?.lastName || "",
    });
    setPhoneForm(order.recipient_info?.phone || "");
    setEmailForm(order.recipient_info?.email || "");
    setAddressForm({
      country: order.shipping_address?.country || "",
      city: order.shipping_address?.city || "",
      street: order.shipping_address?.street || "",
      zipCode: order.shipping_address?.zipCode || "",
      flat: order.shipping_address?.flat || "",
    });
  }, [order]);

  useEffect(() => {
    // @ts-ignore
    const action = location.state?.action;
    if (loading || !order) return;
    if (action !== "pay") return;
    const actionsEl = document.querySelector(".order-actions") as HTMLElement | null;
    actionsEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    const payBtn = document.querySelector(".order-actions .action-btn.primary") as HTMLButtonElement | null;
    payBtn?.focus();
  }, [loading, order, location.state]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    if (!user && !import.meta.env.PROD) {
      setOrder({ ...order, status: "Canceled" });
      navigate("/orders", { state: { tab: "completed", cancelOrderId: order.id } });
      return;
    }

    try {
      await refreshSupabaseSessionIfNeeded();
    } catch (e: any) {
      alert(e?.message || "Session expired");
      return;
    }

    const q = supabase.from("orders").update({ status: "Canceled" }).eq("id", order.id);
    const { error } = user ? await q.eq("user_id", user.id) : await q;

    if (error) {
      alert("Error canceling order: " + error.message);
      return;
    }

    setOrder({ ...order, status: "Canceled" });
    navigate("/orders", { state: { tab: "completed" } });
  };

  const saveToDesignProfile = (payload: {
    profile?: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      country?: string;
      city?: string;
      street?: string;
      flat?: string;
      zip_code?: string;
    };
    email?: string;
  }) => {
    try {
      const raw = localStorage.getItem(designStorageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      const next = {
        profile: { ...(parsed?.profile || {}), ...(payload.profile || {}) },
        email: typeof payload.email === "string" ? payload.email : parsed?.email,
      };
      localStorage.setItem(designStorageKey, JSON.stringify(next));
    } catch (_) {}
  };

  const saveToCheckoutCache = (payload: { recipient?: any; shipping?: any }) => {
    try {
      if (payload.recipient) {
        localStorage.setItem("checkout_recipient", JSON.stringify(payload.recipient));
      }
      if (payload.shipping) {
        localStorage.setItem("checkout_shipping", JSON.stringify(payload.shipping));
      }
    } catch (_) {}
  };

  const updateOrderAndProfile = async (next: { recipient?: any; shipping?: any; email?: string }) => {
    if (!order) return;

    const recipientNext = next.recipient
      ? { ...order.recipient_info, ...next.recipient }
      : order.recipient_info || { firstName: "", lastName: "", phone: "", email: "" };
    const shippingNext = next.shipping ? { ...order.shipping_address, ...next.shipping } : order.shipping_address;
    const emailNext = typeof next.email === "string" ? next.email : recipientNext.email;

    const derivedRecipient = { ...recipientNext, email: emailNext };
    const orderPatch: any = { recipient_info: derivedRecipient };
    if (shippingNext) orderPatch.shipping_address = shippingNext;
    orderPatch.customer_name = `${derivedRecipient.firstName || ""} ${derivedRecipient.lastName || ""}`.trim();
    orderPatch.customer_phone = derivedRecipient.phone || "";
    if (shippingNext) {
      orderPatch.customer_address = `${shippingNext.street || ""}${shippingNext.flat ? `, ${shippingNext.flat}` : ""}, ${shippingNext.city || ""}, ${shippingNext.zipCode || ""}, ${shippingNext.country || ""}`;
    }

    setOrder((prev) => (prev ? { ...prev, ...orderPatch } : prev));
    saveToCheckoutCache({
      recipient: {
        firstName: derivedRecipient.firstName || "",
        lastName: derivedRecipient.lastName || "",
        countryCode: "US",
        phone: derivedRecipient.phone || "",
        email: derivedRecipient.email || "",
      },
      shipping: shippingNext
        ? {
            country: shippingNext.country || "",
            zipCode: shippingNext.zipCode || "",
            city: shippingNext.city || "",
            street: shippingNext.street || "",
            buildingName: "",
            flat: shippingNext.flat || "",
            region: "",
          }
        : undefined,
    });

    if (!user) {
      saveToDesignProfile({
        profile: {
          first_name: derivedRecipient.firstName || "",
          last_name: derivedRecipient.lastName || "",
          phone: derivedRecipient.phone || "",
          country: shippingNext?.country || "",
          city: shippingNext?.city || "",
          street: shippingNext?.street || "",
          flat: shippingNext?.flat || "",
          zip_code: shippingNext?.zipCode || "",
        },
        email: derivedRecipient.email || "",
      });
      return;
    }

    try {
      await refreshSupabaseSessionIfNeeded();
    } catch (e: any) {
      setError(e?.message || "Session expired");
      return;
    }

    try {
      const { error: orderErr } = await supabase
        .from("orders")
        .update(orderPatch)
        .eq("id", order.id)
        .eq("user_id", user.id);
      if (orderErr) throw orderErr;

      const profilePatch: any = {
        id: user.id,
        first_name: derivedRecipient.firstName || "",
        last_name: derivedRecipient.lastName || "",
        phone: derivedRecipient.phone || "",
        country: shippingNext?.country || "",
        city: shippingNext?.city || "",
        street: shippingNext?.street || "",
        flat: shippingNext?.flat || "",
        zip_code: shippingNext?.zipCode || "",
        updated_at: new Date(),
      };
      await supabase.from("profiles").upsert(profilePatch);

      if (typeof next.email === "string" && next.email && next.email !== user.email) {
        const { error: emailErr } = await supabase.auth.updateUser({ email: next.email });
        if (emailErr) {
          setError(emailErr.message);
        }
      }
    } catch (e: any) {
      setError(e?.message || "Failed to save changes");
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

  function toNumber(value: unknown) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const num = Number(value);
      return Number.isFinite(num) ? num : 0;
    }
    return 0;
  }

  function formatMoney(value: unknown) {
    return toNumber(value).toFixed(2);
  }

  function displayOrderNumber(order: Order) {
    const crmNumber = order?.contacts?.crm?.number;
    if (crmNumber) return String(crmNumber);
    const id = typeof order?.id === "string" ? order.id : "";
    return id.includes("-") ? id.split("-")[0].toUpperCase() : id;
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
              <nav className="orders-nav">
                <button className="orders-nav-item active" onClick={() => navigate("/orders")}>Orders</button>
                <button className="orders-nav-item" onClick={() => navigate("/profile")}>User info</button>
                <button className="orders-nav-item" onClick={() => navigate("/update-password")}>Password</button>
                <button className="orders-nav-item logout" onClick={handleSignOut}>Log out</button>
              </nav>
            </aside>

            <main className="orders-content">
              <div className="order-detail-container">
                <Link to="/orders" className="back-link">
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 9L1 5L5 1" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to orders
                </Link>
                
                <h1 className="order-detail-title">Order #{displayOrderNumber(order)}</h1>

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

                <div className="order-status-section">
                  <span className={`status-badge-large ${getStatusStyle(order.status)}`}>
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

                <div className="order-info-list">
                  <div className="info-item">
                    <div className="info-label">Order date</div>
                    <div className="info-value">{formatDate(order.created_at)}</div>
                  </div>

                  <div className="info-item">
                    <div className="info-header">
                      <div className="info-label">Recipient name</div>
                      {editingRecipient ? (
                        <button
                          className="edit-link"
                          onClick={() => {
                            setEditingRecipient(false);
                            setRecipientForm({
                              firstName: order.recipient_info?.firstName || "",
                              lastName: order.recipient_info?.lastName || "",
                            });
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button className="edit-link" onClick={() => setEditingRecipient(true)}>
                          Edit
                        </button>
                      )}
                    </div>
                    {editingRecipient ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <input
                            className="user-info-input"
                            value={recipientForm.firstName}
                            placeholder="First name"
                            onChange={(e) => setRecipientForm((p) => ({ ...p, firstName: e.target.value }))}
                          />
                          <input
                            className="user-info-input"
                            value={recipientForm.lastName}
                            placeholder="Last name"
                            onChange={(e) => setRecipientForm((p) => ({ ...p, lastName: e.target.value }))}
                          />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            className="action-btn primary"
                            style={{ width: 180 }}
                            onClick={async () => {
                              await updateOrderAndProfile({ recipient: { firstName: recipientForm.firstName, lastName: recipientForm.lastName } });
                              setEditingRecipient(false);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="info-value">
                        {order.recipient_info?.firstName} {order.recipient_info?.lastName}
                      </div>
                    )}
                  </div>

                  <div className="info-item">
                    <div className="info-header">
                      <div className="info-label">Phone number</div>
                      {editingPhone ? (
                        <button
                          className="edit-link"
                          onClick={() => {
                            setEditingPhone(false);
                            setPhoneForm(order.recipient_info?.phone || "");
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button className="edit-link" onClick={() => setEditingPhone(true)}>
                          Edit
                        </button>
                      )}
                    </div>
                    {editingPhone ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                        <input
                          className="user-info-input"
                          value={phoneForm}
                          placeholder="Phone number"
                          onChange={(e) => setPhoneForm(e.target.value)}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            className="action-btn primary"
                            style={{ width: 180 }}
                            onClick={async () => {
                              await updateOrderAndProfile({ recipient: { phone: phoneForm } });
                              setEditingPhone(false);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="info-value">{order.recipient_info?.phone}</div>
                    )}
                  </div>

                  <div className="info-item">
                    <div className="info-header">
                      <div className="info-label">E-mail</div>
                      {editingEmail ? (
                        <button
                          className="edit-link"
                          onClick={() => {
                            setEditingEmail(false);
                            setEmailForm(order.recipient_info?.email || "");
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button className="edit-link" onClick={() => setEditingEmail(true)}>
                          Edit
                        </button>
                      )}
                    </div>
                    {editingEmail ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                        <input
                          className="user-info-input"
                          value={emailForm}
                          placeholder="E-mail"
                          onChange={(e) => setEmailForm(e.target.value)}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            className="action-btn primary"
                            style={{ width: 180 }}
                            onClick={async () => {
                              await updateOrderAndProfile({ email: emailForm });
                              setEditingEmail(false);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="info-value">{order.recipient_info?.email}</div>
                    )}
                  </div>

                  <div className="info-item">
                    <div className="info-header">
                      <div className="info-label">Shipping address</div>
                      {editingAddress ? (
                        <button
                          className="edit-link"
                          onClick={() => {
                            setEditingAddress(false);
                            setAddressForm({
                              country: order.shipping_address?.country || "",
                              city: order.shipping_address?.city || "",
                              street: order.shipping_address?.street || "",
                              zipCode: order.shipping_address?.zipCode || "",
                              flat: order.shipping_address?.flat || "",
                            });
                          }}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button className="edit-link" onClick={() => setEditingAddress(true)}>
                          Edit
                        </button>
                      )}
                    </div>
                    {editingAddress ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                        <input
                          className="user-info-input"
                          value={addressForm.street}
                          placeholder="Street address"
                          onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))}
                        />
                        <div style={{ display: "flex", gap: 12 }}>
                          <input
                            className="user-info-input"
                            value={addressForm.flat}
                            placeholder="Apt / office"
                            onChange={(e) => setAddressForm((p) => ({ ...p, flat: e.target.value }))}
                          />
                          <input
                            className="user-info-input"
                            value={addressForm.zipCode}
                            placeholder="Postcode"
                            onChange={(e) => setAddressForm((p) => ({ ...p, zipCode: e.target.value }))}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <input
                            className="user-info-input"
                            value={addressForm.city}
                            placeholder="City"
                            onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                          />
                          <input
                            className="user-info-input"
                            value={addressForm.country}
                            placeholder="Country"
                            onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))}
                          />
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            className="action-btn primary"
                            style={{ width: 180 }}
                            onClick={async () => {
                              await updateOrderAndProfile({
                                shipping: {
                                  street: addressForm.street,
                                  flat: addressForm.flat,
                                  city: addressForm.city,
                                  zipCode: addressForm.zipCode,
                                  country: addressForm.country,
                                },
                              });
                              setEditingAddress(false);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="info-value address-value">
                        {order.shipping_address ? (
                          <>
                            {order.shipping_address.street} {order.shipping_address.flat ? `APT ${order.shipping_address.flat}` : ""}
                            <br />
                            {order.shipping_address.city}, {order.shipping_address.zipCode}, {order.shipping_address.country}
                          </>
                        ) : "N/A"}
                      </div>
                    )}
                  </div>

                  {order.status === "Awaiting payment" && (
                    <div className="info-item">
                      <div className="info-label">Shipping service</div>
                      <div className="info-value">UPS</div>
                    </div>
                  )}
                </div>

                <div className="order-products-list">
                  {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="order-product-row"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const rawProductId = item?.productId ?? item?.id;
                        const nextId = Number(rawProductId);
                        if (Number.isFinite(nextId) && nextId > 0) {
                          navigate(`/product/${nextId}`);
                        }
                      }}
                    >
                      <div className="product-image">
                        {item.image ? <img src={item.image} alt={item.name} /> : <div className="no-image">IMG</div>}
                      </div>
                      <div className="product-details">
                        <div className="product-name">{item.name}</div>
                        <div className="product-sku">{item.sku || "NUC" + item.id?.toString().slice(0, 4).toUpperCase()}</div>
                      </div>
                      <div className="product-price-qty">
                        ${formatMoney(item.price)} x {toNumber(item.quantity) || 1}
                      </div>
                      <div className="product-total">
                        ${formatMoney(toNumber(item.price) * (toNumber(item.quantity) || 1))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary-section">
                  <h2 className="summary-title">Order summary</h2>
                  
                  <div className="summary-row">
                    <div className="summary-label">Quantity</div>
                    <div className="summary-value">
                      {Array.isArray(order.items) ? order.items.reduce((acc: number, item: any) => acc + toNumber(item.quantity), 0) : 0}
                    </div>
                  </div>

                  <div className="summary-row">
                    <div className="summary-label">Subtotal</div>
                    <div className="summary-value">${formatMoney(order.total_amount)}</div>
                  </div>
                  
                  <div className="summary-row">
                    <div className="summary-label">Shipping</div>
                    <div className="summary-value">$100.00</div>
                  </div>

                  <div className="summary-row total-row">
                    <div className="summary-label">Total</div>
                    <div className="summary-value">${formatMoney(toNumber(order.total_amount) + 100)}</div>
                  </div>

                  <div className="order-actions">
                    {order.status === "Awaiting payment" && (
                      <button className="action-btn primary" onClick={() => navigate("/checkout")}>Go to payment</button>
                    )}
                    {["New", "Processing", "Awaiting payment"].includes(order.status) && (
                      <button className="action-btn secondary" onClick={handleCancelOrder}>
                        Cancel order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
