import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';

interface ProfileData {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  flat: string;
  zip_code: string;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    country: '',
    city: '',
    street: '',
    flat: '',
    zip_code: ''
  });

  // Edit states
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false); // Email usually not editable directly without verification, but UI shows edit
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  // Form states (buffers)
  const [nameForm, setNameForm] = useState({ first_name: '', last_name: '' });
  const [phoneForm, setPhoneForm] = useState('');
  const [emailForm, setEmailForm] = useState('');
  const [addressForm, setAddressForm] = useState({
    country: '',
    city: '',
    street: '',
    flat: '',
    zip_code: ''
  });

  useEffect(() => {
    // TEMPORARY: Allow viewing profile without login for design review
    if (!user) {
      // navigate('/login?redirect=/profile');
      // return;
      console.log('Viewing profile in design mode (not logged in)');
    }

    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        // Mock data for design review
        setProfile({
          first_name: 'Dmitry',
          last_name: 'User',
          phone: '+7 900 123 45 67',
          country: 'Russia',
          city: 'Moscow',
          street: 'Lenina st.',
          flat: '42',
          zip_code: '101000'
        });
        setNameForm({ first_name: 'Dmitry', last_name: 'User' });
        setPhoneForm('+7 900 123 45 67');
        setAddressForm({
          country: 'Russia',
          city: 'Moscow',
          street: 'Lenina st.',
          flat: '42',
          zip_code: '101000'
        });
        setEmailForm('demo@example.com'); // Mock email
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setProfile(data);
        // Initialize forms
        setNameForm({ first_name: data.first_name || '', last_name: data.last_name || '' });
        setPhoneForm(data.phone || '');
        setAddressForm({
          country: data.country || '',
          city: data.city || '',
          street: data.street || '',
          flat: data.flat || '',
          zip_code: data.zip_code || ''
        });
      } else {
        // Try to get from metadata if profile doesn't exist
        const meta = user?.user_metadata || {};
        const initialProfile = {
            first_name: meta.first_name || '',
            last_name: meta.last_name || '',
            phone: '',
            country: '',
            city: '',
            street: '',
            flat: '',
            zip_code: ''
        };
        setProfile(initialProfile);
        setNameForm({ first_name: initialProfile.first_name, last_name: initialProfile.last_name });
      }
      setEmailForm(user?.email || '');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates, updated_at: new Date() });

      if (error) throw error;

      setProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const saveName = async () => {
    await updateProfile(nameForm);
    setEditingName(false);
  };

  const savePhone = async () => {
    await updateProfile({ phone: phoneForm });
    setEditingPhone(false);
  };

  const saveAddress = async () => {
    await updateProfile(addressForm);
    setEditingAddress(false);
  };

  // Email update is tricky with Supabase (requires confirmation). 
  // For now, I'll assume we just update it in profiles table if we want to store it there, 
  // but usually email is in auth.users. 
  // If the user wants to change login email, we need supabase.auth.updateUser({ email: ... })
  const saveEmail = async () => {
    if (emailForm !== user?.email) {
       const { error } = await supabase.auth.updateUser({ email: emailForm });
       if (error) {
         alert('Error updating email: ' + error.message);
         return;
       }
       alert('Check your new email for a confirmation link.');
    }
    setEditingEmail(false);
  };

  const formatAddress = () => {
    const parts = [
      profile.street,
      profile.flat ? `APT ${profile.flat}` : '',
      profile.city,
      profile.zip_code,
      profile.country
    ].filter(Boolean);
    
    if (parts.length === 0) return 'No address set';
    return parts.join(', ');
  };

  return (
    <>
      <Header variant="white" />
      <div className="orders-page"> {/* Reuse orders page layout for sidebar */}
        <div className="orders-container">
          <div className="orders-layout">
            <aside className="orders-sidebar">
              <div className="orders-sidebar-title">Orders</div>
              <nav className="orders-nav">
                <button className="orders-nav-item" onClick={() => navigate("/orders")}>Orders</button>
                <button className="orders-nav-item active">User info</button>
                <button className="orders-nav-item" onClick={() => navigate("/update-password")}>
                  Password
                </button>
                <button className="orders-nav-item logout" onClick={handleSignOut}>
                  Log out
                </button>
              </nav>
            </aside>

            <main className="orders-content">
              <h1 className="orders-title">User info</h1>

              {/* Name Section */}
              <div className="user-info-section">
                <div className="user-info-header">
                  <span className="user-info-label">Name</span>
                  {editingName ? (
                    <button className="user-info-edit-btn cancel" onClick={() => setEditingName(false)}>Cancel</button>
                  ) : (
                    <button className="user-info-edit-btn" onClick={() => setEditingName(true)}>Edit</button>
                  )}
                </div>
                {editingName ? (
                  <div className="user-info-edit-form">
                    <div className="user-info-row">
                      <div className="user-info-field">
                        <input 
                          className="user-info-input" 
                          placeholder="First name"
                          value={nameForm.first_name}
                          onChange={e => setNameForm({...nameForm, first_name: e.target.value})}
                        />
                      </div>
                      <div className="user-info-field">
                        <input 
                          className="user-info-input" 
                          placeholder="Last name"
                          value={nameForm.last_name}
                          onChange={e => setNameForm({...nameForm, last_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <button className="user-info-save-btn" onClick={saveName}>Save</button>
                  </div>
                ) : (
                  <div className="user-info-value">
                    {profile.first_name || profile.last_name 
                      ? `${profile.first_name} ${profile.last_name}`.trim() 
                      : 'Not set'}
                  </div>
                )}
              </div>

              {/* Email Section */}
              <div className="user-info-section">
                <div className="user-info-header">
                  <span className="user-info-label">E-mail (login)</span>
                  {editingEmail ? (
                    <button className="user-info-edit-btn cancel" onClick={() => setEditingEmail(false)}>Cancel</button>
                  ) : (
                    <button className="user-info-edit-btn" onClick={() => setEditingEmail(true)}>Edit</button>
                  )}
                </div>
                {editingEmail ? (
                   <div className="user-info-edit-form">
                    <input 
                      className="user-info-input" 
                      placeholder="E-mail"
                      value={emailForm}
                      onChange={e => setEmailForm(e.target.value)}
                    />
                    <button className="user-info-save-btn" onClick={saveEmail}>Save</button>
                   </div>
                ) : (
                  <div className="user-info-value">{user?.email || 'demo@example.com'}</div>
                )}
              </div>

              {/* Phone Section */}
              <div className="user-info-section">
                <div className="user-info-header">
                  <span className="user-info-label">Phone number</span>
                   {editingPhone ? (
                    <button className="user-info-edit-btn cancel" onClick={() => setEditingPhone(false)}>Cancel</button>
                  ) : (
                    <button className="user-info-edit-btn" onClick={() => setEditingPhone(true)}>Edit</button>
                  )}
                </div>
                {editingPhone ? (
                  <div className="user-info-edit-form">
                    <input 
                      className="user-info-input" 
                      placeholder="Phone number"
                      value={phoneForm}
                      onChange={e => setPhoneForm(e.target.value)}
                    />
                    <button className="user-info-save-btn" onClick={savePhone}>Save</button>
                  </div>
                ) : (
                  <div className="user-info-value">{profile.phone || 'Not set'}</div>
                )}
              </div>

              {/* Address Section */}
              <div className="user-info-section no-border">
                <div className="user-info-header">
                  <span className="user-info-label">Address</span>
                   {editingAddress ? (
                    <button className="user-info-edit-btn cancel" onClick={() => setEditingAddress(false)}>Cancel</button>
                  ) : (
                    <button className="user-info-edit-btn" onClick={() => setEditingAddress(true)}>Edit</button>
                  )}
                </div>
                {editingAddress ? (
                  <div className="user-info-edit-form">
                    <div className="user-info-grid">
                       <input 
                        className="user-info-input" 
                        placeholder="Country"
                        value={addressForm.country}
                        onChange={e => setAddressForm({...addressForm, country: e.target.value})}
                      />
                       <input 
                        className="user-info-input" 
                        placeholder="City"
                        value={addressForm.city}
                        onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                      />
                       <input 
                        className="user-info-input" 
                        placeholder="Zip Code"
                        value={addressForm.zip_code}
                        onChange={e => setAddressForm({...addressForm, zip_code: e.target.value})}
                      />
                       <input 
                        className="user-info-input" 
                        placeholder="Street"
                        value={addressForm.street}
                        onChange={e => setAddressForm({...addressForm, street: e.target.value})}
                      />
                       <input 
                        className="user-info-input" 
                        placeholder="Flat / Apt"
                        value={addressForm.flat}
                        onChange={e => setAddressForm({...addressForm, flat: e.target.value})}
                      />
                    </div>
                    <button className="user-info-save-btn" onClick={saveAddress}>Save</button>
                  </div>
                ) : (
                  <div className="user-info-value" style={{ whiteSpace: 'pre-line' }}>
                    {formatAddress()}
                  </div>
                )}
              </div>

            </main>
          </div>
        </div>
      </div>
    </>
  );
}
