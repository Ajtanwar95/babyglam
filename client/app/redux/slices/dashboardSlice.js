import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL  from '../../config/apiConfig';
// Thunks for async API calls
export const fetchMetrics = createAsyncThunk('dashboard/fetchMetrics', async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`);
  return response.data;
});

export const fetchRecentOrders = createAsyncThunk('dashboard/fetchRecentOrders', async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/recent-orders`);
  return response.data;
});

export const fetchSalesData = createAsyncThunk('dashboard/fetchSalesData', async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/sales`);
  return {
    labels: response.data.labels,
    datasets: [
      {
        label: 'Sales ($)',
        data: response.data.values,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
      },
    ],
  };
});

export const fetchCategoryData = createAsyncThunk('dashboard/fetchCategoryData', async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/categories`);
  return {
    labels: response.data.labels,
    datasets: [
      {
        label: 'Product Categories',
        data: response.data.values,
        backgroundColor: ['#10b981', '#3b82f6', '#f43f5e'],
      },
    ],
  };
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: { totalSales: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0 },
    recentOrders: [],
    salesData: { labels: [], datasets: [] },
    categoryData: { labels: [], datasets: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSalesData.fulfilled, (state, action) => {
        state.salesData = action.payload;
      })
      .addCase(fetchCategoryData.fulfilled, (state, action) => {
        state.categoryData = action.payload;
      });
  },
});

export default dashboardSlice.reducer;