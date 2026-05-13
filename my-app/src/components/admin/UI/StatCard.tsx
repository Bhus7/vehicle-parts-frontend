import React from 'react';
import { Card, CardContent, Box, CircularProgress } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
  progress: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, progress, icon }) => {
  return (
    <Card sx={{ position: 'relative', overflow: 'hidden', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
        <Box>
          <Box component="div" sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: '600', mb: 0.5 }}>
            {title}
          </Box>
          <Box component="div" sx={{ fontSize: '2.125rem', fontWeight: 'bold' }}>
            {value}
          </Box>
        </Box>
        
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={56}
            thickness={4}
            sx={{ color: 'rgba(0,0,0,0.05)', position: 'absolute' }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={56}
            thickness={4}
            sx={{ color }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
