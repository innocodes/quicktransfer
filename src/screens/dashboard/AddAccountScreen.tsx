import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {addNewAccount, fetchAccounts} from '../../services/accountService';
import {RootState} from '../../store';
import {setAccounts} from '../../store/slices/accountSlice';
import {ArrowIcon} from '../../components/common/Icons';
import Button from '../../components/common/Button';

const AddAccountScreen = () => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState<'savings' | 'checking'>('savings'); // Default account type

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector((state: RootState) => state.auth.user);

  console.log('user in add account', user);

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveAccount = async () => {
    if (!bankName || !accountNumber || !balance) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setIsLoading(true);

      const accountData = {
        userId: user.uid,
        bankName,
        accountNumber,
        balance: parseFloat(balance),
        type: type, // Default account type
        createdAt: new Date(),
      };

      const addAccount = await addNewAccount(accountData);

      console.log('addAccount', addAccount);

      const accounts = await fetchAccounts(user?.uid);

      console.log('accounts response', accounts);
      dispatch(setAccounts(accounts));

      Alert.alert('Account Added', 'Your account has been added successfully.');

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Add Account Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Bank Name"
        value={bankName}
        onChangeText={setBankName}
      />

      <TextInput
        style={styles.input}
        placeholder="Account Number"
        keyboardType="numeric"
        value={accountNumber}
        onChangeText={setAccountNumber}
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="Initial Balance"
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
      />

      <Button
        title="Save Account"
        type="primary"
        onPress={handleSaveAccount}
        loading={isLoading}
        rightComponent={<ArrowIcon />}
        disabled={!accountNumber || !bankName || !balance}
        style={styles.saveButton}
        //   leftComponent={undefined}
        //   textStyle={undefined}
        //   width={'90%'}
        //   testID={undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f8fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddAccountScreen;
