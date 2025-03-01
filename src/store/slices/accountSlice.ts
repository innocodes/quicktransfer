import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Account {
  id: number;
  bankName: string;
  accountNumber: string;
  balance: number;
  type: "savings" | "checking";
}

interface AccountState {
  accounts: Account[];
}

const initialState: AccountState = {
  accounts: [
    {
      id: 1,
      bankName: "First Bank",
      accountNumber: "1234567890",
      balance: 15000,
      type: "savings",
    },
    {
      id: 2,
      bankName: "GTBank",
      accountNumber: "0987654321",
      balance: 32000,
      type: "checking",
    },
  ],
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
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
  },
});

export const { addAccount, updateBalance, removeAccount } = accountSlice.actions;
export default accountSlice.reducer;
