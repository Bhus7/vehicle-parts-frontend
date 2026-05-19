import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { profileApi } from '../../api/customerApi';

const ProfileManagement = () => {
  const customerId = parseInt(localStorage.getItem('customerId') || '0');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });



  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await profileApi.getProfile(customerId);
        const data = response.data?.data || response.data;
        setProfile({
          name: data.name || data.fullName || data.FullName || '',
          email: data.email || data.Email || '',
          phone: data.phone || data.phoneNumber || data.Phone || '',
          address: data.address || data.Address || '',
        });
      } catch {
        // Fallback to stored data
        const stored = localStorage.getItem('customer');
        if (stored) {
          const data = JSON.parse(stored);
          setProfile({
            name: data.name || data.fullName || data.FullName || '',
            email: data.email || data.Email || '',
            phone: data.phone || data.phoneNumber || data.Phone || '',
            address: data.address || data.Address || '',
          });
        }
      }
    };
    if (customerId) loadProfile();
  }, [customerId]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const updateData = {
        fullName: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
      };
      await profileApi.updateProfile(customerId, updateData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Update localStorage
      const stored = localStorage.getItem('customer');
      if (stored) {
        const data = JSON.parse(stored);
        localStorage.setItem('customer', JSON.stringify({ ...data, ...updateData, fullName: profile.name }));
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 mt-1">Manage your personal information and security settings</p>
      </div>



      {/* Status Message */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-10 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-10 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-10 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="555-0198"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input
                  type="text"
                  value={profile.address}
                  onChange={e => setProfile({ ...profile, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-10 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                  placeholder="123 Main St, City"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
    </div>
  );
};

export default ProfileManagement;
