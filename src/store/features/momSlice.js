import axiosInstance from '@/lib/axiosInstance';


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchMoM = createAsyncThunk(
  'mom/fetchMoM',
  async (meetingId) => {
    const response = await axiosInstance.get(`/mom/${meetingId}`);
    return response.data;
  }
);

export const createMoM = createAsyncThunk(
  'mom/createMoM',
  async ({ meetingId, momData }) => {
    const response = await axiosInstance.post(`/mom/${meetingId}`, momData);
    return response.data;
  }
);

export const updateMoM = createAsyncThunk(
  'mom/updateMoM',
  async ({ meetingId, momData }) => {
    const response = await axiosInstance.put(`/api/mom/${meetingId}`, momData);
    return response.data;
  }
);

export const deleteMoM = createAsyncThunk(
  'mom/deleteMoM',
  async (meetingId) => {
    await axiosInstance.delete(`/mom/${meetingId}`);
    return meetingId;
  }
);

const momSlice = createSlice({
  name: 'mom',
  initialState: {
    mom: null,
    momLoading: false,
    momError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoM.pending, (state) => {
        state.momLoading = true;
      })
      .addCase(fetchMoM.fulfilled, (state, action) => {
        state.momLoading = false;
        state.mom = action.payload;
      })
      .addCase(fetchMoM.rejected, (state, action) => {
        state.momLoading = false;
        state.momError = action.error.message;
      })
      .addCase(createMoM.pending, (state) => {
        state.momLoading = true;
      })
      .addCase(createMoM.fulfilled, (state, action) => {
        state.momLoading = false;
        state.mom = action.payload;
      })
      .addCase(createMoM.rejected, (state, action) => {
        state.momLoading = false;
        state.momError = action.error.message;
      })
      .addCase(updateMoM.pending, (state) => {
        state.momLoading = true;
      })
      .addCase(updateMoM.fulfilled, (state, action) => {
        state.momLoading = false;
        state.mom = action.payload;
      })
      .addCase(updateMoM.rejected, (state, action) => {
        state.momLoading = false;
        state.momError = action.error.message;
      })
      .addCase(deleteMoM.pending, (state) => {
        state.momLoading = true;
      })
      .addCase(deleteMoM.fulfilled, (state) => {
        state.momLoading = false;
        state.mom = null;
      })
      .addCase(deleteMoM.rejected, (state, action) => {
        state.momLoading = false;
        state.momError = action.error.message;
      });
  },
});

export default momSlice.reducer;





