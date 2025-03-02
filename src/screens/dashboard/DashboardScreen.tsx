import React, {useEffect} from 'react';
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

// Custom Menu Icon
const MenuIcon = () => (
  <View style={styles.menuIcon}>
    <View style={styles.menuLine} />
    <View style={styles.menuLine} />
    <View style={styles.menuLine} />
  </View>
);

const DashboardScreen = ({navigation}) => {
  const userName = useSelector((state: RootState) => state.auth.u);
  const balance = useSelector((state: RootState) => state.account.balance);

  useEffect(() => {
    console.log('user', userName);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Drawer Toggle Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}>
        <MenuIcon />
      </TouchableOpacity>
      {/* Greeting */}
      <Text style={styles.greeting}>Hello, {userName || 'User'}! 👋</Text>

      {/* Account Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balance}>₦{balance?.toLocaleString()}</Text>
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
  greeting: {marginTop: 50, fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  balanceTitle: {fontSize: 16, color: '#888'},
  balance: {fontSize: 28, fontWeight: 'bold', color: '#222'},
  menuButton: {position: 'absolute', top: 20, left: 20, zIndex: 10},
  menuIcon: {width: 24, height: 24, justifyContent: 'space-between'},
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: '#222',
    borderRadius: 2,
  },
});

export default DashboardScreen;
