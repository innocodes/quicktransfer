// src/screens/auth/LoginScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../store/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {
  checkBiometricAvailability,
  authenticateWithBiometrics,
} from '../../utils/biometrics';
import colors from '../../theme/colors';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  const dispatch = useDispatch();
  const {user, loading, error} = useSelector(state => state.auth);

  useEffect(() => {
    const checkBiometrics = async () => {
      const available = await checkBiometricAvailability();
      setBiometricsAvailable(available);
    };

    checkBiometrics();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    dispatch(login({email, password}));
  };

  const handleBiometricLogin = async () => {
    try {
      const credentials = await authenticateWithBiometrics();
      if (credentials) {
        dispatch(login(credentials));
      }
    } catch (error) {
      Alert.alert('Biometric Authentication Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>QuickPay</Text>
      </View>

      <View style={styles.welcomeContainer}>
        {user?.name ? (
          <Text style={styles.welcomeBack}>Welcome back, {user.name}!</Text>
        ) : (
          <Text style={styles.welcomeText}>Welcome to QuickPay</Text>
        )}
        <Text style={styles.subtitle}>Fast, secure banking on the go</Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          disabled={loading}
          loading={loading}
        />

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
  welcomeBack: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
});

export default LoginScreen;
