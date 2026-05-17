import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Car, Calendar, ShoppingBag, ArrowLeft, Clock } from 'lucide-react';
import { staffApi } from '../../api/api';

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'history'>('history');

  useEffect(() => {
    if (id) loadCustomerDetails();
  }, [id]);

  const loadCustomerDetails = async () => {
    try {
      const response = await staffApi.getCustomer(parseInt(id!));
      setCustomer(response.data);
    } catch (error) {
      console.error('Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (!customer) return <div className="p-8">Customer not found.</div>;

  return (
    <div className="fade-in">
      <div className="top-nav-back">
        <Link to="/staff/search" className="back-btn">
          <ArrowLeft size={18} /> Back to Search
        </Link>
      </div>

      <div className="profile-layout">
        {/* Profile Card */}
        <div className="profile-card glass">
          <div className="avatar-large">{customer.fullName[0]}</div>
          <h2>{customer.fullName}</h2>
          <p className="customer-id">Customer ID: #{customer.userID}</p>
          
          <div className="contact-info">
            <div className="info-item">
              <Mail size={16} /> <span>{customer.email}</span>
            </div>
            <div className="info-item">
              <Phone size={16} /> <span>{customer.phone}</span>
            </div>
            <div className="info-item">
              <MapPin size={16} /> <span>{customer.address}</span>
            </div>
            <div className="info-item">
              <Clock size={16} /> <span>Member since {new Date(customer.createdDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="history-section">
          <div className="tabs">
            <button 
              className={activeTab === 'history' ? 'active' : ''} 
              onClick={() => setActiveTab('history')}
            >
              Service & Sales History
            </button>
            <button 
              className={activeTab === 'vehicles' ? 'active' : ''} 
              onClick={() => setActiveTab('vehicles')}
            >
              Registered Vehicles
            </button>
          </div>

          <div className="tab-content glass">
            {activeTab === 'vehicles' ? (
              <div className="vehicles-list">
                {customer.vehicles.map((v: any) => (
                  <div key={v.vehicleID} className="vehicle-card">
                    <Car className="icon" />
                    <div className="v-info">
                      <p className="v-number">{v.vehicleNumber}</p>
                      <p className="v-details">{v.brand} {v.model} ({v.year})</p>
                      <p className="v-type">{v.vehicleType}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="timeline">
                {/* Appointments */}
                {customer.appointments.map((a: any) => (
                  <div key={`app-${a.appointmentID}`} className="timeline-item appointment">
                    <div className="timeline-icon"><Calendar size={18} /></div>
                    <div className="timeline-body">
                      <div className="timeline-header">
                        <h4>Service Appointment</h4>
                        <span className="date">{new Date(a.appointmentDate).toLocaleDateString()}</span>
                      </div>
                      <p className="type">{a.serviceType}</p>
                      <p className="notes text-muted">{a.notes}</p>
                      <span className="status-badge">{a.status}</span>
                    </div>
                  </div>
                ))}

                {/* Sales */}
                {customer.sales.map((s: any) => (
                  <div key={`sale-${s.salesInvoiceID}`} className="timeline-item sale">
                    <div className="timeline-icon"><ShoppingBag size={18} /></div>
                    <div className="timeline-body">
                      <div className="timeline-header">
                        <Link to={`/staff/invoice/${s.salesInvoiceID}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          <h4>Parts Purchase</h4>
                        </Link>
                        <span className="date">{new Date(s.salesDate).toLocaleDateString()}</span>
                      </div>
                      <p className="invoice">Invoice #{s.salesInvoiceID}</p>
                      <p className="amount">Total: ${s.finalAmount.toFixed(2)}</p>
                      {s.discountAmount > 0 && <span className="discount-badge">Loyalty Discount Applied</span>}
                    </div>
                  </div>
                ))}

                {customer.appointments.length === 0 && customer.sales.length === 0 && (
                  <div className="empty-history text-muted">No history found for this customer.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .top-nav-back { margin-bottom: 2rem; }
        .back-btn { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-weight: 600; }
        .back-btn:hover { color: white; }
        
        .profile-layout { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; }
        
        .profile-card { padding: 2.5rem 2rem; border-radius: 24px; text-align: center; height: fit-content; }
        .avatar-large {
          width: 100px; height: 100px; background: var(--primary); color: white;
          border-radius: 30px; display: flex; align-items: center; justify-content: center;
          font-size: 3rem; font-weight: 800; margin: 0 auto 1.5rem;
          box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.5);
        }
        .customer-id { font-size: 0.85rem; color: var(--primary); font-weight: 700; margin-bottom: 2rem; letter-spacing: 1px; }
        .contact-info { text-align: left; display: flex; flex-direction: column; gap: 1rem; }
        .info-item { display: flex; align-items: center; gap: 0.8rem; color: var(--text-muted); font-size: 0.9rem; }
        
        .tabs { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .tabs button {
          padding: 0.8rem 1.5rem; background: transparent; color: var(--text-muted);
          font-weight: 600; border: 1px solid var(--border);
        }
        .tabs button.active { background: var(--primary); color: white; border-color: var(--primary); }
        
        .tab-content { border-radius: 24px; padding: 2rem; min-height: 400px; }
        
        .vehicles-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
        .vehicle-card {
          padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 16px;
          display: flex; gap: 1.2rem; align-items: center;
        }
        .vehicle-card .icon { color: var(--primary); }
        .v-number { font-weight: 800; font-size: 1.1rem; }
        .v-details { font-size: 0.85rem; color: var(--text-muted); }
        .v-type { font-size: 0.75rem; background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 0.5rem; }
        
        .timeline { position: relative; padding-left: 2rem; border-left: 2px solid var(--border); }
        .timeline-item { position: relative; margin-bottom: 2.5rem; }
        .timeline-icon {
          position: absolute; left: -2.8rem; top: 0; width: 36px; height: 36px;
          background: var(--bg); border: 2px solid var(--border); border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: var(--text-muted);
        }
        .appointment .timeline-icon { color: #f59e0b; border-color: #f59e0b; }
        .sale .timeline-icon { color: #10b981; border-color: #10b981; }
        
        .timeline-body { background: rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border); }
        .timeline-header { display: flex; justify-content: space-between; margin-bottom: 0.8rem; }
        .timeline-header h4 { font-size: 1rem; }
        .date { font-size: 0.8rem; color: var(--text-muted); }
        .status-badge { font-size: 0.7rem; background: #f59e0b22; color: #f59e0b; padding: 2px 10px; border-radius: 50px; font-weight: 700; margin-top: 0.5rem; display: inline-block; }
        .discount-badge { font-size: 0.7rem; background: #10b98122; color: #10b981; padding: 2px 10px; border-radius: 50px; font-weight: 700; margin-top: 0.5rem; display: inline-block; }
        .amount { font-weight: 800; font-size: 1.1rem; margin-top: 0.5rem; }
      `}</style>
    </div>
  );
};

export default CustomerDetails;
