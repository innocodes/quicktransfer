// src/screens/auth/LoginScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../store/slices/authSlice';
import {setUser} from '../../store/slices/authSlice';
import {signIn} from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {
  createBiometricKey,
  saveCredentials,
  getCredentials,
  checkBiometricAvailability,
  authenticateWithBiometrics,
} from '../../utils/biometrics';
import colors from '../../theme/colors';
import {ArrowIcon, LockIcon, MailIcon} from '../../components/common/Icons';
import store, {persistor, RootState} from '../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserName} from '../../store/slices/userSlice';
import {setAccounts} from '../../store/slices/accountSlice';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  const [bioEmail, setBioEmail] = useState('');
  const [bioPassword, setBioPassword] = useState('');
  const [bioLogin, setBioLogin] = useState(false);

  const [emailError, setEmailError] = useState('');
  const dispatch = useDispatch();

  const fullName = useSelector((state: RootState) => state.auth.user?.fullName);
  const fullUser = useSelector((state: RootState) => state.auth.user);

  const [isHydrated, setIsHydrated] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to persistor to detect hydration completion
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setIsHydrated(true);
        console.log('hydration completed');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkBiometrics = async () => {
      const {available} = await checkBiometricAvailability();
      setBiometricsAvailable(available);
    };

    checkBiometrics();
  }, []);

  const [retrievedName, setRetrievedName] = useState('');

  useEffect(() => {
    setTimeout(() => {
      console.log(
        'Redux User after rehydration in login:',
        store.getState().user.name,
      );
      setRetrievedName(store.getState().user.name);
    }, 200); // Delayed to ensure state is rehydrated
  }, []);

  const handleBiometricLogin = async () => {
    try {
      console.log('step 1');
      // Perform biometric authentication
      const biometricsAuthentication = await authenticateWithBiometrics();
      const {email, password} = biometricsAuthentication;
      setBioEmail(email);
      setBioPassword(password);

      console.log(biometricsAuthentication, 'biometrics authentication');
      if (!biometricsAuthentication) {
        Alert.alert('Biometric Authentication Failed', 'Please try again.');
        return;
      }
      console.log('step 2');
      const storedEmail = await AsyncStorage.getItem('saved_email');
      console.log('step 3', storedEmail);
      if (!storedEmail) {
        Alert.alert(
          'Biometric Login',
          'Please log in manually first to enable biometrics.',
        );
        return;
      }

      const credentials = await getCredentials();
      console.log('step 4');
      if (credentials) {
        console.log('step 5');
        setBioLogin(true);
        setBioEmail(credentials.email);
        setBioPassword(credentials.password);
        // ✅ Pass credentials directly to handleLogin()
        handleLogin(credentials.email, credentials.password);
        handleLogin();
      }
    } catch (error) {
      Alert.alert('Biometric Authentication Failed', error.message);
    }
  };

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    try {
      console.log('step 6');
      setIsLoading(true);

      const finalEmail = loginEmail || email || bioEmail;
      const finalPassword = loginPassword || password || bioPassword;

      console.log('Using credentials:', finalEmail, finalPassword);

      console.log('bioEmail:', bioEmail);
      console.log('bioPassword:', bioPassword);

      // if (!finalEmail || !finalPassword) {
      //   throw new Error('Missing email or password');
      // }

      const user = await signIn(finalEmail, finalPassword);

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email || '',
          fullName: user.fullName,
        }),
      );

      await AsyncStorage.setItem('saved_email', finalEmail);

      // Check if biometrics was previously enabled
      const isBiometricEnabledBefore = await AsyncStorage.getItem(
        'biometrics_enabled',
      );

      const biometricsEnabled = await createBiometricKey();
      if (biometricsEnabled) {
        await saveCredentials(finalEmail, finalPassword);

        // Show success alert only if this is the first time enabling biometrics
        if (!isBiometricEnabledBefore) {
          Alert.alert('Success', 'Biometric login is now enabled.');
          await AsyncStorage.setItem('biometrics_enabled', 'true'); // Mark as enabled
        }
      }

      dispatch(setUserName(user.fullName));
      dispatch(setAccounts(user.accounts));
      persistor.flush(); // Ensures persist
      console.log('user response', user);
      navigation.navigate('Dashboard');
    } catch (error: any) {
      console.log('error', error.message);
      if (error.message.includes('invalid-credential')) {
        console.log('yes, error');
        Alert.alert(
          'Login Failed',
          'Wrong credentials, please try again with correct credentials.',
        );
      }
      if (error.message.includes('unknown')) {
        Alert.alert('Network Error', 'Please try again!');
      }
    } finally {
      setIsLoading(false);
      setBioLogin(false);
    }
  };

  // AsyncStorage.clear();

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <View style={styles.logoContainer}>
        {/* <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.appName}>QuickTransfer</Text>
      </View>

      <View style={styles.welcomeContainer}>
        {retrievedName ? (
          <Text style={styles.welcomeBack}>Welcome back, {retrievedName}!</Text>
        ) : (
          <Text style={styles.welcomeText}>Welcome to QuickTransfer</Text>
        )}
        <Text style={styles.subtitle}>Fast, secure banking on the go</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Basic email input with validation */}
        <Input
          label="Email"
          value={email}
          onChangeText={(text: string) => {
            setEmail(text);
            validateEmail(text);
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
          error={emailError}
          leftComponent={<MailIcon />}
          returnKeyType="next"
        />

        {/* Password input with toggle visibility */}
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={true}
          leftComponent={<LockIcon />}
          returnKeyType="done"
        />

        {/* {error && <Text style={styles.errorText}>{error}</Text>} */}

        <Button
          title="Login"
          type="primary"
          onPress={() => handleLogin()}
          loading={isLoading}
          rightComponent={<ArrowIcon />}
          disabled={!email || !password}
          style={styles.loginButton}
          //   leftComponent={undefined}
          //   textStyle={undefined}
          //   width={'90%'}
          //   testID={undefined}
        />

        <Pressable onPress={() => goToSignUp()} style={styles.signUpContainer}>
          <Text style={styles.subtitle}>No account yet? Sign Up</Text>
        </Pressable>

        {biometricsAvailable && (
          <TouchableOpacity
            style={styles.biometricsButton}
            disabled={isLoading}
            onPress={handleBiometricLogin}>
            <Text style={styles.biometricsText}>Login with Biometrics</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  welcomeBack: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary,
  },
  formContainer: {
    width: '100%',
  },
  errorText: {
    color: colors.error,
    marginBottom: 10,
  },
  biometricsButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  biometricsText: {
    color: colors.primary,
    fontSize: 16,
  },
  loginButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default LoginScreen;
