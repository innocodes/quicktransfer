import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DashboardScreen from './../screens/dashboard/DashboardScreen';
import DrawerContent from '../components/DrawerContent';
import LoginScreen from '../screens/auth/LoginScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={props => <DrawerContent {...props} />}
    screenOptions={{
      headerShown: false, // Hide default headers
      drawerType: 'slide',
      drawerStyle: {backgroundColor: '#fff', width: 250},
    }}>
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
    {/* <Drawer.Screen name="Profile" component={ProfileScreen} /> */}
  </Drawer.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Main" component={DrawerNavigator} />
  </Stack.Navigator>
);

export default MainStack;
