import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Plus, Save, X, Edit, Trash2 } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Vendor {
  id: number;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

function VendorsDirectory() {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Add Modal State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ vendorName: '', contactPerson: '', phone: '', email: '', address: '' });

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ vendorName: '', contactPerson: '', phone: '', email: '', address: '' });
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

  const fetchVendors = () => {
    api.get('/Vendors')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setVendors(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setVendors(res.data.data);
        } else {
          setVendors([]);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setVendors([]);
      });
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Add Handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ vendorName: '', contactPerson: '', phone: '', email: '', address: '' });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/Vendors', formData)
      .then(() => {
        alert('Vendor Added Successfully!');
        handleClose();
        fetchVendors();
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Failed to add vendor.');
      });
  };

  // Edit Handlers
  const handleEditOpen = (vendor: Vendor) => {
    setSelectedVendorId(vendor.id);
    setEditFormData({
      vendorName: vendor.vendorName,
      contactPerson: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedVendorId(null);
    setEditFormData({ vendorName: '', contactPerson: '', phone: '', email: '', address: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVendorId === null) return;

    api.put(`/Vendors/${selectedVendorId}`, { id: selectedVendorId, ...editFormData })
      .then(() => {
        alert('Vendor Updated Successfully!');
        handleEditClose();
        fetchVendors();
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Failed to update vendor.');
      });
  };

  // Delete Handler
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      api.delete(`/Vendors/${id}`)
        .then(() => {
          alert('Vendor Deleted Successfully!');
          fetchVendors();
        })
        .catch((err) => {
          alert(err.response?.data?.message || 'Failed to delete vendor.');
        });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', m: 0 }}>
          Vendors Directory
        </Box>
        <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<Plus size={20} />} sx={{ color: '#fff' }}>
          Add New Vendor
        </Button>
      </Box>

      {/* Add Vendor Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={handleAddSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Vendor</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField label="Vendor Name" fullWidth required value={formData.vendorName} onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })} />
              <TextField label="Contact Person" fullWidth value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
              <TextField label="Phone" fullWidth value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <TextField label="Email" type="email" fullWidth value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <TextField label="Address" fullWidth value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} startIcon={<X size={18} />}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Save size={18} />} sx={{ color: '#fff' }}>Save Vendor</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="xs">
        <form onSubmit={handleEditSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Vendor Details</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField label="Vendor Name" fullWidth required value={editFormData.vendorName} onChange={(e) => setEditFormData({ ...editFormData, vendorName: e.target.value })} />
              <TextField label="Contact Person" fullWidth value={editFormData.contactPerson} onChange={(e) => setEditFormData({ ...editFormData, contactPerson: e.target.value })} />
              <TextField label="Phone" fullWidth value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} />
              <TextField label="Email" type="email" fullWidth value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} />
              <TextField label="Address" fullWidth value={editFormData.address} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleEditClose} startIcon={<X size={18} />}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Save size={18} />} sx={{ color: '#fff' }}>Update Vendor</Button>
          </DialogActions>
        </form>
      </Dialog>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f7f8fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Vendor Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact Person</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(vendors) && vendors.map((vendor) => (
              <TableRow key={vendor.id} hover>
                <TableCell>{vendor.vendorName}</TableCell>
                <TableCell>{vendor.contactPerson}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.address}</TableCell>
                <TableCell>
                  <Button size="small" color="secondary" onClick={() => handleEditOpen(vendor)} startIcon={<Edit size={16} />} sx={{ mr: 1 }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(vendor.id)} startIcon={<Trash2 size={16} />}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default VendorsDirectory;
