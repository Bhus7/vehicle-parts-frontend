import React, { useState, useEffect } from 'react';
import { Search, User, Phone, Car, ChevronRight, Eye, AlertCircle, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staffApi } from '../../api/api';

const CustomerSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Live Search Effect
    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffApi.searchCustomers(query);
      setResults(response.data);
    } catch (err) {
      console.error('Search failed', err);
      setError('Could not load customer data. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Customer Records</h1>
        <p className="text-muted">Search and manage customer profiles.</p>
      </div>

      <div className="search-container glass">
        <div className="search-bar">
          <Search size={22} className="text-muted" />
          <input 
            placeholder="Type to filter by name, phone, or vehicle plate..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="results-section">
        {loading ? (
          <div className="loading-spinner">Searching records...</div>
        ) : error ? (
          <div className="no-results glass" style={{ borderColor: 'var(--error)' }}>
            <AlertCircle size={40} className="error" style={{ marginBottom: '1rem' }} />
            <p>{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="results-table glass">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Vehicles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((customer) => (
                  <tr key={customer.userID} className="result-row">
                    <td>
                      <div className="name-cell">
                        <div className="avatar-small">{customer.fullName[0]}</div>
                        <div>
                          <p className="name">{customer.fullName}</p>
                          <p className="id">ID: #{customer.userID}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <p><Phone size={14} /> {customer.phone}</p>
                        <p className="email">{customer.email}</p>
                      </div>
                    </td>
                    <td>
                      <div className="vehicle-tags">
                        {customer.vehicles.map((v: string) => (
                          <span key={v} className="vehicle-tag"><Car size={12} /> {v}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button 
                        className="view-details-btn"
                        onClick={() => navigate(`/staff/customer/${customer.userID}`)}
                      >
                        <Eye size={18} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-results glass">
            <UserPlus size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No customer records found.</p>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Try searching for someone else or register a new customer.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .search-container {
          margin-top: 2rem;
          padding: 1.5rem;
          border-radius: 20px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .search-bar input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 1.1rem;
          padding: 0.5rem;
        }
        .search-btn {
          background: var(--primary);
          color: white;
          padding: 0.8rem 2rem;
          font-weight: 600;
        }
        .results-section {
          margin-top: 2rem;
        }
        .results-table {
          border-radius: 20px;
          overflow: hidden;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          padding: 1.2rem 1.5rem;
          background: rgba(255,255,255,0.03);
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        td {
          padding: 1.2rem 1.5rem;
          border-top: 1px solid var(--border);
        }
        .result-row:hover {
          background: rgba(255,255,255,0.02);
        }
        .name-cell { display: flex; align-items: center; gap: 1rem; }
        .avatar-small {
          width: 36px;
          height: 36px;
          background: rgba(99, 102, 241, 0.2);
          color: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .name { font-weight: 600; }
        .id { font-size: 0.75rem; color: var(--text-muted); }
        .contact-cell p { font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; }
        .email { color: var(--text-muted); font-size: 0.8rem; margin-top: 0.2rem; }
        .vehicle-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .vehicle-tag {
          background: rgba(255,255,255,0.05);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--primary);
        }
        .view-details-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.6rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }
        .view-details-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
        }
        .view-details-btn:active {
          transform: translateY(0);
        }
        .no-results {
          padding: 3rem;
          text-align: center;
          border-radius: 20px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default CustomerSearch;
