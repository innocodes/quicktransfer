import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Store user details in Firestore
    await firestore().collection('users').doc(user.uid).set({
      fullName,
      email,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    
    const user = userCredential.user;

    // Fetch fullName from Firestore
    const userDoc = await firestore().collection('users').doc(user.uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('userData', userData);
      return {
        uid: user.uid,
        email: user.email,
        fullName: userData?.fullName, // Retrieve fullName from Firestore
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        providerId: user.providerId,
        metadata: user.metadata,
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
