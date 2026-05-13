import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import api from '../../api/axiosConfig';

interface Invoice {
  id: number;
  vendorName?: string;
  vendorId?: number;
  partName?: string;
  partId?: number;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  date: string;
}

function PurchaseHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    api.get('/PurchaseInvoices')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setInvoices(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setInvoices(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setInvoices([
          { id: 101, vendorName: 'AutoParts Wholesale', partName: 'Brake Pads', quantity: 50, totalAmount: 1499.50, date: '2023-10-25' },
          { id: 102, vendorName: 'Global Spares', partName: 'Oil Filter', quantity: 100, totalAmount: 1250.00, date: '2023-10-26' },
        ]);
      });
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 1 }}>
          Purchase History
        </Box>
        <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>
          Review past invoices and audit stock changes.
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f7f8fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Invoice ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Part</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(invoices) && invoices.map((inv) => (
              <TableRow key={inv.id} hover>
                <TableCell>#{inv.id}</TableCell>
                <TableCell>{inv.date}</TableCell>
                <TableCell>{inv.vendorName || `Vendor ${inv.vendorId}`}</TableCell>
                <TableCell>{inv.partName || `Part ${inv.partId}`}</TableCell>
                <TableCell>{inv.quantity}</TableCell>
                <TableCell>${inv.totalAmount?.toFixed(2) || (inv.quantity * inv.unitPrice).toFixed(2)}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PurchaseHistory;
