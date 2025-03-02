import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
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

const {width} = Dimensions.get('window');

const DashboardScreen = ({navigation}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const balance = useSelector((state: RootState) => state.account.balance);
  const accounts = useSelector((state: RootState) => state.account.accounts);

  useEffect(() => {
    console.log('User:', user);
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
      <Text style={styles.greeting}>Hello, {user?.fullName || 'User'}! 👋</Text>

      {/* Account Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balance}>₦{balance?.toLocaleString()}</Text>
      </View>

      {/* Swipeable Bank Accounts */}
      <Text style={styles.sectionTitle}>Your Bank Accounts</Text>
      <FlatList
        data={accounts}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.accountCard}>
            <Text style={styles.bankName}>{item.bankName}</Text>
            <Text style={styles.accountNumber}>Acct: {item.accountNumber}</Text>
            <Text style={styles.accountBalance}>
              Balance: ₦{item.balance.toLocaleString()}
            </Text>
          </View>
        )}
      />

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
  menuLine: {width: 24, height: 3, backgroundColor: '#222', borderRadius: 2},
  sectionTitle: {fontSize: 18, fontWeight: 'bold', marginVertical: 10},
  accountCard: {
    width: width * 0.9,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'center',
  },
  bankName: {fontSize: 20, fontWeight: 'bold', color: '#333'},
  accountNumber: {fontSize: 16, marginTop: 5, color: '#555'},
  accountBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a9d8f',
    marginTop: 10,
  },
});

export default DashboardScreen;
