import firestore from "@react-native-firebase/firestore";

interface Account {
  bankName: string;
  accountNumber: string;
  balance: number;
  type: "savings" | "checking";
}

export const addAccount = async (userId: string, account: Account) => {
  try {
    const accountRef = firestore().collection("users").doc(userId).collection("accounts");
    await accountRef.add(account);
  } catch (error) {
    throw error;
  }
};

export const getAccounts = async (userId: string) => {
  try {
    const accountsSnapshot = await firestore()
      .collection("users")
      .doc(userId)
      .collection("accounts")
      .get();

    return accountsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};
