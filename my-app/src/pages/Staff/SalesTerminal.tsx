import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Trash2, Receipt, CheckCircle2, AlertCircle } from 'lucide-react';
import { staffApi } from '../../api/api';
import { Link } from 'react-router-dom';

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
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
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
          <span>
            Invoice #{response.data.invoiceID} created! 
            <Link to={`/staff/invoice/${response.data.invoiceID}`} style={{ marginLeft: '10px', textDecoration: 'underline', fontWeight: 'bold' }}>
              View Invoice
            </Link>
          </span>
        ) as any
      });
      setCart([]);
      setCustomerId('');
      loadParts(); // Refresh stock quantities
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
    <div className="fade-in">
      <div className="page-header">
        <h1>Sales Terminal</h1>
        <p className="text-muted">Process parts sales and generate customer invoices.</p>
      </div>

      <div className="sales-layout">
        {/* Left: Product Selection */}
        <div className="product-catalog">
          <div className="search-box glass">
            <Search size={20} className="text-muted" />
            <input 
              placeholder="Search parts by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="parts-grid">
            {filteredParts.map(part => (
              <div key={part.partID} className="part-card glass">
                <div className="part-info">
                  <h4>{part.partName}</h4>
                  <p className="category">{part.category}</p>
                  <p className="stock">Stock: <span className={part.stockQuantity < 10 ? 'low' : ''}>{part.stockQuantity}</span></p>
                </div>
                <div className="part-footer">
                  <span className="price">${part.unitPrice}</span>
                  <button 
                    className="add-btn" 
                    onClick={() => addToCart(part)}
                    disabled={part.stockQuantity === 0}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cart & Checkout */}
        <aside className="checkout-sidebar glass">
          <div className="checkout-header">
            <ShoppingCart size={24} />
            <h3>Current Order</h3>
          </div>

          <div className="customer-input">
            <label>Customer ID</label>
            <input 
              type="number" 
              placeholder="Enter User ID" 
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart text-muted">Your cart is empty.</div>
            ) : (
              cart.map(item => (
                <div key={item.partID} className="cart-item">
                  <div className="item-main">
                    <p className="item-name">{item.partName}</p>
                    <p className="item-price">${item.unitPrice * item.selectedQuantity}</p>
                  </div>
                  <div className="item-controls">
                    <div className="qty-picker">
                      <button onClick={() => updateQuantity(item.partID, -1)}><Minus size={14} /></button>
                      <span>{item.selectedQuantity}</span>
                      <button onClick={() => updateQuantity(item.partID, 1)}><Plus size={14} /></button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.partID)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Loyalty Discount (10%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-selection">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="Cash">Cash</option>
              <option value="Card">Credit Card</option>
              <option value="Credit">Store Credit</option>
            </select>
          </div>

          <button 
            className="checkout-btn" 
            onClick={handleCheckout} 
            disabled={loading || cart.length === 0}
          >
            {loading ? 'Processing...' : 'Complete Purchase'}
          </button>

          {status.type && (
            <div className={`status-msg ${status.type}`}>
              {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{status.message}</span>
            </div>
          )}
        </aside>
      </div>

      <style>{`
        .sales-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
          margin-top: 2rem;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }
        .search-box input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 0;
        }
        .parts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        .part-card {
          padding: 1.5rem;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s ease;
        }
        .part-card:hover {
          transform: translateY(-5px);
        }
        .part-info h4 { margin-bottom: 0.5rem; font-size: 1.1rem; }
        .category { font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem; }
        .stock { font-size: 0.85rem; color: var(--text-muted); }
        .stock span.low { color: var(--error); font-weight: bold; }
        .part-footer {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .price { font-size: 1.2rem; font-weight: 800; color: white; }
        .add-btn {
          background: #f1f5f9;
          color: var(--primary);
          border: 1px solid var(--border);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-weight: bold;
        }
        .add-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .checkout-sidebar {
          padding: 2rem;
          background: white;
          border: 1px solid var(--border);
          border-radius: 16px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }
        .checkout-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: var(--primary);
        }
        .customer-input, .payment-selection {
          margin-bottom: 1.5rem;
        }
        .customer-input label, .payment-selection label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }
        .customer-input input, .payment-selection select {
          width: 100%;
        }
        .cart-items {
          margin: 2rem 0;
          min-height: 100px;
          max-height: 400px;
          overflow-y: auto;
        }
        .cart-item {
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border);
        }
        .item-main {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .item-name { font-weight: 600; font-size: 0.95rem; }
        .item-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .qty-picker {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .qty-picker button {
          background: white;
          color: var(--text);
          border: 1px solid var(--border);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        .qty-picker button:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .qty-picker span {
          width: 30px;
          text-align: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .remove-btn { 
          background: transparent; 
          color: #94a3b8; 
          border: none;
          padding: 8px;
        }
        .remove-btn:hover { color: var(--error); background: #fef2f2; border-radius: 6px; }
        .order-summary {
          background: rgba(255,255,255,0.03);
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 1.5rem;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        .discount { color: var(--success); font-weight: 600; }
        .total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          font-size: 1.2rem;
          font-weight: 800;
          color: white;
        }
        .checkout-btn {
          width: 100%;
          background: var(--success);
          color: white;
          padding: 1rem;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 10px 20px -5px rgba(34, 197, 94, 0.3);
        }
        .status-msg {
          margin-top: 1rem;
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .status-msg.success { background: rgba(34, 197, 94, 0.1); color: var(--success); }
        .status-msg.error { background: rgba(239, 68, 68, 0.1); color: var(--error); }
      `}</style>
    </div>
  );
};

export default SalesTerminal;
