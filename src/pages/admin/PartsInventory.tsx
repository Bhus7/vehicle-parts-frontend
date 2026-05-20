import React, { useEffect, useState } from 'react';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Typography
} from '@mui/material';
import { Plus, Save, X, Edit, Trash2, ShieldAlert } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Vendor {
  id: number;
  vendorName: string;
}

interface Part {
  partID?: number;
  id?: number;
  partName: string;
  category: string;
  description: string;
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  vendorID?: number | null;
  vendor?: Vendor | null;
}

function PartsInventory() {
  const [parts, setParts] = useState<Part[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Add Modal State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    partName: '',
    category: '',
    description: '',
    unitPrice: '',
    stockQuantity: '',
    reorderLevel: '',
    vendorID: ''
  });

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    partName: '',
    category: '',
    description: '',
    unitPrice: '',
    stockQuantity: '',
    reorderLevel: '',
    vendorID: ''
  });
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);

  const fetchParts = () => {
    api.get('/Parts')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setParts(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setParts(res.data.data);
        } else {
          setParts([]);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setParts([]);
      });
  };

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
      .catch(() => setVendors([]));
  };

  useEffect(() => {
    fetchParts();
    fetchVendors();
  }, []);

  // Add Handlers
  const handleOpen = () => {
    if (vendors.length === 0) {
      alert('Please add a vendor in the Vendors Directory before adding parts.');
      return;
    }
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setFormData({ partName: '', category: '', description: '', unitPrice: '', stockQuantity: '', reorderLevel: '', vendorID: '' });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendorID) {
      alert('Please select a supplier vendor for this part.');
      return;
    }
    const payload = {
      partName: formData.partName,
      category: formData.category,
      description: formData.description,
      unitPrice: Number(formData.unitPrice),
      stockQuantity: Number(formData.stockQuantity),
      reorderLevel: Number(formData.reorderLevel),
      vendorID: Number(formData.vendorID)
    };

    api.post('/Parts', payload)
      .then(() => {
        alert('Part Added Successfully!');
        handleClose();
        fetchParts();
      })
      .catch((err) => {
        alert(err.response?.data || 'Failed to add part.');
      });
  };

  // Edit Handlers
  const handleEditOpen = (part: Part) => {
    setSelectedPartId(part.partID ?? part.id ?? null);
    setEditFormData({
      partName: part.partName,
      category: part.category,
      description: part.description,
      unitPrice: part.unitPrice.toString(),
      stockQuantity: part.stockQuantity.toString(),
      reorderLevel: part.reorderLevel.toString(),
      vendorID: part.vendorID ? part.vendorID.toString() : ''
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedPartId(null);
    setEditFormData({ partName: '', category: '', description: '', unitPrice: '', stockQuantity: '', reorderLevel: '', vendorID: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPartId === null) return;

    const payload = {
      partID: selectedPartId,
      partName: editFormData.partName,
      category: editFormData.category,
      description: editFormData.description,
      unitPrice: Number(editFormData.unitPrice),
      stockQuantity: Number(editFormData.stockQuantity),
      reorderLevel: Number(editFormData.reorderLevel),
      vendorID: editFormData.vendorID ? Number(editFormData.vendorID) : null
    };

    api.put(`/Parts/${selectedPartId}`, payload)
      .then(() => {
        alert('Part Updated Successfully!');
        handleEditClose();
        fetchParts();
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Failed to update part.');
      });
  };

  // Delete Handler
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      api.delete(`/Parts/${id}`)
        .then(() => {
          alert('Part Deleted Successfully!');
          fetchParts();
        })
        .catch((err) => {
          alert(err.response?.data?.message || 'Failed to delete part.');
        });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', m: 0 }}>
            Parts Inventory
          </Box>
          <Typography color="text.secondary" variant="body2">
            Each part must be registered and associated with a vendor supplier.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<Plus size={20} />} sx={{ color: '#fff' }}>
          Add New Part
        </Button>
      </Box>

      {/* Add Part Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={handleAddSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Part</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField
                select label="Supplier Vendor" required fullWidth
                value={formData.vendorID}
                onChange={(e) => setFormData({ ...formData, vendorID: e.target.value })}
              >
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.vendorName}</MenuItem>
                ))}
              </TextField>
              <TextField label="Part Name" fullWidth required value={formData.partName} onChange={(e) => setFormData({ ...formData, partName: e.target.value })} />
              <TextField label="Category" fullWidth required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              <TextField label="Description" fullWidth multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <TextField label="Unit Price (Rs)" type="number" fullWidth required value={formData.unitPrice} onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })} />
              <TextField label="Initial Stock Quantity" type="number" fullWidth required value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} />
              <TextField label="Reorder Level" type="number" fullWidth required value={formData.reorderLevel} onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} startIcon={<X size={18} />}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Save size={18} />} sx={{ color: '#fff' }}>Save Part</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Part Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="xs">
        <form onSubmit={handleEditSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Part Details</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField
                select label="Supplier Vendor" required fullWidth
                value={editFormData.vendorID}
                onChange={(e) => setEditFormData({ ...editFormData, vendorID: e.target.value })}
              >
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.vendorName}</MenuItem>
                ))}
              </TextField>
              <TextField label="Part Name" fullWidth required value={editFormData.partName} onChange={(e) => setEditFormData({ ...editFormData, partName: e.target.value })} />
              <TextField label="Category" fullWidth required value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} />
              <TextField label="Description" fullWidth multiline rows={2} value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} />
              <TextField label="Unit Price (Rs)" type="number" fullWidth required value={editFormData.unitPrice} onChange={(e) => setEditFormData({ ...editFormData, unitPrice: e.target.value })} />
              <TextField label="Stock Quantity" type="number" fullWidth required value={editFormData.stockQuantity} onChange={(e) => setEditFormData({ ...editFormData, stockQuantity: e.target.value })} />
              <TextField label="Reorder Level" type="number" fullWidth required value={editFormData.reorderLevel} onChange={(e) => setEditFormData({ ...editFormData, reorderLevel: e.target.value })} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleEditClose} startIcon={<X size={18} />}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Save size={18} />} sx={{ color: '#fff' }}>Update Part</Button>
          </DialogActions>
        </form>
      </Dialog>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f7f8fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Part Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Supplier Vendor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(parts) && parts.map((part) => (
              <TableRow key={part.partID ?? part.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{part.partName}</TableCell>
                <TableCell>{part.category}</TableCell>
                <TableCell>
                  <Chip
                    label={part.vendor?.vendorName || 'No Vendor Linked'}
                    size="small"
                    variant="outlined"
                    color={part.vendor ? "primary" : "default"}
                  />
                </TableCell>
                <TableCell>Rs {part.unitPrice.toLocaleString()}</TableCell>
                <TableCell>{part.stockQuantity}</TableCell>
                <TableCell>
                  {part.stockQuantity <= part.reorderLevel ? (
                    <Chip label="Low Stock" color="error" size="small" icon={<ShieldAlert size={14} />} />
                  ) : (
                    <Chip label="In Stock" color="success" size="small" sx={{ bgcolor: '#34B1AA', color: 'white' }} />
                  )}
                </TableCell>
                <TableCell>
                  <Button size="small" color="secondary" onClick={() => handleEditOpen(part)} startIcon={<Edit size={16} />} sx={{ mr: 1 }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(part.partID ?? part.id ?? 0)} startIcon={<Trash2 size={16} />}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PartsInventory;
