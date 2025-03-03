import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {signUp} from './../../services/authService';
import {ArrowIcon, LockIcon, MailIcon} from '../../components/common/Icons';
import Input from '../../components/common/Input';
import colors from '../../theme/colors';
import Button from '../../components/common/Button';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatches, setPasswordMatches] = useState(false);

  const [lastName, setLastName] = useState('');
  const fullName = `${firstName} ${lastName}`;
  const [emailError, setEmailError] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      await signUp(email, password, fullName);
      Alert.alert('Success', 'Account created!');
      navigation.navigate('Login');
    } catch (error: any) {
      // Alert.alert('Error', error.message);
      if (error.message.includes('unknown')) {
        Alert.alert('Network Error', 'Please try again!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // First Name Validator
  const validateFirstName = (text: string) => {
    // Allows letters (including Unicode for accents), hyphens, apostrophes
    // Minimum 2 characters, maximum 50 characters
    const firstNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,50}$/;
    if (!firstNameRegex.test(text)) {
      setFirstNameError(
        'Please enter a valid first name (2-50 characters, letters only)',
      );
    } else {
      setFirstNameError('');
    }
  };

  // Last Name Validator
  const validateLastName = (text: string) => {
    // Similar to first name but allows spaces (e.g., "Innocent Oyebode)
    const lastNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'\-\s]{2,50}$/;
    if (!lastNameRegex.test(text)) {
      setLastNameError(
        'Please enter a valid last name (2-50 characters, letters only)',
      );
    } else {
      setLastNameError('');
    }
  };

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
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
        <Text style={styles.welcomeText}>Welcome to QuickTransfer</Text>
        <Text style={styles.subtitle}>Let's get you onboarded in no time.</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.nameContainer}>
          {/* First Name Input */}
          <View style={styles.innerContainer}>
            <Input
              label="First Name"
              value={firstName}
              onChangeText={(text: string) => {
                setFirstName(text);
                validateFirstName(text);
              }}
              placeholder="Enter firstname"
              keyboardType="default"
              error={firstNameError}
              returnKeyType="next"
            />
          </View>

          {/* Last Name Input */}
          <View style={styles.innerContainer}>
            <Input
              label="Last Name"
              value={lastName}
              onChangeText={(text: string) => {
                setLastName(text);
                validateLastName(text);
              }}
              placeholder="Enter lastname"
              keyboardType="default"
              error={lastNameError}
              returnKeyType="next"
            />
          </View>
        </View>

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

        {/* Password input with toggle visibility */}
        {/* <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry={true}
          leftComponent={<LockIcon />}
          returnKeyType="done"
        /> */}

        <Button
          title="Sign Up"
          type="primary"
          onPress={handleSignUp}
          loading={isLoading}
          rightComponent={<ArrowIcon />}
          disabled={!email || !password}
          style={styles.signUpButton}
          //   leftComponent={undefined}
          //   textStyle={undefined}
          //   width={'90%'}
          //   testID={undefined}
        />

        <Pressable onPress={() => goToLogin()} style={styles.signUpContainer}>
          <Text style={styles.subtitle}>Already have an account? Login</Text>
        </Pressable>

        {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
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
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  formContainer: {
    alignSelf: 'center',
    width: '100%',
  },
  innerContainer: {
    width: '48%',
  },
  nameContainer: {
    marginTop: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signUpButton: {
    flex: 1,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.primary,
  },
  signUpContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
});

export default SignUpScreen;
