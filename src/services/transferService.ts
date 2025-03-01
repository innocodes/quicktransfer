import firestore from '@react-native-firebase/firestore';

export const transferFunds = async (
  userId: string,
  fromAccountId: string,
  toAccountId: string,
  amount: number
) => {
  const db = firestore();
  const fromAccountRef = db.collection('users').doc(userId).collection('accounts').doc(fromAccountId);
  const toAccountRef = db.collection('users').doc(userId).collection('accounts').doc(toAccountId);

  try {
    await db.runTransaction(async (transaction) => {
      const fromAccount = await transaction.get(fromAccountRef);
      const toAccount = await transaction.get(toAccountRef);

      if (!fromAccount.exists || !toAccount.exists) {
        throw new Error('One of the accounts does not exist');
      }

      const fromBalance = fromAccount.data()?.balance || 0;
      if (fromBalance < amount) {
        throw new Error('Insufficient balance');
      }

      transaction.update(fromAccountRef, { balance: fromBalance - amount });
      transaction.update(toAccountRef, { balance: (toAccount.data()?.balance || 0) + amount });
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};
