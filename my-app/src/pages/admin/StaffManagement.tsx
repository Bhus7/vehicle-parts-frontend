import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem as MuiMenuItem } from '@mui/material';
import { Plus, Save, X } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', password: '' });

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
        // Refresh list
        api.get('/Staff').then(res => {
          if (res.data.success) {
            setStaff(res.data.data);
          }
        }).catch(() => {});
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || 'Failed to register staff.';
        alert(errorMsg);
      });
  };

  useEffect(() => {
    // Attempting to fetch staff from standard endpoint
    api.get('/Staff')
      .then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setStaff(res.data.data);
        } else if (Array.isArray(res.data)) {
          setStaff(res.data);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
        setStaff([
          { userID: 1, fullName: 'Admin User', email: 'admin@system.com', phone: '555-0199', address: 'Main Office', status: 'Active', roleID: 1, roleName: 'ADMIN' },
          { userID: 2, fullName: 'Warehouse Manager', email: 'manager@system.com', phone: '555-0188', address: 'Warehouse A', status: 'Active', roleID: 2, roleName: 'STAFF' },
        ]);
      });
  }, []);


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
                label="Full Name"
                fullWidth
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextField
                label="Address"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
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

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f7f8fa' }}>
            <TableRow>
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
                  <Button size="small" color="secondary">Edit</Button>
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
