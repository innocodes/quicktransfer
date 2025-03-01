import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from './../../store/index';
import QuickActions from './../../components/QuickActions';
import TransactionList from './../../components/TransactionList';

const DashboardScreen = ({navigation}) => {
  const userName = useSelector((state: RootState) => state.user.name);
  const balance = useSelector((state: RootState) => state.account.balance);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>Hello, {userName || 'User'}! 👋</Text>

      {/* Account Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balance}>₦{balance.toLocaleString()}</Text>
      </View>

      {/* Quick Actions */}
      <QuickActions navigation={navigation} />

      {/* Recent Transactions */}
      <TransactionList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, padding: 20, backgroundColor: '#f7f8fa'},
  greeting: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  balanceTitle: {fontSize: 16, color: '#888'},
  balance: {fontSize: 28, fontWeight: 'bold', color: '#222'},
});

export default DashboardScreen;
