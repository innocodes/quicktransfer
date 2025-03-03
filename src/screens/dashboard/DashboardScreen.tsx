import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from './../../store/index';
import QuickActions from './../../components/QuickActions';
import TransactionList from './../../components/TransactionList';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

// Custom icons
const MenuIcon = () => (
  <View style={styles.menuIconContainer}>
    <View style={[styles.menuLine, styles.menuLineShort]} />
    <View style={styles.menuLine} />
    <View
      style={[styles.menuLine, styles.menuLineShort, styles.menuLineRight]}
    />
  </View>
);

const NotificationIcon = () => (
  <View style={styles.notificationIconContainer}>
    <View style={styles.notificationBell}>
      <View style={styles.bellTop} />
      <View style={styles.bellBody} />
    </View>
    <View style={styles.notificationDot} />
  </View>
);

// Linear Gradient Component (Custom implementation without library)
const LinearGradientView = ({children, style}) => {
  return (
    <View style={[styles.gradientContainer, style]}>
      <View style={styles.gradientOverlay} />
      {children}
    </View>
  );
};

const DashboardScreen = ({navigation}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);

  useEffect(() => {
    console.log('User:', user);
  }, []);

  useEffect(() => {
    console.log('Accounts:', accounts);
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Any focus-related logic
    }, [accounts]),
  );

  const handleViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentAccountIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MenuIcon />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <NotificationIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileImageContainer}>
              <Text style={styles.profileInitials}>
                {user?.fullName?.charAt(0) || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.greeting}>{user?.fullName || 'User'}</Text>
        </View>

        {/* Accounts Carousel */}
        <View style={styles.accountsContainer}>
          <View style={styles.accountsHeader}>
            <Text style={styles.sectionTitle}>
              {accounts?.length > 1 ? 'Accounts' : 'Account'}
              <Text style={styles.accountCount}> ({accounts?.length})</Text>
            </Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Accounts')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={accounts}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.accountsListContainer}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({item}) => (
              <LinearGradientView style={styles.accountCard}>
                <View style={styles.accountCardContent}>
                  <View style={styles.accountTopSection}>
                    <Text style={styles.bankName}>{item.bankName}</Text>
                    <View style={styles.chipContainer}>
                      <Text style={styles.chipText}>Primary</Text>
                    </View>
                  </View>
                  <Text style={styles.accountNumber}>
                    •••• {item.accountNumber.slice(-4)}
                  </Text>
                  <View style={styles.accountBottomSection}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.accountBalance}>
                      ₦{item.balance.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </LinearGradientView>
            )}
          />

          {/* Pagination Dots */}
          {accounts?.length > 1 && (
            <View style={styles.paginationContainer}>
              {accounts.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentAccountIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Add Account Button */}
        <TouchableOpacity
          style={styles.addAccountButton}
          onPress={() => navigation.navigate('AddAccount')}>
          <View style={styles.plusIconContainer}>
            <View style={styles.plusHorizontal} />
            <View style={styles.plusVertical} />
          </View>
          <Text style={styles.addAccountButtonText}>Add New Account</Text>
        </TouchableOpacity>

        {/* Quick Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <QuickActions navigation={navigation} />
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Transactions')}
              style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <TransactionList />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    padding: 20,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Menu icon styles
  menuIconContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 24,
    height: 2,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  menuLineShort: {
    width: 16,
  },
  menuLineRight: {
    alignSelf: 'flex-end',
  },
  // Notification icon styles
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  notificationIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBell: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#555',
    position: 'relative',
  },
  bellTop: {
    width: 6,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: '#555',
    position: 'absolute',
    top: -2,
    left: 3,
  },
  bellBody: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#555',
    position: 'absolute',
    bottom: 2,
    left: 5,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff3b30',
  },
  // Profile icon styles
  profileButton: {
    width: 36,
    height: 36,
  },
  profileImageContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  greetingContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  accountsContainer: {
    marginBottom: 24,
  },
  accountsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountsListContainer: {
    // paddingRight: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  accountCount: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'normal',
  },
  viewAllButton: {
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3e7bfa',
    fontWeight: '600',
  },
  // Gradient card styles
  gradientContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4b6cb7',
  },
  accountCard: {
    width: width - 60,
    height: 180,
    borderRadius: 16,
    marginHorizontal: 10,
    backgroundColor: '#4b6cb7',
  },
  accountCardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
  },
  accountTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  accountNumber: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    letterSpacing: 1,
  },
  accountBottomSection: {
    marginTop: 'auto',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#3e7bfa',
    width: 16,
  },
  // Add account button styles
  addAccountButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  plusIconContainer: {
    width: 16,
    height: 16,
    marginRight: 8,
    position: 'relative',
  },
  plusHorizontal: {
    position: 'absolute',
    top: 7,
    left: 0,
    width: 16,
    height: 2,
    backgroundColor: '#3e7bfa',
    borderRadius: 1,
  },
  plusVertical: {
    position: 'absolute',
    top: 0,
    left: 7,
    width: 2,
    height: 16,
    backgroundColor: '#3e7bfa',
    borderRadius: 1,
  },
  addAccountButtonText: {
    color: '#3e7bfa',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsSection: {
    marginBottom: 24,
  },
  transactionsSection: {
    marginBottom: 24,
  },
});

export default DashboardScreen;
