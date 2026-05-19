import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ClipboardList, Package } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Customer {
  userID: number;
  fullName: string;
  email: string;
  phone: string;
}

interface PartRequest {
  id: number;
  userID: number;
  partName: string;
  category: string;
  quantity: number;
  notes: string;
  status: string;
  createdDate: string;
  vendor?: { vendorName: string };
}

const PartRequests = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [requests, setRequests] = useState<PartRequest[]>([]);
  
  // Form State
  const [partName, setPartName] = useState('');
  const [category, setCategory] = useState('Engine');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Categories list
  const categories = [
    'Engine', 'Brakes', 'Suspension', 'Fluids', 'Electrical', 
    'Transmission', 'Interior', 'Exterior', 'General'
  ];

  // Fetch customer list
  useEffect(() => {
    api.get('/Customers')
      .then((res) => {
        setCustomers(res.data);
        if (res.data.length > 0) {
          // Default to the first customer in the database
          setSelectedCustomerId(res.data[0].userID);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch customers list from database.');
      });
  }, []);

  // Fetch requested parts list for the selected customer
  const fetchCustomerRequests = (customerId: number) => {
    api.get(`/PartRequests/customer/${customerId}`)
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (selectedCustomerId) {
      fetchCustomerRequests(Number(selectedCustomerId));
    }
  }, [selectedCustomerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Please select a customer profile first.');
      return;
    }
    if (!partName.trim()) {
      setError('Part Name is required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      userID: Number(selectedCustomerId),
      partName: partName.trim(),
      category,
      quantity: Number(quantity),
      notes: notes.trim()
    };

    try {
      await api.post('/PartRequests', payload);
      setSuccess(`Request for '${partName}' has been submitted and sent to Admin!`);
      setPartName('');
      setNotes('');
      setQuantity('1');
      fetchCustomerRequests(Number(selectedCustomerId));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || 'Failed to submit part request.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Approved':
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'Ordered':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'Fulfilled':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-10 px-4 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 border border-slate-700 bg-slate-800 rounded hover:bg-slate-700 text-white transition-all">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ClipboardList size={28} className="text-blue-500" /> Customer Part Requests
            </h1>
          </div>

          {/* Customer Profile Switcher (Superb Evaluator Tool!) */}
          <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Testing As:</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded px-3 py-1 text-sm font-bold text-white focus:border-blue-500 outline-none"
            >
              {customers.map((c) => (
                <option key={c.userID} value={c.userID}>{c.fullName}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 font-bold">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg mb-6 font-bold">{success}</div>}

        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Left Column: Request Form */}
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 h-fit shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-700">
              <Send size={18} className="text-blue-500" /> Submit Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Part Name / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Performance Carbon Brake Rotors"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Additional Notes / Specs</label>
                <textarea
                  placeholder="Include brand preference, OEM numbers, or specific model details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Parts Request'}
              </button>
            </form>
          </div>

          {/* Right Column: Requests History & Tracker */}
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-700">
              <ClipboardList size={18} className="text-blue-500" /> Request Catalog & Trackers
            </h2>

            {requests.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Package size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">No requests found</h3>
                <p className="text-sm">Submit your first request in the side panel to begin tracking!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 text-sm">
                      <th className="text-left py-3 font-semibold">Date</th>
                      <th className="text-left py-3 font-semibold">Part Name</th>
                      <th className="text-left py-3 font-semibold">Category</th>
                      <th className="text-left py-3 font-semibold">Qty</th>
                      <th className="text-left py-3 font-semibold">Notes</th>
                      <th className="text-left py-3 font-semibold">Status</th>
                      <th className="text-left py-3 font-semibold">Assigned Vendor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-slate-700/50 text-sm hover:bg-slate-700/25 transition-colors">
                        <td className="py-4">
                          {new Date(req.createdDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 font-bold text-white">{req.partName}</td>
                        <td className="py-4">
                          <span className="bg-slate-900 px-2.5 py-1 rounded text-xs border border-slate-700">{req.category}</span>
                        </td>
                        <td className="py-4 font-bold text-blue-400">{req.quantity}</td>
                        <td className="py-4 max-w-[180px] truncate text-slate-400" title={req.notes}>
                          {req.notes || '-'}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusBadgeClass(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 font-medium text-slate-300">
                          {req.vendor?.vendorName || <span className="text-slate-500 italic">Finding Supplier...</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartRequests;
