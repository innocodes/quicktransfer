import firestore from '@react-native-firebase/firestore';

type IAccount = {
    id: string;
}
type IGetAccounts = {
    userId: string;
    callback: (accounts: IAccount[]) => void;
}

type ITransaction = {
    id: string;
};

type IGetTransactionns = {
    accountId: string;
    callback: (transactions: ITransaction[]) => void;
}
// Get all accounts for a user with real-time updates
export const getAccountsWithRealtime = ({userId, callback}: IGetAccounts) => {
    return firestore()
      .collection('accounts')
      .where('userId', '==', userId)
      .onSnapshot(
        (snapshot) => {
          const accounts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback(accounts);
        },
        (error: any) => {
          console.error('Accounts listener error:', error);
        //   callback([], error);
        }
      );
  };
  
  // Get transactions for an account with real-time updates
export const getTransactionsWithRealtime = ({accountId, callback}: IGetTransactionns) => {
    return firestore()
      .collection('transactions')
      .where('accountId', '==', accountId)
      .orderBy('date', 'desc')
      .limit(10)
      .onSnapshot(
        (snapshot) => {
          const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback(transactions);
        },
        (error) => {
          console.error('Transactions listener error:', error);
        //   callback([], error);
        }
      );
  };
  