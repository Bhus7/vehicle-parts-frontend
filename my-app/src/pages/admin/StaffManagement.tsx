import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Plus, Save, X, Edit, Trash2 } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Staff {
  userID: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  roleID: number;
  roleName?: string;
}

function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  
  // Register Modal State
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', password: '' });

  // Edit Modal State
  const [editOpen, setEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ fullName: '', phone: '', address: '' });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const fetchStaff = () => {
    api.get('/Staff')
      .then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setStaff(res.data.data);
        } else if (Array.isArray(res.data)) {
          setStaff(res.data);
        } else {
          setStaff([]);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setStaff([]);
      });
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Register Handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ fullName: '', email: '', phone: '', address: '', password: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/Staff', formData)
      .then((res) => {
        alert(res.data.message || 'Staff Registered Successfully!');
        handleClose();
        fetchStaff();
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || 'Failed to register staff.';
        alert(errorMsg);
      });
  };

  // Edit Handlers
  const handleEditOpen = (s: Staff) => {
    setSelectedUserId(s.userID);
    setEditFormData({ fullName: s.fullName, phone: s.phone, address: s.address });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedUserId(null);
    setEditFormData({ fullName: '', phone: '', address: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId === null) return;

    api.put(`/Staff/${selectedUserId}`, editFormData)
      .then(() => {
        alert('Staff Updated Successfully!');
        handleEditClose();
        fetchStaff();
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || 'Failed to update staff.';
        alert(errorMsg);
      });
  };

  // Delete Handler
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      api.delete(`/Staff/${id}`)
        .then(() => {
          alert('Staff Deleted Successfully!');
          fetchStaff();
        })
        .catch((err) => {
          const errorMsg = err.response?.data?.message || 'Failed to delete staff.';
          alert(errorMsg);
        });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 1 }}>
            Staff Management
          </Box>
          <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>
            Manage staff registration and roles (Admin only).
          </Box>
        </Box>
        <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<Plus size={20} />} sx={{ color: '#fff' }}>
          Register Staff
        </Button>
      </Box>

      {/* Register Staff Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Register New Staff</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField
                label="Full Name" fullWidth required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <TextField
                label="Email Address" type="email" fullWidth required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Phone" fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextField
                label="Address" fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <TextField
                label="Password" type="password" fullWidth required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} startIcon={<X size={18} />}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Save size={18} />} sx={{ color: '#fff' }}>
              Save Staff
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="xs">
        <form onSubmit={handleEditSubmit}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Staff Details</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
              <TextField
                label="Full Name" fullWidth required
                value={editFormData.fullName}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
              />
              <TextField
                label="Phone" fullWidth
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
              <TextField
                label="Address" fullWidth
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleEditClose} startIcon={<X size={18} />}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Save size={18} />} sx={{ color: '#fff' }}>
              Update Staff
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f7f8fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(staff) && staff.map((s) => (
              <TableRow key={s.userID} hover>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>#{s.userID}</TableCell>
                <TableCell>{s.fullName}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell>{s.address}</TableCell>
                <TableCell>
                  <Chip 
                    label={s.status} 
                    color={s.status === 'Active' ? 'success' : 'default'} 
                    size="small" 
                    sx={s.status === 'Active' ? { bgcolor: '#34B1AA', color: 'white' } : {}}
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" color="secondary" onClick={() => handleEditOpen(s)} startIcon={<Edit size={16} />} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(s.userID)} startIcon={<Trash2 size={16} />}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StaffManagement;
