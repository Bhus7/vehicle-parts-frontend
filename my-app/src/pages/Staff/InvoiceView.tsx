import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Mail, ArrowLeft, Download, Check } from 'lucide-react';
import { staffApi } from '../../api/api';

const InvoiceView = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (id) loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const response = await staffApi.getInvoice(parseInt(id!));
      setInvoice(response.data);
    } catch (error) {
      console.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSend = () => {
    setSending(true);
    // Simulate sending email
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  if (loading) return <div className="p-8">Loading invoice...</div>;
  if (!invoice) return <div className="p-8">Invoice not found.</div>;

  return (
    <div className="fade-in no-print-padding">
      <div className="invoice-actions no-print">
        <Link to="/staff/search" className="back-btn">
          <ArrowLeft size={18} /> Back
        </Link>
        <div className="action-buttons">
          <button className="secondary-btn" onClick={handlePrint}>
            <Printer size={18} /> Print Invoice
          </button>
          <button className="primary-btn" onClick={handleSend} disabled={sending}>
            {sending ? 'Sending...' : sent ? <><Check size={18} /> Sent!</> : <><Mail size={18} /> Send to Customer</>}
          </button>
        </div>
      </div>

      <div className="invoice-paper glass">
        <header className="invoice-header">
          <div className="company-info">
            <h1 className="brand-name">AutoParts</h1>
            <p>123 Service Lane</p>
            <p>Kathmandu, Nepal</p>
            <p>Phone: +977 1-4444444</p>
          </div>
          <div className="invoice-meta">
            <h2>INVOICE</h2>
            <p className="invoice-id">#{invoice.salesInvoiceID}</p>
            <p className="date">Date: {new Date(invoice.salesDate).toLocaleDateString()}</p>
          </div>
        </header>

        <div className="billing-info">
          <div className="bill-to">
            <p className="label">BILL TO</p>
            <h3>{invoice.customerName}</h3>
            <p>{invoice.customerEmail}</p>
            <p>{invoice.customerPhone}</p>
            <p>{invoice.customerAddress}</p>
          </div>
          <div className="payment-status">
            <p className="label">STATUS</p>
            <span className={`status-badge ${invoice.paymentStatus.toLowerCase()}`}>
              {invoice.paymentStatus}
            </span>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th className="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, idx: number) => (
              <tr key={idx}>
                <td>{item.partName}</td>
                <td>{item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)}</td>
                <td className="text-right">${item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-footer">
          <div className="notes">
            <p className="label">NOTES</p>
            <p>Thank you for your business. Please keep this receipt for warranty purposes.</p>
          </div>
          <div className="totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${invoice.totalAmount.toFixed(2)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="total-row discount">
                <span>Loyalty Discount (10%)</span>
                <span>-${invoice.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row grand-total">
              <span>Final Total</span>
              <span>${invoice.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .invoice-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .action-buttons { display: flex; gap: 1rem; }
        
        .invoice-paper {
          background: white;
          color: #1e293b;
          padding: 4rem;
          border-radius: 8px;
          max-width: 850px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        
        .invoice-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 2rem;
          margin-bottom: 2rem;
        }
        .brand-name { color: var(--primary); font-size: 2rem; margin-bottom: 0.5rem; }
        .invoice-meta { text-align: right; }
        .invoice-id { font-size: 1.5rem; font-weight: 800; color: #64748b; }
        
        .billing-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3rem;
        }
        .label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin-bottom: 0.5rem; }
        .bill-to h3 { font-size: 1.25rem; margin-bottom: 0.25rem; }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .status-badge.paid { background: #dcfce7; color: #166534; }
        
        .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 3rem; }
        .invoice-table th { text-align: left; padding: 1rem; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 0.8rem; }
        .invoice-table td { padding: 1rem; border-bottom: 1px solid #f1f5f9; }
        .text-right { text-align: right; }
        
        .invoice-footer { display: flex; justify-content: space-between; gap: 4rem; }
        .notes { flex: 1; font-size: 0.85rem; color: #64748b; }
        .totals { width: 250px; }
        .total-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-weight: 600; }
        .discount { color: #16a34a; }
        .grand-total {
          border-top: 2px solid #f1f5f9;
          margin-top: 1rem;
          padding-top: 1rem;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
        }

        @media print {
          .no-print { display: none !important; }
          .no-print-padding { padding: 0 !important; }
          .invoice-paper { box-shadow: none; border: none; padding: 0; width: 100%; max-width: 100%; }
          body { background: white; }
          .sidebar, .top-header { display: none; }
          .content { margin-left: 0; }
        }
        
        .secondary-btn {
          background: white;
          border: 1px solid var(--border);
          padding: 0.6rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .primary-btn {
          background: var(--primary);
          color: white;
          padding: 0.6rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
