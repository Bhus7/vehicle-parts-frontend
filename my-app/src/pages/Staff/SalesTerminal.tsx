import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Plus, Minus, Trash2, CheckCircle2, AlertCircle, Package, ArrowRight, CreditCard, Wallet, Banknote, User as UserIcon } from 'lucide-react';
import { staffApi } from '../../api/api';
import { Link } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui-components';

interface Part {
  partID: number;
  partName: string;
  unitPrice: number;
  stockQuantity: number;
  category: string;
}

interface CartItem extends Part {
  selectedQuantity: number;
}

const SalesTerminal = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: React.ReactNode }>({ type: null, message: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const response = await staffApi.getParts();
      setParts(response.data);
    } catch (error) {
      console.error('Failed to load parts');
    }
  };

  const addToCart = (part: Part) => {
    const existing = cart.find(item => item.partID === part.partID);
    if (existing) {
      if (existing.selectedQuantity < part.stockQuantity) {
        setCart(cart.map(item => 
          item.partID === part.partID 
            ? { ...item, selectedQuantity: item.selectedQuantity + 1 } 
            : item
        ));
      }
    } else {
      setCart([...cart, { ...part, selectedQuantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.partID === id) {
        const newQty = Math.max(1, Math.min(item.stockQuantity, item.selectedQuantity + delta));
        return { ...item, selectedQuantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.partID !== id));
  };

  const calculateSubtotal = () => cart.reduce((sum, item) => sum + (item.unitPrice * item.selectedQuantity), 0);
  const subtotal = calculateSubtotal();
  const discount = subtotal > 5000 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const handleCheckout = async () => {
    if (!customerId) return setStatus({ type: 'error', message: 'Please enter a Customer ID.' });
    if (cart.length === 0) return setStatus({ type: 'error', message: 'Cart is empty.' });

    setLoading(true);
    try {
      const payload = {
        userID: parseInt(customerId),
        paymentMethod,
        items: cart.map(item => ({
          partID: item.partID,
          quantity: item.selectedQuantity
        }))
      };

      const response = await staffApi.createSale(payload);
      setStatus({ 
        type: 'success', 
        message: (
          <div className="flex flex-col gap-1">
            <span>Transaction Complete! Invoice #{response.data.invoiceID} generated.</span>
            <Link to={`/staff/invoice/${response.data.invoiceID}`} className="text-white underline font-bold flex items-center gap-1 hover:text-indigo-200 transition-colors">
              View Receipt <ArrowRight size={14} />
            </Link>
          </div>
        )
      });
      setCart([]);
      setCustomerId('');
      loadParts(); 
    } catch (error: any) {
      setStatus({ type: 'error', message: error.response?.data || 'Checkout failed.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredParts = parts.filter(p => 
    p.partName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-indigo-500 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Terminal</span>
          <h1 className="text-4xl font-outfit font-bold text-white mb-2">Sales Interface</h1>
          <p className="text-slate-400">Process spare parts transactions and fulfillment.</p>
        </div>
        <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-white/5 md:w-96">
            <Search className="ml-3 mt-2.5 text-slate-500" size={18} />
            <input 
              className="bg-transparent border-none outline-none text-sm p-2.5 w-full text-slate-200"
              placeholder="Filter inventory by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Parts Catalog */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredParts.map((part) => (
              <motion.div
                key={part.partID}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group hover:border-indigo-500/50 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                        <Package size={24} />
                      </div>
                      <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${
                        part.stockQuantity < 10 
                        ? 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                      }`}>
                        {part.stockQuantity < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>

                    <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors mb-1 truncate">{part.partName}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">{part.category}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-black text-white">${part.unitPrice}</span>
                      <button 
                        onClick={() => addToCart(part)}
                        disabled={part.stockQuantity === 0}
                        className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar: Cart & Checkout */}
        <div className="sticky top-[100px] z-20">
          <Card className="p-0 border-white/10 ring-1 ring-white/5 shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3 text-indigo-400">
                <ShoppingCart size={20} />
                <h3 className="font-bold text-lg font-outfit uppercase tracking-wider text-white">Active Cart</h3>
              </div>
              <span className="text-xs font-black px-2 py-1 bg-indigo-500 rounded-lg text-white">
                {cart.length} ITEMS
              </span>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Customer Link</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 text-slate-500" size={16} />
                  <Input 
                    placeholder="Search User ID..." 
                    className="pl-12 bg-white/5 border-white/5" 
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  />
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 italic text-sm">
                    Cart is currently empty.
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      key={item.partID} 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate">{item.partName}</p>
                        <p className="text-indigo-400 font-bold text-xs">${item.unitPrice * item.selectedQuantity}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-white/5">
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                          onClick={() => updateQuantity(item.partID, -1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.selectedQuantity}</span>
                        <button 
                         className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                         onClick={() => updateQuantity(item.partID, 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.partID)}
                        className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Subtotal</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400 font-medium">Loyalty Discount (10%)</span>
                    <span className="text-emerald-400 font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-indigo-500/30 flex justify-between">
                  <span className="text-white font-black text-lg uppercase font-outfit">Total Due</span>
                  <span className="text-indigo-400 font-black text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Settlement Method</label>
                <div className="grid grid-cols-3 gap-2">
                   {['Cash', 'Card', 'Credit'].map((method) => (
                     <button
                       key={method}
                       onClick={() => setPaymentMethod(method)}
                       className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                         paymentMethod === method 
                         ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                         : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                       }`}
                     >
                       {method === 'Cash' && <Banknote size={16} />}
                       {method === 'Card' && <CreditCard size={16} />}
                       {method === 'Credit' && <Wallet size={16} />}
                       <span className="text-[10px] font-bold uppercase">{method}</span>
                     </button>
                   ))}
                </div>
              </div>

              <Button 
                className="w-full h-16 text-lg tracking-wider rounded-2xl group" 
                onClick={handleCheckout} 
                isLoading={loading}
                disabled={cart.length === 0}
              >
                AUTHORIZE CHECKOUT
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <AnimatePresence>
                {status.type && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`p-4 rounded-xl flex items-center gap-3 border ${
                      status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
                    <div className="text-sm font-medium">{status.message}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <ArrowRight className={className} size={size} />
);

export default SalesTerminal;
