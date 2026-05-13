import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Plus } from 'lucide-react';
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

  useEffect(() => {
    api.get('/Vendors')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setVendors(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setVendors(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch vendors", err);
        setVendors([
          { id: 1, vendorName: 'AutoParts Wholesale', contactPerson: 'John Doe', email: 'john@autoparts.com', phone: '555-0100', address: '123 Industrial Way' },
          { id: 2, vendorName: 'Global Spares', contactPerson: 'Jane Smith', email: 'jane@globalspares.com', phone: '555-0101', address: '456 Business Park' },
        ]);
      });
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', m: 0 }}>
          Vendors Directory
        </Box>
        <Button variant="contained" color="primary" startIcon={<Plus size={20} />} sx={{ color: '#fff' }}>
          Add New Vendor
        </Button>
      </Box>

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
                  <Button size="small" color="secondary">Edit</Button>
                  <Button size="small" color="error">Delete</Button>
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
