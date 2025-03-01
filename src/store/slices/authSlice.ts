import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: {
    uid: string;
    email: string;
    fullName: string;
  } | null;
}


const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;

// Persist Config
const persistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

export default persistReducer(persistConfig, authSlice.reducer);
