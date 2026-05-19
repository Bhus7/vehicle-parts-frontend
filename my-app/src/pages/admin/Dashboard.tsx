import { useEffect, useState } from 'react';
import { Box, Card, CardContent, useTheme } from '@mui/material';
import { DollarSign, Users, TrendingUp, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/admin/UI/StatCard';
import api from '../../api/axiosConfig';

const salesData = [
  { name: 'Jan', current: 4000, previous: 2400 },
  { name: 'Feb', current: 3000, previous: 1398 },
  { name: 'Mar', current: 2000, previous: 9800 },
  { name: 'Apr', current: 2780, previous: 3908 },
  { name: 'May', current: 1890, previous: 4800 },
  { name: 'Jun', current: 2390, previous: 3800 },
  { name: 'Jul', current: 3490, previous: 4300 },
];

const orderData = [
  { name: 'Week 1', thisMonth: 400, lastMonth: 240 },
  { name: 'Week 2', thisMonth: 300, lastMonth: 139 },
  { name: 'Week 3', thisMonth: 200, lastMonth: 980 },
  { name: 'Week 4', thisMonth: 278, lastMonth: 390 },
];

function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState({
    staffCount: 0,
    customerCount: 0,
    ordersCount: 0,
    revenue: 'Rs. 0',
    sales: 'Rs. 0'
  });

  useEffect(() => {
    // Fetch Staff Count
    api.get('/Staff')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setStats(prev => ({ ...prev, staffCount: res.data.data.length }));
        }
      }).catch(() => {});

    // Fetch Customer Count
    api.get('/Customers')
      .then(res => {
        if (Array.isArray(res.data)) {
          setStats(prev => ({ ...prev, customerCount: res.data.length }));
        }
      }).catch(() => {});

    // Fetch Orders/Appointments Count
    api.get('/Appointments/all')
      .then(res => {
        if (Array.isArray(res.data)) {
          setStats(prev => ({ ...prev, ordersCount: res.data.length }));
        }
      }).catch(() => {});

    // Fetch Sales & Revenue Stats
    api.get('/SalesInvoices/stats')
      .then(res => {
        if (res.data) {
          setStats(prev => ({
            ...prev,
            sales: `Rs. ${res.data.totalSales ? res.data.totalSales.toLocaleString() : 0}`,
            revenue: `Rs. ${res.data.totalRevenue ? res.data.totalRevenue.toLocaleString() : 0}`
          }));
        }
      }).catch(() => {});
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box component="h1" sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 1 }}>
          Dashboard Overview
        </Box>
        <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>
          Welcome back! Here is what's happening today.
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard title="Total Sales" value={stats.sales} color="#F29F67" progress={75} icon={<DollarSign size={18} />} />
        <StatCard title="Staff Members" value={stats.staffCount.toString()} color="#3B8FF3" progress={60} icon={<Users size={18} />} />
        <StatCard title="Total Customers" value={stats.customerCount.toString()} color="#34B1AA" progress={85} icon={<TrendingUp size={18} />} />
        <StatCard title="New Orders" value={stats.ordersCount.toString()} color="#E0B50F" progress={45} icon={<ShoppingCart size={18} />} />
      </Box>

      {/* Critical Alerts Section */}
      <Box sx={{ mb: 4 }}>
        <Box component="h2" sx={{ fontSize: '1.25rem', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, bgcolor: 'error.main', borderRadius: '50%' }} />
          Critical Alerts
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Card sx={{ borderLeft: '4px solid #f44336', bgcolor: 'rgba(244, 67, 54, 0.04)' }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ fontWeight: 'bold', color: 'error.main', mb: 0.5 }}>Low Stock Warning</Box>
              <Box sx={{ fontSize: '0.875rem' }}>
                5 items are currently below the threshold of 10 units. Emails have been sent to Admin.
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ borderLeft: '4px solid #ff9800', bgcolor: 'rgba(255, 152, 0, 0.04)' }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ fontWeight: 'bold', color: 'warning.main', mb: 0.5 }}>Overdue Payments</Box>
              <Box sx={{ fontSize: '0.875rem' }}>
                3 customers have unpaid credits older than 1 month. Automatic reminders are active.
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>



      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Box component="h2" sx={{ fontSize: '1.25rem', fontWeight: 'bold', mb: 1 }}>
                Sales Trend
              </Box>
              <Box sx={{ height: 320, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip contentStyle={{ borderRadius: 8, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                    <Legend />
                    <Line type="monotone" dataKey="current" name="Current Year" stroke="#F29F67" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="previous" name="Previous Year" stroke="#666666" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Box component="h2" sx={{ fontSize: '1.25rem', fontWeight: 'bold', mb: 1 }}>
                Orders Comparison
              </Box>
              <Box sx={{ height: 320, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                    <Legend />
                    <Bar dataKey="thisMonth" name="This Month" fill="#3B8FF3" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lastMonth" name="Last Month" fill="#1E1E2C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
