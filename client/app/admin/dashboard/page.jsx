'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetrics, fetchRecentOrders, fetchSalesData, fetchCategoryData } from '@/app/redux/slices/dashboardSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { FaDollarSign, FaShoppingCart, FaBox, FaUsers } from 'react-icons/fa';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { metrics, recentOrders, salesData, categoryData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchMetrics());
    dispatch(fetchRecentOrders());
    dispatch(fetchSalesData());
    dispatch(fetchCategoryData());
  }, [dispatch]);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>

      {loading && (
        <div className="flex justify-center items-center mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Total Sales</CardTitle>
            <FaDollarSign className="text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              ${metrics.totalSales.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Total Orders</CardTitle>
            <FaShoppingCart className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{metrics.totalOrders}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Total Products</CardTitle>
            <FaBox className="text-rose-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{metrics.totalProducts}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Total Customers</CardTitle>
            <FaUsers className="text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{metrics.totalCustomers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Product Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Pie
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Order ID</TableHead>
                <TableHead className="text-xs sm:text-sm">Customer</TableHead>
                <TableHead className="text-xs sm:text-sm">Date</TableHead>
                <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                <TableHead className="text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
              {recentOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="text-xs sm:text-sm">{order.orderId}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{order.customerName}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-xs sm:text-sm">${order.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <a href={`/admin/orders/${order.orderId}`} className="text-blue-500 hover:underline">View</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;