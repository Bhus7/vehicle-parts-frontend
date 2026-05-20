import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Plus, Minus, Trash2, CheckCircle2, AlertCircle, Package, ArrowRight, CreditCard, Wallet, Banknote, User as UserIcon, Mail, Check } from 'lucide-react';
import { staffApi } from '../../api/api';
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

  // Customer selection states (Step 1)
  const [customerSearch, setCustomerSearch] = useState('');
  const [matchingCustomers, setMatchingCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Invoice Preview Modal State (Step 6)
  const [checkoutInvoice, setCheckoutInvoice] = useState<any>(null);

  // Email states
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    if (!checkoutInvoice) return;
    setSendingEmail(true);
    try {
      await staffApi.sendInvoiceEmail(checkoutInvoice.invoiceID);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error: any) {
      console.error('Failed to send email:', error);
      const backendError = error.response?.data?.message || error.response?.data || error.message;
      alert(`Email dispatch failed: ${backendError}`);
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const response = await staffApi.getParts();
      setParts(response.data.map((p: any) => ({ ...p, partID: p.partID || p.id })));
    } catch (error) {
      console.error('Failed to load parts');
    }
  };

  const handleCustomerSearch = async (val: string) => {
    setCustomerSearch(val);
    if (!val.trim()) {
      setMatchingCustomers([]);
      return;
    }
    try {
      const response = await staffApi.searchCustomers(val);
      setMatchingCustomers(response.data);
    } catch (e) {
      console.error("Failed to query customers", e);
    }
  };

  const selectCustomer = (cust: any) => {
    setSelectedCustomer(cust);
    setCustomerId(cust.userID.toString());
    setCustomerSearch('');
    setMatchingCustomers([]);
  };

  const clearCustomerSelection = () => {
    setSelectedCustomer(null);
    setCustomerId('');
    setCustomerSearch('');
    setMatchingCustomers([]);
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
      } else {
        setStatus({
          type: 'error',
          message: `Stock constraint met! Available inventory for ${part.partName} is only ${part.stockQuantity} items.`
        });
      }
    } else {
      setCart([...cart, { ...part, selectedQuantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setStatus({ type: null, message: '' });
    setCart(cart.map(item => {
      if (item.partID === id) {
        const newQty = item.selectedQuantity + delta;
        if (newQty > item.stockQuantity) {
          setStatus({
            type: 'error',
            message: `Inventory Alert: Cannot exceed available stock (${item.stockQuantity} items) for ${item.partName}.`
          });
          return item;
        }
        if (newQty < 1) return item;
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
    if (!customerId) return setStatus({ type: 'error', message: 'Please select a Customer.' });
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
      
      // Store checkout details for visual invoice preview modal!
      setCheckoutInvoice({
        invoiceID: response.data.invoiceID,
        total: response.data.total,
        discount: response.data.discount,
        final: response.data.final,
        items: [...cart]
      });

      setStatus({ 
        type: 'success', 
        message: (
          <div className="flex flex-col gap-1">
            <span>Transaction Complete! Invoice #{response.data.invoiceID} generated.</span>
            <button onClick={() => setCheckoutInvoice({
              invoiceID: response.data.invoiceID,
              total: response.data.total,
              discount: response.data.discount,
              final: response.data.final,
              items: [...cart]
            })} className="text-white underline font-bold flex items-center gap-1 hover:text-indigo-200 transition-colors">
              Preview Invoice Details <ArrowRight size={14} />
            </button>
          </div>
        )
      });
      setCart([]);
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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-indigo-600 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Terminal</span>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 mb-2">Sales Interface</h1>
          <p className="text-slate-500 text-sm">Process spare parts transactions and fulfillment.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm md:w-96">
            <Search className="ml-3 mt-2.5 text-slate-400" size={18} />
            <input 
              className="bg-transparent border-none outline-none text-sm p-2 w-full text-slate-800 placeholder:text-slate-400"
              placeholder="Filter inventory by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* Step 1: Customer Selection Registry */}
      <div className="mb-8 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div>
          <span className="text-indigo-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-2 block">Step 1 — Customer Registry</span>
          <h2 className="text-lg font-bold text-slate-800">Select Customer File</h2>
          <p className="text-xs text-slate-500">Search customer registry by Name, Phone Number, Customer ID, or Vehicle Plate Number.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <Input 
              placeholder="Type Name, Phone or ID to search..." 
              className="pl-12 w-full"
              value={customerSearch}
              onChange={(e) => handleCustomerSearch(e.target.value)}
            />

            {/* Dropdown list of matching customers */}
            {matchingCustomers.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-[250px] overflow-y-auto z-30 divide-y divide-slate-100">
                {matchingCustomers.map((cust) => (
                  <button
                    key={cust.userID || cust.UserID}
                    onClick={() => selectCustomer(cust)}
                    className="w-full text-left p-4 hover:bg-slate-50 flex flex-col gap-1 transition-colors text-slate-850 text-sm"
                  >
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{cust.fullName || cust.FullName}</span>
                      <span className="text-indigo-600 text-xs">ID: {cust.userID || cust.UserID}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Phone: {cust.phone || cust.Phone || 'N/A'}</span>
                      <span>Vehicles: {((cust.vehicles || cust.Vehicles) ? (cust.vehicles || cust.Vehicles).map((v: any) => typeof v === 'object' ? (v.vehicleNumber || v.VehicleNumber || '') : v).filter(Boolean).join(', ') : '') || 'N/A'}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {selectedCustomer ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <UserIcon size={16} className="text-indigo-600" />
                    <span className="font-bold text-slate-800 text-sm">{selectedCustomer.fullName || selectedCustomer.FullName}</span>
                    <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded">ID: {selectedCustomer.userID || selectedCustomer.UserID}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <p>Phone: {selectedCustomer.phone || selectedCustomer.Phone || 'N/A'}</p>
                    <p>Vehicle: {(() => {
                      const list = selectedCustomer.vehicles || selectedCustomer.Vehicles;
                      if (!list || !Array.isArray(list) || list.length === 0) return 'N/A';
                      const v = list[0];
                      return typeof v === 'object' ? (v.vehicleNumber || v.VehicleNumber || 'N/A') : v;
                    })()}</p>
                  </div>
                </div>
                <button
                  onClick={clearCustomerSelection}
                  className="text-xs text-slate-400 hover:text-red-500 font-bold underline"
                >
                  Change
                </button>
              </motion.div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 italic text-sm min-h-[92px]">
                No customer linked yet. Search and select a customer above.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Flow: Step 2 & Step 3 */}
      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Parts Catalog */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-indigo-600 font-bold tracking-[0.2em] text-[10px] uppercase block">Step 2 — Vehicle Parts Catalog</span>
              <span className="text-xs text-slate-500">{filteredParts.length} parts found</span>
            </div>
            
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full sm:w-72">
              <Search className="ml-2.5 mt-1.5 text-slate-400" size={16} />
              <input 
                className="bg-transparent border-none outline-none text-xs p-1.5 w-full text-slate-800 placeholder:text-slate-400"
                placeholder="Quick search parts or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-hidden border border-slate-200 bg-white rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Part Description</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-right">Price</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-center">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-center">In Cart</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filteredParts.map((part) => {
                    const cartQty = cart.find(item => item.partID === part.partID)?.selectedQuantity || 0;
                    const isLowStock = part.stockQuantity < 10;
                    return (
                      <motion.tr
                        key={part.partID}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-500">
                              <Package size={18} />
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">{part.partName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{part.category}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800 text-sm font-mono">
                          Rs. {part.unitPrice}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            isLowStock 
                            ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          }`}>
                            {part.stockQuantity} {isLowStock ? '(Low)' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {cartQty > 0 ? (
                            <span className="text-xs font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg">
                              {cartQty}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            type="button"
                            onClick={() => addToCart(part)}
                            disabled={part.stockQuantity === 0 || cartQty >= part.stockQuantity}
                            className="inline-flex w-8 h-8 rounded-lg bg-indigo-600 text-white items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale shadow-sm"
                          >
                            <Plus size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Cart & Checkout (Step 3 & 4 & 5) */}
        <div className="sticky top-[100px] z-20">
          <Card className="p-0 border border-slate-200 shadow-md bg-white">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5 text-indigo-600">
                <ShoppingCart size={20} />
                <h3 className="font-bold text-base font-outfit uppercase tracking-wider text-slate-800">Active Cart</h3>
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-indigo-600 rounded-lg text-white">
                {cart.length} ITEMS
              </span>
            </div>

            <div className="p-5 space-y-5">
              {/* Linked Customer (Step 1 link indicator) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-550 block">Customer Link Status</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 text-slate-400" size={16} />
                  <Input 
                    placeholder="Search User ID..." 
                    className="pl-12 cursor-not-allowed bg-slate-50 border-slate-200" 
                    value={customerId ? `Selected Customer: ID ${customerId}` : 'No Customer Linked'} 
                    disabled
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 italic text-sm">
                    Cart is currently empty.
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      key={item.partID} 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 flex items-center gap-3.5"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{item.partName}</p>
                        <p className="text-indigo-600 font-bold text-xs">Rs. {item.unitPrice * item.selectedQuantity}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200">
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-slate-450 hover:text-slate-700"
                          onClick={() => updateQuantity(item.partID, -1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-slate-800">{item.selectedQuantity}</span>
                        <button 
                          className="w-6 h-6 flex items-center justify-center text-slate-450 hover:text-slate-700"
                          onClick={() => updateQuantity(item.partID, 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.partID)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Step 3: Cart / Invoice Calculation */}
              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-3 shadow-inner">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="text-slate-850 font-bold">Rs. {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 font-medium">Loyalty Discount (10%)</span>
                    <span className="text-emerald-600 font-bold">-Rs. {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-indigo-150 flex justify-between">
                  <span className="text-slate-800 font-bold text-base uppercase font-outfit">Total Due</span>
                  <span className="text-indigo-600 font-bold text-xl">Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Step 4: Payment Section */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-550 block">Settlement Method</label>
                <div className="grid grid-cols-3 gap-2">
                   {['Cash', 'Card', 'Credit'].map((method) => (
                     <button
                       key={method}
                       type="button"
                       onClick={() => setPaymentMethod(method)}
                       className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                         paymentMethod === method 
                         ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                         : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                       }`}
                     >
                       {method === 'Cash' && <Banknote size={16} />}
                       {method === 'Card' && <CreditCard size={16} />}
                       {method === 'Credit' && <Wallet size={16} />}
                       <span className="text-[10px] font-bold uppercase">{method === 'Card' ? 'Online' : method}</span>
                     </button>
                   ))}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Payment Status:</span>
                  <span className={`font-black uppercase tracking-widest px-3 py-1 rounded text-[10px] ${
                    paymentMethod === 'Credit' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {paymentMethod === 'Credit' ? 'Pending' : 'Paid'}
                  </span>
                </div>
                {paymentMethod === 'Credit' && (
                  <div className="text-[10px] text-amber-600 italic leading-relaxed">
                    * Customer will be billed on store credit. Overdue tracking is active for this invoice.
                  </div>
                )}
              </div>

              {/* Step 5: Generate Invoice Button */}
              <Button 
                className="w-full h-14 text-sm font-bold tracking-wider rounded-xl group" 
                onClick={handleCheckout} 
                isLoading={loading}
                disabled={cart.length === 0 || !customerId}
              >
                AUTHORIZE CHECKOUT
                <ChevronRight className="ml-1.5 group-hover:translate-x-0.5 transition-transform" size={16} />
              </Button>

              {/* Status Message Panel */}
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

      {/* Step 6 — Show Invoice Preview Modal */}
      <AnimatePresence>
        {checkoutInvoice && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8"
            >
              {/* Header Strip */}
              <div className="bg-slate-950 p-6 md:p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-xl">
                      <span className="text-2xl font-black italic">A</span>
                   </div>
                   <div>
                      <h1 className="text-xl font-black uppercase tracking-tighter">AutoParts</h1>
                      <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Enterprise Service Node</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-1">Invoice ID</p>
                   <h2 className="text-xl font-black">#{checkoutInvoice.invoiceID.toString().padStart(6, '0')}</h2>
                </div>
              </div>

              {/* Invoice Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6 text-xs">
                  <div>
                    <h3 className="font-bold text-slate-400 uppercase tracking-widest mb-2">Customer Info</h3>
                    <p className="font-black text-sm">{selectedCustomer?.fullName || selectedCustomer?.FullName || 'Walk-in Customer'}</p>
                    <p className="text-slate-600 mt-1">Phone: {selectedCustomer?.phone || selectedCustomer?.Phone || 'N/A'}</p>
                    <p className="text-slate-600">Vehicle: {(() => {
                      const list = selectedCustomer?.vehicles || selectedCustomer?.Vehicles;
                      if (!list || !Array.isArray(list) || list.length === 0) return 'N/A';
                      const v = list[0];
                      return typeof v === 'object' ? (v.vehicleNumber || v.VehicleNumber || 'N/A') : v;
                    })()}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-slate-400 uppercase tracking-widest mb-2">Transaction Details</h3>
                    <p className="font-black">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-slate-600 mt-1">Method: {paymentMethod === 'Card' ? 'Online' : paymentMethod}</p>
                    <span className={`inline-block mt-2 font-black uppercase tracking-widest text-[9px] px-2 py-0.5 rounded border ${
                      paymentMethod === 'Credit' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {paymentMethod === 'Credit' ? 'Pending' : 'Paid'}
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500">
                      <tr>
                        <th className="px-4 py-3 uppercase">Component Description</th>
                        <th className="px-4 py-3 uppercase text-center">Qty</th>
                        <th className="px-4 py-3 uppercase text-right">Unit Price</th>
                        <th className="px-4 py-3 uppercase text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {checkoutInvoice.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-slate-800 font-bold">{item.partName}</td>
                          <td className="px-4 py-3 text-center text-slate-500">{item.selectedQuantity}</td>
                          <td className="px-4 py-3 text-right text-slate-500">Rs. {item.unitPrice}</td>
                          <td className="px-4 py-3 text-right text-slate-900 font-bold font-mono">Rs. {item.unitPrice * item.selectedQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="w-full max-w-xs ml-auto space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-500">
                    <span className="uppercase text-[9px] tracking-wider">Subtotal</span>
                    <span>Rs. {checkoutInvoice.total.toFixed(2)}</span>
                  </div>
                  {checkoutInvoice.discount > 0 && (
                    <div className="flex justify-between font-bold text-emerald-600">
                      <span className="uppercase text-[9px] tracking-wider">Loyalty Offset (10%)</span>
                      <span>-Rs. {checkoutInvoice.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-end">
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Settlement Total</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase">NPR VALUATION</p>
                     </div>
                     <h2 className="text-2xl font-black text-indigo-600 font-mono">Rs. {checkoutInvoice.final.toFixed(2)}</h2>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-xs"
                  >
                    Print Receipt
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors text-xs flex items-center gap-1.5"
                  >
                    {sendingEmail ? (
                      <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : emailSent ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Mail size={14} className="text-slate-500" />
                    )}
                    <span>{emailSent ? 'Sent' : 'Email Customer'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setCheckoutInvoice(null);
                      clearCustomerSelection();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ChevronRight = ({ className, size = 20 }: { className?: string, size?: number }) => (
  <ArrowRight className={className} size={size} />
);

export default SalesTerminal;
