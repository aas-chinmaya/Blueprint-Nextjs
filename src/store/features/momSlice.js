import axiosInstance from '@/lib/axiosInstance';


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchMoM = createAsyncThunk(
  'mom/fetchMoM',
  async (meetingId) => {
    const response = await axiosInstance.get(`/mom/byMeeting/${meetingId}`);
    return response.data.data;
  }
);

export const createMoM = createAsyncThunk(
  'mom/createMoM',
  async ( momData ) => {
    const response = await axiosInstance.post(`/mom/createmom`, momData);
    return response.data;
  }
);

export const updateMoM = createAsyncThunk(
  'mom/updateMoM',
  async (momData ) => {
    const response = await axiosInstance.put(`/mom/update`, momData);
    return response.data;
  }
);


const momSlice = createSlice({
  name: 'mom',
  initialState: {
    mom: [],
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
   
  },
});

export default momSlice.reducer;





