import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft, ShieldCheck, CreditCard, ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();

  // Mock cart data
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Premium Brake Pads", price: 45.99, category: "Brakes", quantity: 1, image: "🛑" },
    { id: 3, name: "Iridium Spark Plugs (Set of 4)", price: 32.00, category: "Engine", quantity: 2, image: "⚡" }
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax + 5.99; // + shipping

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate(-1)} className="p-2 border border-slate-700 bg-slate-800 rounded hover:bg-slate-700 text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingCart size={28} className="text-blue-500" /> Your Shopping Cart
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-slate-800 p-12 rounded-xl border border-slate-700 text-center">
                <ShoppingCart size={48} className="mx-auto text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
                <p className="text-slate-400 mb-6">Looks like you haven't added any auto parts yet.</p>
                <Link to="/" className="inline-block px-6 py-3 bg-blue-600 font-bold text-white rounded hover:bg-blue-700">
                  Return to Store
                </Link>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center text-4xl border border-slate-700">
                    {item.image}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                  </div>
                  
                  <div className="text-center sm:text-right">
                    <div className="text-xl font-bold text-white mb-2">Rs. {(item.price * item.quantity).toFixed(2)}</div>
                    
                    <div className="flex items-center justify-center sm:justify-end gap-3">
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-slate-700 text-white font-bold">-</button>
                        <span className="px-3 font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-slate-700 text-white font-bold">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Panel */}
          {cartItems.length > 0 && (
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 h-fit sticky top-24 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-white">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-white">Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-white">Rs. 5.99</span>
                </div>
              </div>
              
              <div className="border-t border-slate-700 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-3xl font-black text-blue-500">Rs. {total.toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors mb-4 shadow-lg shadow-green-600/20">
                Proceed to Checkout <ArrowRight size={20} />
              </button>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold justify-center uppercase tracking-widest">
                  <ShieldCheck size={16} className="text-blue-500" /> Secure Encryption
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold justify-center uppercase tracking-widest">
                  <CreditCard size={16} className="text-blue-500" /> All Cards Accepted
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
