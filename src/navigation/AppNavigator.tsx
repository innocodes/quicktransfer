import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthNavigator';
import MainStack from './MainStack';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

const AppNavigator = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
