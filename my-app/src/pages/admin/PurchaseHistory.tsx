import { useEffect, useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, Dialog, DialogContent, DialogActions, Typography, Divider, IconButton
} from '@mui/material';
import { Eye, ShoppingBag, X, Printer, Hash } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Part {
  partID: number;
  partName: string;
  category: string;
}

interface InvoiceDetail {
  purchaseDetailID: number;
  partID: number;
  part?: Part;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

interface Invoice {
  id: number;
  vendorId?: number;
  vendorName?: string;
  totalAmount?: number;
  invoiceDate: string;
  details?: InvoiceDetail[];
}

function PurchaseHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchInvoices = () => {
    api.get('/PurchaseInvoices')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setInvoices(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setInvoices(res.data.data);
        } else {
          setInvoices([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setInvoices([]);
      });
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenDetails = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedInvoice(null);
    setDetailsOpen(false);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-purchase-invoice');
    if (!printContent) return;
    
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    // Restore page
    document.body.innerHTML = originalContent;
    window.location.reload(); // Refresh to restore react state cleanly
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 1 }}>
          Purchase History
        </Box>
        <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>
          Review past invoices, supplier purchases, and audit stock updates.
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f7f8fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Invoice ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vendor Supplier</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Parts Included</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Total Qty</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Grand Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold', pl: 4 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No purchase invoices found in history.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => {
                const partsText = inv.details?.map(d => d.part?.partName || `Part #${d.partID}`).join(', ') || 'N/A';
                const totalQty = inv.details?.reduce((sum, d) => sum + d.quantity, 0) || 0;

