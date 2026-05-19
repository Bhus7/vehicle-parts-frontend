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
    confirmPassword: '',
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
      if (formData.password !== formData.confirmPassword) {
        setStatus({ type: 'error', message: 'Passwords do not match. Please verify and try again.' });
        setLoading(false);
        return;
      }

      await staffApi.registerCustomer(formData);
      setStatus({ 
        type: 'success', 
        message: `Successfully registered ${formData.fullName} and vehicle ${formData.vehicleNumber}!` 
      });
      setFormData({
        fullName: '', email: '', phone: '', password: '', confirmPassword: '', address: '',
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <span className="text-indigo-600 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Onboarding</span>
        <h1 className="text-3xl font-outfit font-bold text-slate-800 mb-2 flex items-center gap-2">
          Customer Registration
          <ChevronRight className="text-slate-300" size={20} />
        </h1>
        <p className="text-slate-500 text-sm">Establish a new service profile for your client and their vehicle.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {status.type && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className={`flex items-center gap-3.5 p-4 rounded-xl mb-6 border ${
              status.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-600" /> : <AlertCircle size={20} className="text-red-600" />}
            <span className="font-medium text-sm">{status.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 h-full border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-outfit text-slate-800">Identity Details</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Client Information</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Tag size={14} className="text-indigo-500" /> Full Name
                  </label>
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Mail size={14} className="text-indigo-500" /> Email Address
                    </label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Phone size={14} className="text-indigo-500" /> Phone Number
                    </label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} required placeholder="9812345678" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Lock size={14} className="text-indigo-500" /> Portal Password
                    </label>
                    <Input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Lock size={14} className="text-indigo-500" /> Confirm Password
                    </label>
                    <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <MapPin size={14} className="text-indigo-500" /> Physical Address
                  </label>
                  <Input name="address" value={formData.address} onChange={handleChange} placeholder="Kathmandu, Nepal" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Vehicle Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-full border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
                  <Car size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-outfit text-slate-800">Vehicle Spec</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Machine Database</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Archive size={14} className="text-pink-500" /> Vehicle Number (Plate)
                  </label>
                  <Input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required placeholder="BA 1 PA 1234" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                       Brand
                    </label>
                    <Input name="brand" value={formData.brand} onChange={handleChange} required placeholder="Toyota" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                       Model
                    </label>
                    <Input name="model" value={formData.model} onChange={handleChange} required placeholder="Corolla" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Calendar size={14} className="text-pink-500" /> Manufacture Year
                    </label>
                    <Input name="year" type="number" value={formData.year} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-1.5">
                      Category
                    </label>
                    <select 
                      name="vehicleType" 
                      value={formData.vehicleType} 
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 transition-all font-sans shadow-sm"
                    >
                      <option value="">Select Type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Bike">Bike</option>
                      <option value="Truck">Truck</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <FileText size={14} className="text-pink-500" /> Condition Notes
                  </label>
                  <textarea 
                    name="conditionNotes" 
                    value={formData.conditionNotes} 
                    onChange={handleChange} 
                    rows={3} 
                    placeholder="Any existing damage or specific service notes..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 transition-all resize-none shadow-sm"
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
          className="flex justify-end pt-2"
        >
          <Button 
            type="submit" 
            size="lg" 
            className="w-full sm:w-auto h-12 px-8 text-sm font-medium rounded-xl group"
            isLoading={loading}
          >
            Finalize Registration
            <ChevronRight className="ml-2 group-hover:translate-x-0.5 transition-transform" size={16} />
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default RegisterCustomer;
