import firestore from '@react-native-firebase/firestore';

type IAccount = {
    id: string;
}
type IGetAccounts = {
    userId: string;
    callback: (accounts: IAccount[]) => void;
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
  