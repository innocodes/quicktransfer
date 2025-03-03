import firestore from '@react-native-firebase/firestore';

export const fetchAccounts = async (userId: string) => {
  try {
    const snapshot = await firestore()
      .collection('accounts')
      .where('userId', '==', userId) // Filter accounts by userId
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};


export const addNewAccount = async (account: {userId: string; bankName: string; accountNumber: string; balance: number; type: 'savings' | 'checking'; createdAt: Date }) => {
  try {
    const newAccountRef = await firestore().collection('accounts').add(account);
    return { id: newAccountRef.id, ...account };
  } catch (error) {
    throw error;
  }
};

export const updateAccountBalance = async (id: string, amount: number) => {
  try {
    const accountRef = firestore().collection('accounts').doc(id);
    const accountDoc = await accountRef.get();

    if (!accountDoc.exists) {
      throw new Error('Account not found');
    }

    const currentBalance = accountDoc.data()?.balance || 0;
    await accountRef.update({ balance: currentBalance + amount });
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (id: string) => {
  try {
    await firestore().collection('accounts').doc(id).delete();
  } catch (error) {
    throw error;
  }
};
