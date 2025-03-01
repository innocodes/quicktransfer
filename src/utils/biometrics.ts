import { Alert } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

// Initialize the biometrics library
const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true, // allows PIN/Pattern/Password as fallback
});

  // Function to check biometric availability
  export const checkBiometricAvailability = async () => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      if (available) {
        let biometricName = 'Biometrics';
        if (biometryType === BiometryTypes.FaceID) {
          biometricName = 'Face ID';
        } else if (biometryType === BiometryTypes.TouchID) {
          biometricName = 'Touch ID';
        } else if (biometryType === BiometryTypes.Biometrics) {
          biometricName = 'Fingerprint';
        }


        return {
            available,
            biometricName,
          };
        }
    } catch (error) {
      console.error('Error checking biometrics:', error);
      Alert.alert('Error', 'Failed to check biometric availability');
    }
  };

// Create a biometric key for the user
export const createBiometricKey = async (userId: any) => {
    try {
      const { publicKey } = await rnBiometrics.createKeys();
      if (publicKey) {
        // You could store this public key to Firebase for verification
        // This is a simple example - in production, you might want to verify this key
        console.log('Biometric enrollment successful');

        // Store a flag indicating biometrics is enabled for this user
        await Keychain.setInternetCredentials(
          'biometricsEnabled',
          userId,
          'true'
        );
      }
    } catch (error) {
      console.error('Error creating biometric key:', error);
      Alert.alert('Error', 'Failed to enable biometric authentication');
    }
  };

  type ILogin = {
    email: string;
    password: string;
  }

// Save credentials to secure storage after successful login
export const saveCredentials = async ({email, password}: ILogin) => {
    try {
      await Keychain.setGenericPassword(email, password);
      return true;
    } catch (error) {
      console.error('Error saving credentials:', error);
      return false;
    }
  };

  export const getCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return {
          email: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  };
