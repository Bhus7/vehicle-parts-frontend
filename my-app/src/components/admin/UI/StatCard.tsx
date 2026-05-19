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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ minWidth: 0, flex: 1, pr: 1 }}>
          <Box component="div" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: '600', mb: 0.5, textTransform: 'uppercase', tracking: '0.05em' }}>
            {title}
          </Box>
          <Box component="div" sx={{ fontSize: '1.375rem', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value}
          </Box>
        </Box>
        
        <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={44}
            thickness={4}
            sx={{ color: 'rgba(0,0,0,0.05)', position: 'absolute' }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={44}
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
