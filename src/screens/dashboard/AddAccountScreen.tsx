import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [type, setType] = useState<'savings' | 'checking'>('savings');

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
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
        type: type,
        createdAt: new Date(),
      };

      await addNewAccount(accountData);
      const accounts = await fetchAccounts(user?.uid);
      dispatch(setAccounts(accounts));

      Alert.alert('Success', 'Your account has been added successfully.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountTypeChange = (selectedType: 'savings' | 'checking') => {
    setType(selectedType);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Account</Text>
        <View style={{width: 40}} /> {/* Empty view for balance */}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Bank Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bank Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bank name"
                placeholderTextColor="#a0a0a0"
                value={bankName}
                onChangeText={setBankName}
              />
            </View>

            {/* Account Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                placeholderTextColor="#a0a0a0"
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
                maxLength={10}
              />
            </View>

            {/* Account Type Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Type</Text>
              <View style={styles.accountTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.accountTypeButton,
                    type === 'savings' && styles.accountTypeButtonActive,
                  ]}
                  onPress={() => handleAccountTypeChange('savings')}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.accountTypeText,
                      type === 'savings' && styles.accountTypeTextActive,
                    ]}>
                    Savings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.accountTypeButton,
                    type === 'checking' && styles.accountTypeButtonActive,
                  ]}
                  onPress={() => handleAccountTypeChange('checking')}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.accountTypeText,
                      type === 'checking' && styles.accountTypeTextActive,
                    ]}>
                    Checking
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Initial Balance Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Initial Balance</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter initial balance"
                placeholderTextColor="#a0a0a0"
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
              />
            </View>
          </View>

          {/* Save Button */}
          <Button
            title="Save Account"
            type="primary"
            onPress={handleSaveAccount}
            loading={isLoading}
            rightComponent={<ArrowIcon />}
            disabled={!accountNumber || !bankName || !balance}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#212121',
  },
  formContainer: {
    marginTop: 16,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 22,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  accountTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  accountTypeButton: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountTypeButtonActive: {
    backgroundColor: '#4a80f5',
  },
  accountTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#757575',
  },
  accountTypeTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    marginTop: 'auto',
    height: 56,
    borderRadius: 12,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
});

export default AddAccountScreen;
