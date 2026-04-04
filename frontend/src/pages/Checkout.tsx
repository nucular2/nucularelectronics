import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Header from "../components/Header";
import CountryCombobox from "../components/CountryCombobox";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { countries } from "../data/countries";
import "../checkout-styles.css";

// Types for our form data
interface RecipientInfo {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  email: string;
}

interface ShippingAddress {
  country: string;
  region?: string;
  zipCode: string;
  city: string;
  street: string;
  buildingName?: string;
  flat?: string;
}

interface ContactsInfo {
  telegram?: string;
  whatsapp?: string;
  reason?: string;
  comment?: string;
  termsAccepted: boolean;
}

type PaymentMethod = "card" | "paypal" | "bank" | "crypto" | "no_payment";

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart(); // Assuming clearCart exists, otherwise we'll handle it
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Steps: 1 = Recipient, 2 = Shipping, 3 = Contacts
  const [step, setStep] = useState(1);

  // Form State
  const [recipient, setRecipient] = useState<RecipientInfo>({
    firstName: "",
    lastName: "",
    countryCode: "US", // Default
    phone: "",
    email: "",
  });

  const [shipping, setShipping] = useState<ShippingAddress>({
    country: "",
    zipCode: "",
    city: "",
    street: "",
    buildingName: "",
    flat: "",
  });

  const [contacts, setContacts] = useState<ContactsInfo>({
    telegram: "",
    whatsapp: "",
    reason: "",
    comment: "",
    termsAccepted: false,
  });

  const cartSnapshotRef = useRef<{ items: any[]; totalPrice: number }>({ items: [], totalPrice: 0 });
  const [phoneVerifyOpen, setPhoneVerifyOpen] = useState(false);
  const [phoneVerifyDigits, setPhoneVerifyDigits] = useState<string[]>(["", "", "", ""]);
  const [phoneVerifyLoading, setPhoneVerifyLoading] = useState(false);
  const [phoneVerifyError, setPhoneVerifyError] = useState<string | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const phoneVerifyInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const hasPreorder = useMemo(() => items.some((it: any) => Boolean(it?.isPreorder)), [items]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(hasPreorder ? "bank" : "card");
  const [promoCode, setPromoCode] = useState('');

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedRecipient = localStorage.getItem('checkout_recipient');
      if (savedRecipient) setRecipient(JSON.parse(savedRecipient));
      
      const savedShipping = localStorage.getItem('checkout_shipping');
      if (savedShipping) setShipping(JSON.parse(savedShipping));

      const savedContacts = localStorage.getItem('checkout_contacts');
      if (savedContacts) setContacts(JSON.parse(savedContacts));
    } catch (e) {
      console.error("Failed to load checkout data", e);
    }
  }, []);

  useEffect(() => {
    const designStorageKey = "design_profile_v1";
    const applyFromProfile = async () => {
      try {
        if (!user) {
          let nextEmail = "";
          let nextProfile: any = null;
          try {
            const raw = localStorage.getItem(designStorageKey);
            if (raw) {
              const parsed = JSON.parse(raw);
              nextProfile = parsed?.profile || null;
              if (typeof parsed?.email === "string") nextEmail = parsed.email;
            }
          } catch (_) {}

          setRecipient((prev) => ({
            ...prev,
            firstName: prev.firstName || nextProfile?.first_name || "",
            lastName: prev.lastName || nextProfile?.last_name || "",
            phone: prev.phone || nextProfile?.phone || "",
            email: prev.email || nextEmail || "",
          }));
          setShipping((prev) => ({
            ...prev,
            country: prev.country || nextProfile?.country || "",
            city: prev.city || nextProfile?.city || "",
            street: prev.street || nextProfile?.street || "",
            zipCode: prev.zipCode || nextProfile?.zip_code || "",
            flat: prev.flat || nextProfile?.flat || "",
          }));
          return;
        }

        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        const profile: any = data || null;
        setRecipient((prev) => ({
          ...prev,
          firstName: prev.firstName || profile?.first_name || "",
          lastName: prev.lastName || profile?.last_name || "",
          phone: prev.phone || profile?.phone || "",
          email: prev.email || user.email || "",
        }));
        setShipping((prev) => ({
          ...prev,
          country: prev.country || profile?.country || "",
          city: prev.city || profile?.city || "",
          street: prev.street || profile?.street || "",
          zipCode: prev.zipCode || profile?.zip_code || "",
          flat: prev.flat || profile?.flat || "",
        }));
      } catch (_) {}
    };
    void applyFromProfile();
  }, [user]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('checkout_recipient', JSON.stringify(recipient));
  }, [recipient]);

  useEffect(() => {
    localStorage.setItem('checkout_shipping', JSON.stringify(shipping));
  }, [shipping]);

  useEffect(() => {
    localStorage.setItem('checkout_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    cartSnapshotRef.current = {
      items: Array.isArray(items) ? items : [],
      totalPrice: typeof totalPrice === "number" && Number.isFinite(totalPrice) ? totalPrice : 0,
    };
  }, [items, totalPrice]);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!user) navigate("/login?redirect=/checkout");
  }, [user, navigate]);

  // Handlers
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipient(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  const handleContactsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContacts(prev => ({ ...prev, [name]: value }));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContacts(prev => ({ ...prev, termsAccepted: e.target.checked }));
  };

  // Temporary function for quick testing
  const fillTestValues = () => {
    setRecipient({
      firstName: "Test",
      lastName: "User",
      countryCode: "US",
      phone: "+1234567890",
      email: "test@example.com",
    });
    setShipping({
      country: "Test Country",
      zipCode: "12345",
      city: "Test City",
      street: "Test Street 1",
      buildingName: "",
      flat: "1",
    });
    setContacts({
      telegram: "@test",
      whatsapp: "+1234567890",
      comment: "Test comment",
      termsAccepted: true,
    });
    // setStep(3);
  };

  // Navigation
  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient.firstName && recipient.lastName && recipient.phone && recipient.email) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const goToStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (shipping.country && shipping.zipCode && shipping.city && shipping.street) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const ensureSupabaseSession = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (sessionData?.session) return sessionData.session;
    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError || !refreshed.session) {
      throw new Error("Session expired. Please log in again.");
    }
    return refreshed.session;
  };

  const startPhoneVerification = async () => {
    setPhoneVerifyLoading(true);
    setPhoneVerifyError(null);
    try {
      const session = await ensureSupabaseSession();
      const country = countries.find((c) => c.code === recipient.countryCode);
      const dialCode = country ? country.dial_code : "";
      const rawPhone = String(recipient.phone || "").trim();
      const fullPhone = rawPhone.startsWith("+") ? rawPhone : `${dialCode}${rawPhone}`;
      const r = await fetch("/api/twilio/verify/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ phone: fullPhone }),
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(text || "Failed to start phone verification");
      }
      setPhoneVerifyDigits(["", "", "", ""]);
      window.setTimeout(() => phoneVerifyInputRefs.current[0]?.focus?.(), 0);
    } catch (e: any) {
      setPhoneVerifyError(e?.message || "Failed to start phone verification");
    } finally {
      setPhoneVerifyLoading(false);
    }
  };

  const confirmPhoneVerification = async () => {
    setPhoneVerifyLoading(true);
    setPhoneVerifyError(null);
    try {
      const session = await ensureSupabaseSession();
      const code = phoneVerifyDigits.join("").trim();
      if (code.length !== 4) throw new Error("Enter the 4-digit code");
      const country = countries.find((c) => c.code === recipient.countryCode);
      const dialCode = country ? country.dial_code : "";
      const rawPhone = String(recipient.phone || "").trim();
      const fullPhone = rawPhone.startsWith("+") ? rawPhone : `${dialCode}${rawPhone}`;
      const r = await fetch("/api/twilio/verify/check", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ phone: fullPhone, code }),
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(text || "Invalid code");
      }
      const payload = await r.json().catch(() => null);
      if (!payload?.ok) throw new Error(payload?.message || "Invalid code");
      setPhoneVerified(true);
      setPhoneVerifyOpen(false);
      setPhoneVerifyDigits(["", "", "", ""]);
      await handleOfflineCheckout();
    } catch (e: any) {
      setPhoneVerifyError(e?.message || "Invalid code");
    } finally {
      setPhoneVerifyLoading(false);
    }
  };

  const getCartFallback = () => {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return { items: [] as any[], total: 0 };
      const parsed = JSON.parse(raw);
      const fallbackItems = Array.isArray(parsed) ? parsed : [];
      const total = fallbackItems.reduce((sum: number, it: any) => {
        const price = String(it?.price || "");
        if (price === "Preorder") return sum;
        const qty = typeof it?.quantity === "number" && Number.isFinite(it.quantity) && it.quantity > 0 ? it.quantity : 1;
        const n = parseFloat(price.replace("$", "").replace(",", ""));
        if (!Number.isFinite(n)) return sum;
        return sum + n * qty;
      }, 0);
      return { items: fallbackItems, total: Math.round(total * 100) / 100 };
    } catch {
      return { items: [] as any[], total: 0 };
    }
  };

  const createOrder = async (params?: { initialStatus?: string; itemsOverride?: any[]; totalOverride?: number }) => {
    if (!contacts.termsAccepted) {
      setError("Please accept the Terms and Conditions.");
      throw new Error("Terms not accepted");
    }
    let orderItems = params?.itemsOverride ?? items;
    let orderTotal = typeof params?.totalOverride === "number" ? params.totalOverride : totalPrice;
    if (!Array.isArray(orderItems) || orderItems.length === 0 || !(typeof orderTotal === "number") || orderTotal <= 0) {
      const fallback = getCartFallback();
      if (Array.isArray(fallback.items) && fallback.items.length > 0 && fallback.total > 0) {
        orderItems = fallback.items;
        orderTotal = fallback.total;
      }
    }
    if (!Array.isArray(orderItems) || orderItems.length === 0 || !(typeof orderTotal === "number") || orderTotal <= 0) {
      setError("Your cart is empty. Please add items before checkout.");
      throw new Error("Cart is empty");
    }
    
    if (!user) throw new Error("User not logged in");

    await ensureSupabaseSession();

    const isProduction = import.meta.env.PROD;

    const country = countries.find((c) => c.code === recipient.countryCode);
    const dialCode = country ? country.dial_code : "";
    const rawPhone = String(recipient.phone || "").trim();
    const fullPhone = rawPhone.startsWith("+") ? rawPhone : `${dialCode}${rawPhone}`;

    if (isProduction) {
      const payload = {
        user_id: user.id,
        items: orderItems,
        total_amount: orderTotal,
        status: params?.initialStatus || "New",
        customer_name: `${recipient.firstName} ${recipient.lastName}`.trim(),
        customer_phone: fullPhone,
        customer_address: `${shipping.street}${shipping.buildingName ? `, ${shipping.buildingName}` : ''}${shipping.flat ? `, ${shipping.flat}` : ''}, ${shipping.city}, ${shipping.zipCode}, ${shipping.country}`,
        recipient_info: recipient,
        shipping_address: shipping,
        contacts: { ...contacts, paymentMethod },
      };
      try {
        const r = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload })
        });
        if (r.ok) {
          const { order } = await r.json();
          return order;
        }
        // serverless failed, fall back to client supabase
      } catch (_) {
        // ignore and fall back
      }
    } else {
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          items: orderItems,
          total_amount: orderTotal,
          status: params?.initialStatus || "New",
          customer_name: `${recipient.firstName} ${recipient.lastName}`.trim(),
          customer_phone: fullPhone,
          customer_address: `${shipping.street}${shipping.buildingName ? `, ${shipping.buildingName}` : ''}${shipping.flat ? `, ${shipping.flat}` : ''}, ${shipping.city}, ${shipping.zipCode}, ${shipping.country}`,
          recipient_info: recipient,
          shipping_address: shipping,
          contacts: { ...contacts, paymentMethod },
        })
        .select()
        .single();
      if (insertError) throw insertError;
      if (!data) throw new Error("Failed to create order.");
      return data;
    }
    // Fallback path when serverless failed: create order via client supabase
    const { data, error: insertError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        items: orderItems,
        total_amount: orderTotal,
        status: params?.initialStatus || "New",
        customer_name: `${recipient.firstName} ${recipient.lastName}`.trim(),
        customer_phone: fullPhone,
        customer_address: `${shipping.street}${shipping.buildingName ? `, ${shipping.buildingName}` : ''}${shipping.flat ? `, ${shipping.flat}` : ''}, ${shipping.city}, ${shipping.zipCode}, ${shipping.country}`,
        recipient_info: recipient,
        shipping_address: shipping,
        contacts: { ...contacts, paymentMethod },
      })
      .select()
      .single();
    if (insertError) throw insertError;
    if (!data) throw new Error("Failed to create order.");
    return data;
  };

  const sendOrderToCrm = async (order: any) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const resSrv = await fetch('/api/retailcrm/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    if (resSrv.ok) return;
    if (apiBase) {
      const resApi = await fetch(`${apiBase}/api/retailcrm/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
      if (!resApi.ok) {
        const text = await resApi.text();
        throw new Error(text || 'RetailCRM request failed');
      }
      return;
    }
    const text = await resSrv.text();
    throw new Error(text || 'RetailCRM request failed');
  };

  const handleCardCheckout = async (e?: any) => {
    e?.preventDefault?.();
    setLoading(true);
    setError(null);

    try {
      const order = await createOrder();

      try {
        await sendOrderToCrm(order);
      } catch (crmErr) {
        console.error('RetailCRM send error:', crmErr);
        if (!error) setError('Ошибка отправки заказа в CRM');
      }

      // Initiate Stripe Checkout Session
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        // Try serverless Stripe
        let response = await fetch('/api/checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        });
        if (!response.ok && apiBase) {
          // Fallback to backend Express
          response = await fetch(`${apiBase}/api/checkout/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.id }),
          });
        }
        if (!response.ok) {
          const text = await response.text();
          setError(text || 'Не удалось инициировать оплату');
          throw new Error(text || 'Failed to initiate payment');
        }

        const { url } = await response.json();
        if (url) {
          clearCart();
          localStorage.removeItem('checkout_recipient');
          localStorage.removeItem('checkout_shipping');
          localStorage.removeItem('checkout_contacts');
          window.location.href = url;
          return;
        } else {
          setError('Платёжная страница недоступна (url пустой)');
        }
      } catch (paymentError) {
        console.error('Payment initiation error:', paymentError);
        clearCart();
        localStorage.removeItem('checkout_recipient');
        localStorage.removeItem('checkout_shipping');
        localStorage.removeItem('checkout_contacts');
        setError('Ошибка запуска оплаты. Заказ сохранён, откройте детали заказа.');
        navigate(`/orders/${order.id}`);
        return;
      }
    } catch (err: any) {
      if (err.message !== "Terms not accepted") {
        console.error("Checkout error:", err);
        setError(err.message || "Failed to complete checkout.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      const session = await ensureSupabaseSession();
      const details = await actions.order.capture();
      // Update order status in Supabase
      // We need the order ID. Since createOrder returned it to PayPal createOrder, 
      // we might need to store it or retrieve it from details/context.
      // Actually, createOrder (below) creates the Supabase order.
      // But we don't have easy access to that ID here unless we store it in state or use a ref.
      
      // Alternative: We can search for the order by some reference or rely on webhooks.
      // But for client-side, let's use a ref to store the current order ID.
      if (currentOrderId.current) {
          const paidAtIso = new Date().toISOString();
          await supabase
            .from("orders")
            .update({
              status: "Paid",
              payment_details: details,
              contacts: { ...contacts, paymentMethod, payment: { provider: "paypal", status: "paid", paidAt: paidAtIso } },
            })
            .eq("id", currentOrderId.current);

          try {
            await fetch('/api/retailcrm/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
              body: JSON.stringify({
                orderId: currentOrderId.current,
                provider: 'paypal',
                paymentId: String(details?.id || ''),
                amount: Number(totalPrice.toFixed(2)),
                paidAt: paidAtIso,
              }),
            });
          } catch (_) {}
            
          clearCart();
          localStorage.removeItem('checkout_recipient');
          localStorage.removeItem('checkout_shipping');
          localStorage.removeItem('checkout_contacts');
          navigate("/orders");
      }
    } catch (err) {
      console.error("PayPal capture error", err);
      setError("Payment failed");
    }
  };
  
  const currentOrderId = React.useRef<string | null>(null);

  const handleOfflineCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await ensureSupabaseSession();
      const isNoPayment = paymentMethod === "no_payment";
      const order = await createOrder({ initialStatus: "Awaiting payment" });

      try {
        await sendOrderToCrm(order);
      } catch (crmErr) {
        console.error("RetailCRM send error:", crmErr);
      }

      if (isNoPayment || hasPreorder) {
        try {
          await fetch("/api/clicksend/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({
              orderId: order.id,
              reason: isNoPayment ? "no_payment" : "preorder",
            }),
          });
        } catch (_) {}
      }

      clearCart();
      localStorage.removeItem("checkout_recipient");
      localStorage.removeItem("checkout_shipping");
      localStorage.removeItem("checkout_contacts");
      navigate("/orders", { state: { tab: "active" } });
    } catch (e: any) {
      setError(e?.message || "Failed to complete checkout");
    } finally {
      setLoading(false);
    }
  };
  const selectedCountry = useMemo(() => {
    return countries.find((c) => c.code === recipient.countryCode) ?? countries[0];
  }, [recipient.countryCode]);
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!countryOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.(".country-dropdown")) return;
      setCountryOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [countryOpen]);

  const totalQty = useMemo(() => items.reduce((acc, it) => acc + (typeof it.quantity === 'number' ? it.quantity : 1), 0), [items]);

  const parseMoney = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const s = String(value || '').trim();
    if (!s) return null;
    const normalized = s.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    const n = Number.parseFloat(normalized);
    return Number.isFinite(n) ? n : null;
  };

  return (
    <>
      <Header variant="white" />
      <div className="checkout-page">
        <div className="checkout-container">
          {/* Desktop Title & Order Summary Row */}
          <div className="checkout-header-desktop">
            <Link to="/cart" className="checkout-back-link">
              <span className="checkout-back-icon">‹</span> Back to cart
            </Link>
            <h1 className="checkout-title" style={{ margin: 0 }}>
              Checkout
            </h1>
          </div>

          {/* Mobile Header Row: Back to cart + Order Summary */}
          <div className="checkout-header-mobile">
            <Link to="/cart" className="back-link">
              <span style={{ marginRight: '8px' }}>‹</span> Back to cart
            </Link>
            <div className="mobile-order-summary">
              ${totalPrice.toFixed(2)} ({items.length})
            </div>
          </div>
          
          {/* Mobile Title */}
          <h1 className="checkout-title-mobile">Checkout</h1>
          
          <div className="quick-fill-container">
            <button onClick={fillTestValues} style={{ padding: '8px 16px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
              ⚡️ Quick Fill (Test)
            </button>
          </div>
          
          {error && <div className="inline-error" style={{marginBottom: '20px', maxWidth: '480px', margin: '0 auto 20px auto', textAlign: 'center'}}>{error}</div>}

          <div className="checkout-grid">
            <div className="checkout-left-panel">
          <div className="checkout-content">
            {/* Step 1: Recipient Information */}
            <div className={`checkout-step ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="checkout-step-header" onClick={() => setStep(1)}>
                <div className="step-number">1</div>
                <div className="checkout-step-header-main">
                  <h2 className="step-title">Contact</h2>
                  {step > 1 ? (
                    <div className="checkout-step-header-summary">
                      <div className="checkout-step-header-summary-line">
                        {`${recipient.firstName} ${recipient.lastName}`.trim()}
                      </div>
                      <div className="checkout-step-header-summary-line">
                        {`${selectedCountry?.dial_code || ''} ${recipient.phone}`.trim()}
                      </div>
                      <div className="checkout-step-header-summary-line">{recipient.email}</div>
                    </div>
                  ) : null}
                </div>
                {step > 1 ? (
                  <button type="button" className="checkout-step-change" onClick={() => setStep(1)}>
                    Change
                  </button>
                ) : null}
              </div>
              
              <div className="checkout-step-content">
                <form onSubmit={goToStep2} className="checkout-form-grid checkout-form-grid--two-col">
                  <input
                    name="firstName"
                    placeholder="First name"
                    value={recipient.firstName}
                    onChange={handleRecipientChange}
                    required
                    className="checkout-input"
                  />
                  <input
                    name="lastName"
                    placeholder="Last name"
                    value={recipient.lastName}
                    onChange={handleRecipientChange}
                    required
                    className="checkout-input"
                  />
                  <div className="phone-input-group">
                    <div className="country-dropdown" ref={countryDropdownRef}>
                      <button
                        type="button"
                        className="country-dropdown-trigger"
                        aria-haspopup="listbox"
                        aria-expanded={countryOpen}
                        onClick={() => setCountryOpen((v) => !v)}
                      >
                        <span className="country-dropdown-flag">{selectedCountry?.flag}</span>
                        <span className="country-dropdown-caret">▾</span>
                      </button>
                      {countryOpen ? (
                        <div className="country-dropdown-menu" role="listbox">
                          {sortedCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              className="country-dropdown-item"
                              role="option"
                              aria-selected={c.code === recipient.countryCode}
                              onClick={() => {
                                setRecipient((prev) => ({ ...prev, countryCode: c.code }));
                                setCountryOpen(false);
                              }}
                            >
                              <span className="country-dropdown-name">{c.name}</span>
                              <span className="country-dropdown-dial">{c.dial_code}</span>
                              <span className="country-dropdown-flag-right">{c.flag}</span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="phone-input-wrap">
                      <div className="phone-prefix">{selectedCountry?.dial_code}</div>
                    <input
                      name="phone"
                      placeholder="Phone number"
                      value={recipient.phone}
                      onChange={handleRecipientChange}
                      required
                      className="phone-input phone-input--with-prefix"
                      type="tel"
                    />
                    </div>
                  </div>
                  <input
                    name="email"
                    placeholder="E-mail"
                    value={recipient.email}
                    onChange={handleRecipientChange}
                    required
                    className="checkout-input"
                    type="email"
                  />
                  <button type="submit" className="checkout-next-btn checkout-next-btn--small">
                    Continue
                  </button>
                </form>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className={`checkout-step ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="checkout-step-header" onClick={() => step > 1 && setStep(2)}>
                <div className="step-number">2</div>
                <div className="checkout-step-header-main">
                  <div className="checkout-step-header-top">
                    <h2 className="step-title">Shipping address</h2>
                    <div className="checkout-step-header-actions">
                      {step > 2 ? (
                        <button type="button" className="checkout-step-change" onClick={() => setStep(2)}>
                          Change
                        </button>
                      ) : null}
                      {step === 2 ? (
                        <div className="checkout-shipping-logos" aria-hidden="true">
                          <svg width="35" height="20" viewBox="0 0 35 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18.9278 16.2903L21.6004 19.2876H27.3728L21.8764 13.141L27.2975 7.04397H21.7501L19.1523 10.0183L16.4526 7.04397H10.7042H4.5341V4.29916H10.7042V0H0V19.2876H10.7042H16.2786L18.9278 16.2903ZM16.1523 13.1667L10.7042 19.2876V14.9776H4.5341V11.1808H10.7042V7.04397L16.1523 13.1667Z"
                              fill="#FF5A00"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M31.4622 18.7509V17.4933L31.4645 17.4942V17.4928H31.859C32.1282 17.4928 32.2536 17.5785 32.3249 17.8134C32.3622 17.9475 32.3813 18.0928 32.4 18.2357C32.4244 18.4221 32.4482 18.6043 32.5115 18.7518H32.9922C32.9159 18.6646 32.8689 18.3323 32.8337 18.0834C32.8281 18.0439 32.8228 18.0066 32.8177 17.9726C32.7695 17.5898 32.6833 17.3805 32.4489 17.3431V17.3314C32.719 17.2958 32.9286 17.05 32.9286 16.7398C32.9286 16.2361 32.6572 15.9777 32.0656 15.9777H31.0559V18.7509H31.4622ZM32.4732 16.7393C32.4732 16.9246 32.3605 17.1348 31.9659 17.1348V17.1357H31.4622V16.347H31.9659C32.3605 16.347 32.4732 16.5202 32.4732 16.7393Z"
                              fill="#FF5A00"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M31.9528 15.0993C30.7218 15.0993 29.6346 16.025 29.6346 17.3945C29.6346 18.7613 30.7218 19.6879 31.9528 19.6879C33.1879 19.6879 34.2733 18.7613 34.2733 17.3945C34.2733 16.025 33.1875 15.0993 31.9528 15.0993ZM31.9546 15.469C33.0405 15.469 33.8287 16.283 33.8287 17.3945C33.8287 18.5029 33.0405 19.3168 31.9546 19.3168C30.8706 19.3168 30.0815 18.5043 30.0815 17.3945C30.0815 16.283 30.8706 15.469 31.9546 15.469Z"
                              fill="#FF5A00"
                            />
                          </svg>
                          <svg width="44" height="28" viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_2459_91784)">
                              <path d="M0 0.000976562H43.9972V28.001H0V0.000976562Z" fill="#FFCB01" />
                              <path d="M8.9984 12.9662L6.26134 16.676H12.9359C15.1383 16.676 16.3668 15.1816 16.7442 14.6642H12.1952C11.6184 14.6642 11.7926 14.4279 11.889 14.298L12.582 13.3566C12.7655 13.1081 12.7702 12.9662 12.3947 12.9662H8.9984Z" fill="#D80613" />
                              <path d="M20.4504 16.676L21.9346 14.6632H18.0196L16.5354 16.676H20.4504Z" fill="#D80613" />
                              <path d="M18.3567 14.2074H27.9313L30.5494 10.6602H26.6362L25.1343 12.6944H23.3879L24.888 10.6602H20.9748L18.3567 14.2074Z" fill="#D80613" />
                              <path d="M26.1109 16.676L27.5951 14.6632H23.6819L22.1977 16.676H26.1109Z" fill="#D80613" />
                              <path d="M6.44206 15.4571H0.675781V15.8839H6.12744L6.44206 15.4571Z" fill="#D80613" />
                              <path d="M7.02824 14.6632H0.675781V15.0901H6.71268L7.02824 14.6632Z" fill="#D80613" />
                              <path d="M5.85682 16.251H0.675781V16.676H5.54313L5.85682 16.251Z" fill="#D80613" />
                              <path d="M37.5761 15.8839H43.3217V15.4571H37.8916L37.5761 15.8839Z" fill="#D80613" />
                              <path d="M36.9927 16.676H43.3217V16.251H37.3054L36.9927 16.676Z" fill="#D80613" />
                              <path d="M43.3217 14.6632H38.4769L38.1622 15.091H43.3217V14.6632Z" fill="#D80613" />
                              <path d="M33.3511 14.2074L35.9692 10.6602H31.8238L29.2038 14.2074H33.3511Z" fill="#D80613" />
                              <path d="M28.4435 15.2404C28.583 15.0536 28.8686 14.6632 28.8686 14.6632H37.7596L36.2754 16.675H29.9904C28.3863 16.675 27.9528 15.9036 28.4435 15.2404Z" fill="#D80613" />
                              <path d="M6.81344 12.5066L8.17588 10.6602L16.0341 10.6611C18.0295 10.6611 18.5389 12.233 17.9808 12.9886L17.0809 14.2084H14.0442C13.4674 14.2084 13.6416 13.9721 13.738 13.8423C13.8353 13.7109 13.9644 13.5326 14.0922 13.356C14.2143 13.1873 14.3353 13.0202 14.4263 12.8971C14.6098 12.6477 14.6145 12.5066 14.239 12.5066H6.81344Z" fill="#D80613" />
                            </g>
                            <defs>
                              <clipPath id="clip0_2459_91784">
                                <rect width="44" height="28" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="checkout-step-desc">We ship by DHL or FedEx</div>
                </div>
              </div>
              
              <div className="checkout-step-content">
                <form onSubmit={goToStep3} className="checkout-form-grid checkout-form-grid--two-col">
                  <CountryCombobox
                    value={shipping.country}
                    onChange={(v) => setShipping((prev) => ({ ...prev, country: v }))}
                    placeholder="Country"
                    className="country-combobox-field"
                    required
                  />
                  <input
                    name="zipCode"
                    placeholder="Postcode"
                    value={shipping.zipCode}
                    onChange={handleShippingChange}
                    required
                    className="checkout-input"
                  />
                  <select
                    name="region"
                    value={(shipping as any).region || ''}
                    onChange={handleShippingChange}
                    className="checkout-input checkout-select"
                  >
                    <option value="" disabled>
                      State
                    </option>
                    <option value="">State</option>
                  </select>
                  <input
                    name="city"
                    placeholder="City"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    required
                    className="checkout-input"
                  />
                  <input
                    name="street"
                    placeholder="Street address"
                    value={shipping.street}
                    onChange={handleShippingChange}
                    required
                    className="checkout-input"
                  />
                  <div className="checkout-field-group">
                    <input
                      name="buildingName"
                      placeholder="Apt, office, building"
                      value={shipping.buildingName}
                      onChange={handleShippingChange}
                      className="checkout-input"
                    />
                    <div className="checkout-field-hint">Optional</div>
                  </div>
                  
                  <button type="submit" className="checkout-next-btn">
                    Continue
                  </button>
                </form>
              </div>
            </div>

            {/* Step 3: Contacts */}
            <div className={`checkout-step ${step === 3 ? 'active' : ''}`}>
              <div className="checkout-step-header" onClick={() => step > 2 && setStep(3)}>
                <div className="step-number">3</div>
                <h2 className="step-title">Payment</h2>
              </div>
              
              <div className="checkout-step-content">
                <div className="checkout-form-grid">
                  <div className="checkout-payment-options">
                    {!hasPreorder ? (
                      <>
                        <button
                          type="button"
                          className={`checkout-payment-tile ${paymentMethod === "card" ? "checkout-payment-tile--active" : ""}`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <div className="checkout-payment-tile-icon" aria-hidden="true">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </div>
                          <div className="checkout-payment-tile-label">Credit card</div>
                          <div className="checkout-payment-tile-sub">Stripe</div>
                        </button>

                        <button
                          type="button"
                          className={`checkout-payment-tile ${paymentMethod === "paypal" ? "checkout-payment-tile--active" : ""}`}
                          onClick={() => setPaymentMethod("paypal")}
                        >
                          <div className="checkout-payment-tile-icon" aria-hidden="true">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18.6364 7.21293C18.8701 5.68888 18.6364 4.67285 17.8182 3.73497C16.9222 2.67986 15.2859 2.25 13.1822 2.25H7.14363C6.71509 2.25 6.36446 2.56263 6.28654 2.99248L3.75425 19.0145C3.71529 19.3272 3.94904 19.6007 4.26071 19.6007H8.00072L7.72801 21.242C7.68905 21.5155 7.88384 21.75 8.19551 21.75H11.3511C11.7407 21.75 12.0524 21.4765 12.0913 21.1247L12.7536 16.9825C12.7926 16.6308 13.1432 16.3572 13.4939 16.3572H13.9614C17.0001 16.3572 19.4155 15.1067 20.1168 11.5115C20.3895 10.0266 20.2726 8.73697 19.4934 7.87725C19.2597 7.60371 18.987 7.40832 18.6364 7.21293" fill="currentColor" />
                              <path d="M18.6364 7.21293C18.8701 5.68888 18.6364 4.67285 17.8182 3.73497C16.9222 2.67986 15.2859 2.25 13.1822 2.25H7.14363C6.71509 2.25 6.36446 2.56263 6.28654 2.99248L3.75425 19.0145C3.71529 19.3272 3.94904 19.6007 4.26071 19.6007H8.00071L8.89676 13.8171C8.97468 13.3873 9.3253 13.0746 9.75384 13.0746H11.5459C15.0522 13.0746 17.7793 11.6678 18.5584 7.52555C18.5974 7.44739 18.5974 7.33016 18.6364 7.21293Z" fill="currentColor" />
                              <path d="M9.94864 7.252C9.98759 6.97846 10.3382 6.62675 10.6888 6.62675H15.4418C15.9872 6.62675 16.5326 6.66583 17.0001 6.74399C17.4286 6.82214 18.2078 7.01753 18.5974 7.252C18.8312 5.72796 18.5974 4.71192 17.7793 3.77405C16.9222 2.67986 15.2859 2.25 13.1822 2.25H7.14363C6.71509 2.25 6.36446 2.56263 6.28654 2.99248L3.75425 19.0145C3.71529 19.3272 3.94904 19.6007 4.26071 19.6007H8.00071L9.94864 7.252V7.252Z" fill="currentColor" />
                            </svg>
                          </div>
                          <div className="checkout-payment-tile-label">PayPal</div>
                        </button>
                      </>
                    ) : null}

                    <button
                      type="button"
                      className={`checkout-payment-tile ${paymentMethod === "bank" ? "checkout-payment-tile--active" : ""}`}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <div className="checkout-payment-tile-icon" aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 10.25H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M6 18.25V10.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M10 18.25V10.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M14 18.25V10.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M18 18.25V10.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M3.5 18.25H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M4.5 9.75L12 5.75L19.5 9.75" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="checkout-payment-tile-label">Bank transfer</div>
                    </button>

                    <button
                      type="button"
                      className={`checkout-payment-tile ${paymentMethod === "crypto" ? "checkout-payment-tile--active" : ""}`}
                      onClick={() => setPaymentMethod("crypto")}
                    >
                      <div className="checkout-payment-tile-icon" aria-hidden="true">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.84615 5.25V6.75H6.75C6.33579 6.75 6 7.08579 6 7.5C6 7.91421 6.33579 8.25 6.75 8.25H7.5V13.75H6.75C6.33579 13.75 6 14.0858 6 14.5C6 14.9142 6.33579 15.25 6.75 15.25H9V16.75C9 17.1642 9.33579 17.5 9.75 17.5C10.1642 17.5 10.5 17.1642 10.5 16.75V15.25H12.1538V16.75C12.1538 17.1642 12.4896 17.5 12.9038 17.5C13.3181 17.5 13.6538 17.1642 13.6538 16.75V15.25H13.5C14.8807 15.25 16 14.1307 16 12.75C16 12.0686 15.7274 11.4509 15.2854 11C15.7274 10.5491 16 9.93136 16 9.25C16 7.86929 14.8807 6.75 13.5 6.75V5.25C13.5 4.83579 13.1642 4.5 12.75 4.5C12.3358 4.5 12 4.83579 12 5.25V6.75H10.3462V5.25C10.3462 4.83579 10.0104 4.5 9.59615 4.5C9.18194 4.5 8.84615 4.83579 8.84615 5.25ZM13.5 10.25H9V8.25H13.5C14.0523 8.25 14.5 8.69772 14.5 9.25C14.5 9.80228 14.0523 10.25 13.5 10.25ZM9 13.75V11.75H13.5C14.0523 11.75 14.5 12.1977 14.5 12.75C14.5 13.3023 14.0523 13.75 13.5 13.75H9Z"
                            fill="currentColor"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM20.5 11C20.5 16.2467 16.2467 20.5 11 20.5C5.75329 20.5 1.5 16.2467 1.5 11C1.5 5.75329 5.75329 1.5 11 1.5C16.2467 1.5 20.5 5.75329 20.5 11Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div className="checkout-payment-tile-label">Crypto</div>
                    </button>

                    <button
                      type="button"
                      className={`checkout-payment-tile ${paymentMethod === "no_payment" ? "checkout-payment-tile--active" : ""}`}
                      onClick={() => setPaymentMethod("no_payment")}
                    >
                      <div className="checkout-payment-tile-icon" aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M1.46967 1.46967C1.76256 1.17678 2.23744 1.17678 2.53033 1.46967L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.6893 19.75H4C2.48122 19.75 1.25 18.5188 1.25 17V7C1.25 5.72904 2.11219 4.65946 3.28359 4.34425L1.46967 2.53033C1.17678 2.23744 1.17678 1.76256 1.46967 1.46967ZM4.68934 5.75H4C3.30964 5.75 2.75 6.30964 2.75 7V9.25H8.18934L4.68934 5.75ZM9.68934 10.75H2.75V17C2.75 17.6904 3.30964 18.25 4 18.25H17.1893L9.68934 10.75Z" fill="currentColor" />
                          <path d="M22.75 7V17.5C22.75 17.9142 22.4142 18.25 22 18.25C21.5858 18.25 21.25 17.9142 21.25 17.5V10.75H14.5C14.0858 10.75 13.75 10.4142 13.75 10C13.75 9.58579 14.0858 9.25 14.5 9.25H21.25V7C21.25 6.30964 20.6904 5.75 20 5.75H9.5C9.08579 5.75 8.75 5.41421 8.75 5C8.75 4.58579 9.08579 4.25 9.5 4.25H20C21.5188 4.25 22.75 5.48122 22.75 7Z" fill="currentColor" />
                        </svg>
                      </div>
                      <div className="checkout-payment-tile-label">No payment</div>
                    </button>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="checkout-payment-hint">
                      Payment via MasterCard, Visa, American Express, UnionPay, JCB, Apple Pay and Google Pay.
                      <br />
                      You&nbsp;will be redirected to the payment provider
                    </div>
                  ) : paymentMethod === "paypal" ? (
                    <div className="checkout-payment-hint">Payment via PayPal wallet</div>
                  ) : paymentMethod === "crypto" ? (
                    <div className="checkout-payment-hint">
                      You will be redirected to the payment provider. You can pay via USDT, BTC or ETH
                    </div>
                  ) : null}

                  {hasPreorder ? (
                    <div className="checkout-preorder-note">
                      <div className="checkout-preorder-note-icon" aria-hidden="true">
                        i
                      </div>
                      <div className="checkout-preorder-note-text">
                        All goods in the cart, are available only for pre-order. We don&apos;t charge pre-payment for pre-orders. We&nbsp;will contact you for confirmation when the goods will be in stock and agree on payment and delivery methods.
                      </div>
                    </div>
                  ) : null}

                  {paymentMethod === "no_payment" ? (
                    <>
                      <div className="checkout-no-payment-note">
                        Placing an order without payment. Please describe the reason
                      </div>
                      <input
                        name="reason"
                        placeholder="Reason"
                        value={contacts.reason || ""}
                        onChange={handleContactsChange}
                        className="checkout-input checkout-reason-input"
                      />
                      <textarea
                        name="comment"
                        placeholder="Comment"
                        value={contacts.comment}
                        onChange={handleContactsChange}
                        className="checkout-input checkout-textarea checkout-comment-textarea"
                      />
                    </>
                  ) : (
                    <textarea
                      name="comment"
                      placeholder="Comment"
                      value={contacts.comment}
                      onChange={handleContactsChange}
                      className="checkout-input checkout-textarea checkout-comment-textarea"
                    />
                  )}
                  <div className="checkout-field-hint">Optional</div>

                  <div className="terms-checkbox">
                    <label className="checkbox-container">
                      <input type="checkbox" checked={contacts.termsAccepted} onChange={handleTermsChange} id="terms" />
                      <span className="checkmark"></span>
                      <span style={{ fontSize: "14px", color: "#222" }}>
                        By placing an order you agree to the <Link to="/terms" className="terms-link">Terms and Conditions</Link>
                      </span>
                    </label>
                  </div>

                </div>
              </div>
            </div>
          </div>
          </div>
          <aside className="checkout-right-panel">
            <div className="checkout-summary">
              <div className="checkout-summary-head">
                <div className="checkout-summary-title">Order summary</div>
                <button type="button" className="checkout-summary-edit" onClick={() => navigate('/cart')}>
                  Edit
                </button>
              </div>

              <div className="checkout-summary-items">
                {items.map((it: any) => {
                  const unit = parseMoney(it?.price);
                  const qty = typeof it?.quantity === 'number' && it.quantity > 0 ? it.quantity : 1;
                  const lineTotal = unit != null ? unit * qty : null;
                  return (
                    <div key={it.id} className="checkout-summary-item">
                      <div className="checkout-summary-item-img">
                        {it.image ? <img src={it.image} alt={it.title} /> : <div className="checkout-summary-item-img-placeholder" />}
                      </div>
                      <div className="checkout-summary-item-main">
                        <div className="checkout-summary-item-title">{it.title}</div>
                        <div className="checkout-summary-item-meta">
                          {unit != null ? `$${unit.toFixed(2)} x ${qty}` : it.price}
                        </div>
                        {it.isPreorder ? <div className="checkout-summary-item-note">Pre-order. Waiting time ~ 7 months</div> : null}
                      </div>
                      <div className="checkout-summary-item-price">{lineTotal != null ? `$${lineTotal.toFixed(2)}` : null}</div>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-summary-sep" />

              <div className="checkout-summary-promo">
                <input
                  className="checkout-summary-input"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                />
                <button type="button" className="checkout-summary-activate">
                  Activate
                </button>
              </div>

              <div className="checkout-summary-rows">
                <div className="checkout-summary-row">
                  <div className="checkout-summary-label">Quantity</div>
                  <div className="checkout-summary-value">{totalQty}</div>
                </div>
                <div className="checkout-summary-row">
                  <div className="checkout-summary-label">Subtotal</div>
                  <div className="checkout-summary-value">${totalPrice.toFixed(2)}</div>
                </div>
                <div className="checkout-summary-row">
                  <div className="checkout-summary-label">Tax</div>
                  <div className="checkout-summary-value checkout-summary-value-muted">Enter country</div>
                </div>
                <div className="checkout-summary-row">
                  <div className="checkout-summary-label">Shipping</div>
                  <div className="checkout-summary-value checkout-summary-value-muted">Enter shipping address</div>
                </div>
                <div className="checkout-summary-row checkout-summary-row-total">
                  <div className="checkout-summary-label">Total</div>
                  <div className="checkout-summary-total">${totalPrice.toFixed(2)}</div>
                </div>
              </div>

              {step === 3 ? (
                <div className="checkout-summary-action">
                  {paymentMethod === "paypal" && !hasPreorder ? (
                    <div className="checkout-paypal-wrap">
                      <PayPalScriptProvider options={{ clientId: "AR6kjBY5YEabbcJwBNE6cdoyichfDV8GFZCBV6b8K10d8HiH1X6ZuE_ttf-oj-FAZvrLVFw-LDGkVv_P", currency: "USD" }}>
                        <PayPalButtons
                          style={{ layout: "horizontal", color: "gold", shape: "rect", label: "paypal", height: 44, tagline: false }}
                          createOrder={async (_data, actions) => {
                            const snap = cartSnapshotRef.current;
                            const order = await createOrder({ itemsOverride: snap.items, totalOverride: snap.totalPrice });
                            currentOrderId.current = order.id;
                            try {
                              await sendOrderToCrm(order);
                            } catch (e) {
                              console.error("RetailCRM send error:", e);
                            }
                            return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [
                                {
                                  description: `Order ${String(order.id).slice(0, 12)}`,
                                  amount: { currency_code: "USD", value: Number(order.total_amount).toFixed(2) },
                                },
                              ],
                            });
                          }}
                          onApprove={handlePayPalApprove}
                          onError={(err: any) => {
                            console.error("PayPal error:", err);
                            setError(`PayPal payment failed: ${err.message || JSON.stringify(err)}`);
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="checkout-pay-btn"
                      disabled={
                        loading ||
                        !items.length ||
                        totalPrice <= 0 ||
                        !contacts.termsAccepted ||
                        (hasPreorder && paymentMethod !== "bank" && paymentMethod !== "no_payment")
                      }
                      onClick={() => {
                        if (paymentMethod === "card") {
                          void handleCardCheckout();
                          return;
                        }
                        if (paymentMethod === "no_payment") {
                          if (phoneVerified) {
                            void handleOfflineCheckout();
                            return;
                          }
                          setPhoneVerifyOpen(true);
                          void startPhoneVerification();
                          return;
                        }
                        void handleOfflineCheckout();
                      }}
                    >
                      {loading ? "Processing..." : "Pay"}
                    </button>
                  )}
                </div>
              ) : null}

            </div>
          </aside>
          </div>
        </div>
      </div>
      {phoneVerifyOpen ? (
        <div className="checkout-modal-overlay" role="dialog" aria-modal="true">
          <div className="checkout-modal">
            <div className="checkout-modal-head">
              <div className="checkout-modal-title">Confirm your phone</div>
              <button
                type="button"
                className="checkout-modal-close"
                onClick={() => {
                  setPhoneVerifyOpen(false);
                  setPhoneVerifyError(null);
                  setPhoneVerifyDigits(["", "", "", ""]);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="checkout-modal-desc">
              Enter the code from the SMS sent to the number{" "}
              <span className="checkout-modal-phone">{recipient.phone || ""}</span>{" "}
              <button
                type="button"
                className="checkout-modal-change"
                onClick={() => {
                  setPhoneVerifyOpen(false);
                  setPhoneVerifyError(null);
                  setPhoneVerifyDigits(["", "", "", ""]);
                  setStep(1);
                  window.scrollTo(0, 0);
                }}
              >
                Change
              </button>
            </div>
            <div className="checkout-otp">
              {phoneVerifyDigits.map((d, idx) => (
                <input
                  key={idx}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="checkout-otp-input"
                  value={d}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d]/g, "").slice(0, 1);
                    setPhoneVerifyDigits((prev) => {
                      const next = [...prev];
                      next[idx] = v;
                      return next;
                    });
                    if (v && idx < phoneVerifyDigits.length - 1) {
                      phoneVerifyInputRefs.current[idx + 1]?.focus?.();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !phoneVerifyDigits[idx] && idx > 0) {
                      phoneVerifyInputRefs.current[idx - 1]?.focus?.();
                    }
                    if (e.key === "Enter") {
                      void confirmPhoneVerification();
                    }
                  }}
                  ref={(el) => {
                    phoneVerifyInputRefs.current[idx] = el;
                  }}
                />
              ))}
            </div>
            {phoneVerifyError ? <div className="checkout-modal-error">{phoneVerifyError}</div> : null}
            <div className="checkout-modal-actions">
              <button type="button" className="checkout-modal-resend" onClick={() => void startPhoneVerification()} disabled={phoneVerifyLoading}>
                Submit new code
              </button>
              <button type="button" className="checkout-modal-submit" onClick={() => void confirmPhoneVerification()} disabled={phoneVerifyLoading}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
