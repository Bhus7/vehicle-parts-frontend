import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Plus, Save, X, Edit, Trash2 } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Part {
  id: number;
  partName: string;
  category: string;
  description: string;
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
}

function PartsInventory() {
  const [parts, setParts] = useState<Part[]>([]);

  // Add Modal State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ partName: '', category: '', description: '', unitPrice: '', stockQuantity: '', reorderLevel: '' });

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ partName: '', category: '', description: '', unitPrice: '', stockQuantity: '', reorderLevel: '' });
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

  useEffect(() => {
    fetchParts();
  }, []);

  // Add Handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ partName: '', category: '', description: '', unitPrice: '', stockQuantity: '', reorderLevel: '' });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      partName: formData.partName,
      category: formData.category,
      description: formData.description,
      unitPrice: Number(formData.unitPrice),
      stockQuantity: Number(formData.stockQuantity),
      reorderLevel: Number(formData.reorderLevel)
    };

    api.post('/Parts', payload)
      .then(() => {
        alert('Part Added Successfully!');
        handleClose();
        fetchParts();
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Failed to add part.');
      });
  };

  // Edit Handlers
  const handleEditOpen = (part: Part) => {
    setSelectedPartId(part.id);
    setEditFormData({
      partName: part.partName,
      category: part.category,
      description: part.description,
      unitPrice: part.unitPrice.toString(),
      stockQuantity: part.stockQuantity.toString(),
      reorderLevel: part.reorderLevel.toString()
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedPartId(null);
    setEditFormData({ partName: '', category: '', description: '', unitPrice: '', stockQuantity: '', reorderLevel: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPartId === null) return;

    const payload = {
      partName: editFormData.partName,
      category: editFormData.category,
      description: editFormData.description,
      unitPrice: Number(editFormData.unitPrice),
      stockQuantity: Number(editFormData.stockQuantity),
      reorderLevel: Number(editFormData.reorderLevel)
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
        <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', m: 0 }}>
          Parts Inventory
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
              <TextField label="Part Name" fullWidth required value={formData.partName} onChange={(e) => setFormData({ ...formData, partName: e.target.value })} />
              <TextField label="Category" fullWidth required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              <TextField label="Description" fullWidth multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <TextField label="Unit Price" type="number" fullWidth required value={formData.unitPrice} onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })} />
              <TextField label="Stock Quantity" type="number" fullWidth required value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} />
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
              <TextField label="Part Name" fullWidth required value={editFormData.partName} onChange={(e) => setEditFormData({ ...editFormData, partName: e.target.value })} />
              <TextField label="Category" fullWidth required value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} />
              <TextField label="Description" fullWidth multiline rows={2} value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} />
              <TextField label="Unit Price" type="number" fullWidth required value={editFormData.unitPrice} onChange={(e) => setEditFormData({ ...editFormData, unitPrice: e.target.value })} />
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
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(parts) && parts.map((part) => (
              <TableRow key={part.id} hover>
                <TableCell>{part.partName}</TableCell>
                <TableCell>{part.category}</TableCell>
                <TableCell>${part.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{part.stockQuantity}</TableCell>
                <TableCell>
                  {part.stockQuantity <= part.reorderLevel ? (
                    <Chip label="Low Stock" color="error" size="small" />
                  ) : (
                    <Chip label="In Stock" color="success" size="small" sx={{ bgcolor: '#34B1AA', color: 'white' }} />
                  )}
                </TableCell>
                <TableCell>
                  <Button size="small" color="secondary" onClick={() => handleEditOpen(part)} startIcon={<Edit size={16} />} sx={{ mr: 1 }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(part.id)} startIcon={<Trash2 size={16} />}>Delete</Button>
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