                return (
                  <TableRow key={inv.id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{inv.id}</TableCell>
                    <TableCell>
                      {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell>{inv.vendorName || `Vendor ID: ${inv.vendorId}`}</TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" title={partsText} noWrap>
                        {partsText}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={totalQty} size="small" variant="outlined" color="primary" />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'teal' }}>
                      Rs {inv.totalAmount?.toLocaleString() || '0'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small" variant="outlined"
                        startIcon={<Eye size={14} />}
                        onClick={() => handleOpenDetails(inv)}
                        sx={{ borderRadius: 2 }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invoice Details Dialog Modal */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} fullWidth maxWidth="md" {...({ PaperProps: { sx: { borderRadius: '2rem', overflow: 'hidden' } } } as any)}>
        {selectedInvoice && (
          <>
            {/* Header Dialog Controls */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Button size="small" variant="contained" color="primary" startIcon={<Printer size={16} />} onClick={handlePrint} sx={{ borderRadius: 2, px: 2 }}>
                Print Invoice
              </Button>
              <IconButton onClick={handleCloseDetails} size="small">
                <X size={18} />
              </IconButton>
            </Box>

            <DialogContent sx={{ p: 0 }}>
              {/* Premium Printable Invoice Wrapper */}
              <Box id="printable-purchase-invoice" sx={{ bgcolor: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
                
                {/* Printable Invoice Header Strip */}
                <Box sx={{ bgcolor: '#0f172a', p: { xs: 4, md: 5 }, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '1rem', bgcolor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: '900', fontStyle: 'italic', color: '#fff' }}>A</span>
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: '900', letterSpacing: '-0.05em', lineHeight: 1, m: 0 }}>
                        AUTOPARTS
                      </Typography>
                      <Typography variant="caption" sx={{ letterSpacing: '0.15em', fontWeight: '900', color: '#64748b', fontSize: '8px' }}>
                        ENTERPRISE SUPPLY NODE
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b', fontSize: '9px', fontWeight: '900', letterSpacing: '0.15em', justifyContent: 'flex-end', mb: 0.5 }}>
                      <Hash size={11} /> PURCHASE REF
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: '900', letterSpacing: '-0.03em', color: '#fff', m: 0 }}>
                      PINV-{selectedInvoice.id.toString().padStart(6, '0')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: '700', fontSize: '10px' }}>
                      DIGITAL LEDGER ENTRY
                    </Typography>
                  </Box>
                </Box>

                {/* Invoice Body Content */}
                <Box sx={{ p: { xs: 4, md: 6 }, spaceY: 6 }}>
                  
                  {/* Supplier & Receipt Info Grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4, mb: 5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.15em', display: 'block', mb: 1.5 }}>
                        SUPPLIER DETAILS
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: '900', letterSpacing: '-0.02em', mb: 0.5 }}>
                        {selectedInvoice.vendorName || `Vendor ID: ${selectedInvoice.vendorId}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                        Registered Enterprise Partner
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.15em', display: 'block', mb: 1.5 }}>
                        TRANSACTION DATE
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: '900', letterSpacing: '-0.02em', mb: 0.5 }}>
                        {new Date(selectedInvoice.invoiceDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                        TS: {new Date(selectedInvoice.invoiceDate).toLocaleTimeString()}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.15em', display: 'block', mb: 1.5 }}>
                        LEDGER STATUS
                      </Typography>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, borderRadius: '8px', border: '1px solid #bbf7d0', bgcolor: '#f0fdf4', color: '#166534' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                        <Typography sx={{ fontSize: '9px', fontWeight: '900', letterSpacing: '0.1em' }}>
                          SETTLED & DEPOSITED
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '10px' }}>
                        Stock increment completed ✅
                      </Typography>
                    </Box>
                  </Box>

                  {/* Components Table */}
                  <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <ShoppingBag size={12} /> COMPONENT SPECIFICATIONS
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '1.25rem', overflow: 'hidden', borderColor: '#f1f5f9', mb: 4 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: '900', fontSize: '9px', color: '#475569', py: 2 }}>COMPONENT DESCRIPTION</TableCell>
                          <TableCell sx={{ fontWeight: '900', fontSize: '9px', color: '#475569', py: 2 }} align="center">QTY</TableCell>
                          <TableCell sx={{ fontWeight: '900', fontSize: '9px', color: '#475569', py: 2 }} align="right">UNIT COST</TableCell>
                          <TableCell sx={{ fontWeight: '900', fontSize: '9px', color: '#475569', py: 2 }} align="right">TOTAL</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInvoice.details?.map((detail) => (
                          <TableRow key={detail.purchaseDetailID} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>
                              {detail.part?.partName || `Part ID #${detail.partID}`}
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: '900', color: '#64748b', fontSize: '13px' }}>
                              {detail.quantity}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: '700', color: '#64748b', fontSize: '13px' }}>
                              Rs {detail.unitCost.toLocaleString()}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: '900', color: '#0f172a', fontSize: '13px' }}>
                              Rs {detail.subtotal.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Summary & Disclaimers block */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, pt: 2 }}>
                    <Box sx={{ maxWidth: '380px', p: 3, borderRadius: '1.25rem', bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
                      <Typography variant="caption" sx={{ fontSize: '9px', fontWeight: '900', color: '#92400e', letterSpacing: '0.15em', display: 'block', mb: 0.5 }}>
                        SYSTEM AUDIT INFORMATION
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '11px', color: '#b45309', lineHeight: 1.5, display: 'block' }}>
                        This document verifies that parts have been successfully purchased and inventory levels in <b>Parts Inventory</b> have been updated accordingly. Retain this digital document for tax audits.
                      </Typography>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '280px' } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.1em' }}>NET VALUE</Typography>
                        <Typography sx={{ fontSize: '12px', fontWeight: '700' }}>Rs {selectedInvoice.totalAmount?.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontSize: '9px', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.1em' }}>TAX OFFSET (0%)</Typography>
                        <Typography sx={{ fontSize: '12px', fontWeight: '700', color: 'text.secondary' }}>Rs 0.00</Typography>
                      </Box>
                      <Divider sx={{ my: 1.5 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Box>
                          <Typography sx={{ fontSize: '8px', fontWeight: '900', color: '#94a3b8', letterSpacing: '0.15em' }}>SETTLEMENT TOTAL</Typography>
                          <Typography sx={{ fontSize: '10px', fontWeight: '700', color: '#64748b' }}>NPR VALUATION</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: '900', color: '#4f46e5', letterSpacing: '-0.04em' }}>
                          Rs {selectedInvoice.totalAmount?.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
              <Button onClick={handleCloseDetails} variant="outlined" sx={{ px: 3, borderRadius: 2 }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default PurchaseHistory;
