import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Plus } from 'lucide-react';
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

  useEffect(() => {
    // Fetch from real API
    api.get('/Parts')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setParts(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setParts(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch parts, using mock data", err);
        // Fallback to mock data if API fails
        setParts([
          { id: 1, partName: 'Brake Pads', category: 'Braking', description: 'Heavy duty pads', unitPrice: 29.99, stockQuantity: 45, reorderLevel: 10 },
          { id: 2, partName: 'Oil Filter', category: 'Maintenance', description: 'High flow filter', unitPrice: 12.50, stockQuantity: 8, reorderLevel: 5 },
          { id: 3, partName: 'Spark Plug', category: 'Ignition', description: 'Iridium spark plug', unitPrice: 5.99, stockQuantity: 120, reorderLevel: 20 },
        ]);
      });
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', m: 0 }}>
          Parts Inventory
        </Box>
        <Button variant="contained" color="primary" startIcon={<Plus size={20} />} sx={{ color: '#fff' }}>
          Add New Part
        </Button>
      </Box>

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

export default PartsInventory;
