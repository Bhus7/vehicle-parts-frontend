import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Car, CheckCircle2, AlertCircle, Mail, Phone, Lock, MapPin, Tag, Calendar, Archive, FileText, ChevronRight } from 'lucide-react';
import { staffApi } from '../../api/api';
import { Button, Card, Input } from '../../components/ui-components';

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
      await staffApi.registerCustomer(formData);
      setStatus({ 
        type: 'success', 
        message: `Successfully registered ${formData.fullName} and vehicle ${formData.vehicleNumber}!` 
      });
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="text-indigo-500 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Onboarding</span>
        <h1 className="text-4xl font-outfit font-bold text-white mb-2 flex items-center gap-3">
          Customer Registration
          <ChevronRight className="text-indigo-500/50" />
        </h1>
        <p className="text-slate-400">Establish a new service profile for your client and their vehicle.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {status.type && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`flex items-center gap-4 p-4 rounded-2xl mb-8 border ${
              status.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-medium text-sm md:text-base">{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-outfit text-white">Identity Details</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Client Information</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                    <Tag size={16} className="text-indigo-500" /> Full Name
                  </label>
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                      <Mail size={16} className="text-indigo-500" /> Email Address
                    </label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                      <Phone size={16} className="text-indigo-500" /> Phone Number
                    </label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} required placeholder="9812345678" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                    <Lock size={16} className="text-indigo-500" /> Portal Password
                  </label>
                  <Input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-indigo-500" /> Physical Address
                  </label>
                  <Input name="address" value={formData.address} onChange={handleChange} placeholder="Kathmandu, Nepal" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Vehicle Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-outfit text-white">Vehicle Spec</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Machine Database</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                    <Archive size={16} className="text-pink-500" /> Vehicle Number (Plate)
                  </label>
                  <Input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required placeholder="BA 1 PA 1234" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                       Brand
                    </label>
                    <Input name="brand" value={formData.brand} onChange={handleChange} required placeholder="Toyota" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                       Model
                    </label>
                    <Input name="model" value={formData.model} onChange={handleChange} required placeholder="Corolla" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                      <Calendar size={16} className="text-pink-500" /> Manufacture Year
                    </label>
                    <Input name="year" type="number" value={formData.year} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                      Category
                    </label>
                    <select 
                      name="vehicleType" 
                      value={formData.vehicleType} 
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 transition-all font-sans appearance-none"
                    >
                      <option value="">Select Type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Bike">Bike</option>
                      <option value="Truck">Truck</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1">
                    <FileText size={16} className="text-pink-500" /> Condition Notes
                  </label>
                  <textarea 
                    name="conditionNotes" 
                    value={formData.conditionNotes} 
                    onChange={handleChange} 
                    rows={3} 
                    placeholder="Any existing damage or specific service notes..."
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pt-4"
        >
          <Button 
            type="submit" 
            size="lg" 
            className="w-full md:w-auto h-16 px-12 text-lg rounded-2xl group"
            isLoading={loading}
          >
            Finalize Registration
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default RegisterCustomer;
