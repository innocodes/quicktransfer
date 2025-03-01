// src/api/authService.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type ILogin = {
    email: string;
    password: string;
};
// Login with email and password
export const loginWithEmail = async ({email, password}: ILogin) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);

    // Get additional user data from Firestore
    const userDoc = await firestore()
      .collection('users')
      .doc(userCredential.user.uid)
      .get() || {};

    if (!userDoc.exists) {
      throw new Error('User data not found');
    }

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userDoc.data()?.name,
      phoneNumber: userDoc.data()?.phoneNumber,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
