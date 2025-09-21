import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReviews = createAsyncThunk('reviews/fetchReviews', async (productId) => {
  const response = await axios.get(`http://localhost:5000/api/v2/reviews?productId=${productId}`);
  return response.data;
});

export const createReview = createAsyncThunk('reviews/createReview', async (reviewData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('rating', reviewData.rating);
    formData.append('comment', reviewData.comment);
    formData.append('name', reviewData.name || '');
    formData.append('email', reviewData.email || '');
    if (reviewData.file) formData.append('file', reviewData.file);

    const response = await axios.post(`http://localhost:5000/api/v2/reviews/${reviewData.productId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateReview = createAsyncThunk('reviews/updateReview', async (reviewData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('rating', reviewData.rating);
    formData.append('comment', reviewData.comment);
    formData.append('name', reviewData.name || '');
    formData.append('email', reviewData.email || '');
    if (reviewData.file) formData.append('file', reviewData.file);

    const response = await axios.patch(`http://localhost:5000/api/v2/reviews/${reviewData._id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteReview = createAsyncThunk('reviews/deleteReview', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/v2/reviews/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.items.push(action.payload.review);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r._id === action.payload.review._id);
        if (index !== -1) state.items[index] = action.payload.review;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;