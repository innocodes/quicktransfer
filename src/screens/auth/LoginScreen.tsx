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
} from '../../utils/biometrics';
import colors from '../../theme/colors';
import {ArrowIcon, LockIcon, MailIcon} from '../../components/common/Icons';
import store, {persistor, RootState} from '../../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUserName} from '../../store/slices/userSlice';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

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
      const {available, biometricName} = await checkBiometricAvailability();

      console.log('available value:', available);
      console.log('biometric name:', biometricName);
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
    }, 3000); // Delayed to ensure state is rehydrated
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      const user = await signIn(email, password);
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email || '',
          fullName: user.fullName,
        }),
      );
      dispatch(setUserName(user.fullName));
      persistor.flush(); // Ensures persist
      console.log('user response', user);
      navigation.navigate('Dashboard');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
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

  const handleBiometricLogin = async () => {
    try {
      const credentials = await authenticateWithBiometrics();
      if (credentials) {
        dispatch(login(credentials));
      }
    } catch (error: any) {
      Alert.alert('Biometric Authentication Failed', error.message);
    }
  };

  const handleSubmit = () => {
    // if (!validateEmail(email)) {
    //   return;
    // }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Login successful!');
    }, 2000);
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
          onPress={handleLogin}
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
            onPress={handleBiometricLogin}
            disabled={loading}>
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
