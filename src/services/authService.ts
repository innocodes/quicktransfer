import firestore from '@react-native-firebase/firestore';
import { fetchAccounts } from './accountService';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@react-native-firebase/auth';



export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const auth = getAuth(); // ✅ Use getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Store user details in Firestore
    await firestore().collection('users').doc(user.uid).set({
      fullName,
      email,
      createdAt: new Date(),
    });

    // Create a default account for the new user
    const defaultAccount = {
      userId: user.uid,
      bankName: 'Interswitch',
      accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Generate random 10-digit number
      balance: 1000, // ₦1,000 initial balance
      type: 'savings', // Default account type
      createdAt: new Date(),
    };

    await firestore().collection('accounts').add(defaultAccount);

    // Fetch the newly created account
    const accounts = await fetchAccounts(user.uid);

    return {
      uid: user.uid,
      email: user.email,
      fullName,
      accounts,
    };
  } catch (error) {
    throw error;
  }
};


export const signIn = async (email: string, password: string) => {
  try {
    const auth = getAuth(); // ✅ Use getAuth()
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Fetch fullName from Firestore
    const userDoc = await firestore().collection('users').doc(user.uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      console.log('userData', userData);

          // Fetch user accounts
    const accounts = await fetchAccounts(user?.uid);

      return {
        uid: user.uid,
        email: user.email,
        fullName: userData?.fullName, // Retrieve fullName from Firestore
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        providerId: user.providerId,
        metadata: user.metadata,
        accounts,
      };
    } else {
      throw new Error('User data not found in Firestore.');
    }
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    throw error;
  }
};
