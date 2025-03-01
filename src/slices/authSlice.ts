import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginWithEmail, getCurrentUser, signOut, updateLastLogin } from './../api/authService';

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

