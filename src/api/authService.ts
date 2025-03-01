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

// Check if user is logged in
export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth().onAuthStateChanged(async (user) => {
        unsubscribe();
        if (user) {
          try {
            // Get additional user data from Firestore
            const userDoc = await firestore()
              .collection('users')
              .doc(user.uid)
              .get();

            if (!userDoc.exists) {
              resolve(null);
              return;
            }

            resolve({
              uid: user.uid,
              email: user.email,
              name: userDoc.data()?.name,
              phoneNumber: userDoc.data()?.phoneNumber,
            });
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(null);
        }
      });
    });
  };

// Sign out
export const signOut = async () => {
    try {
      await auth().signOut();
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

// Update last login time
export const updateLastLogin = async (userId: string) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .update({
          lastLogin: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Update last login error:', error);
    }
  };