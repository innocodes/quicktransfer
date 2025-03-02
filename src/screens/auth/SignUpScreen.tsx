import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import {signUp} from './../../services/authService';
import {MailIcon} from '../../components/common/Icons';
import Input from '../../components/common/Input';
import colors from '../../theme/colors';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');
  const fullName = `${firstName} ${lastName}`;
  const [emailError, setEmailError] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email, password, fullName);
      Alert.alert('Success', 'Account created!');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
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

  return (
    <View>
      <Text>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />

      <View style={styles.formContainer}>
        <View style={styles.nameContainer}>
          {/* First Name Input */}
          <Input
            label="First Name"
            value={firstName}
            onChangeText={(text: string) => {
              setFirstName(text);
            }}
            placeholder="Enter firstname"
            keyboardType="default"
            returnKeyType="next"
          />

          {/* Last Name Input */}
          <Input
            label="Last Name"
            value={firstName}
            onChangeText={(text: string) => {
              setFirstName(text);
            }}
            placeholder="Enter lastname"
            keyboardType="default"
            returnKeyType="next"
          />
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

        {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  formContainer: {
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
});

export default SignUpScreen;
