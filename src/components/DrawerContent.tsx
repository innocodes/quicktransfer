import React, {useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../store/slices/authSlice';
import {clearAccounts} from '../store/slices/accountSlice';
import {signOut} from '../services/authService';

// Custom Icons Components
const DashboardIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.dashboardOuter} />
    <View style={styles.dashboardInner} />
  </View>
);

const TransactionsIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.arrowLeft} />
    <View style={styles.arrowRight} />
  </View>
);

const ProfileIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.profileHead} />
    <View style={styles.profileBody} />
  </View>
);

const SettingsIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.settingsCircle} />
    <View style={styles.settingsLines}>
      {[...Array(4)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.settingsLine,
            {transform: [{rotate: `${90 * i}deg`}, {translateY: 10}]},
          ]}
        />
      ))}
    </View>
  </View>
);

const LogoutIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.logoutBox} />
    <View style={styles.logoutArrow} />
  </View>
);

const ANIMATION_DURATION = 300;
const MENU_ITEMS = [
  {label: 'Dashboard', icon: DashboardIcon, route: 'Dashboard'},
  {label: 'Transactions', icon: TransactionsIcon, route: 'Transactions'},
  {label: 'Profile', icon: ProfileIcon, route: 'Profile'},
  {label: 'Settings', icon: SettingsIcon, route: 'Settings'},
];

const DrawerContent = props => {
  const dispatch = useDispatch();
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(
    MENU_ITEMS.map(() => new Animated.Value(0)),
  ).current;
  const prevOpenStateRef = useRef(false);

  // This function handles all animations when drawer opens
  const animateIn = () => {
    // Reset animation values to starting position
    translateY.setValue(-50);
    opacity.setValue(0);
    itemAnimations.forEach(anim => anim.setValue(0));

    // Start animations
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.stagger(
        100,
        itemAnimations.map(anim =>
          Animated.timing(anim, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ),
      ),
    ]).start();
  };

  // Listen to drawer state changes
  useEffect(() => {
    // We need to check if this is a navigation state change
    if (props.state) {
      const isDrawerOpen = props.state.history.some(
        h => h.type === 'drawer' && h.status === 'open',
      );

      // Only animate if drawer state changed from closed to open
      if (isDrawerOpen && !prevOpenStateRef.current) {
        animateIn();
      }

      prevOpenStateRef.current = isDrawerOpen;
    }
  }, [props.state]);

  // Also animate on initial mount
  useEffect(() => {
    animateIn();
  }, []);

  const renderMenuItem = (item, index) => {
    const translateX = itemAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 0],
    });

    const itemOpacity = itemAnimations[index];

    return (
      <Animated.View
        key={item.label}
        style={{
          transform: [{translateX}],
          opacity: itemOpacity,
        }}>
        <DrawerItem
          icon={() => <item.icon />}
          label={item.label}
          onPress={() => props.navigation.navigate(item.route)}
          activeBackgroundColor="#e6f7ff"
          activeTintColor="#1890ff"
          style={styles.drawerItem}
        />
      </Animated.View>
    );
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerScrollView}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{translateY}],
            opacity,
          },
        ]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <View style={styles.avatarInner} />
          </View>
        </View>
        <Text style={styles.title}>QuickTransfer</Text>
        <Text style={styles.subtitle}>Fast & Secure Payments</Text>
      </Animated.View>

      <View style={styles.divider} />

      <View style={styles.menuContainer}>{MENU_ITEMS.map(renderMenuItem)}</View>

      <Animated.View
        style={{
          opacity,
          transform: [{translateY}],
          marginTop: 'auto',
        }}>
        <TouchableOpacity
          onPress={() => {
            dispatch(logoutUser());
            dispatch(clearAccounts());
            signOut();
          }}
          style={styles.logoutBtn}>
          <LogoutIcon />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerScrollView: {
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#1890ff',
    marginBottom: 10,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e1e4e8',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  menuContainer: {
    marginTop: 10,
  },
  drawerItem: {
    borderRadius: 8,
    marginVertical: 2,
  },
  logoutBtn: {
    margin: 20,
    padding: 12,
    backgroundColor: '#ff4d4f',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  // Icon styles
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Dashboard icon
  dashboardOuter: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#757575',
  },
  dashboardInner: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#757575',
  },
  // Transactions icon
  arrowLeft: {
    width: 10,
    height: 2,
    backgroundColor: '#757575',
    position: 'absolute',
    left: 4,
    top: 11,
    borderRadius: 1,
  },
  arrowRight: {
    width: 10,
    height: 2,
    backgroundColor: '#757575',
    position: 'absolute',
    right: 4,
    top: 11,
    borderRadius: 1,
  },
  // Profile icon
  profileHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#757575',
    marginBottom: 2,
  },
  profileBody: {
    width: 16,
    height: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#757575',
  },
  // Settings icon
  settingsCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#757575',
  },
  settingsLines: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsLine: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#757575',
  },
  // Logout icon
  logoutBox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 2,
  },
  logoutArrow: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: 'white',
    right: 2,
    top: 11,
  },
});

export default DrawerContent;
