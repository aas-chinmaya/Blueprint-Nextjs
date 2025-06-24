// File: store/features/fetchallProjectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

// Async thunk for fetching all projects
export const fetchAllProjects = createAsyncThunk(
  'fetchallProjects/fetchAll',  // Changed namespace to match slice name
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/projects/getallprojects');
      
      // Improved data handling
      if (response.data) {
        // Return the array of projects, handling different API response structures
        const projectData = Array.isArray(response.data) ? response.data : 
        response.data.data || response.data.projects || [];
        return projectData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

// 🔄 Thunk: Fetch projects assigned to a specific employee
export const fetchProjectsByEmployeeId = createAsyncThunk(
  'fetchProjectsByEmployeeId/fetch',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/projects/getall/${employeeId}`);

       console.log('Response from fetchProjectsByEmployeeId:', response.data);
        return response.data;
   
    } catch (error) {
      console.error('Error fetching projects by employee ID:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee projects');
    }
  }
);


const initialState = {
  projects: [],
  employeeProjects: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const fetchallProjectsSlice = createSlice({
  name: 'fetchallProjects', // Changed to match what's used in the component
  initialState,
  reducers: {
    clearProjects: (state) => {
      state.projects = [];
      state.status = 'idle';
      state.error = null;
    },
    clearEmployeeProjects: (state) => {
      state.employeeProjects = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle projects by employee ID
      .addCase(fetchProjectsByEmployeeId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProjectsByEmployeeId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeeProjects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectsByEmployeeId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      ;
  }
});

export const { clearProjects,clearEmployeeProjects  } = fetchallProjectsSlice.actions;
export default fetchallProjectsSlice.reducer;

 