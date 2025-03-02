import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, updateDoc, doc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import your Firestore instance
import { RootState } from '../store';

interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  type: 'savings' | 'checking';
}

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

// Fetch accounts from Firestore
export const fetchAccounts = createAsyncThunk('account/fetchAccounts', async (userId: string) => {
  const accountsRef = collection(db, 'accounts');
  const q = query(accountsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Account[];
});

// Add new account
export const addAccount = createAsyncThunk('account/addAccount', async ({ userId, account }: { userId: string; account: Omit<Account, 'id'> }) => {
  const accountsRef = collection(db, 'accounts');

  // Check if user already has 5 accounts
  const q = query(accountsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size >= 5) {
    throw new Error('You can only have up to 5 accounts.');
  }

  const docRef = await addDoc(accountsRef, { ...account, userId });
  return { id: docRef.id, ...account };
});

// Update account balance
export const updateBalance = createAsyncThunk('account/updateBalance', async ({ accountId, amount }: { accountId: string; amount: number }) => {
  const accountRef = doc(db, 'accounts', accountId);
  await updateDoc(accountRef, { balance: amount });
  return { accountId, amount };
});

// Remove account
export const removeAccount = createAsyncThunk('account/removeAccount', async (accountId: string) => {
  const accountRef = doc(db, 'accounts', accountId);
  await deleteDoc(accountRef);
  return accountId;
});

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch accounts';
        state.loading = false;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(updateBalance.fulfilled, (state, action) => {
        const account = state.accounts.find((acc) => acc.id === action.payload.accountId);
        if (account) {
          account.balance = action.payload.amount;
        }
      })
      .addCase(removeAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((acc) => acc.id !== action.payload);
      });
  },
});

export default accountSlice.reducer;
