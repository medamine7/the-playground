import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import services from "../../api";
import { STATUSES, UNKNOWN_ERROR_MESSAGE } from '../constants';

const initialState = {
  user: null,
  status: STATUSES.IDLE, 
  error: null,
};

const setCSRF = () => services.auth.get('/csrf-cookie');

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    await setCSRF();
    const { data } = await services.auth.post('/login', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || UNKNOWN_ERROR_MESSAGE);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    await setCSRF();
    const { data } = await services.auth.post('/register', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || UNKNOWN_ERROR_MESSAGE);
  }
});

export const logout = createAsyncThunk('auth/logout', async (payload, { rejectWithValue }) => {
  try {
    await setCSRF();
    services.auth.post('/logout', payload)
  } catch (error) {
    rejectWithValue(error.response?.data?.message || UNKNOWN_ERROR_MESSAGE);
  }
});

export const refresh = createAsyncThunk('auth/refresh', async (payload, { rejectWithValue }) => {
  try {
    await setCSRF();
    services.auth.update('/user', payload)
  } catch (error) {
    rejectWithValue(error.response?.data?.message || UNKNOWN_ERROR_MESSAGE);
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async (payload, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const { user } = auth;
    await setCSRF();
    const { data } = await services.auth.put(`/users/${user.id}`, payload);
    return data;
  } catch (error) {
    rejectWithValue(error.response?.data?.message || UNKNOWN_ERROR_MESSAGE);
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.fulfilled, (state, action) => {
      return {
        status: STATUSES.SUCCESS,
        user: action.payload,
        error: null,
      }
    })
    .addCase(login.pending, (state) => {
      state.status = STATUSES.LOADING;
    })
    .addCase(login.rejected, (state, action) => {
      return {
        status: STATUSES.ERROR,
        error: action.payload,
        user: null,
      }
    })
    // Register
    .addCase(register.fulfilled, (state, action) => {
      return {
        status: STATUSES.SUCCESS,
        user: action.payload,
        error: null,
      }
    })
    .addCase(register.pending, (state) => {
      state.status = STATUSES.LOADING;
    })
    .addCase(register.rejected, (state, action) => {
      return {
        status: STATUSES.ERROR,
        error: action.payload,
        user: null,
      }
    })
    // Logout
    .addCase(logout.fulfilled, () => {
      return initialState;
    })
    .addCase(logout.pending, (state) => {
      state.status = STATUSES.LOADING;
    })
    // refresh
    .addCase(refresh.fulfilled, (state, action) => {
      return {
        status: STATUSES.SUCCESS,
        user: action.payload,
        error: null,
      }
    })
    .addCase(refresh.pending, (state) => {
      state.status = STATUSES.LOADING;
    })
    // updateUser
    .addCase(updateUser.fulfilled, (state, action) => {
      return {
        status: STATUSES.SUCCESS,
        user: action.payload,
        error: null,
      }
    })
    .addCase(updateUser.pending, (state) => {
      state.status = STATUSES.LOADING;
    })
    .addCase(updateUser.rejected, (state, action) => {
      return {
        status: STATUSES.ERROR,
        error: action.payload,
        user: null,
      }
    })
  },
})

export const { setStatus } = authSlice.actions;

export default authSlice.reducer