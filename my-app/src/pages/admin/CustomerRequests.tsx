import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, MenuItem, Select, Button, Chip,
  FormControl, InputLabel, Alert, CircularProgress, Tooltip
} from '@mui/material';
import { ClipboardList, ArrowRight, User, ShoppingCart, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

interface PartRequest {
  id: number;
  userID: number;
  user?: { fullName: string; email: string };
  partName: string;
  category: string;
  quantity: number;
  notes: string;
  status: string;
  createdDate: string;
  vendorID?: number | null;
  vendor?: { vendorName: string };
}

interface Vendor {
  id: number;
  vendorName: string;
}

function CustomerRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<{ [reqId: number]: number }>({});

  const fetchRequestsAndVendors = async () => {
    setLoading(true);
    try {
      const [reqsRes, vendorsRes] = await Promise.all([
        api.get('/PartRequests'),
        api.get('/Vendors')
      ]);
      setRequests(reqsRes.data);
      setVendors(vendorsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load customer requests data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestsAndVendors();
  }, []);

  const handleVendorSelect = (requestId: number, vendorId: number) => {
    setSelectedVendors(prev => ({ ...prev, [requestId]: vendorId }));
  };

  const handleAssignVendor = async (requestId: number) => {
    const vendorId = selectedVendors[requestId];
    if (!vendorId) {
      alert('Please select a vendor first.');
      return;
    }

    try {
      await api.put(`/PartRequests/${requestId}/assign-vendor`, { vendorId });
      alert('Vendor assigned and request marked as Approved!');
      fetchRequestsAndVendors();
    } catch (err) {
      console.error(err);
      alert('Failed to assign vendor.');
    }
  };

  const handleTriggerPurchase = (req: PartRequest) => {
    if (!req.vendorID) {
      alert('Please assign a vendor to this request first.');
      return;
    }

    // Redirect to New Purchase screen with pre-fill state!
    navigate('/admin/purchase/new', {
      state: {
        prefillPart: req.partName,
        prefillQty: req.quantity,
        requestId: req.id,
        vendorId: req.vendorID
      }
    });
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Chip label="Pending" sx={{ bgcolor: 'rgba(242, 159, 103, 0.15)', color: '#F29F67', fontWeight: 'bold' }} />;
      case 'Approved':
        return <Chip label="Approved" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 'bold' }} />;
      case 'Ordered':
        return <Chip label="Ordered" sx={{ bgcolor: 'rgba(251, 146, 60, 0.15)', color: '#FB923C', fontWeight: 'bold' }} />;
      case 'Fulfilled':
        return <Chip label="Fulfilled" sx={{ bgcolor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', fontWeight: 'bold' }} />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(242, 159, 103, 0.1)', color: '#F29F67' }}>
          <ClipboardList size={28} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Customer Part Requests
          </Typography>
          <Typography color="text.secondary">
            Manage incoming parts requests from customers, assign wholesale vendors, and initiate purchase orders.
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          {requests.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
              <HelpCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <Typography variant="h6" fontWeight="bold">No Requests Found</Typography>
              <Typography variant="body2">When customers request out-of-stock items, they will appear here.</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Requested Part</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Qty</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Notes</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Linked Vendor</TableCell>
                  <TableCell style={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell>
                      {new Date(req.createdDate).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={16} className="text-slate-400" />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {req.user?.fullName || 'Customer'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {req.user?.email || ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell fontWeight="bold">{req.partName}</TableCell>
                    <TableCell>
                      <Chip label={req.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell fontWeight="bold">{req.quantity}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.notes || <span style={{ color: '#ccc', fontStyle: 'italic' }}>None</span>}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(req.status)}</TableCell>
                    <TableCell>
                      {req.vendor ? (
                        <Typography variant="body2" fontWeight="medium">
                          {req.vendor.vendorName}
                        </Typography>
                      ) : req.status === 'Pending' ? (
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                          <InputLabel>Select Vendor</InputLabel>
                          <Select
                            value={selectedVendors[req.id] || ''}
                            label="Select Vendor"
                            onChange={(e) => handleVendorSelect(req.id, Number(e.target.value))}
                          >
                            {vendors.map((v) => (
                              <MenuItem key={v.id} value={v.id}>{v.vendorName}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Assigned</span>
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: 'right' }}>
                      {req.status === 'Pending' && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleAssignVendor(req.id)}
                          sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                          Approve
                        </Button>
                      )}
                      {req.status === 'Approved' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<ShoppingCart size={14} />}
                          onClick={() => handleTriggerPurchase(req)}
                          sx={{ textTransform: 'none', fontWeight: 'bold', bgcolor: '#F29F67', '&:hover': { bgcolor: '#e08f58' } }}
                        >
                          Order Part
                        </Button>
                      )}
                      {req.status === 'Fulfilled' && (
                        <Chip label="Ready" color="success" size="small" variant="outlined" />
                      )}
                      {req.status === 'Ordered' && (
                        <Chip label="In Transit" color="warning" size="small" variant="outlined" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default CustomerRequests;
