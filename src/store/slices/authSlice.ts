import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginWithEmail, getCurrentUser, signOut, updateLastLogin } from '../../api/authService';

type AuthLogin = {
    email: string;
    password: string;
};

  // Async thunk for login
  export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: AuthLogin, { rejectWithValue }) => {
      try {
        const user = await loginWithEmail({email, password});
        await updateLastLogin(user.uid);
        return user;
      } catch (error: any) {
        return rejectWithValue(error.message || 'Login failed');
      }
    }
  );

  // Async thunk for checking current user
  export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
      try {
        const user = await getCurrentUser();
        if (user) {
          await updateLastLogin(user?.uid);
        }
        return user;
      } catch (error: any) {
        return rejectWithValue(error.message || 'Authentication check failed');
      }
    }
  );
  
// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

type ReduxState = {
  user: null;
  isAuthenticated: boolean;
  loading: boolean;
  error: null;
}


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
