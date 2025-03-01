import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: "credit" | "debit";
}

interface TransactionState {
  recent: Transaction[];
}

const initialState: TransactionState = {
  recent: [
    { id: 1, name: "Airtime Purchase", amount: 500, type: "debit" },
    { id: 2, name: "Bank Transfer", amount: 2000, type: "debit" },
    { id: 3, name: "Deposit", amount: 5000, type: "credit" },
  ],
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.recent.unshift(action.payload);
    },
  },
});

export const { addTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
