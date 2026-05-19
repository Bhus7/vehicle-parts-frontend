import React, { useEffect, useState } from 'react';
import {
  Box, Button, Paper, TextField, MenuItem, Typography,
  Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Divider, Chip, Alert, Snackbar
} from '@mui/material';
import { PlusCircle, Trash2, ShoppingCart, CheckCircle, HelpCircle } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useLocation } from 'react-router-dom';

interface Vendor { id: number; vendorName: string; }
interface Part { partID: number; partName: string; unitPrice: number; stockQuantity: number; vendorID?: number | null; }
interface LineItem { partID: number; partName: string; quantity: number; purchasePrice: number; }

function NewPurchaseOrder() {
  const location = useLocation();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/Vendors').then((res) => setVendors(res.data)).catch(() => setVendors([]));
    api.get('/Parts').then((res) => setParts(res.data)).catch(() => setParts([]));
  }, []);

  // Intercept redirected state from Customer Requests Catalog
  useEffect(() => {
    if (location.state && parts.length > 0) {
      const stateObj = location.state as {
        prefillPart?: string;
        prefillQty?: number;
        requestId?: number;
        vendorId?: number;
      };

      if (stateObj.vendorId) {
        setSelectedVendor(String(stateObj.vendorId));
      }
      if (stateObj.requestId) {
        setRequestId(stateObj.requestId);
      }

      if (stateObj.prefillPart) {
        const existingPart = parts.find(
          p => p.partName.toLowerCase() === stateObj.prefillPart?.toLowerCase()
        );

        if (existingPart) {
          const itemExists = lineItems.some(i => i.partID === existingPart.partID);
          if (!itemExists) {
            setLineItems([{
              partID: existingPart.partID,
              partName: existingPart.partName,
              quantity: stateObj.prefillQty || 1,
              purchasePrice: Number(existingPart.unitPrice * 0.7), // Default purchase price to 70% of sell price
            }]);
          }
        } else {
          setError(`Part '${stateObj.prefillPart}' does not exist in inventory. Please register it under Parts Inventory first!`);
        }
      }
    }
  }, [location.state, parts]);

  const selectedPartObj = parts.find(p => p.partID === Number(selectedPart));

  // Filter parts according to the selected Vendor!
  const filteredParts = parts.filter(p => p.vendorID === Number(selectedVendor));

  const handleAddItem = () => {
    if (!selectedPart || !quantity || !purchasePrice) {
      setError('Please select a part and fill in quantity and price.');
      return;
    }
    const partObj = parts.find(p => p.partID === Number(selectedPart));
    if (!partObj) return;
    const existing = lineItems.findIndex(i => i.partID === partObj.partID);
    if (existing !== -1) {
      setError('This part is already added. Remove it first to change quantity.');
      return;
    }
    setLineItems(prev => [...prev, {
      partID: partObj.partID,
      partName: partObj.partName,
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
    }]);
    setSelectedPart('');
    setQuantity('');
    setPurchasePrice('');
  };

  const handleRemoveItem = (partID: number) => {
    setLineItems(prev => prev.filter(i => i.partID !== partID));
  };

  const grandTotal = lineItems.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) { setError('Please select a vendor.'); return; }
    if (lineItems.length === 0) { setError('Please add at least one part.'); return; }

    setLoading(true);
    const payload = {
      vendorID: Number(selectedVendor),
      invoiceDate: new Date().toISOString(),
      items: lineItems.map(i => ({
        partID: i.partID,
        quantity: i.quantity,
        purchasePrice: i.purchasePrice,
      })),
      requestId: requestId ? Number(requestId) : null,
    };

    try {
      await api.post('/PurchaseInvoices', payload);
      setSuccess(true);
      setLineItems([]);
      setSelectedVendor('');
      setRequestId(null);
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create purchase invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          New Purchase Order
        </Typography>
        <Typography color="text.secondary">
          Parts are filtered and listed <b>according to the selected Vendor</b>. Add a vendor first, associate parts with them, then place an order here.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 3 }}>
        {/* Left Panel - Form */}
        <Box>
          {/* Vendor Selection */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Step 1 — Select Vendor</Typography>
            <TextField
              select fullWidth label="Vendor / Supplier"
              value={selectedVendor}
              onChange={(e) => {
                setSelectedVendor(e.target.value);
                setLineItems([]); // Clear line items if vendor changes to maintain vendor consistency
                setSelectedPart('');
              }}
            >
              {vendors.length === 0 && <MenuItem disabled>No vendors found</MenuItem>}
              {vendors.map((v) => (
                <MenuItem key={v.id} value={v.id}>{v.vendorName}</MenuItem>
              ))}
            </TextField>
          </Paper>

          {/* Add Parts */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, opacity: selectedVendor ? 1 : 0.6 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>Step 2 — Add Parts</Typography>
            {!selectedVendor && (
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                Please select a Vendor first to view and add their associated parts.
              </Alert>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr auto' }, gap: 2, alignItems: 'flex-end' }}>
              <TextField
                select label="Select Part"
                value={selectedPart}
                disabled={!selectedVendor}
                onChange={(e) => {
                  setSelectedPart(e.target.value);
                  const p = parts.find(p => p.partID === Number(e.target.value));
                  if (p) setPurchasePrice(p.unitPrice.toString());
                }}
              >
                {filteredParts.length === 0 && (
                  <MenuItem disabled>
                    {selectedVendor ? 'No parts registered for this vendor' : 'Select a vendor first'}
                  </MenuItem>
                )}
                {filteredParts.map((p) => (
                  <MenuItem key={p.partID} value={p.partID}>
                    {p.partName}
                    <Typography variant="caption" color="text.secondary" ml={1}>
                      (Stock: {p.stockQuantity})
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="number" label="Quantity" value={quantity}
                disabled={!selectedVendor}
                onChange={(e) => setQuantity(e.target.value)}
                inputProps={{ min: 1 }}
              />
              <TextField
                type="number" label="Unit Price (Rs)" value={purchasePrice}
                disabled={!selectedVendor}
                onChange={(e) => setPurchasePrice(e.target.value)}
                inputProps={{ min: 0.01, step: 0.01 }}
              />
              <Button
                variant="contained" onClick={handleAddItem}
                disabled={!selectedVendor || !selectedPart}
                startIcon={<PlusCircle size={18} />}
                sx={{ height: 56, px: 3, borderRadius: 2, bgcolor: '#3B8FF3', '&:hover': { bgcolor: '#2d7de0' } }}
              >
                Add
              </Button>
            </Box>
            {selectedPartObj && (
              <Box mt={1}>
                <Chip label={`Current stock: ${selectedPartObj.stockQuantity} units`} size="small" color="info" variant="outlined" />
              </Box>
            )}
          </Paper>

          {/* Line Items Table */}
          {lineItems.length > 0 && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Step 3 — Review Items</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Part</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Qty</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Unit Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Subtotal</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.partID} hover>
                      <TableCell>{item.partName}</TableCell>
                      <TableCell align="center">
                        <Chip label={item.quantity} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">Rs {item.purchasePrice.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        Rs {(item.quantity * item.purchasePrice).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => handleRemoveItem(item.partID)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>

        {/* Right Panel - Summary */}
        <Box>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 24 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ShoppingCart size={20} />
              <Typography variant="h6" fontWeight="bold">Order Summary</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {lineItems.length === 0 ? (
              <Typography color="text.secondary" fontSize={14} textAlign="center" py={3}>
                No items added yet.
              </Typography>
            ) : (
              <>
                {lineItems.map((item) => (
                  <Box key={item.partID} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography fontSize={13} noWrap sx={{ maxWidth: 180 }}>{item.partName} ×{item.quantity}</Typography>
                    <Typography fontSize={13} fontWeight="medium">Rs {(item.quantity * item.purchasePrice).toLocaleString()}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">Grand Total</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Rs {grandTotal.toLocaleString()}
                  </Typography>
                </Box>
                <Box mt={1} mb={3}>
                  <Chip
                    label={`${lineItems.length} part type(s) · ${lineItems.reduce((s, i) => s + i.quantity, 0)} units total`}
                    size="small" color="success" variant="outlined"
                  />
                </Box>
              </>
            )}

            <Button
              fullWidth variant="contained" size="large"
              onClick={handleSubmit}
              disabled={loading || lineItems.length === 0 || !selectedVendor}
              startIcon={<CheckCircle size={20} />}
              sx={{
                borderRadius: 2, py: 1.5, fontWeight: 'bold',
                bgcolor: '#34B1AA', '&:hover': { bgcolor: '#2a9994' },
                '&:disabled': { opacity: 0.5 }
              }}
            >
              {loading ? 'Submitting...' : 'Submit Purchase Invoice'}
            </Button>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
              Stock will be updated automatically upon submission.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Feedback */}
      <Snackbar open={success} autoHideDuration={5000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Purchase Invoice created! Stock has been updated automatically. ✅
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}

export default NewPurchaseOrder;
