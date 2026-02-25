import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { countries } from "../data/countries";

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
  zipCode: string;
  city: string;
  street: string;
  flat?: string;
}

interface ContactsInfo {
  telegram?: string;
  whatsapp?: string;
  comment?: string;
  termsAccepted: boolean;
}

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
    flat: "",
  });

  const [contacts, setContacts] = useState<ContactsInfo>({
    telegram: "",
    whatsapp: "",
    comment: "",
    termsAccepted: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/checkout");
    }
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

  const handleCompleteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contacts.termsAccepted) {
      setError("Please accept the Terms and Conditions.");
      return;
    }
    
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const country = countries.find(c => c.code === recipient.countryCode);
      const dialCode = country ? country.dial_code : "";
      const fullPhone = `${dialCode}${recipient.phone}`;

      const { data, error: insertError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          items: items,
          total_amount: totalPrice,
          status: "New",
          customer_name: `${recipient.firstName} ${recipient.lastName}`.trim(),
          customer_phone: fullPhone,
          customer_address: `${shipping.street} ${shipping.flat ? shipping.flat + ' ' : ''}, ${shipping.city}, ${shipping.zipCode}, ${shipping.country}`,
          recipient_info: recipient,
          shipping_address: shipping,
          contacts: contacts,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error("Failed to create order.");

      // Initiate Stripe Checkout Session
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/checkout/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: data.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to initiate payment');
        }

        const { url } = await response.json();
        if (url) {
          clearCart();
          window.location.href = url;
          return;
        }
      } catch (paymentError) {
        console.error('Payment initiation error:', paymentError);
        // If payment fails to start, we still have the order created
        // Navigate to order detail so user can try again later (if implemented)
        clearCart();
        navigate(`/orders/${data.id}`);
        return;
      }

      clearCart();
      navigate("/orders");
      
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to complete checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header variant="white" />
      <div className="checkout-page">
        <div className="checkout-container">
          <h1 className="checkout-title">Checkout</h1>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <button onClick={fillTestValues} style={{ padding: '8px 16px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
              ⚡️ Quick Fill (Test)
            </button>
          </div>
          
          {error && <div className="auth-error" style={{marginBottom: '20px', maxWidth: '480px', margin: '0 auto 20px auto', textAlign: 'center'}}>{error}</div>}

          <div className="checkout-layout">
            <div className="checkout-stepper-col">
               <img src="/stepper.png" alt="stepper" className="stepper-image" />
            </div>
            
            <div className="checkout-content-col">
              {/* Step 1: Recipient Information */}
              {step === 1 && (
                <div className="step-section">
                  <h2 className="step-title">Recipient information</h2>
                  <form onSubmit={goToStep2} className="checkout-form-grid">
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
                      <select
                        name="countryCode"
                        value={recipient.countryCode}
                        onChange={handleRecipientChange}
                        className="country-select"
                      >
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.dial_code}
                          </option>
                        ))}
                      </select>
                      <input
                        name="phone"
                        placeholder="Phone number"
                        value={recipient.phone}
                        onChange={handleRecipientChange}
                        required
                        className="phone-input"
                        type="tel"
                      />
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
                    <button type="submit" className="checkout-next-btn">
                      Next
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div className="step-section">
                   <div className="step-header-row">
                      <h2 className="step-title">Shipping address</h2>
                      <button type="button" className="step-back-btn" onClick={() => setStep(1)}>Back</button>
                   </div>
                  <form onSubmit={goToStep3} className="checkout-form-grid">
                    <input
                      name="country"
                      placeholder="Country"
                      value={shipping.country}
                      onChange={handleShippingChange}
                      required
                      className="checkout-input"
                    />
                    <input
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={shipping.zipCode}
                      onChange={handleShippingChange}
                      required
                      className="checkout-input"
                    />
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
                      placeholder="Street name and number"
                      value={shipping.street}
                      onChange={handleShippingChange}
                      required
                      className="checkout-input"
                    />
                    <input
                      name="flat"
                      placeholder="Flat / office"
                      value={shipping.flat}
                      onChange={handleShippingChange}
                      className="checkout-input"
                    />
                    <span className="input-hint">Optional</span>
                    
                    <button type="submit" className="checkout-next-btn">
                      Next
                    </button>
                  </form>
                </div>
              )}

              {/* Step 3: Contacts */}
              {step === 3 && (
                <div className="step-section">
                   <div className="step-header-row">
                      <h2 className="step-title">Contacts</h2>
                      <button type="button" className="step-back-btn" onClick={() => setStep(2)}>Back</button>
                   </div>
                  <form onSubmit={handleCompleteCheckout} className="checkout-form-grid">
                    <input
                      name="telegram"
                      placeholder="Telegram"
                      value={contacts.telegram}
                      onChange={handleContactsChange}
                      className="checkout-input"
                    />
                    <span className="input-hint">Optional</span>

                    <input
                      name="whatsapp"
                      placeholder="WhatsApp"
                      value={contacts.whatsapp}
                      onChange={handleContactsChange}
                      className="checkout-input"
                    />
                    <span className="input-hint">Optional</span>

                    <textarea
                      name="comment"
                      placeholder="Comment"
                      value={contacts.comment}
                      onChange={handleContactsChange}
                      className="checkout-input checkout-textarea"
                      style={{ textAlign: 'center' }}
                    />
                    <span className="input-hint">Optional</span>

                    <div className="terms-checkbox">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={contacts.termsAccepted}
                          onChange={handleTermsChange}
                          id="terms"
                        />
                        <span className="checkmark"></span>
                        <span className="checkbox-label" style={{ fontSize: '14px', color: '#666', userSelect: 'none' }}>
                          By placing an order you agree to the <Link to="/terms" className="terms-link" onClick={(e) => e.stopPropagation()}>Terms and Conditions</Link>
                        </span>
                      </label>
                    </div>

                    <button type="submit" className="checkout-next-btn" disabled={loading}>
                      {loading ? "Completing..." : "Complete checkout"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
