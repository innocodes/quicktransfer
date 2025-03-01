import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
// import DashboardScreen from '../screens/DashboardScreen';
import DrawerContent from '../components/DrawerContent';

const Drawer = createDrawerNavigator();

const MainStack = () => (
  <Drawer.Navigator
    drawerContent={props => <DrawerContent {...props} />}
    screenOptions={{headerShown: false}}>
    <Drawer.Screen name="Dashboard" component={DashboardScreen} />
  </Drawer.Navigator>
);

export default MainStack;
