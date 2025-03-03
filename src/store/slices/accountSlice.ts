import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Account {
  id: number;
  bankName: string;
  accountNumber: string;
  balance: number;
  type: 'savings' | 'checking';
}

interface AccountState {
  accounts: Account[];
}

const initialState: AccountState = {
  accounts: [],
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    updateBalance: (state, action: PayloadAction<{ id: number; amount: number }>) => {
      const account = state.accounts.find((acc) => acc.id === action.payload.id);
      if (account) {
        account.balance += action.payload.amount;
      }
    },
    removeAccount: (state, action: PayloadAction<number>) => {
      state.accounts = state.accounts.filter((acc) => acc.id !== action.payload);
    },
    clearAccounts: (state) => {
      state.accounts = [];
    },
  },
});

export const { setAccounts, addAccount, updateBalance, removeAccount, clearAccounts } = accountSlice.actions;
export default accountSlice.reducer;
