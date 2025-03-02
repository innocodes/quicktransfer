import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../store/slices/authSlice';

const DrawerContent = props => {
  const dispatch = useDispatch();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <Text style={styles.title}>QuickTransfer</Text>
        <DrawerItem
          label="Dashboard"
          onPress={() => props.navigation.navigate('Dashboard')}
        />
        <TouchableOpacity
          onPress={() => dispatch(logoutUser())}
          style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  title: {fontSize: 18, fontWeight: 'bold'},
  logoutBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  logoutText: {color: 'white', textAlign: 'center'},
});

export default DrawerContent;
