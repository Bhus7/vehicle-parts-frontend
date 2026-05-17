import React, { useState } from 'react';
import { User, Car, CheckCircle2, AlertCircle } from 'lucide-react';
import { staffApi } from '../../api/api';

const RegisterCustomer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    vehicleNumber: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    vehicleType: '',
    conditionNotes: '',
  });

  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await staffApi.registerCustomer(formData);
      setStatus({ 
        type: 'success', 
        message: `Successfully registered ${formData.fullName} and vehicle ${formData.vehicleNumber}!` 
      });
      // Clear form on success
      setFormData({
        fullName: '', email: '', phone: '', password: '', address: '',
        vehicleNumber: '', brand: '', model: '', year: new Date().getFullYear(),
        vehicleType: '', conditionNotes: ''
      });
    } catch (error: any) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data || 'Failed to register customer. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Register New Customer</h1>
        <p className="text-muted">Enter customer personal details and vehicle information.</p>
      </div>

      {status.type && (
        <div className={`status-alert ${status.type}`}>
          {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-grid">
          {/* Customer Details */}
          <section className="form-section glass">
            <div className="section-title">
              <User size={20} className="icon" />
              <h3>Customer Details</h3>
            </div>
            
            <div className="input-group">
              <label>Full Name</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="9812345678" />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
            </div>

            <div className="input-group">
              <label>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Kathmandu, Nepal" />
            </div>
          </section>

          {/* Vehicle Details */}
          <section className="form-section glass">
            <div className="section-title">
              <Car size={20} className="icon" />
              <h3>Vehicle Details</h3>
            </div>

            <div className="input-group">
              <label>Vehicle Number (Plate)</label>
              <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required placeholder="BA 1 PA 1234" />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Brand</label>
                <input name="brand" value={formData.brand} onChange={handleChange} required placeholder="Toyota" />
              </div>
              <div className="input-group">
                <label>Model</label>
                <input name="model" value={formData.model} onChange={handleChange} required placeholder="Corolla" />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Year</label>
                <input name="year" type="number" value={formData.year} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Vehicle Type</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Bike">Bike</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Condition Notes</label>
              <textarea name="conditionNotes" value={formData.conditionNotes} onChange={handleChange} rows={3} placeholder="Any existing damage or specific notes..."></textarea>
            </div>
          </section>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register Customer & Vehicle'}
          </button>
        </div>
      </form>

      <style>{`
        .registration-form {
          margin-top: 2rem;
          max-width: 1200px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .form-section {
          padding: 2rem;
          border-radius: 20px;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 2rem;
          color: var(--primary);
        }
        .input-group {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-actions {
          margin-top: 2rem;
          display: flex;
          justify-content: flex-end;
        }
        .primary-btn {
          background: var(--primary);
          color: white;
          padding: 1rem 2.5rem;
          font-size: 1rem;
          font-weight: 700;
          box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
        }
        .primary-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }
        .primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .status-alert {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }
        .status-alert.success {
          background: rgba(34, 197, 94, 0.1);
          color: var(--success);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .status-alert.error {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RegisterCustomer;
