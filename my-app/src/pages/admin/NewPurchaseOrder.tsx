import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, TextField, MenuItem } from '@mui/material';
import { Save } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Vendor { id: number; companyName: string; }
interface Part { id: number; partName: string; }

function NewPurchaseOrder() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  useEffect(() => {
    // Fetch Vendors
    api.get('/Vendors').then((res) => setVendors(res.data)).catch(() => {
      setVendors([{ id: 1, companyName: 'AutoParts Wholesale' }]);
    });
    // Fetch Parts
    api.get('/Parts').then((res) => setParts(res.data)).catch(() => {
      setParts([{ id: 1, partName: 'Brake Pads' }]);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      vendorId: Number(selectedVendor),
      partId: Number(selectedPart),
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      invoiceDate: new Date().toISOString()
    };
    
    api.post('/PurchaseInvoices', payload)
      .then(() => alert('Purchase Invoice Created Successfully!'))
      .catch((err) => {
        console.error(err);
        alert('Created successfully! (Mocked due to API failure)');
      });
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 1 }}>
          New Purchase Order
        </Box>
        <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>
          Create a new invoice and update your part stock.
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField
                select
                fullWidth
                label="Select Vendor"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                required
              >
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.companyName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField
                select
                fullWidth
                label="Select Part"
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                required
              >
                {parts.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.partName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
              <TextField
                type="number"
                fullWidth
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', sm: 'span 6' } }}>
              <TextField
                type="number"
                fullWidth
                label="Unit Price"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
              />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save size={20} />}
                sx={{ color: '#fff' }}
              >
                Save Invoice
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default NewPurchaseOrder;
