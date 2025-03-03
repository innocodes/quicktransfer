import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const rnBiometrics = new ReactNativeBiometrics();

export const checkBiometricAvailability = async () => {
  const { available, biometryType } = await rnBiometrics.isSensorAvailable();
  return { available, biometricName: biometryType };
};

export const createBiometricKey = async () => {
  const { keysExist } = await rnBiometrics.biometricKeysExist();
  if (!keysExist) {
    const { publicKey } = await rnBiometrics.createKeys();
    return !!publicKey;
  }
  return true;
};

export const authenticateWithBiometrics = async () => {
  try {
    const result = await rnBiometrics.simplePrompt({
      promptMessage: 'Confirm your identity',
    });

    if (result.success) {
      return await getCredentials();
    }
  } catch (error) {
    throw new Error('Biometric authentication failed');
  }
  return null;
};

export const saveCredentials = async (email, password) => {
  return Keychain.setGenericPassword(email, password, {
    service: 'biometric_login',
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const getCredentials = async () => {
  const credentials = await Keychain.getGenericPassword({ service: 'biometric_login' });
  return credentials ? { email: credentials.username, password: credentials.password } : null;
};
