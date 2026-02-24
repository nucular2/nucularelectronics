import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

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
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          items: items,
          total_amount: totalPrice,
          status: "New",
          recipient_info: recipient,
          shipping_address: shipping,
          contacts: contacts,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!data) throw new Error("Failed to create order.");

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
          
          {error && <div className="auth-error" style={{marginBottom: '20px', maxWidth: '480px'}}>{error}</div>}

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
                        <option value="US">🇺🇸 +1</option>
                        <option value="RU">🇷🇺 +7</option>
                        <option value="UK">🇬🇧 +44</option>
                        <option value="EU">🇪🇺 +33</option>
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
                    />
                    <span className="input-hint">Optional</span>

                    <div className="terms-checkbox">
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={contacts.termsAccepted}
                          onChange={handleTermsChange}
                          id="terms"
                        />
                        <span className="checkmark"></span>
                      </div>
                      <label htmlFor="terms" style={{cursor: 'pointer'}}>
                        By placing a order you agree to the <a href="/terms" className="terms-link">Terms and Conditions</a>
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
